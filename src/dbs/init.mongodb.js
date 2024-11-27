'use strict'
const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect')
const { mongodb } = require('../configs/config.mongodb')

// Sử dụng Singleton Pattern để tạo một instance của Database
class Database {
    instance
    constructor() {
        this._connect()
    }

    _connect() {
        console.log('mongodb.mongoUrl', mongodb.url);
        mongoose.connect(mongodb.url, {
            maxPoolSize: 10
        })
            .then(() => {
                console.log('connected to mongodb')
                countConnect()
            }
            )
            .catch((err) => {
                console.log('error connecting to mongodb', err)
            }
            )
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database()
        }
        return this.instance
    }
}
const dbInstance = Database.getInstance()
module.exports = dbInstance