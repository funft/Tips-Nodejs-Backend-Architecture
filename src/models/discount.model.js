'use strict'
const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // percentage
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // số lượng discount có thể sử dụng
    discount_uses_count: { type: Number, default: 0 }, // số lần đã sử dụng
    discount_user_used: { type: Array, default: [] }, // danh sách user đã sử dụng
    discount_max_uses_per_user: { type: Number, require: true }, // số lần sử dụng tối đa của 1 user
    discount_min_order_value: { type: Number, require: true }, // giá trị đơn hàng tối thiểu để sử dụng discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] } // số sản phẩm được áp dụng
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}