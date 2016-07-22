var express = require('express'),
    transactionService = require('./transaction.service'),
    constants = require('./transaction.constants.json'),
    Transaction = require('./transaction.schema');

module.exports = {
    
    createTransaction:function (req, res, next) {
        var newTransaction = new Transaction({
            creator:req.body.creator,
            value: req.body.value,
            status: req.body.status,
            debtor: req.body.debtor,
            creditor: req.body.creditor
        });
        if ( typeof newTransaction.value  == 'undefined' ||  typeof newTransaction.status  == 'undefined' || typeof newTransaction.debtor == 'undefined'|| typeof newTransaction.creditor == "undefined") {
            res.json({status:400,  error: constants.error.msg_invalid_param});
        }else {
            transactionService.createTransaction(newTransaction, function(response){
                if (response){
                    res.json(response);
                }else {
                    res.sendStatus(400);
                }
            })
        }
    },

    getListTransactions:function (req, res, next) {
        transactionService.getListTransactions(function(transactions){
            if (transactions){
                res.json(transactions);
            }else {
                res.sendStatus(404);
            }
        })
    },

    getListTransactionsByUser:function (req, res, next) {
        var user_id = req.params.user_id;
        if ( typeof user_id == 'undefined'){
            res.json(400, { error: constants.error.msg_invalid_param});
        }else {
            transactionService.getListTransactionsByUser(user_id, function(transactions){
                if (transactions){
                    res.json(transactions);
                }else {
                    res.sendStatus(404);
                }
            })
        }
    },

    getTransaction:function (req, res, next) {
        var id = req.params.id;
        if ( typeof id == 'undefined'){
            res.json(400, { error: constants.error.msg_invalid_param});
        }else {
            transactionService.getTransaction(id, function(transaction){
                if (transaction){
                    res.json(transaction);
                }else {
                    res.sendStatus(404);
                }
            })
        }
    },

    deleteTransaction:function (req, res, next) {
        var id = req.params.id;
        if ( typeof id == 'undefined'){
            res.json(400, { error: constants.error.msg_invalid_param});
        }else {
            transactionService.deleteTransaction(id, function(response){
                if (response){
                    res.json(response);
                }else {
                    res.sendStatus(404);
                }
            })
        }
    },

    updateTransaction:function (req, res, next) {
         var updateTransaction = new Transaction({
            _id:      req.body.id,
            value:    req.body.value,
            status:   req.body.status,
            debtor:   req.body.debtor,
            creditor: req.body.creditor
        });
        if ( typeof updateTransaction.value  == 'undefined' ||  typeof updateTransaction.status  == 'undefined' || typeof updateTransaction.debtor == 'undefined'|| typeof updateTransaction.creditor == "undefined") {
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            transactionService.updateTransaction(updateTransaction, function(response){
                if (response){
                    res.json(response);
                }else {
                    res.sendStatus(400);
                }
            })
        }
    }
}