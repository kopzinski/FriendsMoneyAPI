/**
 *User Schema 
 * 
 */
var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
	phone: {type:String, unique:true, required:true},
	name: String,
	email: String,
	registration_id: String,
	registration_flag: Boolean	
});

userSchema.pre('save', function(next){
//get current date
var currentDate = new Date();

//change the updated_at fielt to current date
this.updated_at = currentDate;

// if created_at doesn't exist
if(!this.created_at)
    this.created_at = currentDate;

next();

});

module.exports = mongoose.model('Users', userSchema);