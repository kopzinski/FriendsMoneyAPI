var express = require('express'),
    config   = require('./config'),
    path = require('path'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cors = require('cors'),
    helmet = require('helmet'),
    logger = require('mm-node-logger')(module),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'), //used to manipulate POST

    app  = express(),
    pathUtils      = require('../utils/path-utils');
    const SixMonths = 15778476000;
    
    
    function initMiddleware(app) {
 // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');
    if (config.environment === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));
    
        // Disable views cache
        app.set('view cache', false);
    } else if (config.environment === 'production') {
        app.locals.cache = 'memory';
    }
    
     // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(methodOverride());


}
function initHelmetHeaders(app) {
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff())
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
      "maxAge": SixMonths,
      "includeSubdomains": true,
      "force": true
    }));
    app.disable("x-powered-by");
}

function initCrossDomain(app) {
    app.use(cors());
    app.use(function(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
}

function initGonfig(app) {
    pathUtils.getGlobbedPaths(path.join(__dirname, '../**/*.config.js')).forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
}

function initRoutes(app) {
   app.use('/api', require('./routes'));
}

function initDB() {
    if(config.seedDB) {
        require('./seed');
    }
}

function init() {
    var app = express();
    initMiddleware(app);
    initHelmetHeaders(app);
    initCrossDomain(app);
    initGonfig(app);
    initRoutes(app);
    initDB();
    return app;
}

module.exports.init = init;