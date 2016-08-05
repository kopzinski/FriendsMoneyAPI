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
    //console.log(req.body);
    var contacts = req.body.contacts;  
    async.map(contacts, FilterContacts, function(err, results){
    //   console.log(results);
       res.json(results);
    });
}

var FilterContacts = function(contact, doneCallback){
    if( contact.phoneNumbers == null){
        return doneCallback();
    }else { 
        async.each(contact.phoneNumbers, function(phone, callback2){
            var newUser;    
            userService.getUser(phone.value, function(user) {
                //console.log("usuário: ",user);
                if (user && user.registrationFlag != false){
                    var newContact = {name: user.name, phone: {value: user.phone.value}, registrationFlag: true, _id:user._id};
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

function getPhoneNumberPattern(phone){
    phone = phone.replace(/[^\w\\s]/gi, '');
    console.log("+"+phone);
    var testPattern = /^[0-9]{2}[0-9]{10,11}$/;
    return testPattern.test(phone)
}

