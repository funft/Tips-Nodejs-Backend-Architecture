const redisPubsubService = require("../services/redisPubsub.service")

class ProductServiceTest {
    async purchaseProduct({ productId, quantity }) {
        console.log('purchaseProduct test');
        const order = {
            productId,
            quantity
        }
        redisPubsubService.publishMessage('purchase_events', JSON.stringify(order))
            .then((reply) => {
                console.log('purchaseProduct reply::', reply);
            })
            .catch((err) => {
                console.log('purchaseProduct error::', err);
            }
            )
    }
}

module.exports = new ProductServiceTest()