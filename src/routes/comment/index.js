const express = require('express');
const route = express.Router();
const { handleError } = require('../../helpers/async.handle');
const { authenticationV2 } = require('../../auths/authUtils');
const CommentController = require('../../controllers/comment.controller');

route.use(authenticationV2);
route.post('', handleError(CommentController.createComment));
route.get('', handleError(CommentController.getComments));
route.delete('', handleError(CommentController.deleteComment));


module.exports = route;