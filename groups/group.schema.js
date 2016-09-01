/**
 *Group Schema 
 * 
 */
var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    name:{type:String, required:true},
    members:[
        
    ]
})




var transactionSchema = mongoose.Schema({
	name: {type:String, required:true},
	memb: {type:Number},
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