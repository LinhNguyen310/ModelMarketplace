// use to create the token
'use strict'

const keytokenModel = require("../models/keytoken.model");
const {Types} = require('mongoose');

class KeyTokenService {
    static createToken = async ({userId, publicKey, privateKey, refreshTokensUsed}) => {
        try {
            // // public key still has buffer so convert to string when I insert it to database it wont cause an error
            // const publicKeyString = publicKey.toString();
            // const token = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString});
            // return token ? token.publicKey : null; // return public key if token exists
            const filter = {user: userId};
            const update = {publicKey, privateKey, refreshTokensUsed: []};
            const options = {upsert: true, new: true}; // upsert: create new if not exists, new: return new document if created
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        try {
            const token = await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean(); // Types.ObjectId(userId) to convert string to ObjectId
            return token ? token : null;
        } catch (error) {
            return error;
        }
    }

}

module.exports = KeyTokenService;