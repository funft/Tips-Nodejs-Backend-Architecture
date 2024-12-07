const { CREATED, OK } = require('../core/success.response');
const ProductFactory = require('../services/product.service');

class ProductController {
    async handleRefreshToken(req, res) {
        new CREATED({
            message: 'create product success',
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.shop.userId
            })
        }).send(res)
    }

    // PUT
    async publishProduct(req, res) {
        new OK({
            message: 'publish product success',
            metadata: await ProductFactory.publishProduct({
                product_shop: req.shop.userId,
                product_id: req.params.id
            })
        }).send(res)
    }
    async unPublishProduct(req, res) {
        new OK({
            message: 'unPublish product success',
            metadata: await ProductFactory.unPublishProduct({
                product_shop: req.shop.userId,
                product_id: req.params.id
            })
        }).send(res)
    }
    async updateProduct(req, res) {
        new OK({
            message: 'update product success',
            metadata: await ProductFactory.updateProduct({
                type: req.body.product_type,
                productShop: req.shop.userId,
                productId: req.params.id,
                bodyUpdate: req.body
            })
        }).send(res)
    }
    // END PUT


    // có thể là chia ra theo thiết kế CQRS
    // QUERY
    async getAllDraftForShop(req, res) {
        new OK({
            message: 'get list draft success',
            metadata: await ProductFactory.findAllDraftForShop({ product_shop: req.shop.userId })
        }).send(res)
    }
    async getAllPublishedForShop(req, res) {
        new OK({
            message: 'get list published success',
            metadata: await ProductFactory.findAllPublishedForShop({ product_shop: req.shop.userId })
        }).send(res)
    }
    async searchProduct(req, res) {
        new OK({
            message: 'search product success',
            metadata: await ProductFactory.searchProduct({ keySearch: req.params.keySearch })
        }).send(res)
    }
    async getAllProduct(req, res) {
        new OK({
            message: 'get list all product success',
            metadata: await ProductFactory.findAllProduct(req.query)
        }).send(res)
    }
    async getProduct(req, res) {
        new OK({
            message: 'get product success',
            metadata: await ProductFactory.findProduct({ productId: req.params.productId })
        }).send(res)
    }
    // END QUERY
}

module.exports = new ProductController();