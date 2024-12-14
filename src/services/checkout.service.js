'use strict'

const { checkExistRecord } = require("../utils");
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require('../services/discount.service')
const { cart } = require('../models/cart.model');
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

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
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
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


    // order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({ cartId, userId, shop_order_ids })

        const products = shop_order_ids_new.flatMap(item => item.item_products)
        console.log('products::', products);
        const acquireProduct = []
        for (let product of products) {
            const { productId, quantity } = product
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(!!keyLock)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        if (acquireProduct.includes(false)) throw new BadRequestError('Some product was updated, please visit cart again')
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shiping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // Nếu order thành công, thì xóa cart
        if (newOrder) {

        }

        return order
    }

    /*
        1> Query Order [ của Users]
    */
    static async getOrderByUser({ }) {

    }

    /*
        1> Query Order using Id [Users]
    */
    static async getOneOrderByUser({ }) {

    }

    /*
        1> Cancel Order [Users]
    */
    static async cancelOrderByUser({ }) {

    }

    /*
        1> Update Order Statús [Shop | Admin]
    */
    static async updateOrderStatusByShop({ }) {

    }

}

module.exports = CheckoutService;