'use strict'

const { BadRequestError } = require('../core/error.response');
const {product, clothing, electronic} = require('../models/product.model');    


// define factory class to cteaye product

class ProductFactory {
    static async createProduct(type, payload){
        switch(type){
            case 'Clothing':
                return await new Clothing(payload);
            case 'Electronic':
                return await new Electronic(payload);
            default:
                throw new BadRequestError(`Invalid product type ${type}`);
        }
    }
}

// define basic product class
class Product {
    constructor(product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(){
        return await product.create(this);
    }
}

class Clothing extends Product {
    async createProduct(){
        const newClothing = new clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('Error creating clothing');

        const newProduct = new super.createProduct();

        if (!newProduct) throw new BadRequestError('Error creating product');

        return newProduct;
    }    
}

class Electronic extends Product {
    async createProduct(){
        const newElectronic = new clothing.create(this.product_attributes);
        if (!newElectronic) throw new BadRequestError('Error creating clothing');

        const newProduct = new super.createProduct();

        if (!newProduct) throw new BadRequestError('Error creating product');

        return newProduct;
    }    
}


module.exports = {
    ProductFactory,
};