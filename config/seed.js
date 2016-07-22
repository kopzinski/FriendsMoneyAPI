'use strict';

var logger   = require('mm-node-logger')(module);
var mongoose = require('mongoose');
var User = require('../users/user.schema');
var Transaction = require('../transactions/transaction.schema');
var userService = require('../users/user.service');
var transactionService = require('../transactions/transaction.service');


var user1 = new User(
    {
        name:"Adrian Lemes",
        registrationFlag: true,
        registrationId: null,
        phone: "+555197412487",
        email:"adrianlemess@gmail.com",
        deviceId:"1239849123"

    }
)

var user2 = new User(
    {
        phone: "+555177777777",
        registrationFlag: false,
    }
)
User.find({}).remove(function() {
    
    userService.registerUserDevice(user1, function(err){    
        if (err) console.log(err)
    })
    userService.registerUserDevice(user2, function(err){    
        if (err) console.log(err)
    })

}


