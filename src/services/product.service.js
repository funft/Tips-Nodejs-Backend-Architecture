'use strict'
const { product, electronic, clothing, furniture } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

class ProductFactory {
    static ProductTypes = {}
    static registryProductType(type, classRef) {
        this.ProductTypes[type] = classRef
    }

    static async createProduct(type, payload) {
        const productType = this.ProductTypes[type]
        if (!productType) {
            throw new BadRequestError('Invalid product type')
        }
        return new productType(payload).createProduct()
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

    async createProduct({ product_id }) {
        return await product.create({
            ...this,
            _id: product_id
        })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) {
            throw new BadRequestError('Failed to create clothing')
        }
        const newProduct = await super.createProduct({ product_id: newClothing._id })
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }
        )
        if (!newElectronic) {
            throw new BadRequestError('Failed to create clothing')
        }
        const newProduct = await super.createProduct({ product_id: newElectronic._id })
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }
        )
        if (!newFurniture) {
            throw new BadRequestError('Failed to create clothing')
        }
        const newProduct = await super.createProduct({ product_id: newFurniture._id })
        if (!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}

// Should write in a config file
const configProductFactory = {
    Clothing,
    Electronics,
    Furniture
}

for (const key in configProductFactory) {
    ProductFactory.registryProductType(key, configProductFactory[key])
}
module.exports = ProductFactory