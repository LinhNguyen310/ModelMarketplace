'use strict'

const _ = require('lodash');

const getInfoData = ({fields = [], object = {} }) => {
    return _.pick(object, fields);
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((field) => [field, 1]));
}

const getUnselectData = (unselect = []) => {
    return Object.fromEntries(unselect.map((field) => [field, 0]));
}   

module.exports = {
    getInfoData,
    getSelectData,
    getUnselectData
}