'use strict'
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const authUtils = require('../auths/authUtils');
const { getIntoData } = require('../utils/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ROLE_SHOP = {
    SHOP: '0001',
    WRITE: '0002',
    EDITOR: '0003',
}


class AccessService {
    static signUp = async (name, email, password) => {
        try {
            // check tồn tại email
            const existEmail = await shopModel.findOne({
                email: email
            }).lean()
            if (existEmail) {
                return {
                    code: '40001',
                    message: 'Email đã tồn tại',
                    status: "error"
                }
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
                const publicKeyString = await KeyTokenService.createKeyToken(newShop._id, publicKey)

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
                console.log('chayj trwocs verirfy');
                return {
                    code: '20000',
                    metadata: {
                        shop: getIntoData(newShop, ['name']),
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    }

                }
            }
        } catch (error) {
            return {
                code: '50002',
                message: error.message,
                status: "error"
            }
        }
    }

}

module.exports = AccessService;