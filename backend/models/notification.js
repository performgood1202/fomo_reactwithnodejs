const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const NotificationSchema = new Schema({
    message: { type: String, required: true},
  	assign_to: { type: String, required: true },
    notification_type: { type: String, enum : ['Query', 'Subscription', 'Promotion',"Booking","Order",], default: '' },
    notification_from: { type: String, enum : ['Contact', 'Club', 'Order', "Booking", "App"], default: '' },
    notification_link: { type: String },
  	read: { type: String, enum : ['0', '1'], default: '0' },
  	status: { type: String, enum : ['0', '1'], default: '1' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('Notification', NotificationSchema);