//controllers/routes.js
/**
 *Mapping routes to send a request to controllers 
 * 
 */
var express = require('express');
var transactionController = require('../transactions/transaction.controller');
var userController = require('../users/user.controller');
var router = express.Router();
var userContactsController = require('../users/contactList.controller');
var groupController = require('../groups/group.controller');
var pendencieController = require('../pendings/pending.controller');
router.get('/',function(req, res){
    res.send("Hello World");
})

//Users
router.post('/user',userController.registerUser);
router.post('/userFromTransaction', userController.registerUserFromTransaction);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/user/:phone', userController.getUser);
router.get('/users', userController.getListAllUsers);
router.post('/contacts', userContactsController.getContact);

//Transactions
router.get('/transactions', transactionController.getListTransactions);
router.get('/transactions/:phone', transactionController.getListTransactionsByUser);
router.get('/transaction/:id',transactionController.getTransaction);
router.delete('/transaction/:id', transactionController.deleteTransaction);
router.put('/transaction', transactionController.updateTransaction);
router.post('/transaction', transactionController.createTransaction);

//Groups
router.post('/group', groupController.createGroup);
router.get('/groups/:phone', groupController.getGroupsByUser);
router.get('/group/:idGroup/transactions', groupController.getTransactionsByGroup);
router.get('/group/:idGroup/members',groupController.getMembersByGroup);
router.post('/group/:idGroup/transaction',groupController.registerTransactionByGroup);
router.put('/group/:idGroup/transaction',groupController.updateTransactionByGroup);

//Pendencies
router.get('/pending/:phone', pendencieController.getListPendencies);


module.exports = router;  