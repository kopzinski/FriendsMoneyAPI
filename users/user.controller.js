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

        var user_phone = req.params.phone;
        if (typeof user_phone == 'undefined' || !user_phone.trim()){
             res.status(400).json({ error: constants.error.msg_invalid_param});
        }
        else {		
            userService.getUser(user_phone,function(user){
                if (user) {
                    res.json(user);
                } else {
                    res.status(404).json({status:404, error: constants.error.msg_no_register});
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
    registerUser:function(req, res, next){
          if (req.body.user){
              
            var user = req.body.user;
             if ( typeof user.phone != 'undefined' || typeof user.deviceId != 'undefined'){
                 userService.registerUserFlagTrue(user,function(response){
                     if (response){
                     res.json(response)
                     transactionService.updateUserTransaction(user)
                 }else {
                         res.status(400);
                     }
                 })
             }else {
                 res.status(400);
             }
          }else {
               res.status(400);
          }
    },
    registerUserFromTransaction: function(req,res,next){
        if(req.body.transaction){
            var transaction = req.body.transaction;
                if(((!transaction.debtor.registrationFlag)||(!transaction.creditor.registrationFlag))&& (transaction.creditor.phone)||(transaction.debtor.phone)){
                   
                    userService.registerUserFlagFalse(transaction,function(response){
                        if (response){
                            transactionService.createTransaction(transaction, function(response){
                                res.json(response);
                            })
                        }else {
                            res.json(response);
                        }
                    })
                }else {
                    res.status(400);
                }
            }else {
                res.status(400);
            }
    }
}

    