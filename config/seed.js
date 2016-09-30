'use strict';

var logger   = require('mm-node-logger')(module);
var mongoose = require('mongoose');
var User = require('../users/user.schema');
var Transaction = require('../transactions/transaction.schema');
var userService = require('../users/user.service');
var transactionService = require('../transactions/transaction.service');


var user1 = new User(
    {
        name:"Adrian Lemes",
        registrationFlag: true,
        phone: "+555197412487",
        email:"adrianlemess@gmail.com",
        deviceId:"1239849123"

    }
)


var user2 = new User(
    {
        phone: "+555177777777",
        registrationFlag: false
    }
)


var user3 = new User(
    {
        name:"Guilherme Webber",
        phone: "+555155555555",
        email:"guilhermewebber@gmail.com",
        deviceId:"189237854"

    }
)
var user4 = new User(
    {
        name:"João Vitor A Machado",
        phone: "+555182158998",
        email:"joaoamachado@gmail.com",
        deviceId:"12345567"

    }
)
function populateUser(user1, user2,user3, callback){
    User.find({}).remove(function() {
        userService.registerUserDevice(user1, function(response){    
            if (response) console.log(response);
            userService.registerUserFromTransaction(user2, function(response){    
                if (response) console.log(response);
                userService.registerUserDevice(user3, function(response){    
                    if (response){
                        console.log(response);
                        callback(true);
                    }                     
                })
              
            })
        })
    })
}

populateUser(user1, user2,user3, function(response){
     Transaction.find({}).remove(function() {
    if (response){
        var transaction1 = new Transaction({
            value:506,
            creator:{phone:user3.phone,  name:user3.name, registrationFlag:user3.registrationFlag},
            debtor:{phone:user1.phone, name:user1.name, registrationFlag:user1.registrationFlag},
            creditor:{phone:user3.phone, name:user3.name, registrationFlag:user3.registrationFlag},
            status:"pending"
        })
        var transaction2 = new Transaction({
            value:53,
            creator:{phone:user3.phone, name:user3.name, registrationFlag:user3.registrationFlag},
            debtor:{phone:user2.phone, name:user2.name, registrationFlag:user2.registrationFlag},
            creditor:{phone:user3.phone, name:user3.name, registrationFlag:user3.registrationFlag},
            status:"pending"
        })
        var transaction3 = new Transaction({
            value:300,
            creator:{phone:user1.phone, name:user1.name, registrationFlag:user1.registrationFlag},
            debtor:{phone:user3.phone, name:user3.name, registrationFlag:user3.registrationFlag},
            creditor:{phone:user1.phone, name:user1.name, registrationFlag:user1.registrationFlag},
            status:"pending"
        })
        var transaction4 = new Transaction({
            value:150,
            creator:{phone:user4.phone, name:user4.name, registrationFlag:user4.registrationFlag},
            debtor:{phone:user4.phone, name:user4.name, registrationFlag:user4.registrationFlag},
            creditor:{phone:user1.phone, name:user1.name, registrationFlag:user1.registrationFlag},
            status:"pending"
        })

        transactionService.createTransaction(transaction1,function(response){
            console.log(response)
            if (response){
                transactionService.createTransaction(transaction2,function(response){
                    console.log(response)
                    if (response){
                        transactionService.createTransaction(transaction3,function(response){
                            console.log(response)
                            if (response){
                                transactionService.createTransaction(transaction4,function(response){
                                    if (response){
                                        console.log(response);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})
})


