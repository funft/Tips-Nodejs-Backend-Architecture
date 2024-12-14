'use strict'
const { NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { product } = require("../models/product.model");
const { checkExistRecord } = require("../utils");

class InventoryService {
    static async addStockToInventory({ productId, stock, shopId, location = 'HaNoi' }) {
        const foundProduct = await checkExistRecord({
            model: product,
            filter: {
                _id: productId
            }
        })
        if (!foundProduct) throw new NotFoundError('Product not found')

        const query = { inven_productId: productId, inven_shopId: shopId },
            updateSet = {
                $inc: { inven_stock: stock },
                $set: { inven_location: location }
            },
            options = { upsert: true, new: true }
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService;