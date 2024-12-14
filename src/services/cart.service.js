'use strict'
const { NotFoundError, BadRequestError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { checkExistRecord } = require('../utils')
const { findProductById } = require('./product.service')

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
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
            'cart_products.productId': productId,
            cart_state: 'active'
        },
            updateSet = {
                '$inc': {
                    'cart_products.$.quantity': quantity
                }
            },
            options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product }) {
        console.log('addToCart');
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

    // update Cart
    /*
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        productId,
                        oldQuantity
                    }
                ],
                version
            }
        ]
    */
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, oldQuantity } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await findProductById({ productId })
        if (!foundProduct) throw new NotFoundError('Product not found')
        // compare
        console.log('foundProduct.product_shop', foundProduct.product_shop);
        console.log('shop_order_ids[0].shopId', shop_order_ids[0]?.item_products[0]?.shopId);
        if (foundProduct.product_shop.toString() != shop_order_ids[0]?.item_products[0]?.shopId) throw new BadRequestError('Product not belong to shop')
        if (quantity == 0) {
            // delete
        }
        console.log('runhere');
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - oldQuantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        },
            updateSet = {
                $pull: {
                    cart_products: { productId: productId }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId,
        }).lean()
    }
}

module.exports = CartService