var User = require('./user.schema');
var userService = require('./user.service');
var constants = require('./user.constants.json');
var service = {};
var Q = require('q');
service.getUser = getUser;
service.getListAllUsers = getListAllUsers;
service.deleteUser = deleteUser;
service.registerUserFlagTrue = registerUserFlagTrue;
service.registerUserFlagFalse = registerUserFlagFalse;
service.getValidNumberPhone = getValidNumberPhone;
module.exports = service;

function getUser (phone, callback){
			var newPhone = phone.trim();
			User.findOne({$or:[{"phone.value" : {$regex : ".*"+newPhone+".*"}},{"phone.value":newPhone}]}, function(err, user) {
				if (err)  callback({status: 500, error: err });
				if (user == null || user == undefined){
					callback(false);
				}else {
					callback(user);
				}
			});
	}

function getListAllUsers (callback){
    User.find({}, function(err, users) {
        if (err) callback({status:500, error: err });
        if (users == null){
              callback( {status:404, error: constants.error.msg_empty_database});
        }else {
            callback(users);
        }
    });
}

function deleteUser (phone, callback){
	User.findOne({$or:[{"phone.value" : {$regex : ".*"+phone+".*"}},{"phone.value":phone}]}, function(err, user) {
		if (err) { callback({status: 500, error: err })

		}else if (user == null ){ 
			  callback({status:404, error: constants.error.msg_no_register});
		}else {
			User.remove(user,function(err, user){
				if(err){
					callback(err);
				}else{					
					callback(constants.success.msg_del_success);
				}	
			})			
		}
	});	    
}

function registerUserFlagFalse (transaction, callback){
	if (transaction.debtor == transaction.creator){
		var user = {
			phone:transaction.creditor.phone,
			registrationFlag:false
		}
	}else {
		var user = {
			phone:transaction.debtor.phone,
			registrationFlag:false
		}
	}
	var newUser = new User(user);
	newUser.registrationFlag = false;
	User.findOne({$or:[{"phone.value" : {$regex : ".*"+newUser.phone.value+".*"}},{"phone.value":newUser.phone.value}]}, function(err, userMongo){
		if (userMongo){
			callback(true);
		}else if(newUser.phone){
			newUser.save(function(err, doc){
				if (err) {callback(false);}
				else {
					callback(true);
				}		 
			});			
		}else{
			callback(false);	
		}
	})
}

function registerUserFlagTrue (user, callback){
	user.registrationFlag = true;

	 if(user.phone){
		User.findOne({$or:[{"phone.value" : {$regex : ".*"+user.phone.value+".*"}},{"phone.value":user.phone.value}, {deviceId:user.deviceId}]}, function(err, userMongo){
			console.log(userMongo);
			if(err){
				console.log("erro");
				callback({error: err});
			}else if(!userMongo){
				console.log("salvando a primeira vez")
				var newUser = new User(user);
				newUser.save(function(err){
					if (err)
					callback({error: err});
					else
					callback(newUser);
				})
			}else if (userMongo.name == user.name && userMongo.phone.value == user.phone.value  && userMongo.registrationId == user.registrationId && userMongo.deviceId == user.deviceId){
				console.log("Objetos iguais no banco")
				callback(constants.error.msg_reg_exists_update);
			}else {
				if (user.name)
				userMongo.name = user.name;
				if (user.registerId)
				userMongo.registerId = user.registerId;
				if (user.phone)
				userMongo.phone = user.phone;
				if (user.deviceId)
				userMongo.deviceId = user.deviceId;
				userMongo.save(function(err){
					if (err)
					callback({error: err});
					else{
						callback(userMongo);
					}
					
				})
			}
		})
	 }
}

function getValidNumberPhone(phone){
    var deferred = Q.defer();
    phone = phone.replace(/[^\w\\s]/gi, '');
    var testPattern = /^[0-9]{7,}$/;
    if (testPattern.test(phone)){
        console.log("phone"+phone);
         deferred.resolve(phone);
    }else {
        deferred.reject(false);
    }
    return deferred.promise;
}