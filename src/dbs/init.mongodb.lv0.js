'use strict'
const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017/devShop'
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('connected to mongodb')
    }
    )
    .catch((err) => {
        console.log('error connecting to mongodb', err)
    }
    )

//dev: set cho môi trường dev, vẫn chưa hiểu làm gì chỗ này
if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
    });
}



exports.exports = mongoose