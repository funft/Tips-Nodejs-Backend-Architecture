const express = require('express');
const routes = express.Router();

routes.use('/access', require('./access/index'));

module.exports = routes;