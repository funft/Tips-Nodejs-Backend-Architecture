'use strict'
const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
    cart_state: {
        type: String,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: { type: Array, default: [] },
    /**
     * [
     * {
     * product_id: ,
     * shopId:,
     * product_name:,
     * product_price:
     * product_quantity:
     * }]
     */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }
}, {
    collection: 'carts',
    timeseries: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = {
    cart: model('Cart', cartSchema)
}