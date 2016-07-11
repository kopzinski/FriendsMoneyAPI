/**
 * This file contain all methods to access and modify objects in users database
 * @author Guilherme Webber
 */
 
 
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
	
    getUser:function (req, res, next) {		
        userService.getUser(req.body,function(user){
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        })
    },
    
    deleteUser:function (req, res, next) {		
		userService.deleteUser(req.body.phone, function(result){
			if(result){
				res.send(result); 
			}else {
				res.status(400); 
			}
		})  
    },
    
    registerUser:function (req, res, next) {		
		console.log("Ta pegando: ",req.body);				
		userService.registerUser(req.body, function(result) {
			res.json(result);
		});
			
    }
}
    