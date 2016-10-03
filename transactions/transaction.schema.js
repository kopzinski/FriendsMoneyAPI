/**
 *Transaction Schema 
 * 
 */
var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
	valueTotal: {type:Number, required:true},
	valuePaid: {type:Number},
	description: String,
	creator:{ phone:{value:{type: String, required:true, ref: 'User'}}, name:{type:String}, registrationFlag:String},
	status: String,
	debtor: { phone:{value:{type: String, required:true, ref: 'User' }}, name:{type:String}, senderConfirm:Boolean, registrationFlag:String},
	creditor: { phone:{value:{type: String, required:true, ref: 'User'}}, name:{type:String},senderConfirm:Boolean, registrationFlag:String},
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