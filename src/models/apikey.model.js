'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "apikeys";
const COLLECTION_NAME = "apikeys";

// Declare the Schema of the Mongo model
var apikeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    }, 
    permissions: {
        type: [String],
        required: true,
        enum: ['000', '111', '222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apikeySchema);