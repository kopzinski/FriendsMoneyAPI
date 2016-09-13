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
//service.getGruposByUser = getGruposByUser;

module.exports = service;

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
	    
	}else {
        callback({error: constant.msg_reg_failure});
    }
    return deferred.promise;
}



function getGroupsByUser(user, callback){
        if(user){
            Group.find({"user.phone": user.phone},function(err, groups){
                if (err){
                    logger.error(constant.error.msg_mongo_error+": "+err);
                    callback({status:500, error: err });
                }else if (groups[0] == null || groups[0] == undefined){
                    callback();
                } else {
                    callback(groups);
                }
            }).sort({updatedAt : 1})
        }else {
            callback({status:404, error: "No groups"});
        }     
}

function acceptGroupInvitation (userPhone, id_group, callback){
    userService.getUser(userPhone, function(user){
        console.log(userPhone);
       if(user) {
           console.log("outro aqui");
            Group.findById(id_group, function(err, group){


                if (err){
                    callback(err, null);
                }else {
                    async.map(group.members,function(user, doneCallback){
                        console.log(user);
                        if(user.phone.value == userPhone){
                            user.flagAccepted = true;
                            console.log(user);
                        }
                         doneCallback(user)
                    },
                    function(result){
                        group.members = result;
                         group.save(function(err){
                            if (err) callback(err, null);
                            else {
                                callback(null, constant.success.msg_reg_success);
                            }
                        })
                    }) 
                }
            })
        }else {
            callback(null, null)
        }
    })

}

function denyGroupInvitation (userPhone, id_group){

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


