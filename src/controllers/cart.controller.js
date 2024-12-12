const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');


class CartController {
    async addToCart(req, res) {
        new SuccessResponse({
            message: 'Add product to cart successfully',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    // update + -
    async updateCart(req, res) {
        new SuccessResponse({
            message: 'Update product in cart successfully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    async delete(req, res) {
        new SuccessResponse({
            message: 'Delete product in cart successfully',
            metadata: await CartService.deleteUserCart(req.query)
        }).send(res)
    }
    async getListUserCart(req, res) {
        new SuccessResponse({
            message: 'Get list product in cart successfully',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController();