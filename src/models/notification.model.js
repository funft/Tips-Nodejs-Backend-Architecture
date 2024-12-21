'use strict'
const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

// Quy định noti_type giữa client và server để tiện xử lý
// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new promotion
// SHOP-001: new product by user following


const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], require: true },
    noti_senderId: { type: Schema.Types.ObjectId, require: true, ref: 'Shop' },
    noti_receiverId: { type: Number, require: true },
    noti_content: { type: String, require: true },
    noti_options: { type: Object, default: {} } // a Tips bảo chưa mấy thông tin sau dùng để gửi noti đỡ phải query
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = {
    noti: model(DOCUMENT_NAME, notificationSchema)
}