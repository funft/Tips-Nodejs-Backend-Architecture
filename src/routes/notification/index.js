const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const NotificationController = require('../../controllers/notification.controller');

route.get('', handleError(NotificationController.getNotifications));


module.exports = route;