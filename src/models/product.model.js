'use strict'
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
}, {
    timestamps: true, // createdAt, updatedAt automatically created
    collection: COLLECTION_NAME // name of collection name should use for this model
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

