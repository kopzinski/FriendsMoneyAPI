var express = require('express');
var userService = require('./user.service');
var User = require('./user.schema');
var transactionService = require('../transactions/transaction.service');
var constants = require('./user.constants');
var Transaction = require('../transactions/transaction.schema');
var async = require('async');


var controller = [];
controller.getContact = getContact;
module.exports = controller;

function getContact (req,res){
    var newContacts = [];
    console.log(req.body);
    var contacts = req.body.contacts;  
    async.map(contacts, FilterContacts, function(err, results){
        console.log(results);
       res.json(results);
    });
}

var FilterContacts = function(contact, doneCallback){
    // A random amount of time has passed.
    // Callback with no error and the result of num * num
    if( contact.phoneNumbers == null){
        return doneCallback();
    }else { 
        async.each(contact.phoneNumbers, function(phone, callback2){
            var newUser;
            userService.getUser(phone.value, function(user) {
                if (user){
                    var newContact = {name: user.name, phone: {value:user.phone}, registrationFlag: true};
                    
                    callback2(newContact)
                }else {
                    callback2(); 
                }
             });
        }, 
        function(result){
            if (!result){
                var newContact2 = {name: contact.name.formatted, phone:contact.phoneNumbers, registrationFlag: false};
                
                return doneCallback(null, newContact2)
            }else {
                return doneCallback(null, result)
            }
        })        
    }
}



