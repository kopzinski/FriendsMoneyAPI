/**
 * 
 * This file contain all methods to access and modify objects in transactions database
 * 
 */
//required libraries and files
var Transaction = require('./transaction.schema'),
    logger      = require('mm-node-logger')(module),
    User        = require('../users/user.schema'),
    constant    = require('./transaction.constants.json');

var service = {};
 service.createTransaction = createTransaction;
 service.getListTransactions = getListTransactions;
// service.getTransaction = getTransaction;
// service.deleteTransaction = deleteTransaction;
// service.updateTransaction = updateTransaction;

module.exports = service;

/**
 * This method receive a user_id parameter (mongo id) and find all transactions with a debtor or a creditor that match with
 * the user_id parameter
 * @param user_id
 */
function getListTransactions (user_id, callback){
    console.log('teste');
    Transaction.find({$or: [{debtor:user_id}, {creditor: user_id}]},function(err, transactions){
    
        if (err) 
        {
            logger.error("Find an error: "+err);
            callback(false);
        }else if (transactions[0] != null && transactions[0] != undefined){
            callback(transactions);
        }else {
            callback(constant.error.msg_no_register);
        }
    })
}

function createTransaction(transaction, callback){

}