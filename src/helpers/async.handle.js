'use strict'

const handleError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.log('err', err.stack);
            next(err)
        })
    }
}

module.exports = { handleError }