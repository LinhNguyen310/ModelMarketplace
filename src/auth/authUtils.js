'use strict'
const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}