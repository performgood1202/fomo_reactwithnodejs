const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const eventSchema = new Schema({
	  club_id: { type: String, required: true},
  	title: { type: String, required: true },
  	event_date: { type: Date, required: true },
    event_end_date: { type: Date, required: true },
  	event_time: { type: String, required: true },
    hours: { type: String, required: true },
  	avail_seats: { type: String, required: true },
    avail_guest_seats: { type: String, required: true },
  	booking_price: { type: String, required: true },
  	event_images: { type: String, required: false, default: null },
  	performerName: { type: String, required: false},
  	performerDescription: { type: String, required: false},
  	performerImage: { type: String, required: false},
    status: { type: String, enum : ['0', '1', '2'], default: '0' },
    event_booking_status: { type: String, enum : ['0', '1'], default: '1' },
    booking_count: { type: Number , default: '0'},
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('Event', eventSchema);