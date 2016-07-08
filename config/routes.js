//controllers/routes.js
/**
 *Mapping routes to send a request to controllers 
 * 
 */
var express = require('express');
var userController = require('../user/user.controller');
// var notificationController = require('../notifications/notifications.controller');
var router = express.Router();

//Users
 router.get('/allUsers', userController.getListAllUsers);
 
// router.get('/user/:username', userController.getUser);
// router.delete('/user/:username', userController.deleteUser);
// router.put('/user', userController.updateUser);

//Notification
// router.post('/notification', notificationController.getSendPushNotification);

module.exports = router;  