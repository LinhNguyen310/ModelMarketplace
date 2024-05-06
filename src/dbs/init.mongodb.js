'use strict'
require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const { countConnect } = require('../helpers/check.connect');
class Database {
    constructor() {
        this._connect();
    }
    _connect(type = 'mongodb') {
        // dev
        if ( 1 === 1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color:true});
        }
        mongoose.connect(MONGO_URI, {maxPoolSize: 50}).then(() => {
            countConnect();
            console.log('Database connection successful');
        }).catch((err) => {
            console.error('Database connection failed with error ' + err);
        })
    }

    static getInstance(){
        if (!Database.instance){
            Database.instance = new Database();
            return Database.instance;
        }
    }
}

const instance = Database.getInstance();
module.exports = instance;