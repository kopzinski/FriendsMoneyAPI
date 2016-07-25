/**
 * This file contain all methods to access and modify objects in users database
 * @author Guilherme Webber
 */
 
 
var express = require('express');
var userService = require('./user.service');
var User = require('./user.schema');
var transactionService = require('../transactions/transaction.service');
var constants = require('./user.constants');
var Transaction = require('../transactions/transaction.schema');
var async = require('async');


module.exports = {
    getListAllUsers:function (req, res, next) {
         userService.getListAllUsers(function (users) {
            if (users) {
                res.json(users);
            } else {
                res.sendStatus(404);
            }
        })
        
    },
	
    getUser:function (req, res, next) {
        var user_phone = req.param.phone;
        if (typeof user_phone == 'undefined' || !user_phone.trim()){
             res.json(400, { error: constants.error.msg_invalid_param});
        }
        else {		
            userService.getUser(user_phone,function(user){
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus({status:404, error: constants.error.msg_no_register});
                }
            })
        }
    },
    
    deleteUser:function (req, res, next) {
          if (typeof req.body.phone == 'undefined' || !req.body.phone.trim()){
             res.json(400, { error: constants.error.msg_invalid_param});
        }else {	
            userService.deleteUser(req.body.phone, function(result){
                if(result){
                    res.send(result); 
                }else {
                    res.status(400); 
                }
            })  
        }
    },

    registerUserDevice:function (req, res, next) {
        var user = new User(req.body);
         if ( typeof user.phone != 'undefined' || typeof user.email != 'undefined' || typeof user.deviceId != 'undefined'){
             userService.registerUserDevice(req.body,function(response){
                 if (response){
                     res.json(response)
                 }else {
                     res.status(400);
                 }
             })
         }else {
              res.sendStatus(404);
         }
    },


    registerUserFromTransaction:function (req, res, next) {        
        var newTransaction = new Transaction(req.body.transaction);
        
        var user = new User(req.body.user);
        
		if (user.phone && newTransaction && (user.deviceId == null || user.deviceId == undefined)){
             userService.registerUserFromTransaction(user,function(response){
                 if (response){
                     console.log('transaçãoiofhasjfjas: ',newTransaction);
                     transactionService.createTransaction(newTransaction, function(response){
                         console.log('if ',response)
                     
                         res.json(response);
                     })
                 }else {
                     console.log('elsesaeaeaseeae ',response)
                     res.json(response);
                 }
             })
        }else {

             res.json({status:400,  error: constants.error.msg_invalid_param});
        }	
    }
}

    