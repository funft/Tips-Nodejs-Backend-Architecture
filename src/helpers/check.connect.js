'use strict'
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const INTERVAL_CHECK = 5000

const countConnect = () => {
    console.log('Number of connections: ', mongoose.connections.length);
    return mongoose.connections.length;
}

function checkConnect() {
    setInterval(() => {
        const connects = countConnect();
        const cpus = os.cpus().length
        console.log('cpus', cpus);
        const mem = process.memoryUsage().rss
        const maxConnections = cpus * 5;

        console.log(`Mem usage: ${mem / 1024 / 1024} MB`);

        if (connects > maxConnections) {
            console.log('Max connections exceeded');
        }



    }, INTERVAL_CHECK)
}

module.exports = { countConnect, checkConnect };