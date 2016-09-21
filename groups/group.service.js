/**
 * 
 * This file contain all methods to access and modify objects in Groups database
 * @author Adrian Lemes
 */
//required libraries and files
var Group       = require('./group.schema'),
    logger      = require('mm-node-logger')(module),
    User        = require('../users/user.schema'),
    userService = require('../users/user.service'),
    async       = require('async'),
    constant    = require('./group.constants.json'),
    Q           = require('q');

//export all methods to be accessed externally
var service = {};
service.createGroup = createGroup;
service.getGroupsByUser = getGroupsByUser;
service.getTransactionsByGroup = getTransactionsByGroup;
service.getMembersByGroup = getMembersByGroup;
service.registerTransactionByGroup = registerTransactionByGroup;
service.updateTransactionByGroup = updateTransactionByGroup;
service.getGroupById = getGroupById;

module.exports = service;

function registerTransactionByGroup(idGroup, transaction){
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        group.transactions.push(transaction);
        group.save(function(err){
            if (err){
                deferred.reject(err);
            }else {
                deferred.resolve(constant.success.msg_reg_transaction_success);
            }
        })
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function updateTransactionByGroup(idGroup, transactionUpdated){
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        for (var i = 0; i < group.transactions.length; i++){
            if (group.transactions[i]._id == transactionUpdated._id){
                group.transactions[i] == transactionUpdated;
                group.save(function(err){
                    if (err){
                        deferred.reject(err);
                    }else {
                        deferred.resolve(constant.success.msg_reg_transaction_success);
                    }
                }) 
            }else if (i == group.transactions.length){
                deferred.reject(constant.error.msg_find_failure_transaction);
            }
        }
        
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function getTransactionsByGroup(idGroup) {
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        if (group.transactions.length > 0){
            deferred.resolve(group.transactions);
        }else {
            deferred.resolve();
        }
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function getMembersByGroup(idGroup) {
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        if (group.members.length > 0){
            deferred.resolve(group.members);
        }else {
            deferred.resolve();
        }
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function createGroup(group){
    console.log("createGroup");
   var deferred = Q.defer();
   var newGroup = new Group(group);
   if(newGroup){
        async.map(newGroup.members, filterUsers, function(err, results){
            console.log(results);
            newGroup.members = results;
            userService.getValidNumberPhone(newGroup.creator).then(function(numberValid){
                newGroup.creator = "+"+numberValid;
                newGroup.save(function(err){
                    if (err) deferred.reject(err);
                    else {
                        deferred.resolve(constant.success.msg_reg_success);
                    }
                })
        })  
    });
	}else {
        callback({error: constant.msg_reg_failure});
    }
    return deferred.promise;
}

function filterUsers(user, callback){
    userService.getUser(user.phone.value, function(response){
        if (response){
            console.log("if");
            user._id = response._id;
            user.name = response.name;
            user.phone.value = response.phone.value;
            user.registrationFlag = response.registrationFlag;
            user.flagGroup = false;
            return callback(null, user)
        }else {
            console.log("else");
            userService.getValidNumberPhone(user.phone.value).then(function(validNumber){
            user.phone.value = "+"+validNumber;
            user.flagGroup = false;
            user.registrationFlag = false;
            return callback(null, user)
    })
        }
    })
}


function getGroupsByUser(user, callback){
    var deferred = Q.defer();
    if(user){
        Group.find({"user.phone": user.phone},function(err, groups){
            if (err){
                logger.error(constant.error.msg_mongo_error+": "+err);
                deferred.reject(err);
            }else if (groups[0] == null || groups[0] == undefined){
                deferred.resolve();
            } else {
                deferred.resolve(groups);
            }
        }).sort({updatedAt : 1})
    }else {
        deferred.reject(constant.error.msg_find_failure);
    }
    return deferred.promise;
     
}

function getGroupById(idGroup){
    var deferred = Q.defer();

    Group.findById(idGroup,function(err, group){
        if (err){
            defer.reject(err);
        }else if (group){
            defer.resolve(group);
        }else {
            defer.reject(constant.error.msg_find_failure);
        }       
    })
    return deferred.promise;
}