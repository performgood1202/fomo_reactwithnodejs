const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


/* email length checker */
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

/* valid email checker */
let validEmailChecker = (email) => {
  	if (!email) {
    	return false;
  	} else {
    	const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    	return regExp.test(email);
  	}
};

/* email validator */
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

// Staff Model Definition
const staffSchema = new Schema({
  	first_name: { type: String, required: true },
  	last_name: { type: String },
  	email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  	phone: { type: String, required: true},
  	phone_country_code: { type: String, required: true },
  	shift: { type: String },
  	position: { type: String },
  	emp_code: { type: String },
  	hiring_date: { type: Date },
  	salary: { type: Number },
  	club_id: { type: String },
  	image: { type: String },
  	id_proof: { type: String },
  	status: { type: String, enum : ['0', '1'], default: '1' }
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

module.exports = mongoose.model('Staff', staffSchema);