//controllers/routes.js
/**
 *Mapping routes to send a request to controllers 
 * 
 */
var express = require('express');
var transactionController = require('../transactions/transaction.controller');
var userController = require('../user/user.controller');
var router = express.Router();

router.get('/',function(req, res){
    res.send("Hello World");
})

//Users
 router.post('/registerUser', userController.registerUser);
 router.post('/deleteUser', userController.deleteUser);
 router.post('/user', userController.getUser);
 router.post('/users', userController.getListAllUsers);

// router.get('/user/:username', userController.getUser);
// router.delete('/user/:username', userController.deleteUser);
// router.put('/user', userController.updateUser);


//Transactions
 router.get('/transactions', transactionController.getListTransactions);
 router.get('/transactions/:user_id', transactionController.getListTransactionsByUser);
 router.get('/transaction/:id',transactionController.getTransaction);
 router.delete('/transaction/:id', transactionController.deleteTransaction);
 router.put('/transaction', transactionController.updateTransaction);
 router.post('/transaction', transactionController.createTransaction);

module.exports = router;  