'use strict'

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// router.get('/all', asyncHandler(productController.getAllPublishedForShop)); // user can search for public items so no need to add after authentication step
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct)); // user can search for public items so no need to add after authentication step
router.get('/all', asyncHandler(productController.getAllProducts)); // user can search for public items so no need to add after authentication step

// AUTHENITCATION
router.use(authentication); 
// POST
router.post('', asyncHandler(productController.createProduct));

// GET
// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('', asyncHandler(productController.getAllProducts));

// POST
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.ubpublishProductByShop));

module.exports = router; 