"use strict";

/***********************************
 ****** Configuration Manager ******
 ***********************************/
module.exports = {
    SERVER: require("./server"),
    CREDENTIALS: require('./credentials'),
    DB: require('./db'),
    SWAGGER: require('./swagger'),
    DOMAIN: require('./domain')
};