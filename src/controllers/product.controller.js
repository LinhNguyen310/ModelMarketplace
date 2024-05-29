'use strict'


const { OK, CREATED, SuccessResponse } = require('../core/success.response');
const { ProductFactory } = require('../services/product.service');

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse (
            {
                message: 'Product has been created',
                metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
            }
        ).send(res);
    }

}

module.exports = new ProductController();