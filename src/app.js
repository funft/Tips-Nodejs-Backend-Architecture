const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const { checkConnect } = require('./helpers/check.connect')

// init middleware
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')
checkConnect()

// init routes
app.get('/app', (req, res) => {
    const strCompressed = 'Hello World <>';

    res.status(200).json(
        {
            message: "success",
            metadata: strCompressed.repeat(10000)
        }
    )
});

// init error handler


module.exports = app;