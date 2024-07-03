'use strict'
const { update } = require('lodash');
// use repository pattern to hide the database logic from the service

const { product, electronic, furniture, clothing } = require('../product.model');

const findAllDraftsForShop = async({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id') // refer documents in another colelction, only takes the name and email fields from the shop collection but not the _id, product_shop refers to the field in the product collection
    .sort({updatedAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(); // exec() returns a promise, shows that this is an async function
}

module.exports = {
    findAllDraftsForShop
};