const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;



// Events Model Definition
const menuSchema = new Schema({
	    club_id: { type: String, required: true},
	  	name: { type: String, required: true },
	  	code: { type: String, required: true },
	  	price: { type: String, required: true },
	  	cuisine: { type: String },
	  	food_type: { type: String },
	  	item_type: { type: String },
	  	drink_type: { type: String },
	    category: { type: String },
	    menuImage: { type: String,required: false, default: null },
	    status: { type: String, enum : ['0', '1'], default: '1' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });


module.exports = mongoose.model('Menu', menuSchema);