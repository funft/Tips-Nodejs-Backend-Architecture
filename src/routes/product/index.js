const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const ProductController = require('../../controllers/product.controller');

route.use(handleError(authenticationV2))
route.post('/createProduct', handleError(ProductController.handleRefreshToken));

module.exports = route;