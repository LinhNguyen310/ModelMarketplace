'use strict'
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {Types, default: mongoose} = require('mongoose');
const { BadRequestError, ConflictRequestError, AuthFailureError, NotFoundError } = require('../core/error.response');
const ShopService = require('./shop.service');
const keytokenModel = require('../models/keytoken.model');

const roleShop = {
    SHOP: '000',
    WRITER: '001',
    EDITOR: '002',
    ADMIN: '003'
}

class AccessService {
    static logout = async ({keyStore}) => {
        const newUserId = new Types.ObjectId(keyStore.userId);
        const delKey = await KeyTokenService.removeKeyById({_id:newUserId});
        console.log({delKey});
        return delKey;
    }


    /*
    Check token used ?
    */
    static handleRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRequestTokenUsed(refreshToken);
        console.log("token found", foundToken)
        console.log("refreshToken", refreshToken)
        // if token is found but get refresh again
        if  (foundToken) { 
            // decode to see who is this
            const { userId, email} = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log("userId", userId);
            // delete keys from keyStore
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something went wrong. Please login! ');
        }
        
        // if token is not found
        const holderToken = await KeyTokenService.findByRequestToken(refreshToken);

        console.log("holderToken", holderToken)
        if (!holderToken){
            throw new NotFoundError('Token not found. ');
        }

        // verify token
        const { userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
        const foundShop = await ShopService.findByEmail(email);

        if (!foundShop){
            throw new BadRequestError('Error: Shop not found. ');
        }
        
        // if foundShop, provide a new token
        // move the refresh token to refreshTokensUsed
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey);

        console.log("tokens", tokens)
        console.log("refreshToken", refreshToken)

        // update refresh token
        await KeyTokenService.updateRefreshToken({userId, usedRefreshToken: refreshToken, newRefreshToken: tokens.refreshToken});

        return {
            userId: userId,
            tokens
        }
    }
    /*
    * @param {Object} param0
    * @param {String} param0.email
    * @param {String} param0.password
    * @param {String} param0.refreshToken
    * 1 - Check if email exists
    * 2 - Check if password is correct
    * 3 - Create access token and refresh token
    * 4 - generate token
    * 5 - Get data and return logic
    */
    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await ShopService.findByEmail(email);

        if (!foundShop){
            throw new BadRequestError('Error: Shop not found. ');
        }

        // validate password
        const match = await bcrypt.compare(password, foundShop.password);

        if (!match){
            throw new AuthFailureError('Authentication Error.');
        }

        // generate token
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

        const publicKeyString = await KeyTokenService.createToken({userId: foundShop._id, publicKey});
        if (!publicKeyString){
            throw new BadRequestError;
        }
        
        // has public key string
        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const {_id: userId} = foundShop._id;
 

        // create access token and refresh token
        const tokens = await createTokenPair({userId, email}, publicKeyObject, privateKey);
        console.log("tokens", tokens);

        await KeyTokenService.createToken({
            userId,
            refreshToken: tokens.refreshToken,
            publicKey: publicKeyString, 
            privateKey: privateKey}
        );
        
        // has public key string

        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }


    static signUp = async ({name, email, password}) => {
        // check if email already exists
        // if exists, throw error
        // use lean to make the object lighter
        const holderShop = await shopModel.findOne({email}).lean();
        if(holderShop) {
            throw new BadRequestError('Error: Shop already registered. ');
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
                throw new BadRequestError;
            }
            // has public key string
            const publicKeyObject = crypto.createPublicKey(publicKeyString);
            
            // create access token and refresh token
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyObject, privateKey);
            return {
                code: '201', // created
                metadata: {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }
        }
        return  {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService;