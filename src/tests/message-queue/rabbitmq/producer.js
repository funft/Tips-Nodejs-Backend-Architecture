'use strict'
const amqp = require('amqplib')
const messages = "Hello RabbitMQ first time"
const dotenv = require('dotenv')
dotenv.config()
const runProducer = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })


        // send message to consumer
        channel.sendToQueue(queueName, Buffer.from(messages), {

        })
        console.log('message sent: ', messages);
    } catch (err) {
        console.error(err)
    }
}
runProducer().catch(console.error)