const express = require('express');
const route = express.Router();
const AccessController = require('../../controllers/access.controller');
const { handleError } = require('../../auths/checkAuth');

route.get('/signup', handleError(AccessController.signup));
route.get('/login', handleError(AccessController.signIn));

module.exports = route;