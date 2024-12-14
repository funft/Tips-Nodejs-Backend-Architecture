const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const checkoutController = require('../../controllers/checkout.controller');

route.post('/review', handleError(checkoutController.checkoutReview))


module.exports = route;