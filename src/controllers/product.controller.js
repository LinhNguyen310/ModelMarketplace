'use strict'


const { OK, CREATED, SuccessResponse } = require('../core/success.response');
const { ProductFactory } = require('../services/product.service');

class ProductController {

    // POST /api/v1/products
    createProduct = async (req, res, next) => {
        new SuccessResponse (
            {
                message: 'Product has been created',
                metadata: await ProductFactory.createProduct(req.body.product_type, req.body, {
                    ...req.body, // unpack elements from array
                    product_shop: req.user.userId
                })
            }
        ).send(res);
    }

    // PATCH
    updateProduct = async (req, res, next) => {
        const productId = req.params.product_id;
        new SuccessResponse (
            {
                message: 'Product has been updated',
                metadata: await ProductFactory.updateProductService(req.body.product_type, productId, {
                    ...req.body, // unpack elements from array
                    product_shop: req.user.userId
                })
            }
        ).send(res);
    }
    // QUERY PARAMS: limit, skip
    // GET /api/v1/products/drafts
    /**
     * @desc Get all drafts for a shop
     * @param {String} req - The request object from the client. This object must contain a `user` property with a `userId` attribute, which is used to identify the shop for which drafts are being fetched.
     * @param {*} res - The response object used to send back the HTTP response.
     * @param {*} next - A callback function used to pass control to the next middleware function in the stack. Not used in the provided code snippet.
     * 
     * The function begins by calling the `ProductFactory.findAllDraftsForShop` method, passing an object containing the `product_shop` property. This property is set to the `userId` of the user making the request, which is assumed to represent the shop's unique identifier.
     * 
     * The `findAllDraftsForShop` method is expected to return a promise that resolves with the data of all draft products associated with the given shop.
     * 
     * Once the promise resolves, a `SuccessResponse` object is instantiated with a message indicating successful retrieval and the metadata containing the drafts.
     * 
     * The `SuccessResponse` object's `send` method is then called, passing the `res` object to send the response back to the client.
     * 
     * Response: The HTTP response sent back to the client includes a success message and metadata containing the list of draft products for the shop. The exact structure of the response and the draft product data is not detailed in the provided code snippet.
     * 
     * Error Handling: Error handling is not explicitly implemented in the provided code snippet. In a complete implementation, errors such as database query failures or unauthorized access attempts should be caught and handled appropriately, potentially using the `next` function to pass errors to an error-handling middleware.
     * 
     * Usage: This function is designed to be used as a route handler with Express.js or a similar web server framework that supports asynchronous middleware. It should be attached to a route that accepts GET requests and requires authentication to ensure that the `userId` can be securely obtained from the `req.user` object.
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse (
            {
                message: 'Get list drafts successfully!',
                metadata: await ProductFactory.findAllDraftsForShop({
                    product_shop: req.user.userId,
                })
            }
        ).send(res);
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse (
            {
                message: 'Get list published successfully!',
                metadata: await ProductFactory.findAllPublishedForShop({
                    product_shop: req.user.userId,
                })
            }
        ).send(res);
    }

    publishProductByShop = async (req, res, next) => { 
        const product_id = req.params.id; // get product id from request params ":id"
        new SuccessResponse (
            {
                message: 'Product has been published',
                metadata: await ProductFactory.publishProductByShop({
                    product_shop: req.user.userId,
                    product_id
                })
            }
        ).send(res);
    }

    unpublishProductByShop = async (req, res, next) => { 
        const product_id = req.params.id; // get product id from request params ":id"
        new SuccessResponse (
            {
                message: 'Product has been unpublished',
                metadata: await ProductFactory.unpublishProductByShop({
                    product_shop: req.user.userId,
                    product_id
                })
            }
        ).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse (
            {
                message: 'Search products successfully!',
                metadata: await ProductFactory.getListSearchProduct(req.params)
            }
        ).send(res);
    }

    getAllProducts = async (req, res, next) => {
        new SuccessResponse (
            {
                message: 'Get list products successfully!',
                metadata: await ProductFactory.findAllProducts(req.query)
            }
        ).send(res);
    }

    getProductById = async (req, res, next) => {
        console.log("req.params: ", req.params)
        new SuccessResponse (
            {
                message: 'Get product successfully!',
                metadata: await ProductFactory.findProduct({
                    product_id: req.params.product_id,
                })
            }
        ).send(res);
    }
}

module.exports = new ProductController();