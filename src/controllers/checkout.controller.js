const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
    async checkoutReview(req, res) {
        new SuccessResponse({
            message: 'Checkout review',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new CheckoutController();