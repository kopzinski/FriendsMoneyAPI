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

userSchema.post('findOneAndUpdate', function() {
	this.findOne({phone:this._update.phone}, function(err, userMongo){
			if (userMongo.createdAt == null || userMongo.createdAt == undefined){
				var currentDate = new Date();
				userMongo.updatedAt = currentDate;
				userMongo.createdAt = currentDate;
				userMongo.save(function(err){
					if (err) console.log(err)
				
				})
			}else {
				var currentDate = new Date();
				userMongo.updatedAt = currentDate;
				userMongo.save(function(err){
					if (err) console.log(err)
				
				})
			}
		})
		
	// if (this._update == null){
	// 	this.update({},{ $set: { updatedAt: new Date(), createdAt: new Date() } });
	// }else {
	// 	this.findOne({phone:this._update.phone}, function(err, userMongo){
	// 		if (userMongo.createdAt==undefined){
	// 			this.update({},{ $set: { updatedAt: new Date(), createdAt: new Date() } });
	// 		}else {
	// 			this.update({},{ $set: { updatedAt: new Date()} });
	// 		}
	// 	})
	// }
});

module.exports = mongoose.model('Users', userSchema);