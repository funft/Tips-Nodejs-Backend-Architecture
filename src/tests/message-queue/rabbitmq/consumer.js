'use strict'
const amqp = require('amqplib')
const dotenv = require('dotenv')
dotenv.config()
const runConsumer = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })


        // receive message to consumer
        channel.consume(queueName, (messages) => {
            console.log('Received', messages.content.toString());
        }, {
            noAck: true
        })
    } catch (err) {
        console.error(err)
    }
}
runConsumer().catch(console.error)