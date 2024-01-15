const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js")
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const User = require('../models/user.js');
const Session = require('../models/session.js');
const PlansModal = require('../models/plans.js');


const fetch = async (body, res) => {
	const response = new baseResponse(res);
	try {
		PlansModal.find({}, async (err, plans) => {

			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch plans.';
					}
      		} else {
      			let plans_data = {
      				plans: plans
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err) {
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", 500, null);
	}

	return true;
}
const fetchApiPlans = async (body, res) => {
	const response = new baseResponse(res);
	try {
		PlansModal.find({status:1}, async (err, plans) => {

			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch plans.';
					}
      		} else {
      			let plans_data = {
      				plans: plans
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err) {
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", 500, null);
	}

	return true;
}
const create = async (body, res) => {
	const response = new baseResponse(res);
	try {
		let plans = new PlansModal({
            name: body.name,
            month_price: body.month_price,
            year_price: body.year_price,
      	});
		plans.save((err) => {
      		let result = {data: null,  status: false, message: 'Plan create Issue', code: statusCode.nulledData };
      		if(err) {
				
					// Check if error is a validation rror
					if (err.errors) {
						// Check if validation error is in the email field
						if (err.errors.email) {
							result.message = err.errors.email.message
						} else {
							// Check if validation error is in the username field
							if (err.errors.username) {
								result.message = err.errors.username.message;
							} else {
								// Check if validation error is in the password field
								if (err.errors.password) {
									result.message = err.errors.password.message;
								} else {
									result.message = err;
								}
							}
						}
					} else {
						result.message = 'Could not save user.';
					}
      		} else {
      			let plans_data = {
      				message: "Plans successfully save."
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}

      		response.sendResponse(result.data, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", 500, null);
	}

	return true;
}
const update = async (body, res) => {
	const response = new baseResponse(res);
	try {
		const query2 = { "_id": body.id };
		const update = { $set: {name: body.name, month_price: body.month_price, year_price: body.year_price } };
		const options = {};
		PlansModal.findByIdAndUpdate(query2, update, options, function(err, res) {
      		let result = { data: null, status: false, message: 'Plan Update Issue', code: statusCode.nulledData };
      		if(err) {
      			console.log("__________innererror:::: "+err);
				
					// Check if error is a validation rror
					if (err.errors) {
						// Check if validation error is in the email field
						if (err.errors.email) {
							result.message = err.errors.email.message
						} else {
							// Check if validation error is in the username field
							if (err.errors.username) {
								result.message = err.errors.username.message;
							} else {
								// Check if validation error is in the password field
								if (err.errors.password) {
									result.message = err.errors.password.message;
								} else {
									result.message = err;
								}
							}
						}
					} else {
						result.message = 'Could not Update Plan.';
					}
      		} else {

      			let plans_data = {
      				message: "Plan successfully updated."
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}

      		response.sendResponse(result.data, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		throw err;
		response.sendResponse(null, false, "Something went wrong", 500, null);
	}

	return true;
}
const remove = async (body, res) => {
	const response = new baseResponse(res);
	try {

		PlansModal.findByIdAndRemove({ "_id": body.id }, function(err, res) {
      		let result = { data: null, status: false, message: 'Plans delete Issue', code: statusCode.nulledData };
      		if(err) {
      			console.log("__________innererror:::: "+err);
				
					// Check if error is a validation rror
					if (err.errors) {
						// Check if validation error is in the email field
						if (err.errors.email) {
							result.message = err.errors.email.message
						} else {
							// Check if validation error is in the username field
							if (err.errors.username) {
								result.message = err.errors.username.message;
							} else {
								// Check if validation error is in the password field
								if (err.errors.password) {
									result.message = err.errors.password.message;
								} else {
									result.message = err;
								}
							}
						}
					} else {
						result.message = 'Could not delete Plan.';
					}
      		} else {

      			let plans_data = {
      				message: "Plan successfully deleted."
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}

      		response.sendResponse(result.data, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		throw err;
		response.sendResponse(null, false, "Something went wrong", 500, null);
	}

	return true;
}

module.exports = {
	create,
	fetch,
	update,
	remove,
	fetchApiPlans
}