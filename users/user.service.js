var User = require('./user.schema');
var userService = require('./user.service');
var constants = require('./user.constants.json');
var service = {};

service.getUser = getUser;
service.getListAllUsers = getListAllUsers;
service.deleteUser = deleteUser;
service.registerUserDevice = registerUserDevice;
service.registerUserFromTransaction = registerUserFromTransaction;
module.exports = service;

function getUser (phone, callback){
		User.findOne({ phone: phone }, function(err, user) {
			if (err)  callback({status: 500, error: err });
			if (user == null || user == undefined){
				callback({status:404, error: constants.error.msg_no_register});
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
	User.findOne({ phone: phone }, function(err, user) {
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

function registerUserFromTransaction (user, callback){
	var newUser = new User(user);
	newUser.registration_flag = false;
	User.findOne({$or: [{phone: newUser.phone},{deviceId: newUser.deviceId}]}, function(err, userMongo){
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

function registerUserDevice (user, callback){
	user.registration_flag = true;
	if(user.phone){
		User.findOneAndUpdate({phone:user.phone},user, {upsert:true}, function(err, newUser){

			if (err) {console.log("Aqui"), callback({status: 500, error: err});}
			else if (newUser.name == user.name && newUser.phone == user.phone && newUser.email == user.email && newUser.registrationId == user.registrationId && newUser.deviceId == user.deviceId){
				 callback(constants.error.msg_reg_exists_update);
			}
			else {
				callback(constants.success.msg_reg_success);
			}		 
		});			
	}else{
		callback({status:500, error: constants.error.msg_field_empty});	
	}
}
