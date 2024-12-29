'use strict'
const amqp = require('amqplib')
const dotenv = require('dotenv')
dotenv.config()

const log = console.log
console.log = function () {
    log.apply(console, [new Date().toISOString(), ...arguments])
}

const producerDLX = async () => {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await conn.createChannel()

        const notificationExchange = 'notificationEx'
        const notiQueue = 'notiQueueProcess'
        const notiExchangeDLX = 'notiExchangeDLX'
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

        // 1. create exchange
        await channel.assertExchange(notificationExchange, 'direct', { duraable: true })
        // 2. create queue
        const notiQueueProcess = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3. bind queue to exchange
        await channel.bindQueue(notiQueueProcess.queue, notificationExchange)
        // 4. send message
        const msg = 'create a new product'
        console.log('send message', msg);
        await channel.sendToQueue(notiQueueProcess.queue, Buffer.from(msg), {
            expiration: 10000
        })
        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 500)
    } catch (err) {
        console.error(err)
    }
}

producerDLX()
    .catch(console.error)