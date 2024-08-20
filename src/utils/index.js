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

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    return obj;
}
/**
 * @param {Object} obj
 * @returns {Object}
const a  ={
    a: 1,
    b: 2,
    c: {
        d: 3,
        e: 4
    }    
}

db.collection.updateOne({
'c.d': 3
})
*/

const nestedObjectParser = obj => {
    const final = {};
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'Object' && !Array.isArray(obj[key])) {
            const response = nestedObjectParser(obj[key]);
            Object.keys(response).forEach(innerKey => {
                final[`${key}.${innerKey}`] = response[innerKey];
            });
        } else {
            final[key] = obj[key];
        }
    });
    return final;
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnselectData,
    removeUndefinedObject, 
    nestedObjectParser
}