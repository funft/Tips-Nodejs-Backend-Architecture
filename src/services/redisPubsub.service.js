'use strict'
const Redis = require('redis')

class RedisPubSubService {
    constructor() {
        this.publisher = Redis.createClient()
        this.subscriber = Redis.createClient()
        this.publisher.on('error', (err) => {
            console.log('Publisher error', err);
        })
        this.subscriber.on('error', (err) => {
            console.log('Subscriber error', err);
        })
        this.publisher.on('end', (err) => {
            console.log('Publisher end', err);
        })
        this.subscriber.on('end', (err) => {
            console.log('Subscriber end', err);
        })
    }
    async init() {
        await this.publisher.connect()
        await this.subscriber.connect()
        this.publisher.on('ready', () => {
            console.log('Publisher ready');
        })
    }
    async publishMessage(channel, message) {
        console.log('publishMessage', message);
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message)
                .then((reply) => {
                    resolve(reply)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    async subscribeMessage(channel, callback) {
        await this.subscriber.subscribe(channel, (message, subscriberChannel) => {
            console.log('subscribeMessage subscribe::', message, channel);
            if (channel === subscriberChannel) {
                callback(channel, message)
            }
        })
    }
}
const redisPubsubService = new RedisPubSubService()
redisPubsubService.init()
module.exports = redisPubsubService