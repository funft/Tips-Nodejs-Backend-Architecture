'use strict'
const lodash = require('lodash');
const getIntoData = ({ obj = {}, fields = [] }) => {
    return lodash.pick(obj, fields);

}



module.exports = {
    getIntoData,
}