var User = require('./user.schema');
var userService = require('./user.service');
var service = {};

service.getUser = getUser;
service.getListAllUsers = getListAllUsers;
service.deleteUser = deleteUser;
service.registerUser = registerUser;

function getUser (user, callback){
	var phone = user.phone;
    console.log("Telefone: "+phone);
    User.findOne({ phone: phone }, function(err, user) {
        if (err) callback(err);
        if (user == null){
            callback(null);
        }else {
            callback(user);
        }
    });
}

function getListAllUsers (callback){
    User.find({ }, function(err, user) {
        if (err) throw err;
        if (user == null){
            callback("Usuário não encontrado");
        }else {
            callback(user);
        }
    });
}

function deleteUser (phone, callback){
    User.findOne({ phone: phone }, function(err, user) {
        if (err) throw err;
        console.log(user);
        if (user == null ){ 
            callback("Dispositivo não encontrado")
        }else {
			callback('Dispositivo deletado com sucesso!');
        }
    });
}

function registerUser (user, callback){	
   var newUser = new user(user)
    //usar valueof pra transforma o array numa string
    User.findOneAndUpdate({phone: user.phone}, newUser, {upsert:true}, function(err, doc){
		if (err) return res.send(500, { error: err });
		return res.send("Salvo");
	});
}

