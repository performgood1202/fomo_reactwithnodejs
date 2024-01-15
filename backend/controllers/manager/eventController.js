require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let baseResponse = require("../../Util/baseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const EventModal = require('../../models/events.js');
const PerformanceModal = require('../../models/performance.js');
const BenefitModal = require('../../models/benefit.js');

const create = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let event = new EventModal({
			title	: body.title,
			event_date : body.event_date,
			event_time : body.event_time,
			avail_tables : body.avail_table,
			booking_price : body.booking_price,
			// event_images : ,			
		});

		event.save()
		.then(data => {		
			let performance = new PerformanceModal({
				name: body.p_name,
				description: body.p_desc,
				// image: body.p_image,
				eventId : data._id
			});
			let benefit = new BenefitModal({
				post_benefits: body.benefits,
				eventid: data._id
			});
			let result = {data: null,  status: false, message: 'Issue in creating event.', code: statusCode.nulledData };
			result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = data;
  			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}


module.exports = {
	create
}