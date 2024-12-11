'use strict'
const { cart } = require('../models/cart.model')
const { checkExistRecord } = require('../utils')

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'activve' },
            updateOrInsert = {
                cart_userId: userId,
                cart_products: [product]
            },
            options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.product_id': productId,
            cart_state: 'active'
        },
            updateSet = {
                '$inc': {
                    'cart_products.$.product_quantity': quantity
                }
            },
            options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product }) {
        const foundCart = await checkExistRecord({
            model: cart,
            filter: {
                cart_userId: userId
            }
        })

        if (!foundCart) {
            return await CartService.createUserCart({ userId, product })
        }

        if (!foundCart.cart_products.length) {
            foundCart.cart_products.push(product)
            foundCart.cart_count_product += 1
            return await foundCart.save()
        }

        // Nếu đã có sản phẩm này trong giỏ hàng -> tăng số lượng
        // Thắc mắc là sao a Tips ko dùng foundCart để update luôn cho nhanh, hay do ko khác nhau???
        return await CartService.updateUserCartQuantity({ userId, product })
    }
}

module.exports = CartService