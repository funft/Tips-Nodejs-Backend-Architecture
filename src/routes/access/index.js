const express = require('express');
const route = express.Router();
const AccessController = require('../../controllers/access.controller');

route.get('/signup', AccessController.signup);

module.exports = route;