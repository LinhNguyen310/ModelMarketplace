'use strict'

const apiKeyModel = require("../models/apiKey.model");

const crypto = require('crypto');

class ApiKeyService {
    static findById = async (key) => {
        // testing purpose
        // const newKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), status: true, permissions: ['000']});
        // console.log(newKey);
        const objKey = await apiKeyModel.findOne({ key , status: true}).lean();
        return objKey;
    }
}

module.exports = ApiKeyService;