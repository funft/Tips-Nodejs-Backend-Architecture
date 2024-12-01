'use strict'
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const INTERVAL_CHECK = 5000

const countConnect = () => {
    return mongoose.connections.length;
}

function checkConnect() {
    setInterval(() => {
        const connects = countConnect();
        const cpus = os.cpus().length
        const mem = process.memoryUsage().rss
        const maxConnections = cpus * 5;
        if (connects > maxConnections) {
            console.log('Max connections exceeded');
        }



    }, INTERVAL_CHECK)
}

module.exports = { countConnect, checkConnect };