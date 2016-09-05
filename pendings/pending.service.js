
/**
 * 
 * This file contain all methods to consult pendencies from database
 * @author Adrian Lemes
 */
//required libraries and files
var Transaction = require('../transactions/transaction.schema'),
    logger      = require('mm-node-logger')(module),
    User        = require('../users/user.schema'),
    userService = require('../users/user.service'),
    async       = require('async'),
    constant    = require('../transactions/transaction.constants.json'),
    Group       = require('../groups/group.schema');
//export all methods to be accessed externally

var service = {};
 service.getListTransactionPendingStatus = getListTransactionPendingStatus;
 service.getListTransactionPaymentConfirmStatus = getListTransactionPaymentConfirmStatus;
 service.addAtributteStatusPendencie = addAtributteStatusPendencie;

module.exports = service;

function getListTransactionPendingStatus (phone, callback){

            //((status == 'pending' && usuario != creator) && (( usuário == debtor || usuário == creditor)))
            Transaction.find({$and:[{status:'pending'},{"creator.phone.value": { $ne: user.phone.value }},{$or:[{"debtor.phone.value":user.phone.value}, 
             {"creditor.phone.value": user.phone.value}]}]},function(err, transactions){
                if (err) 
                    {
                        console.log(err);
                        logger.error(constant.error.msg_mongo_error+": "+err);
                        callback(err, null);
                    }else if (transactions[0] == null || transactions[0] == undefined)
                    {
                       logger.error(constant.error.msg_no_register);
                       callback(null, null);
                    }
                    else {
                       addAtributteStatusPendencie("pending",transactions,function(transactions){
                           callback(null, transactions);  
                       })
                    }
                }).sort({createdAt : 1});
}

function addAtributteStatusPendencie (status, arrayTransaction, callback){
    var itemsProcessed = 0;
    var newArray = [];
    for (i = 0; i < arrayTransaction.length; i++) { 
        var newPending = arrayTransaction[i].toObject();
        newPending["statusPendencie"] = status;
        newArray.push(newPending);

        itemsProcessed++;
        if(itemsProcessed == arrayTransaction.length){
            console.log(newArray);
            callback(newArray);
        }
    } 
    
}

/**
 * This method receive an user_id parameter (mongo id) and find all transactions with a debtor or a creditor that match with
 * the user_id parameter
 * @param user_id
 * @return error or a list with transactions
 */
function getListTransactionPaymentConfirmStatus (phone, callback){
            Transaction.find({$and:[{status:'paymentConfirm'},{$or:[{$and:[{"debtor.phone.value":user.phone.value},{"debtor.senderConfirm":false}]}, 
             {$and:[{"creditor.phone.value":user.phone.value},{"creditor.senderConfirm":false}]}]}]},function(err, transactions){
                    if (err) 
                    {
                        console.log(err);
                        logger.error(constant.error.msg_mongo_error+": "+err);
                        callback(err, null);
                    }else if (transactions[0] == null || transactions[0] == undefined)
                    {
                        logger.error(constant.error.msg_no_register);
                       callback(null, null);
                    }
                    else {
                        addAtributteStatusPendencie("paymentConfirm",transactions,function(transactions){
                           callback(null, transactions);  
                       })  
                    }
                }).sort({createdAt : 1});
}

function getListGroupAcceptedPendencies (phone, callback){
            Group.find({},function(err, transactions){
                    if (err) 
                    {
                        console.log(err);
                        logger.error(constant.error.msg_mongo_error+": "+err);
                        callback(err, null);
                    }else if (transactions[0] == null || transactions[0] == undefined)
                    {
                        logger.error(constant.error.msg_no_register);
                       callback(null, null);
                    }
                    else {
                        addAtributteStatusPendencie("paymentConfirm",transactions,function(transactions){
                           callback(null, transactions);  
                       })  
                    }
                }).sort({createdAt : 1});

}