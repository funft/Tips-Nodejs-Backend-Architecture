'use strict'
const { model, Schema, Types } = require('mongoose');
const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        require: true,
        enum: ['0000', '0001', '0002', '0003']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, apiKeySchema)