'use strict'
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const { crypto } = require('crypto');

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
            const newShop = shopModel.create({name, email, password: passwordHash, roles: [roleShop.SHOP]}); 

            if (newShop){
                // create privateKey, publicKey
                // private key is to create the token
                // public key is to verify the token
                const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                });
                console.log({ privateKey, publicKey }); // save collection key store
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