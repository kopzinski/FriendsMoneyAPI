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

module.exports = service;

function createGroup(group){
    console.log("createGroup");
   var deferred = Q.defer();
   var newGroup = new Group(group);
   if(newGroup){
       async.map(newGroup.members, filterUsers, function(err, results){
       console.log(results);
       newGroup.members = results;
       newGroup.save(function(err){
           if (err) deferred.reject(err);
           else {
               deferred.resolve(constant.success.msg_reg_success);
           }
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
                    user._id = response._id;
                    user.name = response.name;
                    user.phone.value = response.phone.value;
                    user.registrationFlag = response.registrationFlag;
                    user.flagGroup = false;
                    return callback(null, user)
                }else {
                    userService.getValidNumberPhone(user.phone.value).then(function(validNumber){
                    user.phone.value = "+"+validNumber;
                    user.flagGroup = false;
                    user.registrationFlag = false;
                    return callback(null, user)
            })
                }
            })
}
