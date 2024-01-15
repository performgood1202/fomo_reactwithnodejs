const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  	if (!email) {
    	return false;
  	} else {
	    if (email.length < 5 || email.length > 30) {
	      	return false;
	    } else {
	      	return true;
	    }
  	}
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
  	if (!email) {
    	return false;
  	} else {
    	const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    	return regExp.test(email);
  	}
};

// Array of Email Validators
const emailValidators = [
	{
		validator: emailLengthChecker,
		message: 'E-mail must be at least 5 characters but no more than 30'
	},
	{
		validator: validEmailChecker,
		message: 'Must be a valid e-mail'
	}
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
	if (!password) {
		return false;
	} else {
		if (password.length < 8 || password.length > 35) {
			return false;
		} else {
			return true;
		}
	}
};

// Validate Function to check if valid password format
let validPassword = (password) => {
	if (!password) {
		return false;
	} else {
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		return regExp.test(password); // Return regular expression test result (true or false)
	}
};

// Array of Password validators
const passwordValidators = [
	{
		validator: passwordLengthChecker,
		message: 'Password must be at least 8 characters but no more than 35'
	},
	// {
	// 	validator: validPassword,
	// 	message: 'Must have at least one uppercase, lowercase, special character, and number'
	// }
];

/* match phone number pattern */
let validPhoneNoChecker = (phone) => {
	if(!phone){
		return false;
	}else{
		const regExp = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
		return regExp.test(phone);
	}
}

/* phone number validation */
const phoneValidators = [
	{
		validator: validPhoneNoChecker,
		message: 'Enter valid phone number'
	}
];

// User Model Definition
const userSchema = new Schema({
  	fName: { type: String },
  	lName: { type: String },
  	email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  	password: { type: String, required: true, validate: passwordValidators },
  	roleId: { type: Number, required: true },
  	phone_country_code: { type: String },
  	phone: { type: String, unique: true },
  	profileImage: { type: String},
  	stripe_customer_id: { type: String},
  	status: { type: String, enum : ['0', '1', '2'], default: '1' },
  	loginType: { type: String },
  	device_token: { type: String },
  	lat: { type: String },
  	long: { type: String },
  	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
  	if (!this.isModified('password'))
    	return next();

  	// Apply encryption
  	bcrypt.hash(this.password, null, null, (err, hash) => {
    	if (err) return next(err);
	    this.password = hash;
	    next();
  	});
});
userSchema.pre('findOneAndUpdate', function(next) {
	const update = this.getUpdate();

	if(update && update["$set"] && update["$set"].password && update["$set"].password != ""){
		// Apply encryption
	  	bcrypt.hash(update["$set"].password, null, null, (err, hash) => {
	    	if (err) return next(err);
		    this.getUpdate()["$set"].password = hash;
		    next();
	  	});
    }else{
  	   next();
    }

  	
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password) {
	try{

		return bcrypt.compareSync(password, this.password);

	}catch(err) {
		return;
	}
  	
};

module.exports = mongoose.model('User', userSchema);