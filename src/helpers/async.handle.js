'use strict'

const handleError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.log('err', err);
            next(err)
        })
    }
}

module.exports = { handleError }