const express = require('express');
const route = express.Router();
const AccessController = require('../../controllers/access.controller');
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');

route.get('/signup', handleError(AccessController.signup));
route.get('/login', handleError(AccessController.signIn));

route.use(handleError(authenticationV2))
route.delete('/logout', handleError(AccessController.logout));
route.post('/handleRefreshToken', handleError(AccessController.handleRefreshToken));

module.exports = route;