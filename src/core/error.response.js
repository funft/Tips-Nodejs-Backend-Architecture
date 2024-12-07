'use strict'

const STATUS_CODE = {
    FORBIDDEN: 401,
    UNAUTHORIZED: 403,
    CONFLICT: 409,
    NOT_FOUND: 404
}

const REASON_CODE = {
    FORBIDDEN: 'Bad request error',
    UNAUTHORIZED: 'Unauthorized error',
    CONFLICT: 'Conflict error',
    NOT_FOUND: 'Not found error'
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

class NotFoundError extends ErrorResponse {
    constructor(message = REASON_CODE.NOT_FOUND, code = STATUS_CODE.NOT_FOUND) {
        super(message, code)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = REASON_CODE.UNAUTHORIZED, code = STATUS_CODE.UNAUTHORIZED) {
        super(message, code)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = REASON_CODE.FORBIDDEN, code = STATUS_CODE.FORBIDDEN) {
        super(message, code)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}