'use strict'

const asyncHandler = fn => {
    // instead of using try catch in every async function, use this function to handle error
    // catch the error in the function and pass it to the next middleware
    // the next middleware is the one in app.js that handles error
    return (req, res, next) => {
        fn(req, res, next).catch(next); // if has any error, call next
    }
}

module.exports = {
    asyncHandler
};