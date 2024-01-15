const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// User Model Definition
const settingSchema = new Schema({
  	setting_key: { type: String, required: true },
  	setting_value: { type: String, required: true },
  	user_id: { type: String },
  	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Setting', settingSchema);