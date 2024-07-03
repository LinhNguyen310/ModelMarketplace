'use strict'
const { Types } = require('mongoose');
// use repository pattern to hide the database logic from the service
// GET
const { product, electronic, furniture, clothing } = require('../product.model');

const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip});
}

const findAllPublishedForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip});
}

// PUT
const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne(
        {product_shop: new Types.ObjectId(product_shop),
        _id: product_id});

    if (!foundShop) {
        return null;
    }
    // Check if the product is already published
    if (foundShop.isPublished) {
        return 0; // Return 0 if no update is needed
    }

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    foundShop.updatedAt = new Date();
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id') // refer documents in another colelction, only takes the name and email fields from the shop collection but not the _id, product_shop refers to the field in the product collection
    .sort({updatedAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(); // exec() returns a promise, shows that this is an async function}
}

module.exports = {
    findAllDraftsForShop, 
    publishProductByShop, 
    findAllPublishedForShop
};