'use strict'
const { noti } = require('../models/notification.model')
const pushNotiToSystem = async ({
    type = 'ORDER-001',
    senderId = 1,
    receiverId = 1,
    options = {}
}) => {
    // Do something
    let noti_content = ''
    if (type === 'SHOP-001') {
        noti_content = 'create new Product successfully'
    } else if (type === 'ORDER-002') {
        noti_content = 'Order failed'
    }

    const newNoti = await noti.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_content,
        noti_options: options
    })
    return newNoti
}

const listNotiByUser = async ({
    userId = 1,
    type = "ALL",
    isRead = 0
}) => {
    const match = {
        noti_receiverId: +userId
    }
    if (type !== "ALL") {
        match["noti_type"] = type
    }
    const notifications = await noti.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: [{ $toString: "$noti_options.shop_name" }, 0, -1]
                        },
                        " vừa mới thêm 1 sản phẩm mới: ",
                        {
                            $substr: ["$noti_options.product_name", 0, -1]
                        }
                    ]
                },
                createAt: 1,
                noti_options: 1
            }
        }
    ])
    return notifications
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}