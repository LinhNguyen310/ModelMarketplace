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
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop));

// POST
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.ubpublishProductByShop));

module.exports = router; 