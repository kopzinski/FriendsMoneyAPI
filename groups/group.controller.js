var express = require('express'),
    groupService = require('./group.service'),
    constant = require('./group.constants.json');

module.exports = {
    
    createGroup:function (req, res, next) {
        console.log(req.body);
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
    }
}
        
        
