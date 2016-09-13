var express = require('express'),
    groupService = require('./group.service'),
    constant = require('./group.constants.json');

module.exports = {
    
    createGroup:function (req, res, next) {
        var newGroup = ({
            creator:req.body.creator,
            members:req.body.members,
            title:req.body.title,
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
            res.json(400, { error: constant.error.msg_invalid_param});
        }else {
            groupService.getGroupsByUser(phone, function(response){  
                if (response){     
                    console.log(response);
                    res.json(response);
                }else {    
                    res.json({});
                }
            })
        }
    },

    deleteGroup:function (req, res, next) {
        var id = req.params.idgroup;
        var phone = req.params.phone;
        groupService.deleteGroup(id, phone , function(response){  
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

        groupService.acceptGroupInvitation(userPhone, id_group, function(err, response){

            if (response){
                res.json(constant.success.msg_reg_success);
            }else {
                res.status(404).json(err);
            }
        })
    }

    
    
    


}
        
        
