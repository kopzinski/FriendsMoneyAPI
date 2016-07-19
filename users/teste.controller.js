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
    var contacts = req.body;   
    async.map(contacts, FilterContacts, function(err, results){
       res.json(results);
    });
}

var FilterContacts = function(contact, doneCallback){
    // A random amount of time has passed.
    // Callback with no error and the result of num * num

    
    if( contact.phoneNumbers == null){
        return doneCallback(null, null);
    }else {
       var achou = false; 
       return doneCallback(null, contact);
        // async.map(contact.phoneNumbers, FilterNumber, function(err, results){
        //      newContacts.push(contact);
        //      
        // })
        
    }
}

var FilterNumber = function(numberPhone, doneCallback){
    console.log("entrou aqui");
     userService.getUser(numberPhone, function(user) {
        if (user){
           console.log("Achou usuário");
        }else {
           console.log("Não achou o usuário"); 
        }
    });
}