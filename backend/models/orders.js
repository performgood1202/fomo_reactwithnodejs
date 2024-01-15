const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const orderSchema = new Schema({
	order_id: { type: Number},
	booking_id: { type: String, required: true},
    user_id: { type: String, required: true},
    club_id: { type: String, required: true },
    tax: { type: Number},
    total_price: { type: Number},
    status: { type: String, enum : ['0', '1', '2','3'], default: '0' },
    payment_status: { type: String, enum : ['0', '1'], default: '0' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

orderSchema.plugin(AutoIncrement, {inc_field: 'order_id'});

module.exports = mongoose.model('Order', orderSchema);