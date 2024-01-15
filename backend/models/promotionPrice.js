const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Clubs Model Definition
const promotionPriceSchema = new Schema({
  	position: { type: String, required: true },
  	time: { type: String, required: true },
  	price: { type: String, required: true },
  	status: { type: String, enum : ['0', '1'], default: '1' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('promotionPrice', promotionPriceSchema);