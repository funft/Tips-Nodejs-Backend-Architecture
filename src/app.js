const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const { checkConnect } = require('./helpers/check.connect')
const bodyParser = require('body-parser');
const { handleError } = require('./auths/checkAuth');

// init middleware
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
app.use(bodyParser.json())

// init db
require('./dbs/init.mongodb')
checkConnect()

// init routes
app.use('/v1/api', require('./routes/index'));

// init error handler
// handle 404 because other status is handled in routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    console.log('run1');
    error.code = 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.code || 500
    console.log('run2');
    return res.status(statusCode).json({
        message: error.message || 'Internal Server Error',
        status: 'error',
        code: statusCode
    })
})

module.exports = app;