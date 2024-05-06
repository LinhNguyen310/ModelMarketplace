'use strict'
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// count connections to database
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log('Number of connections to the database: ', numConnection);
}
// check overload
const checkOverload = () => {
    setInterval (() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        console.log('Active connections: ', numConnection);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        // Example: maximum number of connections based on number of cores
        // Example: each core can handle 5 connections maximum
        const maxConnections = numCores * 5;
        if (numConnection > maxConnections){
            console.log('Warning: Connection Overload detected');
        }
    }, _SECONDS); // monitor every 5 seconds
}
module.exports = {
    countConnect,
    checkOverload
}