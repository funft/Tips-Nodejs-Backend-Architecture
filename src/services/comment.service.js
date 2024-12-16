'use strict'

const { NotFoundError } = require("../core/error.response")
const commentModel = require("../models/comment.model")
const { product } = require("../models/product.model")
const { convertToObjectIdMongoDb, checkExistRecord } = require("../utils/index")
/*
    add comment [User, Shop]
    get a list of comments [User, Shop]
    delete a comment [User, Shop, Admin]
*/

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await checkExistRecord({
                model: commentModel,
                filter: { _id: convertToObjectIdMongoDb(parentCommentId) }
            })
            if (!parentComment) throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.comment_right
            // update many comment
            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongoDb(productId),

            }, 'comment_right', { sort: { comment_right: -1 } })
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()
        return comment
    }

    static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            console.log('parentComment', parentComment);
            if (!parentComment) throw new NotFoundError('Parent comment not found')
            const comments = await commentModel.find({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right }
            })
                .select({
                    comment_content: 1,
                    comment_parentId: 1,
                    comment_left: 1,
                    comment_right: 1
                })
                .sort({
                    comment_left: 1
                })
            return comments
        }

        const comments = await commentModel.find({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_parentId: null
        })
            .select({
                comment_content: 1,
                comment_parentId: 1,
                comment_left: 1,
                comment_right: 1
            })
            .sort({
                comment_left: 1
            })
        return comments
    }

    static async deleteComment({ commentId, productId }) {
        const foundComment = await commentModel.findOne({
            _id: convertToObjectIdMongoDb(commentId)
        })
        if (!foundComment) throw new NotFoundError('Comment not found')
        const foundProduct = await product.findOne({
            _id: convertToObjectIdMongoDb(productId)
        })
        if (!foundProduct) throw new NotFoundError('Product not found')
        const rightValue = foundComment.comment_right
        const leftValue = foundComment.comment_left
        const width = rightValue - leftValue + 1

        await commentModel.deleteMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })
        return null
    }
}
module.exports = CommentService