'use strict'
const { Schema } = require('mongoose')
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response')
const { discount } = require('../models/discount.model')
const { convertToObjectIdMongoDb } = require('../utils')
const { findAllProducts } = require('../models/repositories/product.repo')
const { findAllDiscountUnselect } = require('../models/repositories/discount.repo')

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
            discount_user_used: discountUserUsed,
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
}