 var express        = require('express'),
    pendingService  = require('./pending.service'),
    constant        = require('../transactions/transaction.constants.json'),
    Transaction     = require('../transactions/transaction.schema'),
    async           = require('async'),
    userService     = require('../users/user.service'),
    User            = require('../users/user.schema');

module.exports = {
 getListPendencies:function(req, res, next){
        var phone = req.params.phone;
        if ( typeof phone == 'undefined'){
            res.status(400).json(constant.error.msg_invalid_param);
        }else {
            userService.getUser(phone,function(user){
                if (user){
                    async.waterfall([
                        function(callback){
                            pendingService.getListTransactionPendingStatus(user.phone.value).then(function(transactionsPending){
                                callback(null, transactionsPending);
                            }).fail(function(err){
                                callback(err, null);
                            })
                        },
                        function(transactionsPending, callback){
                                pendingService.getListTransactionPaymentConfirmStatus(user.phone.value).then(function(transactionsPaymentConfirm){
                                        if (transactionsPending && transactionsPaymentConfirm){
                                            callback(null, transactionsPaymentConfirm.concat(transactionsPending));
                                        }else if (transactionsPaymentConfirm){
                                            callback(null, transactionsPaymentConfirm);
                                        }else if(transactionsPending){
                                            callback(null, transactionsPending);
                                        }else {
                                            callback(null, null);
                                        }
                                        
                                    }).fail(function(err){
                                       callback(err, null); 
                                    })
                                
                        },
                        function(transactionsPaymentConfirm, callback){

                            pendingService.getListGroupAcceptedPendencies(user.phone.value).then(function(pendenciesGroupsCreated){
                                    if (transactionsPaymentConfirm && pendenciesGroupsCreated){
                                        callback(null, pendenciesGroupsCreated.concat(transactionsPaymentConfirm));
                                    }else if(pendenciesGroupsCreated){
                                        callback(null, pendenciesGroupsCreated);
                                    }else if(transactionsPaymentConfirm){
                                        callback(null, transactionsPaymentConfirm);
                                    }else {
                                        callback(null, null);
                                    }
                                    
                            }).fail(function(err){
                                 callback(err, null); 
                            })
                               
                        }
                    ], function (err, result) {
                    	if(err){
                            res.status(404).json(err);
                        }else {
                            res.json(result);
                        }
                    });
                }else {
                    res.status(404).json({error:"Número inexistente no banco"});
                }
            })
            
        }  
    }
}