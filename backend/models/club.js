const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// Clubs Model Definition
const clubsSchema = new Schema({
  	name: { type: String, required: true },
  	email: { type: String, required: true },
  	address: { type: String, required: true },
  	phone_country_code: { type: String},
    phone: { type: String, required: true },
  	website: { type: String, required: false, default: null },
  	stripe_customer_id: { type: String, required: true },
    stripe_account_id: { type: String},
    bank_account_id: { type: String},
    stripe_account_status: { type: String, enum : ['0', '1'], default: '0' },
  	user_id: { type: String, required: true },
  	plan_type: { type: String, enum : ['0','1']},
    lat: { type: String},
    long: { type: String},
  	status: { type: String, enum : ['0', '1', '2', '3'], default: '0' },
  	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Club', clubsSchema);