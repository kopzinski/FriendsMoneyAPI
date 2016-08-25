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
			getValidNumberPhone(phone).then(function(numberValid){
				numberValid = "+"+numberValid;
				if (numberValid){
					User.findOne({$or:[{"phone.value" : {$regex : ".*"+numberValid+".*"}},{"phone.value":numberValid}]}, function(err, user) {
						if (err)  callback({status: 500, error: err });
						if (user == null || user == undefined){
							callback(false);
						}else {
							callback(user);
						}
					});	
				}else {
					callback(constants.error.msg_invalid_param)
				}
			})
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
				getUser(phone, function(user){
					if (!user) { callback({status: 500, error: err })

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
   
				})			
}

function registerUserFlagFalse (transaction, callback){
	console.log(transaction)
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
	getValidNumberPhone(newUser.phone.value).then(function(phoneValid){
		phoneValid = "+"+phoneValid;
		newUser.registrationFlag = false;
		newUser.phone.value = phoneValid;
		getUser(newUser.phone.value, function(userMongo){
			if (userMongo){
				callback(true);
			}else if(!userMongo && newUser.phone){
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
	})
	
}

function registerUserFlagTrue (user, callback){
	user.registrationFlag = true;

	 if(user.phone){
		User.findOne({$or:[{"phone.value" : {$regex : ".*"+user.phone.value+".*"}},{"phone.value":user.phone.value}, {deviceId:user.deviceId}]}, function(err, userMongo){
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
				userMongo.registrationFlag = true;
				userMongo.save(function(err){
					if (err) {
						callback({error: err});
					}else{
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
		if (phone.length == 8 || phone.length == 9){
			phone = "5551"+phone;
		}else if (phone.length == 10 || phone.length == 11){
			phone = "55"+phone;
		}
         deferred.resolve(phone);
    }else {
        deferred.reject(false);
    }
    return deferred.promise;
}