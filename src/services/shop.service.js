'use strict'
const shopModel = require('../models/shop.model');

const findByEmail = async (email, select = { _id: 1, name: 1, email: 1, status: 1, roles: 1, password: 1 }) => {
    const foundShop = await shopModel.findOne({
        email
    }).select(select).lean();
    return foundShop;
}

const findById = async (id, select = { name: 1, email: 1, status: 1, roles: 1 }) => {
    const foundShop = await shopModel.findOne({
        _id: id
    }).select(select).lean();
    return foundShop;
}


module.exports = {
    findByEmail,
    findById
}