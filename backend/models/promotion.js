const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


// UserData Model Definition
const promotionSchema = new Schema({
  	club_id: { type: String },
  	title: { type: String },
  	hours: { type: Number },
  	position: { type: String },
  	promotionStartDate: { type: Date },
  	promotionEndDate: { type: Date },
  	promotionImage: { type: String },
  	txnId: { type: String },
  	price: { type: String },
  	status: {  type: String, enum : ['0', '1', '2'], default: '0' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

module.exports = mongoose.model('Promotion', promotionSchema);