'use strict'
const crypto = require('crypto')

const apiKeyModel = require("../models/apiKey.model")

const findById = async (key) => {
    // const newObjKey = await createApiKey()
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}

const createApiKey = async () => {
    const objKey = await apiKeyModel.create({
        key: crypto.randomBytes(64).toString,
        permissions: ['0000']
    })
}

module.exports = {
    findById
}