const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const otpSchema = new Schema({
	    phone: { type: String, required: true},
	  	otp: { type: String, required: true },
	    status: { type: String, enum : ['0', '1'], default: '0' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('Otp', otpSchema);