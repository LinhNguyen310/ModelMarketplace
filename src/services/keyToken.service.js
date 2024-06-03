// use to create the token
'use strict'

const keytokenModel = require("../models/keytoken.model");
const {Types, default: mongoose} = require('mongoose');

class KeyTokenService {
    static updateRefreshToken = async ({keystore, userId, usedRefreshToken, newRefreshToken}) => {
        try {
            return await keystore.findOneAndUpdate(
                {user: userId},
                {
                    $set: {
                        refreshToken: newRefreshToken
                    },
                    $addToSet: {
                        refreshTokensUsed: usedRefreshToken
                    }
                }
            )
        } catch (error) {
            return error
        }
    }

    static findByRequestToken = async (refreshToken) => {   
        try {
            console.log("refreshToken", refreshToken)
            return await keytokenModel.findOne({refreshToken}).lean();
        } catch (error) {
            return error;
        }
    }

    static findByRequestTokenUsed = async (refreshToken) => {
        try {
            const token = await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
            return token ? token : null;
        } catch (error) {
            return error;
        }
    }

    static createToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // // public key still has buffer so convert to string when I insert it to database it wont cause an error
            // const publicKeyString = publicKey.toString();
            // const token = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString});
            // return token ? token.publicKey : null; // return public key if token exists
            const filter = {user: userId};
            const update = {publicKey, privateKey,refreshTokensUsed: [], refreshToken};
            const options = {upsert: true, new: true}; // upsert: create new if not exists, new: return new document if created
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        try {
            const newUserId = new Types.ObjectId(userId);
            console.log(newUserId)
            const token = await keytokenModel.findOne({user: newUserId}); // Types.ObjectId(userId) to convert string to ObjectId
            return token ? token : null;
        } catch (error) {
            return error;
        }
    }

    static removeKeyById = async (id) => {
        try {
            const token = await keytokenModel.findByIdAndDelete(id);
            return token ? token : null;
        } catch (error) {
            return error;
        }
    }

    static deleteKeyById = async (userId) => {
        try {
            return await keytokenModel.findByIdAndDelete(userId);
        } catch (error) {
            return error;
        }
    }

}

module.exports = KeyTokenService;