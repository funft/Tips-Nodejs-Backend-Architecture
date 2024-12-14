'use strict'
const { Schema } = require('mongoose')
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response')
const { discount } = require('../models/discount.model')
const { convertToObjectIdMongoDb, checkExistRecord } = require('../utils')
const { findAllProducts } = require('../models/repositories/product.repo')
const { findAllDiscountUnselect } = require('../models/repositories/discount.repo')
const { product } = require('../models/product.model')


class DiscountService {
    static async createDiscountCode({
        discountName, discountDescription, discountType, discountValue, discountCode, discountStartDate, discountEndDate, discountMaxUses, discountUsesCount, discountUserUsed, discountMaxUsesPerUser,
        discountMinOrderValue, discountShopId,
        discountIsActive, discountAppliesTo, discountProductIds
    }) {
        // Kiểm tra dữ liệu đầu vào
        // Bước này nên viết handler theo Builder Pattern bắt ở controller
        if (new Date > new Date(discountStartDate) || new Date() > new Date(discountEndDate)) {
            throw new BadRequestError('Discount start date or end date is invalid')
        }
        if (new Date(discountStartDate) > new Date(discountEndDate)) {
            throw new BadRequestError('Discount start date must be before discount end date')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: discountCode,
            discount_shopId: convertToObjectIdMongoDb(discountShopId)
        }).lean()

        if (foundDiscount?.discount_is_active) {
            throw new BadRequestError('Discount code is already exists')
        }

        console.log('discountShopId', discountShopId);
        console.log('discountShopId', typeof discountShopId);
        return await discount.create({
            discount_name: discountName,
            discount_description: discountDescription,
            discount_type: discountType,
            discount_value: discountValue,
            discount_code: discountCode,
            discount_start_date: new Date(discountStartDate),
            discount_end_date: new Date(discountEndDate),
            discount_max_uses: discountMaxUses,
            discount_uses_count: discountUsesCount,
            discount_user_used: [discountUserUsed],
            discount_max_uses_per_user: discountMaxUsesPerUser,
            discount_min_order_value: discountMinOrderValue || 0,
            discount_shopId: convertToObjectIdMongoDb(discountShopId),
            discount_is_active: discountIsActive,
            discount_applies_to: discountAppliesTo,
            discount_product_ids: discountAppliesTo == "all" ? [] : discountProductIds
        })
    }

    static async updateDiscountCode({

    }) {
        // ...
    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }) {
        // ko hiểu sao a Tips lại có dòng dưới ý gì
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        })

        if (!foundDiscount?.discount_is_active) {
            throw new NotFoundError('Not found discount error')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to == 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoDb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to == 'specific') {
            products = await findAllProducts({
                filter: {
                    product_shop: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountCodeByShop({
        limit, page, shopId
    }) {
        const foundDiscounts = await findAllDiscountUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongoDb(shopId)
            },
            unSelect: ['__v', 'discount_shopId']
        })
    }


    /**
      products:
      [
       {
            productId: '123',
            quantity: 2,
            price: 100,
            name: 'product 1',
            shopId: 'shopId'
      },
       {
            productId: '123',
            quantity: 2,
            price: 100,
            name: 'product 1',
            shopId: 'shopId'
      }
      ]
     */
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkExistRecord({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount code not found')
        const {
            discount_is_active,
            discount_start_date,
            discount_end_date,
            discount_max_uses,
            discount_min_order_value,
            discount_user_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new ForbiddenError('Discount code is not active')
        if (!discount_max_uses) throw new BadRequestError('Discount code are out')
        if (new Date(discount_end_date) < new Date()) {
            throw new ForbiddenError('Discount code is expired')
        }
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
            if (totalOrder < discount_min_order_value) throw new ForbiddenError('Total order is not engough')
        }
        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_user_used.find(e => e.userId === userId)
            if (userUsedDiscount?.length > discount_max_uses_per_user) throw new ForbiddenError('User used discount code')
        }
        // ... check phức tạp nữa, nên dùng Builder Pattern

        if (!product) throw new NotFoundError('Product not found')


        const discountAmount = discount_type == 'fixed_amount' ? discount_value : totalOrder * discount_value / 100
        return {
            totalOrder,
            discount,
            totalPrice: totalOrder - discountAmount
        }
    }

    static async deleteDiscountCode({ codeId, shopId }) {
        return await discount.deleteOne({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        })
    }

    static async cancelDiscountCode({ codeId, userId, shopId }) {
        const foundDiscount = await checkExistRecord({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount code not found')

        const result = await discount.findOneAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_uses_count: -1,
                discount_max_uses: 1
            }
        })
        return result
    }
}
module.exports = DiscountService