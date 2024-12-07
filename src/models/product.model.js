'use strict'
const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    product_name: {
        required: true,
        type: String
    },
    product_thmb: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
}, {
    collection: 'clothes',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
}, {
    collection: 'furnitures',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
}, {
    collection: 'electronics',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronis', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema),
}