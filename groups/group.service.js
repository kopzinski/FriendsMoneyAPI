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
service.getGroupsByUser = getGroupsByUser;
service.deleteGroup = deleteGroup;
service.acceptGroupInvitation = acceptGroupInvitation;
service.denyGroupInvitation = denyGroupInvitation;
service.getTransactionsByGroup = getTransactionsByGroup;
service.getMembersByGroup = getMembersByGroup;
service.registerTransactionByGroup = registerTransactionByGroup;
service.updateTransactionByGroup = updateTransactionByGroup;
service.getGroupById = getGroupById;
service.getMemebersPartialBalanceByUser = getMemebersPartialBalanceByUser;
service.updatePaymentBalanceGroupByUser = updatePaymentBalanceGroupByUser;

module.exports = service;

function registerTransactionByGroup(idGroup, transaction){
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        transaction.createdAt = Date.now();
        transaction.updatedAt = Date.now();
        group.transactions.push(transaction);
        group.save(function(err){
            if (err){
                deferred.reject(err);
            }else {
                updatePaymentBalanceGroupByUser(idGroup);
                deferred.resolve(constant.success.msg_reg_transaction_success);
            }
        })
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}
function updatePaymentBalanceGroupByUser(idGroup) {
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        var newGroup = new Group(group);
        newGroup = newGroup.toObject();
        var members = group.members.toObject();
        var transactions = group.transactions.toObject();
        var totalSumTransactions = 0;
        transactions.forEach(function(transaction){
              totalSumTransactions += transaction.valuePaid;
        })
        
        var valueByPerson = totalSumTransactions / members.length;
        members.forEach(function(member){
            var valuePaid = 0;
            transactions.forEach(function(transaction){
                 if (transaction.creditor.phone.value == member.phone.value){
                    valuePaid += transaction.valuePaid;
                }
            })
            member.totalBalance = valuePaid - valueByPerson;
        })
        
        newGroup.members = members;
        //update group with the user's balances
        deferred.resolve(newGroup);
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;   
}
//Método comentado mas pode ser usado futuramente
// function getMemebersPartialBalanceByUser(idGroup, phoneUser){
//     var deferred = Q.defer();
//     updatePaymentBalanceGroupByUser(idGroup).then(function(groupUpdate){
//         var members = groupUpdate.members.toObject();
//         var totalBalancesCreditor = 0;
//         var newMembers = members;

//         groupUpdate.members.forEach(function(member){
//             if(member.totalBalance > 0)
//             totalBalancesCreditor += member.totalBalance;
//         })
//         console.log(totalBalancesCreditor);
//          while(totalBalancesCreditor > 0){                 
//              //encontra maior credor
//              var biggerCreditor = 0;

//              for (var i = 1; i < members.length; i++){
//                  if (members[biggerCreditor].totalBalance < members[i].totalBalance){
//                      biggerCreditor = i;
//                  }
//              } 
//              //encontra maior devedor
//              var biggerDebtor = 0;
//              for (var i = 1; i < members.length; i++){
//                  if (members[i].totalBalance < members[biggerDebtor].totalBalance && members[i].totalBalance < 0){
//                      biggerDebtor = i;
//                  }
//              }
//             //Se o credor for maior que o maior devedor
//             if (members[biggerCreditor].totalBalance >= Math.abs(members[biggerDebtor].totalBalance)){
//                 //balanço total do maior credor - balanço total do maior devedor
//                 members[biggerCreditor].totalBalance -= Math.abs(members[biggerDebtor].totalBalance);
//                 //diminui a variável de parada pelo balanço total do devedor *-1 pra ficar positivo
//                 totalBalancesCreditor -= Math.abs(members[biggerDebtor].totalBalance);
//                 //maior devedor ja quitou tudo e fica = 0;
//                 var balance = Math.abs(members[biggerDebtor].totalBalance);
//                 members[biggerDebtor].totalBalance = 0;
                
//                 //verifica se quem chamou a função é o credor
//                 if (members[biggerCreditor].phone.value == phoneUser){
//                     console.log("Entrei no if sendo creditor1")
//                     //Se sim o balanço individual do devedor em relação a quem chamou a função é igual ao totalBalance do devedor * -1
//                     newMembers[biggerDebtor].individualBalance = balance;
//                     //verifica se quem chamou é o debtor
//                 }else if(members[biggerDebtor].phone.value == phoneUser){
//                      console.log("Entrei no if sendo debtor")
//                     //se sim o individual balance do creditor é igual ao totalBalance de quem chamou (negativo mesmo)
//                     newMembers[biggerCreditor].individualBalance = -balance;

//                 }
//             //se o debtor for maior que o creditor
//             }else {
//                 totalBalancesCreditor -= Math.abs(members[biggerCreditor].totalBalance);
//                 members[biggerDebtor].totalBalance += Math.abs(members[biggerCreditor].totalBalance);
//                 var balance = members[biggerCreditor].totalBalance;
//                 members[biggerCreditor].totalBalance = 0;
//                  //verifica se quem chamou a função é o credor
//                 if (members[biggerCreditor].phone.value == phoneUser){
//                     console.log("Entrei no if sendo creditor2")
//                     //Se sim o balanço individual do devedor em relação a quem chamou a função é igual ao totalBalance do devedor * -1
//                     newMembers[biggerDebtor].individualBalance  = balance;
//                 //verifica se quem chamou é o debtor
//                 }else if(members[biggerDebtor].phone.value == phoneUser){
//                     console.log("Entrei no if sendo debtor")
//                     //se sim o individual balance do creditor é igual ao totalBalance de quem chamou (negativo mesmo)
//                     newMembers[biggerCreditor].individualBalance = -balance;
//                 }
//             }
            
//          }
//          deferred.resolve(newMembers);     
    
//     });
//     return deferred.promise;  
// }




// //ver o que cada um deve contribuir no grupo
// 400 reais 10 pessoas 40 por pessoa

// \

// verificar porcentagem a receber dos positivos
// exemplo: 40 pila por pessoa

// cara 1 tem saldo de  240 a receber
// cara 2 tem saldo de 60 a receber

// 240 - 80%
// 60 - 20%



// -----------
// descobre
// se tiver negativo		
// 	- 20 dividido proporcionalmente a cada credor (quem ta positivo), exceto eu mesmo

// 10 pessoas no churrasco
// 3 pagaram = 280 100 20 = 400
// 7 nao pagaram

// cada pessoa tem que pagar ainda 40 reais

// pessoas a receber não entram na transação
// pessoas a pagar entram na transação

function getCreditorsAndDebtors (idGroup, callback){
    updatePaymentBalanceGroupByUser(idGroup).then(function(groupUpdate){
            if (groupUpdate.transactions.length > 0){
                var members = groupUpdate.members;
                var totalBalancesCreditor = 0;
                
                for (var i = 0; i < members.length; i++){
                if(members[i].totalBalance > 0)
                    totalBalancesCreditor += members[i].totalBalance;
                }
                //encontra todos os credores 
                var creditors = [];
                var debtors = [];
                for (var i = 0; i < members.length; i++){
                    if(members[i].totalBalance > 0){
                        creditors.push({
                            phone: members[i].phone,
                            totalBalance: members[i].totalBalance,
                            percentReceive: (members[i].totalBalance/totalBalancesCreditor)*100,
                            position:i
                        });
                    }
                    if (members[i].totalBalance < 0){
                        debtors.push(i);
                    }  
                }
                callback(creditors, debtors, members, totalBalancesCreditor);
            }else {
                callback(null)
            } 
        })
      
}
function getMemebersPartialBalanceByUser(idGroup, phoneUser){
    var deferred = Q.defer(); 
    getCreditorsAndDebtors(idGroup, function(creditors, debtors, members, totalBalancesCreditor){
        if (members != null && creditors != null && debtors != null){
            for (var i = 0; i < members.length; i++){
                if (members[i].phone.value == phoneUser && members[i].totalBalance > 0){
                    for (var j = 0; j < debtors.length; j++){
                        members[debtors[j]].individualBalance = Math.abs(((((members[i].totalBalance/totalBalancesCreditor)*100)*members[debtors[j]].totalBalance)/100).toFixed(2));
                        console.log(members[debtors[j]])
                    }
                }else if (members[i].phone.value == phoneUser && members[i].totalBalance < 0){
                    
                    for (var j = 0; j < creditors.length; j++){
                        members[creditors[j].position].individualBalance = (((creditors[j].percentReceive)*members[i].totalBalance)/100).toFixed(2);
                    }    
                }
            }
             deferred.resolve(members);   
        }else if(members != null) {
             deferred.resolve(members);   
        }else {
            deferred.resolve();
        } 
    })
    return deferred.promise;
}

function updateTransactionByGroup(idGroup, transactionUpdated){
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        for (var i = 0; i < group.transactions.length; i++){
            if (group.transactions[i]._id == transactionUpdated._id){
                group.transactions[i] == transactionUpdated;
                group.save(function(err){
                    if (err){
                        deferred.reject(err);
                    }else {
                        deferred.resolve(constant.success.msg_reg_transaction_success);
                    }
                }) 
            }else if (i == group.transactions.length){
                deferred.reject(constant.error.msg_find_failure_transaction);
            }
        }
        
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function getTransactionsByGroup(idGroup) {
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        if (group.transactions.length > 0){
            deferred.resolve(group.transactions);
        }else {
            deferred.resolve();
        }
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function getMembersByGroup(idGroup) {
    var deferred = Q.defer();
    getGroupById(idGroup).then(function(group){
        if (group.members.length > 0){
            deferred.resolve(group.members);
        }else {
            deferred.resolve();
        }
    }).fail(function(err){
        deferred.reject(err);
    })
    return deferred.promise;    
}

function createGroup(group){
   var deferred = Q.defer();
   var newGroup = new Group(group);
   if(newGroup){
     async.map(newGroup.members, function(user, callback){
        userService.getUser(user.phone.value, function(response){
        if (response){
            user._id = response._id;
            user.name = response.name;
            user.phone.value = response.phone.value;
            user.registrationFlag = response.registrationFlag;
            if (newGroup.creator.phone.value == user.phone.value){
                user.flagAccepted = true;
            }else{
                user.flagAccepted = false;
            }
            return callback(null, user)
        }else {
            userService.getValidNumberPhone(user.phone.value).then(function(validNumber){
            user.phone.value = "+"+validNumber;
            user.flagAccepted = false;  
            user.registrationFlag = false;
            return callback(null, user)
        })
        }
    })
    },function(err, results){
        newGroup.members = results;
        
        userService.getValidNumberPhone(newGroup.creator.phone.value).then(function(numberValid){ 
                newGroup.creator.phone.value = "+"+numberValid;
                newGroup.save(function(err){
            if (err) deferred.reject(err);
            else {
                deferred.resolve(constant.success.msg_reg_success);
            }
        })
        })
        
    });
    return deferred.promise;
   }
}



function getGroupsByUser(user, callback){
    var deferred = Q.defer();
    if(user){
        Group.find({"user.phone": user.phone},function(err, groups){
            if (err){
                logger.error(constant.error.msg_mongo_error+": "+err);
                deferred.reject(err);
            }else if (groups[0] == null || groups[0] == undefined){
                deferred.resolve();
            } else {
                deferred.resolve(groups);
            }
        }).sort({updatedAt : 1})
    }else {
        deferred.reject(constant.error.msg_find_failure);
    }
    return deferred.promise;
     
}

function acceptGroupInvitation (userPhone, id_group){
    var deferred = Q.defer();
    userService.getUser(userPhone, function(user){

       if(user) {
            Group.findById(id_group, function(err, group){
                
                if (err){
                   deferred.reject(err);
                }else {
                    var newGroup = new Group(group);
                     async.map(newGroup.members, function(user, callback){
                        if (userPhone == user.phone.value){
                            user.flagAccepted = true;
                        }
                        return callback(null, user)
                         
                    },
                    function(err, result){
                        group.members = result;
                        group.save(function(err){
                            if (err) deferred.reject(err);
                            else {
                                deferred.resolve(constant.success.msg_reg_success);
                            }
                        })
                    }) 
                }
            })
        }else {
            deferred.reject();
        }
    })
return deferred.promise;
}

function denyGroupInvitation (userPhone, id_group){
     var deferred = Q.defer();
    userService.getUser(userPhone, function(user){
         if(user) {
             Group.findById(id_group, function(err, group){
                 if (err){
                   deferred.reject(err);
                 }else {

                    async.waterfall([
                    function(callback){
                       var members =  (group.members).filter(function(member){
                        return member.phone.value != userPhone;
                       })
                       callback(members)
                    }],
                    function(result){
                        group.members = result;
                         group.save(function(err){
                            if (err) deferred.reject(err);
                            else {
                                deferred.resolve(constant.success.msg_reg_success);
                            }
                        })

                    })
                 }
             })
         }else {
             deferred.reject();
         }
    });
    return deferred.promise;
}


function deleteGroup(id, phone, callback){
      Group.findById(id, function(err, group){
          if (err){
              logger.error(constant.error.msg_mongo_error+": "+err);
              callback({status: 500, error: err });
          }else if(group == null || group == undefined) {
              callback({status:404, error: constant.error.msg_no_register});
          }else{
              for(var i = 0; i < group.members.length; i++){
                if(group.members[i].phone.value == phone){
                    group.members[i].flagFinalized = true;
                }else{
                    if(group.members[i].flagFinalized == true){
                        group.members[i].flagFinalized == true;
                    }else{
                        group.members[i].flagFinalized = false;
                    }
                }             
              }
              var cont = 0;
              for(var i = 0; i < group.members.length; i++){
                if(group.members[i].flagFinalized == true){
                    cont++;
                }  
              }
              if(cont == group.members.length){
                var date = new Date();
                group.finalizedAt = date;   
              }
              group.save(function(err, success){
                if(err){
                    logger.error(constant.error.msg_mongo_error+": "+err);
                    callback({status: 500, error: err });
                }else{
                    callback(success);
                }
              })
              
              
          }
      })
}

function getGroupById(idGroup){
    var deferred = Q.defer();

    Group.findById(idGroup,function(err, group){
        if (err){
            deferred.reject(err);
        }else if (group){
            deferred.resolve(group);
        }else {
            deferred.reject(constant.error.msg_find_failure);
        }       
    })
    return deferred.promise;

}

var removeByAttr = function(arr, attr, value, callback){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}
