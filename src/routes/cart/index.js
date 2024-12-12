const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const cartController = require('../../controllers/cart.controller');

route.post('', handleError(cartController.addToCart))
route.post('/update', handleError(cartController.updateCart));
route.get('', handleError(cartController.getListUserCart));
route.delete('', handleError(cartController.delete));


module.exports = route;