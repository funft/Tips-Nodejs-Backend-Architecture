'use strict'

const { convertToObjectIdMongoDb } = require("../../utils")
const { inventory } = require("../inventory.model")

const insertInventory = async ({ productId, location, stock, shopId }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_location: location,
        inven_stock: stock,
        inven_shopId: shopId
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectIdMongoDb(productId),
        inven_stock: { $gte: quantity }
    },
        updateSet = {
            $inc: {
                inven_stock: -quantity
            },
            $push: {
                inven_reservation: {
                    quantity,
                    cartId,
                    createdOn: new Date()
                }
            }
        },
        options = {
            upsert: true,
            new: true
        }
    return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}