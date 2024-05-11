'use strict'
const JWT = require('jsonwebtoken');
const {asyncHandler} = require('../helpers/asyncHandler');
const { AuthFailureError } = require('../core/error.response');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    // public key is to verify the token
    // payload is the data you want to transfer in the token
    try {
        
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        // refresh token is longer than access token because it is used to get a new access token
        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        // verify using the public token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if ( err) {
                console.log("Error verify: ", err)
            } else {
                console.log("Decode verify: ", decode)
            }
        });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        return {
            code: 'Error Code',
            message: error.message || 'Error Message',
            status: 'Error Status'
        }
    }
}

/*
*/
const authentication = asyncHandler( async (req, res, next) => {
    /*
        1- Check user id is missing
        2- Get access token
        3- Verify token
        4- Check user id is valid
        5- Check keystore with this userid
        6- OK return next
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Client ID is missing');

});

module.exports = {
    createTokenPair,
    authentication
};
