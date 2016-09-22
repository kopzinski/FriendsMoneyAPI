/**
 *Group Schema 
 * 
 */
var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    title:{type:String, required:true},
    members:[{
		name:String,
		phone:{value:{type: String, required:true, ref: 'User' }},
		registrationFlag:Boolean,
		flagAccepted: Boolean,
		flagFinalized: Boolean
	}],
	creator:{phone:{value:{type: String, required:true, ref: 'User.phone.value'}}, name:String},
	transactions:[{
		description: String,
		valuePaid: Number,
		createdAt: Date,
		updatedAt: Date,
		creditor:{phone:{value:{type: String, required:true, ref: 'User' }}, name:{type:String}}
		}],
	updatedAt:Date,
	createdAt:Date,
	finalizedAt:Date
})

groupSchema.pre('save', function(next){
//get current date
var currentDate = new Date();

//change the updated_at fielt to current date
this.updatedAt = currentDate;

// if createdAt doesn't exist
if(!this.createdAt)
    this.createdAt = currentDate;
next();

});

module.exports = mongoose.model('Group', groupSchema);