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

const permission = ( permission ) => {
    return (req, res, next) => {
        if (! req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied'
            });
        }
        // has permission
        // check if objKey.permission is in permissions
        console.log(req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);

        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission Denied'
            });
        }
        return next();  // call the next middleware function in the stack
    }
}

const asyncHandler = fn => {
    // instead of using try catch in every async function, use this function to handle error
    // catch the error in the function and pass it to the next middleware
    // the next middleware is the one in app.js that handles error
    return (req, res, next) => {
        fn(req, res, next).catch(next); // if has any error, call next
    }
}

module.exports = {
    apikey,
    permission,
    asyncHandler
};