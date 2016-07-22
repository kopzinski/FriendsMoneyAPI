/**
 *Transaction Schema 
 * 
 */
var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
	value: {type:Number, required:true},
	creator:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	status: String,
	debtor: { type: mongoose.Schema.Types.ObjectId, ref: 'User'  },
	creditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User'  },
	createdAt: Date,
	updatedAt: Date
});

transactionSchema.pre('save', function(next){
//get current date
var currentDate = new Date();

//change the updated_at fielt to current date
this.updatedAt = currentDate;

// if createdAt doesn't exist
if(!this.createdAt)
    this.createdAt = currentDate;

next();

});

module.exports = mongoose.model('Transaction', transactionSchema);