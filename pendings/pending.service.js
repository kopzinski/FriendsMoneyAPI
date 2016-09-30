
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
    constant    = require('./pending.constants.json'),
    Group       = require('../groups/group.schema'),
    Q           = require('q');

//export all methods to be accessed externally
var service = {};
 service.getListTransactionPendingStatus = getListTransactionPendingStatus;
 service.getListTransactionPaymentConfirmStatus = getListTransactionPaymentConfirmStatus;
 service.addAtributteStatusPendencie = addAtributteStatusPendencie;
 service.getListGroupAcceptedPendencies = getListGroupAcceptedPendencies;
 service.getListGroupDeletedPendencies = getListGroupDeletedPendencies;
module.exports = service;

function getListTransactionPendingStatus (phone){
    var deferred = Q.defer();
    //((status == 'pending' && usuario != creator) && (( usuário == debtor || usuário == creditor)))
    Transaction.find({$and:[{status:'pending'},{"creator.phone.value": { $ne: phone }},{$or:[{"debtor.phone.value":phone}, 
        {"creditor.phone.value": phone}]}]},function(err, transactions){
        if (err) 
            {
                logger.error(constant.error.msg_mongo_error+": "+err);
                deferred.reject(err);
            }else if (transactions[0] == null || transactions[0] == undefined)
            {
                
                deferred.resolve(null);
            }
            else {
                addAtributteStatusPendencie("pending",transactions,function(transactions){
                    deferred.resolve(transactions); 
                })
            }
        }).sort({createdAt : 1});
        return deferred.promise;
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
function getListTransactionPaymentConfirmStatus (phone){
    var deferred = Q.defer();
    Transaction.find({$and:[{status:'paymentConfirm'},{$or:[{$and:[{"debtor.phone.value":phone},
    {"debtor.senderConfirm":false}]},{$and:[{"creditor.phone.value":phone},
    {"creditor.senderConfirm":false}]}]}]},function(err, transactions){
            if (err) 
            {
                logger.error(constant.error.msg_mongo_error+": "+err);
                deferred.reject(err);
            }else if (transactions[0] == null || transactions[0] == undefined)
            {
                
                deferred.resolve();
            }
            else {
                addAtributteStatusPendencie("paymentConfirm",transactions,function(transactions){
                    deferred.resolve(transactions);  
                })  
            }
        }).sort({createdAt : 1});
        return deferred.promise;
}



function getListGroupDeletedPendencies (phone){
    var deferred = Q.defer();
    Group.find({members: {$elemMatch:{"phone.value":phone, flagFinalized:false}}},function(err, groups){
        if (err) 
        {
            logger.error(constant.error.msg_mongo_error+": "+err);
            deferred.reject(err);
        }else if (groups[0] == null || groups[0] == undefined)
        {
        
            deferred.resolve();
        }
        else {
            addAtributteStatusPendencie("finalizeGroup",groups,function(groups){
                deferred.resolve(groups);  
            })  
        }
    }).sort({createdAt : 1});
    return deferred.promise;
}

function getListGroupAcceptedPendencies (phone){
    var deferred = Q.defer();
        Group.find({members: {$elemMatch:{"phone.value":phone, flagAccepted:false}}},function(err, groups){
            if (err) 
            {
                logger.error(constant.error.msg_mongo_error+": "+err);
                deferred.reject(err);
            }else if (groups[0] == null || groups[0] == undefined)
            {
            
                deferred.resolve(null);
            }
            else {
                addAtributteStatusPendencie("createGroup",groups,function(groups){
                    deferred.resolve(groups);  
                })  
            }
        }).sort({createdAt : 1});
    return deferred.promise;

}