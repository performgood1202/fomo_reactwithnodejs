const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Performance Model Definition
const performanceSchema = new Schema({
  	name: { type: String, required: true },
  	description: { type: String, required: true },
  	image: { type: String, required: false, default: null },
  	eventId: { type: String, required: true }
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('Performance', performanceSchema);