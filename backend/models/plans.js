const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// User Model Definition
const plansSchema = new Schema({
  	name: { type: String, required: true },
  	description: { type: String, required: false },
  	month_stripe_price_key: { type: String, required: true },
  	year_stripe_price_key: { type: String, required: true },
  	month_price: { type: Number, required: true },
  	year_price: { type: String, required: true },
  	status: { type: String, enum : ['0', '1'], default: '1' },
  	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

const getPlanById = async (id) => {

	return mongoose.model('Plan').findOne({"_id":id});
}
const updateMonthPlan = async (id,month_stripe_price_key) => {
	const query2 = { "_id": id };
	const update = { $set: {month_stripe_price_key: month_stripe_price_key } };
	const options = {};

	return mongoose.model('Plan').findByIdAndUpdate(query2, update, options);
}
const updateYearPlan = async (id,year_stripe_price_key) => {
	const query2 = { "_id": id };
	const update = { $set: {year_stripe_price_key: year_stripe_price_key } };
	const options = {};

	return mongoose.model('Plan').findByIdAndUpdate(query2, update, options);
}

const PlansModal =  mongoose.model('Plan', plansSchema);

module.exports = {
	PlansModal,
	getPlanById,
	updateMonthPlan,
	updateYearPlan
}

