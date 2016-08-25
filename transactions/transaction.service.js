/**
 * 
 * This file contain all methods to access and modify objects in transactions database
 * @author Adrian Lemes
 */
//required libraries and files
var Transaction = require('./transaction.schema'),
    logger      = require('mm-node-logger')(module),
    User        = require('../users/user.schema'),
    userService = require('../users/user.service'),
    async       = require('async'),
    constant    = require('./transaction.constants.json');

//export all methods to be accessed externally

var service = {};
 service.createTransaction = createTransaction;
 service.getListTransactions = getListTransactions;
 service.getListTransactionsByUser = getListTransactionsByUser;
 service.getTransaction = getTransaction;
 service.deleteTransaction = deleteTransaction;
 service.updateTransaction = updateTransaction;
 service.getListTransactionsPendencies = getListTransactionsPendencies;
 service.updateUserTransaction = updateUserTransaction;

module.exports = service;


/**
 * Method to create new transaction
 * @param transaction object
 * @return a message with error or success
 */

function createTransaction(transaction, callback){
   var newTransaction = new Transaction(transaction)
    // newTransaction.debtor.senderConfirm = false;
    // newTransaction.creditor.senderConfirm = false;
      if (newTransaction.debtor.phone.value == newTransaction.creator.phone.value){
	    userService.getValidNumberPhone(newTransaction.creditor.phone.value).then(function(validNumber){
            newTransaction.creditor.phone.value = "+"+validNumber;
        })
	}else {
		userService.getValidNumberPhone(newTransaction.debtor.phone.value).then(function(validNumber){
            newTransaction.debtor.phone.value = "+"+validNumber;
            console.log("debtor",newTransaction.debtor.phone.value);
        })
	}
    newTransaction.save(function(err, transaction){
        if (err){callback({status:500, error: err });}
        else{
             callback(constant.success.msg_reg_success)
        }
    })
}

function getListTransactionsPendencies (phone, callback){
     console.log(phone);
     userService.getUser(phone, function(user){
         console.log(user);
            if(user){
             Transaction.find({$and:[{$or:[{"debtor.phone.value":user.phone.value}, {"creditor.phone.value": user.phone.value}]},{"creator.phone.value": { $ne: user.phone.value }},{$or:[{status:"pending"},{status:"paymentConfirm"}]}]},function(err, transactions){
                    
                    if (err) 
                    {
                        console.log(err);
                        logger.error(constant.error.msg_mongo_error+": "+err);
                        callback({status:500, error: err });
                    }else if (transactions[0] == null || transactions[0] == undefined)
                    {
                        logger.error(constant.error.msg_no_register);
                        callback({status:404, error: constant.error.msg_no_register});
                    }
                    else {
                        // console.log(transactions);
                        callback(transactions);    
                    }
                }).sort({createdAt : 1});
            }else {
                callback({status:404, error: "No users"});
            }
       
    })
}

/**
 * This method receive an user_id parameter (mongo id) and find all transactions with a debtor or a creditor that match with
 * the user_id parameter
 * @param user_id
 * @return error or a list with transactions
 */
function getListTransactionsByUser (phone, callback){

    userService.getUser(phone,function(user){
           if(user){
               

                 Transaction.find({$or: [{"debtor.phone": user.phone}, {"creditor.phone":user.phone}]},function(err, transactions){
                    if (err) 
                    {
                        logger.error(constant.error.msg_mongo_error+": "+err);
                        callback({status:500, error: err });
                    }else if (transactions[0] == null || transactions[0] == undefined)
                    {
                        callback();
                    }
                    else {
                        callback(transactions);
                    }
                }).sort({updatedAt : -1})
            }else {
                callback({status:404, error: "No users"});
            }
       
    })
    
}

/**
 * This method find all transactions in database
 * 
 * @return error or a list with transactions
 */

function getListTransactions (callback){

    Transaction.find({},function(err, transaction){
        if (err) 
        {
            logger.error(constant.error.msg_mongo_error+": "+err);
            callback({status:500, error: err });
        }else if (transaction == null || transaction == undefined || transaction.length == 0)
        {
            callback( {status:404, error: constant.error.msg_empty_database});
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
            callback({status: 500, error: err });
        }
        else if(transaction == null || transaction == undefined) {
            callback({status:404, error: constant.error.msg_no_register});
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
               callback({status: 500, error: err });
          }else if(transaction == null || transaction == undefined) {
              callback({status:404, error: constant.error.msg_no_register});
          }else 
          {
              transaction.remove(function(err, transaction){
                  if (err)
                  {
                    logger.error(constant.error.msg_mongo_error+": "+err);
                     callback({status: 500, error: err });
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
    transaction.updatedAt = new Date();
    if (!transaction.valuePaid){
        transaction.valuePaid = 0;
    }
    Transaction.findOneAndUpdate({_id : transaction._id},{ $set: {valueTotal: transaction.valueTotal,valuePaid:transaction.valuePaid, updatedAt:transaction.updatedAt, 
        status:transaction.status, debtor:transaction.debtor, creditor:transaction.creditor}},
        function(err, transactionMongo){
            var newTransaction = new Transaction(transactionMongo);
                console.log("transaction");
                console.log(newTransaction);
             if (err){
                   logger.error(constant.error.msg_mongo_error+": "+err);
                   callback({status: 500, error: err });
                  }
             if(newTransaction.valuePaid == transaction.valuePaid && newTransaction.valueTotal == transaction.valueTotal  && newTransaction.status == transaction.status && newTransaction.creditor.equals(transaction.creditor) &&  newTransaction.debtor.equals(transaction.debtor))
             {
                 callback(constant.error.msg_reg_exists_update);
             }
             else if (newTransaction.valueTotal != transaction.valueTotal || newTransaction.status != transaction.status ||  !newTransaction.creditor.equals(transaction.creditor) ||  !newTransaction.debtor.equals(transaction.debtor)|| newTransaction.valuePaid == transaction.valuePaid)
             {
                //  console.log(newTransaction);

                 callback(constant.success.msg_update_success);
             }
             else {
                  callback( {status:404, error: constant.error.msg_no_register});
             }
        })
}

function updateUserTransaction (user){
    getListTransactionsByUser(user.phone.value, function(transactionList){

        if (transactionList && user.name){
            transactionList.forEach(function(transaction){
                if (transaction.debtor.phone.value == user.phone.value){
                    if (!transaction.debtor.name){
                    transaction.debtor.name = user.name;
                    transaction.debtor.registrationFlag = true;
                    }
                     else 
                    console.log("Nothing to Change");

                }else if (transaction.creditor.phone.value == user.phone.value){
                     if (!transaction.creditor.name){
                    transaction.creditor.name = user.name;
                    transaction.creditor.registrationFlag = true;
                     }
                    else 
                    console.log("Nothing to Change");
                }
                
                transaction.save(function(err){
                    if (err)console.log(err);
                })
            })
        }else {
            console.log("Nothing to Change");
        }
    })
}