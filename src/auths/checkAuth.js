'use strict'
const jwt = require('jsonwebtoken')
const { HEADER } = require('../constants/index')
const { BadRequestError } = require('../core/error.response')
const { findById } = require('../services/apikey.service')
const shopService = require('../services/shop.service.js')
const KeyTokenService = require('../services/keyToken.service.js')

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]
        if (!key) {
            return res.status(403).json({
                message: 'API Key is required',
                status: 'error',
                code: '403'
            })
        }

        // check key in database
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'API Key is invalid',
                status: 'error',
                code: '403'
            })
        }
        req.apiKey = objKey
        // check permission
        next()
    } catch (err) {
        console.log('err', err);
    }
}

// clossure
const checkPermission = (permission) => {
    return async (req, res, next) => {
        if (!req.apiKey.permissions) {
            return res.status(403).json({
                message: 'This API Key does not have permission',
                status: 'error',
                code: '403'
            })
        }

        if (!req.apiKey.permissions.includes(permission)) {
            return res.status(403).json({
                message: 'Permission is invalid',
                status: 'error',
                code: '403'
            })
        }
        next()
    }
}

module.exports = {
    apiKey,
    checkPermission,
}