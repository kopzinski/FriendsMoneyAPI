/**
 * 
 * This file contain all methods to access and modify objects in transactions database
 * @author Adrian Lemes
 */
//required libraries and files
var Transaction = require('./transaction.schema'),
    logger      = require('mm-node-logger')(module),
    User        = require('../users/user.schema'),
    constant    = require('./transaction.constants.json');

//export all methods to be accessed externally
var service = {};
 service.createTransaction = createTransaction;
 service.getListTransactions = getListTransactions;
 service.getListTransactionsByUser = getListTransactionsByUser;
 service.getTransaction = getTransaction;
 service.deleteTransaction = deleteTransaction;
 service.updateTransaction = updateTransaction;

module.exports = service;


/**
 * Method to create new transaction
 * @param transaction object
 * @return a message with error or success
 */
function createTransaction(transaction, callback){
    transaction.save(function(err){
        if (err){
            callback(constant.error.msg_mongo_error+": "+err)   
        }
        else{
             callback(constant.success.msg_reg_success)
        }
    })
}

/**
 * This method receive an user_id parameter (mongo id) and find all transactions with a debtor or a creditor that match with
 * the user_id parameter
 * @param user_id
 * @return error or a list with transactions
 */
function getListTransactionsByUser (user_id, callback){

    Transaction.find({$or: [{debtor:user_id}, {creditor: user_id}]},function(err, transactions){

        if (err) 
        {
            logger.error(constant.error.msg_mongo_error+": "+err);
            callback(false);
        }else if (transactions[0] == null || transactions[0] == undefined)
        {
            callback(constant.error.msg_no_register);
            callback(transactions);
        }
        else {
            callback(transactions);
        }

    })
}

/**
 * This method find all transactions in database
 * the user_id parameter
 * @return error or a list with transactions
 */
function getListTransactionsByUser (user_id, callback){

    Transaction.find({},function(err, transaction){
        if (err) 
        {
            logger.error(constant.error.msg_mongo_error+": "+err);
            callback(false);
        }else if (transaction == null || transaction == undefined)
        {
            callback(constant.error.msg_no_register);
            callback(transaction);
        }
        else {
            callback(transaction);
        }

    })
}

/**
 * This method receive an id transaction parameter (mongo id) and find one transaction that match with this id
 * @param id
 * @return error or a transaction
 */
function getTransaction (id, callback){
    Transaction.findOne({_id:id}, function(err, transaction){
        if (err) 
        {
            logger.error(constant.error.msg_mongo_error+": "+err);
            callback(false);
        }
        else if(transaction == null || transaction == undefined) {
            callback(constant.msg_no_register);
        }
        else 
        {
            callback(transaction);
        } 

    })
}

/**
 * This method receive an id transaction parameter (mongo id) and delete a transaction that match with this id
 * @param id
 * @return error or a success full message delete
 */
function deleteTransaction(id, callback){
      Transaction.findById(id, function(err, transaction){
          if (err)
          {
              logger.error(constant.error.msg_mongo_error+": "+err);
              callback(false);
          }else 
          {
              transaction.remove(function(err, transaction){
                  if (err)
                  {
                    logger.error(constant.error.msg_mongo_error+": "+err);
                    callback(false);
                  }
                  else 
                  {
                      callback(constant.success.msg_del_success);
                  }
                  
              })
          }
      })
}

/**
 * This method receive an id transaction parameter (mongo id) and find one transaction that match with this id
 * @param id
 * @return error or a transaction
 */
function updateTransaction (transaction, callback){
    Transaction.findOneAndUpdate({_id : transaction._id},{ $set: {value: transaction.value, 
        status:transaction.status, debtor:transaction.debtor, creditor:transaction.creditor}},
        function(err, transactionMongo){
             if (err){
                    logger.error(constant.error.msg_mongo_error+": "+err);
                    callback(false);
                  }
             if (transactionMongo)
             {
                 callback(constant.success.msg_update_success);
             }
             else {
                 callback(constant.error.msg_no_register);
             }
        })
}