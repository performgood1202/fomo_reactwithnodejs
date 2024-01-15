const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// Clubs Model Definition
// const date = new Date(); 
// date.setFullYear(date.getFullYear() + 1);
const subscriptionSchema = new Schema({
	club_id: { type: String, required: true },
	stripe_subscription_id: { type: String, required: true },
  	plan_id: { type: String, required: true },
  	price_id: { type: String, required: true },
  	subscription_start_date: { type: Date, required: true, default: Date.now },
  	subscription_recurring_date: { type: Date, default: undefined },
  	subscription_cancel_date: { type: Date, required: false, default: undefined },
  	status: { type: String, enum : ['0', '1','2'], default: '1' },
  	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Subscription',subscriptionSchema)
