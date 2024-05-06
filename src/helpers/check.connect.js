'use strict'
const mongoose = require('mongoose');
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log('Number of connections to the database: ', numConnection);
}

module.exports = {
    countConnect
}