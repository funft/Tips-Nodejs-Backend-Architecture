'use strict'
const { product, electronic, clothing } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Electronics':
                return new Electronics(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type: ${type}`)
        }
    }
}


// base Product class
class Product {
    constructor({ product_name, product_thmb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name
        this.product_thmb = product_thmb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct() {
        return await product.create(this)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) {
            throw new BadRequestError('Failed to create clothing')
        }
        const newProduct = await super.createProduct()
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes)
        if (!newElectronic) {
            throw new BadRequestError('Failed to create clothing')
        }
        const newProduct = await super.createProduct()
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}

module.exports = ProductFactory