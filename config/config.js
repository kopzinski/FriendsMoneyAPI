'use strict';

var config = {};

config.environment = process.env.NODE_ENV || 'development';

// Populate the DB with sample data
config.seedDB = false;

// Server settings
config.server = {
    host: process.env.IP || '0.0.0.0',
    port: process.env.PORT || 3000
};

// MongoDB settings
config.mongodb = {
    dbURI: "mongodb://127.0.0.1:27017/alertaware"
};

// Export configuration object
module.exports = config;