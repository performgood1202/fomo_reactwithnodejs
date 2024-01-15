const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const orderItemsSchema = new Schema({
	order_id: { type: String, required: true},
  	menu_id: { type: String, required: true},
  	price: { type: Number},
  	quantity: { type: Number, required: true},
  	total_price: { type: Number},
    status: { type: String, enum : ['1', '0'], default: '1' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('OrderItem', orderItemsSchema);