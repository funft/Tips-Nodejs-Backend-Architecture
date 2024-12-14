const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const discountController = require('../../controllers/discount.controller');

route.post('/', handleError(discountController.createDiscountCode))


module.exports = route;