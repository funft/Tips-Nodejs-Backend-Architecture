'use strict'

const { getSelectData, getUnSelectData } = require("../../utils")
const { discount } = require("../discount.model")


const findAllDiscountSelect = async ({ limit, page, filter, sort, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}
const findAllDiscountUnselect = async ({ limit, page, filter, sort, unSelect }) => {
    const skip = (page - 1) * limit
    const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()
    return products
}

module.exports = {
    findAllDiscountSelect,
    findAllDiscountUnselect
}