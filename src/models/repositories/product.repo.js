'use strict'
const { Types } = require('mongoose');
// use repository pattern to hide the database logic from the service
// GET
const { product, electronic, furniture, clothing } = require('../product.model');
const { getSelectData, getUnselectData } = require('../../utils');

const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip});
}

const findAllPublishedForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip});
}

const searchProductByUser = async ({keySearch}) => {
    const regex = new RegExp(keySearch);
    // mostly find name or description
    const result = await product.find({
        $text: {$search: regex},
    }, 
    {score: {$meta: 'textScore'}}) // score is the relevance of the search result
    .sort({score: {$meta: 'textScore'}}) // sort by the relevance of the search result
    .lean();
    return result ;
}

const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit; // calculate the number of documents to skip
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}; // sort by id in descending order if sort is ctime, otherwise sort by id in ascending order'
    const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean(); // exec() returns a promise, shows that this is an async function
    return products;
}

const findProduct = async ({product_id, unselect}) => {
    return await product.findOne({_id: product_id}).select(getUnselectData(unselect)).lean().exec();
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

const unpublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne(
        {product_shop: new Types.ObjectId(product_shop),
        _id: product_id});

    if (!foundShop) {
        return null;
    }

    if (foundShop.isPublished) {
        return 0; // Return 0 if no update is needed
    }

    foundShop.isDraft = true;
    foundShop.isPublished = false;
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

// PATCH
const updateProductRepo = async (product_id, payload, model, isNew = true) => {
    console.log("model is: ", model)
    return await product.findOneAndUpdate({_id: product_id}, payload, {new: isNew}).lean().exec();
}

module.exports = {
    findAllDraftsForShop, 
    publishProductByShop, 
    unpublishProductByShop,
    findAllPublishedForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductRepo   
};