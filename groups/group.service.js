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
//service.getGruposByUser = getGruposByUser;

module.exports = service;

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

function acceptGroup (userPhone, id_group){

}

function denyGroup (userPhone, id_group){

}