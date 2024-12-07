
const SUCCESS_CODE = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
}

const REASON_CODE = {
    OK: 'OK',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
}

class SuccessResponse {
    constructor(message, data, code) {
        this.message = message
        this.code = code
        this.data = data
    }
    send(res) {
        return res.status(this.code).json({
            message: this.message,
            data: this.data,
            code: this.code
        })
    }
}

class OK extends SuccessResponse {
    constructor(message, data = {}, code = SUCCESS_CODE.OK, reasonCode = REASON_CODE.OK) {
        super(message, data, code)
        this.message = message || reasonCode
    }
}
class CREATED extends SuccessResponse {
    constructor(message, data = {}, code = SUCCESS_CODE.CREATED, reasonCode = REASON_CODE.CREATED) {
        super(message, data, code)
        this.message = message || reasonCode
    }
}


module.exports = {
    OK,
    CREATED
}