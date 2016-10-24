var express      = require('express'),
    groupService = require('./group.service'),
    constant     = require('./group.constants.json');

module.exports = {
    
    createGroup:function (req, res, next) {
        var newGroup = ({
            creator:req.body.creator,
            members:req.body.members,
            title:req.body.title
        })
        if (typeof newGroup.creator == 'undefined' || newGroup.members.length == 0 || typeof newGroup.title == 'undefined'){
            res.status(400).json({error: constant.error.msg_invalid_param});
        }else {
            groupService.createGroup(newGroup).then(function(response){
                res.json(response);
            }).fail(function(err){
                res.status(404).json(err)
            })
        }
    },
    
    getGroupsByUser:function (req, res, next) {
        var phone = req.params.phone;
        
        if ( typeof phone == 'undefined'){
            res.status(400).json(constant.error.msg_invalid_param);
        }else {
            groupService.getGroupsByUser(phone).then(function(response){  
                if (response){     
                    res.json(response);
                }else {    
                    res.json({});
                }
            })
        }
    },

    acceptDeleteGroup:function (req, res, next) {
        var id = req.params.idgroup;
        var phone = req.params.phone;
        groupService.acceptDeleteGroup(id, phone , function(response){  
            if (response){     
                res.json(response);
            }else {    
                res.json({});
            }
        })
    },

    denyDeleteGroup:function (req, res, next) {
        console.log(req.params);
        var id = req.params.idgroup;
        console.log(id);        
        groupService.denyDeleteGroup(id, function(response){  
            if (response){     
                res.json(response);
            }else {    
                res.json({});
            }
        })
    },

    acceptGroupInvitation:function(req, res, next){
        var userPhone = req.body.userPhone;
        var id_group = req.body.id_group;

        groupService.acceptGroupInvitation(userPhone,id_group).then(function(response){
            res.json(response);

        }).fail(function(err){
            res.status(404).json(err);
        })
    },
    denyGroupInvitation:function(req, res, next){
        var userPhone = req.body.userPhone;
        var id_group = req.body.id_group;

        groupService.denyGroupInvitation(userPhone,id_group).then(function(response){
            res.json(response);

        }).fail(function(err){
            res.status(404).json(err);
        })
    },
    getTransactionsByGroup:function(req, res, next){
        var idGroup = req.params.idGroup;
        if (typeof idGroup == 'undefined'){
            res.status(400).json(constant.error.msg_invalid_param);
        }else {
            groupService.getTransactionsByGroup(idGroup).then(function(transactions){
                res.json(transactions);
            }).fail(function(err){
                res.status(404).json(err);
            })  
        }
    },
    getMembersByGroup:function(req, res, next){
        var idGroup = req.params.idGroup;
        var phone = req.params.phone;
        if (typeof idGroup == 'undefined'){
            res.status(400).json(constant.error.msg_invalid_param);
        }else {
            groupService.getMemebersPartialBalanceByUser(idGroup, phone).then(function(members){
                res.json(members);                
            }).fail(function(err){
                res.status(404).json(err);
            })  
        }    
    },
    registerTransactionByGroup:function (req, res, next){
       var idGroup = req.body.idGroup;
       var transaction = req.body.transaction;
       if (typeof idGroup == 'undefined' && typeof transaction == 'undefined'){
           res.status(400).json(constant.error.msg_invalid_param);
       }else {
           groupService.registerTransactionByGroup(idGroup, transaction).then(function(response){
               res.json(response);
           }).fail(function(err){
               res.status(404).json(err);
           }) 
       }
    },   
    updateTransactionByGroup: function(req, res, next){
       var idGroup = req.body.idGroup;
       var transaction = req.body.transaction;
       if (typeof idGroup == 'undefined' && typeof transaction.valuePaid == 'undefined' && typeof transaction.description == 'undefined'){
           res.status(400).json(constant.error.msg_invalid_param);
       }else {
           groupService.updateTransactionByGroup(idGroup, transaction).then(function(response){
               res.json(response);
           }).fail(function(err){
               res.status(404).json(err);
           }) 
       }
    },

    deleteTransactionByGroup: function(req, res, next){
      
       var idGroup = req.params.idGroup;
       var transaction = req.params.idTransaction;
       var phoneCreator = req.params.phoneCreator;

       if (typeof idGroup == 'undefined' && typeof transaction.valuePaid == 'undefined' && typeof transaction.description == 'undefined'){
           res.status(400).json(constant.error.msg_invalid_param);
       }else {
           groupService.deleteTransactionByGroup(idGroup, transaction, phoneCreator).then(function(response){
               res.json(response);
           }).fail(function(err){
               res.status(404).json(err);
           }) 
       }
    },
    

    denyDeleteTransactionByGroup: function(req, res, next){
       
       
       var idGroup = req.body.idGroup;
       var transaction = req.body.idTransaction;

       if (typeof idGroup == 'undefined'){
           res.status(400).json(constant.error.msg_invalid_param);
       }else {
           groupService.denyDeleteTransactionByGroup(idGroup, transaction).then(function(response){
               res.json(response);
           }).fail(function(err){
               res.status(404).json(err);
           }) 
       }
    }




}
        
        
