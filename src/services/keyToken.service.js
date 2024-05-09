// use to create the token
'use strict'

const keytokenModel = require("../models/keytoken.model");

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
            return {
                code: 'Error Code',
                message: error.message || 'Error Message',
                status: 'Error Status'
            }
        }
    }

}

module.exports = KeyTokenService;