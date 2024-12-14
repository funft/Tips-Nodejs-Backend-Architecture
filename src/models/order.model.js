'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'
const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout: {
            totalPrice: 'number',
            totalDiscount: 'number',
            feeShip: 'number',
            totalCheckout: 'number',
        }
    */
    order_shiping: { type: Object, default: {} },
    /*
        street,
        city,
        state,
        country
     */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, default: [], required: true },
    order_trackingNumber: { type: String, default: '#5301279349079817023' },
    order_status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'] },

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, orderSchema, COLLECTION_NAME);

