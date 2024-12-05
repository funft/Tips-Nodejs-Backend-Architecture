'use strict'
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const authUtils = require('../auths/authUtils');
const { getIntoData } = require('../utils/index');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service')
const ROLE_SHOP = {
    SHOP: '0001',
    WRITE: '0002',
    EDITOR: '0003',
}


class AccessService {
    static signIn = async (email, password, refreshToken = null) => {
        const shop = await findByEmail(email)
        if (!shop) {
            throw new BadRequestError('Invalid email or password')
        }

        const isMatch = await bcrypt.compare(password, shop.password)
        if (!isMatch) {
            throw new AuthFailureError('Invalid email or password')
        }
        const privateKey = await crypto.randomBytes(64).toString('hex')
        const publicKey = await crypto.randomBytes(64).toString('hex')
        const tokens = await authUtils.createTokenPairHs256({ userId: shop._id, email }, privateKey)
        await KeyTokenService.createKeyToken({ userId: shop._id, publicKey, privateKey, refreshToken: tokens.refreshToken })
        return {
            metadata: {
                shop: getIntoData({ obj: shop, fields: ['name', "email", "roles"] }),
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            }
        }
    }

    static signUp = async (name, email, password) => {
        // check tồn tại email
        const existEmail = await shopModel.findOne({
            email: email
        }).lean()
        if (existEmail) {
            throw new BadRequestError('Email đã tồn tại nhé')
        }

        const newShop = await shopModel.create({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 10),
            role: ROLE_SHOP.SHOP
        })

        if (newShop) {
            // Đoạn tạo pri/pub key quá phức tạp, để ở đây nếu cần thì tham khảo
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
            },
            )
            const publicKeyString = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey })

            if (!publicKeyString) {
                return {
                    code: '50001',
                    message: 'Tạo token thất bại',
                    status: 'error'
                }
            }

            const tokens = await authUtils.createTokenPair({ userId: newShop._id, email }, privateKey)

            // test verify token ở đay
            // chuyển publicKey lưu ở dạng json/string trong db về obj để verify
            const publicKeyObject = await crypto.createPublicKey(publicKeyString)
            authUtils.verifyToken(tokens.accessToken, publicKeyObject)
            return {
                code: '20000',
                metadata: {
                    shop: getIntoData({ obj: newShop, fields: ['name'] }),
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                }

            }
        }
    }

}

module.exports = AccessService;