'use strict'
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');

const roleShop = {
    SHOP: '000',
    WRITER: '001',
    EDITOR: '002',
    ADMIN: '003'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            console.log("Service test", name, email, password)
            // check if email already exists
            // if exists, throw error
            // use lean to make the object lighter
            const holderShop = await shopModel.findOne({email}).lean();
            if(holderShop) {
                return {
                    code: 'Error Code For Email Already Exists',
                    message: 'Email Already Exists',
                    status: 'Error Status'
                }
            }
            // shop hasnt been created yet
            // hash the password, 10 is enough if more will affect cpu performance
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({name, email, password: passwordHash, roles: [roleShop.SHOP]}); 

            if (newShop){
                // create privateKey, publicKey
                // private key is to create the token
                // public key is to verify the token
                const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1', // Public Key Cryptography Standards 1
                        format: 'pem' // Privacy Enhanced Mail
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                });
                const publicKeyString = await KeyTokenService.createToken({userId: newShop._id, publicKey});
                if (!publicKeyString){
                    return {
                        code: 'Error Code For Public Key',
                        message: 'Public Key Error',
                        status: 'Error Status'
                    }
                }
                // has public key string
                const publicKeyObject = crypto.createPublicKey(publicKeyString);
                
                // create access token and refresh token
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyObject, privateKey);
                return {
                    code: '201', // created
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
            }
            return  {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'Error Code',
                message: error.message || 'Error Message',
                status: 'Error Status'
            }
        }
    }
}

module.exports = AccessService;