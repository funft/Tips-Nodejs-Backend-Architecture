'use strict'

const { NotFoundError } = require('../../core/error.response')
const { product, electronic, clothing, furniture } = require('../../models/product.model')
const { getSelectData, getUnSelectData, bodyUpdateParser } = require('../../utils')

const updateProduct = async ({ productId, bodyUpdate }) => {
    const updateProduct = await product.findByIdAndUpdate(productId, bodyUpdateParser(bodyUpdate), { new: true })
    return updateProduct
}
const updateDetailProduct = async ({ productId, bodyUpdate, model, isNew = true }) => {
    const updateProduct = await model.findOneAndUpdate(
        { _id: productId },
        bodyUpdateParser(bodyUpdate),
        { new: isNew }
    )
    return updateProduct
}

const findAllProducts = async ({ limit, page, filter, sort, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}
const findProduct = async ({ productId, unSelect }) => {
    return await product.findById(productId)
        .select(getUnSelectData(unSelect))
        .lean()
}

const findAllDraftForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProductForShop({ query, limit, skip })
}
const findAllPublishedForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await queryProductForShop({ query, limit, skip })
}
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find(
        {
            isPublished: true,
            $text: { $search: regexSearch }
        },
        {
            score: { $meta: 'textScore' }
        }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return results
}

const publishProduct = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({ _id: product_id })
    if (!foundProduct) throw new NotFoundError('Product not found')

    foundProduct.isDraft = false
    foundProduct.isPublished = true

    const { modifiedCount } = await product.updateOne({ _id: product_id }, foundProduct)
    return modifiedCount
}

const unPublishProduct = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({ _id: product_id })
    if (!foundProduct) throw new NotFoundError('Product not found')

    foundProduct.isDraft = true
    foundProduct.isPublished = false

    const { modifiedCount } = await product.updateOne({ _id: product_id }, foundProduct)
    return modifiedCount
}

const queryProductForShop = async ({ query, limit = 50, skip = 0 }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .skip(skip)
        .limit(limit)
        .exec()
}

module.exports = {
    findAllDraftForShop,
    findAllPublishedForShop,
    publishProduct,
    unPublishProduct,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProduct,
    updateDetailProduct
}
