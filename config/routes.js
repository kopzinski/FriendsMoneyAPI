//controllers/routes.js
/**
 *Mapping routes to send a request to controllers 
 * 
 */
var express = require('express');
var transactionController = require('../transactions/transaction.controller');
var router = express.Router();

router.get('/',function(req, res){
    res.send("Hello World");
})

//Transactions
 router.get('/transactions', transactionController.getListTransactions);
 router.get('/transactions/:user_id', transactionController.getListTransactionsByUser);
 router.get('/transaction/:id',transactionController.getTransaction);
 router.delete('/transaction/:id', transactionController.deleteTransaction);
 router.put('/transaction', transactionController.updateTransaction);
 router.post('/transaction', transactionController.createTransaction);

module.exports = router;  