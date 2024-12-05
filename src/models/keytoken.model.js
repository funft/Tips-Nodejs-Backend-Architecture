'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
const keytokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array, // a Tips bảo sau này để detect hacker đã dùng token
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, keytokenSchema, COLLECTION_NAME);

