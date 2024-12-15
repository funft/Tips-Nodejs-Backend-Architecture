const Redis = require('redis');

let client;
async function init() {
    // Create and connect the main client (publisher)
    client = Redis.createClient();
    await client.connect();
}

const listener = (message, channel) => {
    console.log(`Received message: "${message}" on channel: "${channel}"`);
};

async function test() {
    // Create a dedicated subscriber connection
    const subscriber = Redis.createClient().duplicate();
    subscriber.on('error', err => console.error('Subscriber error:', err));
    await subscriber.connect();

    // Subscribe to the channel using the subscriber connection
    await subscriber.subscribe('channel', listener);

    // Publish a test message from the publisher connection
    await client.publish('channel', 'Hello from Pub/Sub!');
}

init()
    .then(test)
    .catch(err => console.error('Error:', err));
