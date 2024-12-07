const { CREATED, OK } = require('../core/success.response');
const ProductFactory = require('../services/product.service');

class ProductController {
    async handleRefreshToken(req, res) {
        new CREATED({
            message: 'create product success',
            metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController();