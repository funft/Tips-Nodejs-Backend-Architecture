'use strict'
const jwt = require('jsonwebtoken');
const KeyTokenService = require('../services/keyToken.service');
const constants = require('../constants');
const shopService = require('../services/shop.service');
const { BadRequestError, NotFoundError } = require('../core/error.response');

const createTokenPair = async (payload, privateKey) => {
    try {
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '15m'
        })
        const refreshToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (err) {
        return {
            code: '50003',
            message: err.message,
            status: 'error'
        }
    }
}

const createTokenPairHs256 = async (payload, privateKey, publicKey) => {
    const accessToken = jwt.sign(payload, publicKey, {
        expiresIn: '1d',
    })
    const refreshToken = jwt.sign(payload, privateKey, {
        expiresIn: '7d',
    })
    return {
        accessToken,
        refreshToken
    }
}

const verifyToken = (token, publicKey) => {
    jwt.verify(token, publicKey, {
        algorithm: 'RS256'
    }, (err, decoded) => {
        if (err) {
            console.log('lỗi decode', err);
            return {
                code: '40002',
                message: 'Token khoong hợp lệ',
                status: 'error'
            }
        }
        console.log('decoded', decoded);
        return decoded
    })
}

const authenticationV2 = async (req, res, next) => {
    const userId = req.body.userId
    if (!userId) {
        throw new BadRequestError('Miss data')
    }
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError('User not found')
    }

    const refreshToken = req.headers[constants.HEADER.REFRESHTOKEN]
    if (refreshToken) {
        if (refreshToken !== keyStore.refreshToken) {
            throw new BadRequestError('Refresh token is invalid')
        }
        const decodedData = await jwt.verify(refreshToken, keyStore.privateKey)
        if (userId !== decodedData.userId) {
            throw new BadRequestError('Refresh token is invalid')
        }
        req.keyStore = keyStore
        req.refreshToken = refreshToken
        req.shop = decodedData
        return next()
    }

    const token = req.headers[constants.HEADER.AUTHORIZATION]
    if (!token) {
        throw new BadRequestError('Token is required')
    }

    const decodedData = await jwt.verify(token, keyStore.publicKey)
    if (userId !== decodedData.userId) {
        throw new BadRequestError('Token is invalid')
    }
    req.keyStore = keyStore
    next()
}

const authentication = async (req, res, next) => {
    const userId = req.body.userId
    if (!userId) {
        throw new BadRequestError('Miss data')
    }
    const keyStore = await KeyTokenService.findByUserId(userId, { publicKey: 1 })
    console.log('user', keyStore);
    if (!keyStore) {
        throw new NotFoundError('User not found')
    }
    const token = req.headers[constants.HEADER.AUTHORIZATION]
    console.log('token', token);
    if (!token) {
        throw new BadRequestError('Token is required')
    }

    const decodedData = await jwt.verify(token, keyStore.publicKey)
    if (userId !== decodedData.userId) {
        throw new BadRequestError('Token is invalid')
    }
    req.keyStore = keyStore
    next()
}

module.exports = {
    createTokenPair,
    createTokenPairHs256,
    verifyToken,
    authentication,
    authenticationV2
}