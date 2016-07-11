/** example.controller.js
 * This file have all methods to handler external requests about users
 */

//Dependencies
var express = require('express');
var userService = require('./user.service');
var User = require('./user.schema');

module.exports = {
    getListAllUsers:function (req, res, next) {
         userService.getListAllUsers(function (users) {
            if (users) {
                res.json(users);
            } else {
                res.sendStatus(404);
            }
        })
        
    },
    
    /*getListUserDevice:function (req, res, next) {
        var id = req.params.userId;
        if ( typeof id  == 'undefined' || id == 'null' || id == null) {
            res.json("Parâmetros invalidos");
        } else if (!id.trim()) {
            res.json("Erro - Parâmetro vazios");
        } else {
        userService.getListUserDevice (id,function(users){
            if (users) {
                res.json(users);
            } else {
                res.sendStatus(404);
            }
        })
        }
        
    },*/
    getUser:function (req, res, next) {
        console.log("Resposta getUser: " + req);
        /*var id = req.params.registrationId;
        if ( typeof id  == 'undefined' || id == 'null' || id == null) {
            res.json("Parâmetros invalidos");
        } else if (!id.trim()) {
            res.json("Erro - Parâmetro vazios");
        } else {*/
		
        userService.getUser (req,function(user){
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        })
		
		
		//}
        
    },
    
    deleteUser:function (req, res, next) {
        
		userService.deleteUser(req.phone, function(result){
			if(result){
				res.send(result); 
			}else {
				res.status(400); 
			}
		})  
        
    },
    
    registerUser:function (req, res, next) {
        
        	
		
		console.log(req.body);
		
		
		
         /*newUser.deviceId = req.body.deviceId;
         newUser.registrationId = req.body.registrationId;
         var userId = req.body.userId;
         newUser.celNumber = req.body.celNumber;
		 */		 
        /*if ( typeof newUser.deviceId  == 'undefined' ||  typeof newUser.registrationId  == 'undefined' || typeof userId == 'undefined'|| typeof newUser.celNumber == "undefined") {
           res.json("Parâmetros invalidos");
        } else if (!newUser.deviceId.trim() || !newUser.registrationId.trim() || !userId.trim() || !newUser.celNumber.trim() ) {
         
             res.json("Erro - Parâmetro vazios");
        } else {*/
		
		userService.registerUser(req, function(result) {
			res.json(result);
		});
			
        /*}*/
    }
}
    