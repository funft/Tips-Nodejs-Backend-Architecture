const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops'
// Tạo Schema cho Shops
const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Đảm bảo email là duy nhất
        lowercase: true, // Chuyển email về chữ thường
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] // Kiểm tra định dạng email hợp lệ
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],  // Trạng thái của shop
        default: 'active'
    },
    verify: {
        type: Boolean,
        default: false // Chưa xác thực mặc định là false
    },
    roles: {
        type: [String], // Mảng các vai trò, ví dụ ['admin', 'seller', 'customer']
        default: ['seller']
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Tạo model cho Shops
const Shop = mongoose.model(DOCUMENT_NAME, shopSchema, COLLECTION_NAME);

module.exports = Shop;
