const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

class InventoryController {
    async addStockToInventory(req, res) {
        new SuccessResponse({
            message: 'addStockToInventory success',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController();