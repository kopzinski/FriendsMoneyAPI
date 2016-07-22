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
        console.log("entrou aqui");
        var transaction1 = new Transaction({
            value:506,
            creator:{phone:user2.phone},
            debtor:{phone:user1.phone},
            creditor:{phone:user2.phone},
            status:"pendente"
        })
        var transaction2 = new Transaction({
            value:53,
            creator:{phone:user3.phone},
            debtor:{phone:user2.phone},
            creditor:{phone:user3.phone},
            status:"pendente"
        })
        var transaction3 = new Transaction({
            value:300,
            creator:{phone:user1.phone},
            debtor:{phone:user3.phone},
            creditor:{phone:user1.phone},
            status:"pendente"
        })
        var transaction4 = new Transaction({
            value:150,
            creator:{phone:user3.phone},
            debtor:{phone:user3.phone},
            creditor:{phone:user1.phone},
            status:"pendente"
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


