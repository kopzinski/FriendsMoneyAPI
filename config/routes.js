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
 router.post('/registerUser', userController.registerUser);
 router.post('/deleteUser', userController.deleteUser);
 router.post('/user', userController.getUser);
 router.post('/users', userController.getListAllUsers);

// router.get('/user/:username', userController.getUser);
// router.delete('/user/:username', userController.deleteUser);
// router.put('/user', userController.updateUser);

//Notification
// router.post('/notification', notificationController.getSendPushNotification);

module.exports = router;  