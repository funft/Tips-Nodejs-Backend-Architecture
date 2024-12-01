const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const { checkConnect } = require('./helpers/check.connect')
const bodyParser = require('body-parser');

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


module.exports = app;