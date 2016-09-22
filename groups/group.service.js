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

service.deleteGroup = deleteGroup;
service.acceptGroupInvitation = acceptGroupInvitation;
service.denyGroupInvitation = denyGroupInvitation;
service.getTransactionsByGroup = getTransactionsByGroup;
service.getMembersByGroup = getMembersByGroup;
service.registerTransactionByGroup = registerTransactionByGroup;
service.updateTransactionByGroup = updateTransactionByGroup;
service.getGroupById = getGroupById;


module.exports = service;

function registerTransactionByGroup(idGroup, transaction){
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        transaction.createdAt = Date.now();
        transaction.updatedAt = Date.now();
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
     async.map(newGroup.members, function(user, callback){
        userService.getUser(user.phone.value, function(response){
        if (response){
            console.log(newGroup.creator);
            console.log("if");
            user._id = response._id;
            user.name = response.name;
            user.phone.value = response.phone.value;
            user.registrationFlag = response.registrationFlag;
            if (newGroup.creator.phone.value == user.phone.value){
                user.flagAccepted = true;
            }else{
                user.flagAccepted = false;
            }
            return callback(null, user)
        }else {
            console.log("else");
            userService.getValidNumberPhone(user.phone.value).then(function(validNumber){
            user.phone.value = "+"+validNumber;
            user.flagAccepted = false;  
            user.registrationFlag = false;
            return callback(null, user)
        })
        }
    })
    },function(err, results){
        console.log(results);
        newGroup.members = results;
        
        userService.getValidNumberPhone(newGroup.creator.phone.value).then(function(numberValid){ 
                newGroup.creator.phone.value = "+"+numberValid;
                newGroup.save(function(err){
            if (err) deferred.reject(err);
            else {
                deferred.resolve(constant.success.msg_reg_success);
            }
        })
        })
        
    });
    return deferred.promise;
   }
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

function acceptGroupInvitation (userPhone, id_group){
    var deferred = Q.defer();
    userService.getUser(userPhone, function(user){

       if(user) {
            Group.findById(id_group, function(err, group){
                
                if (err){
                   deferred.reject(err);
                }else {
                    var newGroup = new Group(group);
                     async.map(newGroup.members, function(user, callback){
                        if (userPhone == user.phone.value){
                            user.flagAccepted = true;
                        }
                        return callback(null, user)
                         
                    },
                    function(err, result){
                        group.members = result;
                        console.log(group);
                        group.save(function(err){
                            if (err) deferred.reject(err);
                            else {
                                deferred.resolve(constant.success.msg_reg_success);
                            }
                        })
                    }) 
                }
            })
        }else {
            deferred.reject();
        }
    })
return deferred.promise;
}

function denyGroupInvitation (userPhone, id_group){
     var deferred = Q.defer();
    userService.getUser(userPhone, function(user){
         if(user) {
             Group.findById(id_group, function(err, group){
                 if (err){
                   deferred.reject(err);
                 }else {

                    async.waterfall([
                    function(callback){
                       var members =  (group.members).filter(function(member){
                        return member.phone.value !== userPhone && member.flagAccepted != false;
                       })
                       callback(members)
                    }],
                    function(result){
                        console.log(result);
                        group.members = result;
                         group.save(function(err){
                            if (err) deferred.reject(err);
                            else {
                                deferred.resolve(constant.success.msg_reg_success);
                            }
                        })

                    })
                 }
             })
         }else {
             deferred.reject();
         }
    });
    return deferred.promise;
}

function acceptGroupFinalized (userPhone, id_group){

}

function deleteGroup(id, phone, callback){
      Group.findById(id, function(err, group){
          if (err){
              logger.error(constant.error.msg_mongo_error+": "+err);
              callback({status: 500, error: err });
          }else if(group == null || group == undefined) {
              callback({status:404, error: constant.error.msg_no_register});
          }else{
              for(var i = 0; i < group.members.length; i++){
                if(group.members[i].phone.value == phone){
                    group.members[i].flagFinalized = true;
                }else{
                    group.members[i].flagFinalized = false;
                }                  
              }
              group.save(function(err, success){
                  if(err){
                      logger.error(constant.error.msg_mongo_error+": "+err);
                      callback({status: 500, error: err });
                  }else{
                      callback(success);
                  }
              })
          }
      })
}

function getGroupById(idGroup){
    var deferred = Q.defer();

    Group.findById(idGroup,function(err, group){
        if (err){
            deferred.reject(err);
        }else if (group){
            deferred.resolve(group);
        }else {
            deferred.reject(constant.error.msg_find_failure);
        }       
    })
    return deferred.promise;

}

var removeByAttr = function(arr, attr, value, callback){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}
