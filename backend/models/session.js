const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
	email: { type: String, required: true },
	token: { type: String },
	valid: { type: String, enum: ['0', '1'], default: '1' },
	ts: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);