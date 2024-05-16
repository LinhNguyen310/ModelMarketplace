'use strict'
// store the public key and refresh token for each user
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    publicKey:{
        type:String,
        required:true,

    },
    privateKey:{
        type:String,
        required:true,

    },
    refreshTokensUsed:{
        // refresh token is used to get new access token
        // detect if token is using wrong
        type:Array,
        default:[],
    },
    refreshToken:{
        // is currently being used
        type:String,
        default:null,
        required: true,
    },
}, {
    timestamps: true, // createdAt, updatedAt automatically created
    collection: COLLECTION_NAME // name of collection name should use for this model
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
