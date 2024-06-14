'use strict'


const { OK, CREATED, SuccessResponse } = require('../core/success.response');
const { ProductFactory } = require('../services/product.service');

class ProductController {
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

}

module.exports = new ProductController();