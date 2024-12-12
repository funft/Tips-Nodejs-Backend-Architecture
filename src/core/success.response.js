
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
    constructor({ message, metadata, code = SUCCESS_CODE.OK }) {
        console.log('code', code);
        this.message = message
        this.code = code
        this.metadata = metadata
    }
    send(res) {
        return res.status(this.code).json({
            message: this.message,
            metadata: this.metadata,
            code: this.code
        })
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata = {}, code = SUCCESS_CODE.OK, reasonCode = REASON_CODE.OK }) {
        super({ message, metadata, code })
        this.message = message || reasonCode
    }
}
class CREATED extends SuccessResponse {
    constructor({ message, metadata = {}, code = SUCCESS_CODE.CREATED, reasonCode = REASON_CODE.CREATED }) {
        super({ message, metadata, code })
        this.message = message || reasonCode
    }
}


module.exports = {
    OK,
    CREATED,
    SuccessResponse
}