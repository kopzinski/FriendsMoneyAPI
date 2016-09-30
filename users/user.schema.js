/**
 *User Schema 
 * 
 */
var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
	phone: {value:{type:String, unique:true, required:true}},
	name: String,
	email: String,
	registrationId: String,
	registrationFlag: Boolean,
	deviceId:{ type: String, unique: false},
	createdAt:Date,
	updatedAt:Date
});

userSchema.pre('save', function(next){
//get current date
var currentDate = new Date();

//change the updated_at fielt to current date
this.updatedAt = currentDate;

// if createdAt doesn't exist
if(!this.createdAt)
    this.createdAt = currentDate;
next();

});


module.exports = mongoose.model('Users', userSchema);