const { CREATED, OK } = require('../core/success.response');
const DiscountService = require('../services/discount.service');


class DiscountController {
    async createDiscountCode(req, res) {
        new CREATED({
            message: 'Discount code created successfully',
            metadata: await DiscountService.createDiscountCode(req.body)
        }).send(res)
    }
}

module.exports = new DiscountController();