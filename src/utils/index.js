'use strict'
const lodash = require('lodash');
const getIntoData = ({ obj = {}, fields = [] }) => {
    return lodash.pick(obj, fields);

}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(e => [e, 1]))
}
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(e => [e, 0]))
}
const bodyUpdateParser = (obj = {}) => {
    const final = {}
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const subObj = bodyUpdateParser(obj[key])
            Object.keys(subObj).forEach(subKey => {
                final[`${key}.${subKey}`] = subObj[subKey]
            }
            )
        } else if (obj[key]) {
            final[key] = obj[key]
        }
    })
    return final
}

module.exports = {
    getIntoData,
    getSelectData,
    getUnSelectData,
    bodyUpdateParser
}