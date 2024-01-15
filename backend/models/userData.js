const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// UserData Model Definition
const userDataSchema = new Schema({
  	userId: { type: String, required: true },
  	club_id: { type: String },
  	shift: { type: String },
  	position: { type: String },
  	emp_code: { type: String },
  	idProof: { type: String },
  	hiring_date: { type: Date },
  	salary: { type: Number },
  	dob: { type: String },
  	gender: { type: String },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

module.exports = mongoose.model('userData', userDataSchema);