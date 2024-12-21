'use strict'

const { SuccessResponse } = require("../core/success.response")
const { listNotiByUser } = require("../services/notification.service")

class NotificationController {
    async getNotifications(req, res) {
        new SuccessResponse({
            message: 'Get notification successfully',
            metadata: await listNotiByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController()