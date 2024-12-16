'use strict'

const { SuccessResponse } = require("../core/success.response")
const commentService = require("../services/comment.service")

class CommentController {
    async createComment(req, res) {
        new SuccessResponse({
            message: 'Create comment successfully',
            metadata: await commentService.createComment(req.body)
        }).send(res)
    }
    async deleteComment(req, res) {
        new SuccessResponse({
            message: 'Delete comment successfully',
            metadata: await commentService.deleteComment(req.query)
        }).send(res)
    }

    async getComments(req, res) {
        new SuccessResponse({
            message: 'Get comments successfully',
            metadata: await commentService.getCommentsByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()