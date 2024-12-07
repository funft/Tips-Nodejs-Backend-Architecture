const express = require('express');
const route = express.Router();
const AccessController = require('../../controllers/access.controller');
const { handleError } = require('../../helpers/async.handle');
const { authentication } = require('../../auths/authUtils');

route.get('/signup', handleError(AccessController.signup));
route.get('/login', handleError(AccessController.signIn));

route.use(handleError(authentication))
route.delete('/logout', handleError(AccessController.logout));

module.exports = route;