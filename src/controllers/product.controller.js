const { CREATED, OK } = require('../core/success.response');
const ProductFactory = require('../services/product.service');

class ProductController {
    async handleRefreshToken(req, res) {
        console.log('req.user.userId', req.user);
        new CREATED({
            message: 'create product success',
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController();