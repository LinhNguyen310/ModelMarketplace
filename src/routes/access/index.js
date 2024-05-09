'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();

// sign up
// call asyncHandler to catch the error that was thrown inside the code
router.post('/shop/signup', asyncHandler(accessController.signUp));

// login
router.post('/shop/login', asyncHandler(accessController.login));

module.exports = router;