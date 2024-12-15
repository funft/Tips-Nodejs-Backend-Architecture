const redisPubsubService = require("../services/redisPubsub.service")

class InventoryServiceTest {
    async init() {
        await redisPubsubService.subscribeMessage('purchase_events', (channel, message) => {
            console.log('init InventoryServiceTest');
            InventoryServiceTest.updateInventory(JSON.parse(message))
        })
    }
    static async updateInventory({ productId, quantity }) {
        console.log('Updating inventory', productId, quantity);
    }
}

const inventoryServiceTest = new InventoryServiceTest()
module.exports = inventoryServiceTest