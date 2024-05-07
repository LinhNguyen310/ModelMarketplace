require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

// init cors
app.use(cors(process.env.CORS_ORIGIN));

// init middleware
app.use(morgan('dev'));
app.use(helmet()); // hide crucial information
app.use(compression()); // compress all responses
app.use(express.json()); // parse json
app.use(express.urlencoded({ extended: true })); // parse urlencoded
// init dbs
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
checkOverload();
// init routes
app.use('', require('./routes/index'));
module.exports = app;