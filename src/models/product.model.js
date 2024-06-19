'use strict'
const { min, max } = require('lodash');
const slugify = require('slugify');
// store the public key and refresh token for each user
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name : {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_slug: String, // slugify the product name to be used in the url for example: product name => product-name
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set:(val) => Math.round(val * 10) / 10 // 4.666666 => 46.66666 => 47 => 4.7
    },
    product_variations :{
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true ,// index here because this is one of the most commonly used queries,
        select: false // do not show this field in the query result because it is not needed
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    },
}, {
    timestamps: true, // createdAt, updatedAt automatically created
    collection: COLLECTION_NAME // name of collection name should use for this model
});


// document middleware: runs before.save() and.create()
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower: true});
    next();
});

// define the product type = clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    }
}, {
    collection: 'Clothes',
    timestamps  : true
});


// define product type = electronics
const electronicsSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, {
    collection: 'Electronics',
    timestamps  : true
});

// define product type = furnitures
const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    }
}, {
    collection: 'Furnitures',
    timestamps  : true
});

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothes', clothingSchema),
    electronic: model('Electronics', electronicsSchema),
    furniture: model("Furnitures", furnitureSchema)
};

