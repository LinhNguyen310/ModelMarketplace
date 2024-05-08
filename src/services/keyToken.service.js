// use to create the token
'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createToken = async ({userId, publicKey}) => {
        try {
            // public key still has buffer so convert to string when I insert it to database it wont cause an error
            const publicKeyString = publicKey.toString();
            const token = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString});
            return token ? token.publicKey : null; // return public key if token exists
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