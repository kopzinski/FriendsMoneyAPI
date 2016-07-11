var User = require('./user.schema');
var userService = require('./user.service');
var service = {};

service.getUser = getUser;
service.getListAllUsers = getListAllUsers;
service.deleteUser = deleteUser;
service.registerUser = registerUser;
module.exports = service;

function getUser (user, callback){
	var phone = user.phone;
	if(phone){		
		User.findOne({ phone: phone }, function(err, user) {
			if (err) callback(err);
			if (user == null){
				callback("Não há usuário com esse telefone");
			}else {
				callback(user);
			}
		});
	}else{
		callback("Não há telefone para busca");
	}
    
}

function getListAllUsers (callback){
    User.find({}, function(err, users) {
        if (err) throw err;
        if (users == null){
            callback("Usuário não encontrado");
        }else {
            callback(users);
        }
    });
}

function deleteUser (phone, callback){
	User.findOne({ phone: phone }, function(err, user) {
		if (err) throw err;
		console.log(user);
		if (user == null ){ 
			callback("User não encontrado")
		}else {
			User.remove(user,function(err, user){
				if(err){
					callback(err);
				}else{					
					callback('User deletado com sucesso!');
				}	
			})			
		}
	});	    
}

function registerUser (user, callback){
	if(user.phone){
		User.findOneAndUpdate({phone: user.phone}, user, {upsert:true}, function(err, doc){
			if (err) {callback({status: 500, error: err});}
			else {
				callback("Usuário salvo");
			}		 
		});			
	}else{
		callback("Não salvou");	
	}
}

