'use strict'

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// AUTHENITCATION
router.use(authentication); 
// POST
router.post('', asyncHandler(productController.createProduct));

// GET
// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
module.exports = router; 