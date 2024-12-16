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

// test pub sub redis
// const inventoryServiceTest = require('./tests/inventory.test')
// inventoryServiceTest.init()
//     .then(() => {
//         const productTest = require('./tests/product.test')
//         productTest.purchaseProduct({ productId: 123, quantity: 10 })
//     })
//     .catch((err) => {
//         console.log('Error', err);
//     })

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
    error.code = 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.code || 500
    return res.status(statusCode).json({
        message: error.message || 'Internal Server Error',
        stack: error.stack || 'No stack',
        status: 'error',
        code: statusCode
    })
})

module.exports = app;