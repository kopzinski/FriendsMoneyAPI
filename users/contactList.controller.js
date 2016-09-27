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

    console.log(req.body);

    console.log("fui chamado");
    var newContacts = [];
    var contacts = req.body.contacts;  
    //console.log(req.body);
    async.map(contacts, FilterContacts, function(err, results){
       console.log(results);
       res.json(results);
    });
}

var FilterContacts = function(contact, doneCallback){
    if( contact.phoneNumbers == null){
        return doneCallback();
    }else { 
        async.each(contact.phoneNumbers, function(phone, callback2){
            userService.getValidNumberPhone(phone.value).then(function(numberPhone){
                numberPhone = "+"+numberPhone;
                userService.getUser(numberPhone, function(user) {
                if (user && user.registrationFlag != false){
                    var newContact = {name: user.name, phone: {value: user.phone.value}, registrationFlag: true, _id:user._id};
                    callback2(newContact)
                }else {
                    callback2(); 
                }
             });
            }).fail(function(){
                callback2();
            })
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



