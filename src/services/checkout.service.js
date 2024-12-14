'use strict'

const { checkExistRecord } = require("../utils");
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require('../services/discount.service')
const { cart } = require('../models/cart.model')

class CheckoutService {
    /*
        {
            cartId: 'string',
            userId: 'string',
            shop_order_ids: [
                {
                    shopId: 'string,
                    shop_discounts: [
                        {
                            codeId: 'string'
                        }
                    ],
                    item_products: [
                        {
                            price: 'number',
                            quantity: 'number',
                            productId: 'string',
                        }
                    ]    
                },
                {
                    shopId: 'string,
                    shop_discounts: [],
                    item_products: [
                        {
                            price: 'number',
                            quantity: 'number',
                            productId: 'string',
                        }
                    ]    
                }
            ]
        }
    */
    static async checkoutReview({ userId, shop_order_ids }) {
        const foundCart = await checkExistRecord({
            model: cart,
            filter: {
                cart_userId: userId,
                cart_state: 'active'
            }
        })
        if (!foundCart) throw new NotFoundError('Cart not found')
        const checkout_order = {
            totalPrice: 0,
            totalDiscount: 0,
            feeShip: 0,
            totalCheckout: 0,
        },
            shop_order_ids_new = []

        for (let order of shop_order_ids) {
            const { shopId, shop_discounts, item_products } = order
            const checkProductServer = await checkProductByServer({ products: item_products })
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong')

            const checkoutPrice = checkProductServer.reduce((acc, cur) => {
                return acc + cur.price * cur.quantity
            }, 0)
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // Nếu shop_discounts tồn tại > 0, check xem có hợp lệ không
            if (shop_discounts.length > 0) {
                // Giả sử chỉ có 1 discount -> để xử lý đơn giản đã
                const { codeId } = shop_discounts[0]
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                itemCheckout.priceApplyDiscount = totalPrice
                checkout_order.totalDiscount += discount
            }
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService;