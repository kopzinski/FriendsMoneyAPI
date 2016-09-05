 var express = require('express'),
    pendingService = require('./pending.service'),
    constant = require('../transactions/transaction.constants.json'),
    Transaction = require('../transactions/transaction.schema'),
    userService = require('../users/user.schema');

module.exports = {
 getListPendencies:function(req, res, next){
        var phone = req.params.phone;
        if ( typeof phone == 'undefined'){
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            userService.getUser(phone,function(user){
                if (user){
                    pendingService.getListTransactionPendingStatus(user.phone, function(err, transactionsPending){
                    if (transactionsPending){
                        pendingService.getListTransactionPaymentConfirmStatus(user.phone, function(err, transactionsPaymentConfirm){
                            if (transactionsPaymentConfirm){
                                res.json(transactionsPending.concat(transactionsPaymentConfirm));
                            }else {
                                res.json(transactionsPending)
                            }
                        })

                    }else {
                        pendingService.getListTransactionPaymentConfirmStatus(user.phone, function(err, transactionsPaymentConfirm){
                            if (transactionsPaymentConfirm){
                                res.json(transactionsPaymentConfirm);
                            }else {
                                res.json(404)
                            }
                        })
                    }
                })
                }else {
                    res.status(404).json({error:"No Users"});
                }
            })
            
        }  
    }
}