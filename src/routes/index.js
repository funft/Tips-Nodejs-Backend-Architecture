const express = require('express');
const { apiKey, checkPermission } = require('../auths/checkAuth');
const routes = express.Router();

// check api key
routes.use(apiKey)
// check permission
routes.use(checkPermission('0000'))

routes.use('/access', require('./access/index'));
routes.use('/product', require('./product/index'));

module.exports = routes;