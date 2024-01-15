const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const bookingSchema = new Schema({
	  booking_id: { type: Number},
    user_id: { type: String, required: true},
  	event_id: { type: String, required: true },
    club_id: { type: String, required: true },
  	name: { type: String },
  	price: { type: Number},
    quantity: { type: Number},
    total_price: { type: Number},
    tax: { type: Number},
    table_no: { type: String},
    checkout_session_id: { type: String},
    stripe_payment_id: { type: String},
    is_guest: { type: String, enum : ['0', '1'], default: '0' },
    instagram_link: { type: String },
    status: { type: String, enum : ['0', '1', '2'], default: '0' },
    payment_status: { type: String, enum : ['0', '1'], default: '0' },
    stripe_vendor_payment_intent_id: { type: String},
    vendor_payout_status: { type: String, enum : ['0', '1'], default: '0' },
    order_invoice_url: { type: String},
    booking_invoice_url: { type: String},
    push_notification_for_24hour: { type: String, enum : ['0', '1'], default: '0' },
    push_notification_for_2hour: { type: String, enum : ['0', '1'], default: '0' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


bookingSchema.plugin(AutoIncrement, {inc_field: 'booking_id'});

module.exports = mongoose.model('Booking', bookingSchema);