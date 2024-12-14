'use strict'
const redis = require('redis')
const { promisify } = require('util')
const { findProductById } = require('../models/repositories/product.repo')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 5
    const expireTime = 3000; // 3 seconds
    for (let i = 0; i < retryTimes; i++) {
        // tao 1 key lock, thang nao nam thi duoc vao thanh toan
        const result = await setnxAsync(key, expireTime)
        console.log('result::', result);
        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({ productId, quantity, cartId })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }


            return null
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    const delAsyncKey = primisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}