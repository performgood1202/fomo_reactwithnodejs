const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

// Benefit Model Definition
const EventBenefitSchema = new Schema({
  	benefit: { type: String, required: true },
  	eventid: { type: String, required: true }
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('EventBenefit', EventBenefitSchema);