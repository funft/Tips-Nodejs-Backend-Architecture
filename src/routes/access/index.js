const express = require('express');
const route = express.Router();
const AccessController = require('../../controllers/access.controller');
const { handleError } = require('../../auths/checkAuth');

route.get('/signup', handleError(AccessController.signup));

module.exports = route;