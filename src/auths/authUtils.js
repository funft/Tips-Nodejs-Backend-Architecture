'use strict'
const jwt = require('jsonwebtoken');
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

module.exports = {
    createTokenPair,
    verifyToken
}