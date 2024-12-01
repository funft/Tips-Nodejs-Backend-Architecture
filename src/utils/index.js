'use strict'
const lodash = require('lodash');
const getIntoData = (obj = {}, fields = []) => {
    console.log('obj', obj);
    console.log('fields', fields);
    return lodash.pick(obj, fields);

}

module.exports = {
    getIntoData
}