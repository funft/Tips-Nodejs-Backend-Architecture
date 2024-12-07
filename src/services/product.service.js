'use strict'
const { product, electronic, clothing, furniture } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')
const { findAllDraftForShop, publishProduct, unPublishProduct, findAllPublishedForShop, searchProductByUser, findAllProducts, findProduct, updateProduct, updateDetailProduct } = require('../models/repositories/product.repo')
const { bodyUpdateParser } = require('../utils')

class ProductFactory {
    static ProductTypes = {}
    static registryProductType(type, classRef) {
        this.ProductTypes[type] = classRef
    }
    static async createProduct(type, payload) {
        const productType = this.ProductTypes[type]
        if (!productType) {
            throw new BadRequestError(`Invalid product type: ${type}`)
        }
        return new productType(payload).createProduct()
    }
    static async updateProduct({ type, productId, productShop, bodyUpdate }) {
        const productType = this.ProductTypes[type]
        if (!productType) {
            throw new BadRequestError(`Invalid product type: ${type}`)
        }
        return new productType(bodyUpdate).updateProduct({ productId, productShop, bodyUpdate })
    }
    static async publishProduct({ product_shop, product_id }) {
        return await publishProduct({ product_shop, product_id })
    }
    static async unPublishProduct({ product_shop, product_id }) {
        return await unPublishProduct({ product_shop, product_id })
    }

    // query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }
    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }
    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
    static async findAllProduct({ limit = 50, page = 1, filter = { isPublished: true }, sort = 'ctime' }) {
        return await findAllProducts({ limit, page, filter, sort, select: ['product_name', 'product_price', 'product_thumb'] })
    }
    static async findProduct({ productId }) {
        return await findProduct({ productId, unSelect: ['__v'] })
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
    async updateProduct({ productId }) {
        console.log('bodyUpdateParser(this)', bodyUpdateParser(this));
        return await updateDetailProduct({ productId, bodyUpdate: this, model: product })
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
    async updateProduct({ productId, productShop }) {
        console.log('updateProduct', this);
        const foundProduct = await clothing.findOne({ _id: productId, product_shop: productShop })
        if (!foundProduct) {
            throw new ForbiddenError('Product not found')
        }
        if (this.product_attributes) {
            await updateDetailProduct({ productId, bodyUpdate: this.product_attributes, model: clothing })
        }

        return await super.updateProduct({ productId })
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
    async updateProduct({ productId, productShop }) {
        const foundProduct = await furniture.findOne({ _id: productId, product_shop: productShop })
        if (!foundProduct) {
            throw new ForbiddenError('Product not found')
        }
        if (this.product_attributes) {
            await updateDetailProduct({ productId, bodyUpdate: this.product_attributes, model: furniture })
        }

        return await super.updateProduct({ productId })
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