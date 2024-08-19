'use strict'
const JWT = require('jsonwebtoken');
const {asyncHandler} = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id'
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
            refreshToken,
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
    // send userid through header because we use helmet middleware 
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('id user not found');
    const keyStore = await KeyTokenService.findByUserId(userId);

    if (!keyStore) throw new NotFoundError('Not Found keystore');

    if (req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey); // return decode object
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Request user id not found');
            // if it matches, return next
            req.keyStore = keyStore; // put the keystore in the request object to use in the next middleware
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            next();
        } catch(error) {
            throw new AuthFailureError(error.message || 'Invalid Request token not found');
        }
    }

    // if has in db, then verify the token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request access token not found');
    // put try catch here because verify will throw an error if the token is invalid
    // put try catch where the function might throw an error
   

});

const verifyJWT = async(token, keySecret) => {
    // return user object
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
};
