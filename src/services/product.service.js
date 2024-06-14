'use strict'

const { BadRequestError } = require('../core/error.response');
const {product, clothing, electronic, furniture} = require('../models/product.model');    


// define factory class to cteaye product

class ProductFactory {
    static productRegistry = {} // dictionary to store product type and class reference

    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef;
    }

    /* OLD */
    // static async createProduct(type, payload){
    //     console.log("type: ", type, "payload: ", payload)
    //     switch(type){
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct();
    //         case 'Electronic':
    //             return new Electronic(payload).createProduct();
    //         case 'Furnitrure':
    //             return new Furniture(payload).createProduct();
    //         default:
    //             throw new BadRequestError(`Invalid product type ${type}`);
    //     }
    // }

    /* NEW */
    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);  // check if product type is registered if there is a class reference for that
        console.log("product class " , productClass, "payload: ", payload)
        return new productClass(payload).createProduct();
    }
}

// define basic product class
class Product {
    constructor({product_name, product_description, product_price, product_shop, product_type, product_thumb, product_quantity, product_attributes}){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id){
        return await product.create({
            ...this, 
            _id: product_id,
        });
    }
}

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError('Error creating clothing');

        const newProduct = await super.createProduct();

        if (!newProduct) throw new BadRequestError('Error creating product');

        return newProduct;
    }    
}

class Electronic extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronic) throw new BadRequestError('Error creating electronic');
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Error creating product');

        return newProduct;
    }    
}

class Furniture extends Product {
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newFurniture) throw new BadRequestError('Error creating furniture');
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Error creating product');

        return newProduct;
    }    
}

ProductFactory.registerProductType('Clothings', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Furnitures', Furniture);

module.exports = {
    ProductFactory,
};