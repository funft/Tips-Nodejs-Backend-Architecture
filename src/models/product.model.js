'use strict'
const { model, Schema } = require('mongoose')
const { default: slugify } = require('slugify')

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
    product_slug: {
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
    },
    // more
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    product_variation: {
        type: Array,
        default: []
    },
    // ko có tiền tố product để dễ hiểu khi thiết kế, là trường này ko được lấy ra khi truy vấn
    // đánh index vì trường này hay được truy vấn
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
// create index
productSchema.index({ product_name: 'text', product_description: 'text' })
// run before save() or create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
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