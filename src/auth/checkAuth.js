'use strict'

const ApiKeyService = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apikey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY];
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }
        // check apikey in database
        const objKey = await ApiKeyService.findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }
        // api key in database
        req.objKey = objKey; // save objKey to req
        return next() // call the next middleware function in the stack to verify the permission

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports = {apikey};