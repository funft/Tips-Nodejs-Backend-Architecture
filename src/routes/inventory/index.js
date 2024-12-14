const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const inventoryController = require('../../controllers/inventory.controller');

route.use(authenticationV2)
route.post('', handleError(inventoryController.addStockToInventory))


module.exports = route;