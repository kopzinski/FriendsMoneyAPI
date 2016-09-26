'use strict';

var logger  = require('mm-node-logger')(module);
var pkg     = require('./package.json');
var config  = require('./config/config');
var express = require('./config/express');
var mongodb = require('./config/mongoose');
var groupService = require('./groups/group.service');



mongodb(function startServer() {
    var app = express.init();
    groupService.calculateIndividualPaymentByUser("57e2f66255005cb8011e6171", "5197262289");
    app.listen(config.server.port, function () {
        logger.info('App is running');
    });
});