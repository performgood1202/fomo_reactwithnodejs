const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Queries Model Definition
const queriesSchema = new Schema({
  	name: { type: String, required: true },
  	email: { type: String, required: true },
  	phone: { type: String },
  	message: { type: String, required: true },
  	user_type: { type: String },
  	query_type: { type: String },
  	assign_to: { type: String, required: true },
  	status: { type: String, enum : ['0', '1'], default: '0' }
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

module.exports = mongoose.model('Query', queriesSchema);