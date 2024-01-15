const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// Clubs Model Definition
const payamentHistorySchema = new Schema({
  	club_id: { type: String, required: true },
    user_id: { type: String, required: true },
  	price: { type: Number, required: true },
  	payment_type: { type: String, required: true },
  	subscription_id: { type: String },
  	txnId: { type: String },
  	status: { type: String, enum : ['0', '1', '2'], default: '0' },
  	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('payament_history', payamentHistorySchema);