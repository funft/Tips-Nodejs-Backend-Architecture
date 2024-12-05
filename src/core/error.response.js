'use strict'

const STATUS_CODE = {
    FORBIDDEN: 401,
    CONFLICT: 409,
    UNAUTHORIZED: 403,
}

const REASON_CODE = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    UNAUTHORIZED: 'Unauthorized error',
}

class ErrorResponse extends Error {
    constructor(message, code) {
        super(message)
        this.code = code
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = REASON_CODE.CONFLICT, code = STATUS_CODE.CONFLICT) {
        super(message, code)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = REASON_CODE.FORBIDDEN, code = STATUS_CODE.FORBIDDEN) {
        super(message, code)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = REASON_CODE.UNAUTHORIZED, code = STATUS_CODE.UNAUTHORIZED) {
        super(message, code)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}