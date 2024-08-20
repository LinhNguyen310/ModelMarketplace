'use strict'

const { BadRequestError } = require('../core/error.response');
const {product, clothing, electronic, furniture} = require('../models/product.model');    
const { findAllDraftsForShop, findAllPublishedForShop, publishProductByShop, unpublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductRepo } = require('../models/repositories/product.repo');
const { removeUndefinedObject, nestedObjectParser } = require('../utils');

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
        return new productClass(payload).createProduct(product);
    }


    // PATCH
    static async updateProductService(type,productId, payload){
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);  // check if product type is registered if there is a class reference for that
        return new productClass(payload).updateProduct(productId, payload);
    }

    // PUT
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id});
    }
    
    static async unpublishProductByShop({product_shop, product_id}){
        // create another one to follow SOLID principles
        return await unpublishProductByShop({product_shop, product_id});
    }

    // GET
    // QUERY
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}){
        /*
            // write documentation for this function here
            // this function is used to find all drafts for a shop
            // it takes in the shop id, limit and skip values
            // it then calls the findAllDraftsForShop function from the product repo
            // and returns the result which is a promise object
        */
        const query = {product_shop, isDraft : true}; // query to find all drafts for a shop
        return await findAllDraftsForShop({query, limit, skip});
    }

    static async findAllPublishedForShop({product_shop, limit = 50, skip = 0}){ 
        const query = {product_shop, isPublished : true}; // query to find all published products for a shop
        return await findAllPublishedForShop({query, limit, skip});
    }

    static async getListSearchProduct({keySearch}){
        return await searchProductByUser({keySearch});
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProducts({limit, sort, page, filter,select: ['product_name', 'product_price', 'product_thumb']}); // only select fields that are needed
        // select field takes in object only. for example: select: {product_name: 1, product_price: 1, product_thumb: 1} means only select these fields
    }

    static async findProduct({product_id}) {
        return await findProduct({product_id, unselect: ['__v']}); // unselect field takes in object only. for example: unselect: {product_shop: 0} means do not select this field
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
            ...this, /// 3 dots means spread operator, it spreads the object into individual key value pairs
            _id: product_id,
        });
    }

    async updateProduct(productId, payload){
        return await updateProductRepo(productId, payload, product);
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

    async updateProduct(productId){
        const objectParams = removeUndefinedObject(this); // get all the object params
        // if has product_attributes => update the child product
        // if not => just update Product
        // check if we are updating the attribtutes
        if (objectParams.product_attributes){
           await updateProductRepo(productId, nestedObjectParser(objectParams.product_attributes), clothing);
        }
        // else update the parent product
        const updateProduct = await super.updateProduct(productId, nestedObjectParser(objectParams));
        return updateProduct;
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
    
    async updateProduct(productId){
        const objectParams = this; // get all the object params
        
        // check if we are updating the attribtutes
        if (objectParams.product_attributes){
            await updateProductRepo(productId, nestedObjectParser(objectParams.product_attributes), electronic);
        }
        // else update the parent product
        const updateProduct = await super.updateProduct(productId, nestedObjectParser(objectParams));
        return updateProduct;
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

    async updateProduct(productId){
        const objectParams = this; // get all the object params
        
        // check if we are updating the attribtutes
        if (objectParams.product_attributes){
            await updateProductRepo(productId, nestedObjectParser(objectParams.product_attributes), furniture);
        }

        // else update the parent product
        const updateProduct = await super.updateProduct(productId, nestedObjectParser(objectParams));
        return updateProduct;
    }
}

ProductFactory.registerProductType('Clothings', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Furnitures', Furniture);

module.exports = {
    ProductFactory,
};