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

// handle error
// handle when route not found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
})

module.exports = app;