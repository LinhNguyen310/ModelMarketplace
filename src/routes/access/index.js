'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// sign up
// call asyncHandler to catch the error that was thrown inside the code
router.post('/shop/signup', asyncHandler(accessController.signUp));

// login
router.post('/shop/login', asyncHandler(accessController.login));


// authen when logging out
router.use(authentication); 
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handleRefreshToken));
module.exports = router;