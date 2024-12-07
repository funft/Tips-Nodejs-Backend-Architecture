const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const ProductController = require('../../controllers/product.controller');

route.get('/searchProduct/:keySearch', handleError(ProductController.searchProduct));
route.get('/', handleError(ProductController.getAllProduct));
route.get('/:productId', handleError(ProductController.getProduct));

route.use(handleError(authenticationV2))

route.patch('/updateProduct/:id', handleError(ProductController.updateProduct));
route.post('/createProduct', handleError(ProductController.handleRefreshToken));
route.post('/publishProduct/:id', handleError(ProductController.publishProduct))
route.post('/unPublishProduct/:id', handleError(ProductController.publishProduct))
// QUERY
route.get('/drafts/all', handleError(ProductController.getAllDraftForShop));
route.get('/published/all', handleError(ProductController.getAllPublishedForShop));


module.exports = route;