const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js")
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')

const User = require('../models/user.js');

const Session = require('../models/session.js');

const SettingModal = require('../models/setting.js');


const createAndUpdate = async (body, res) => {
	const response = new baseResponse(res);
	try {
		const query2 = { "setting_key": body.setting_key };
		const update = { $set: {"setting_key": body.setting_key, setting_value: body.setting_value } };
		const options = { upsert:true };

		SettingModal.updateOne(query2, update, options, function(err, res) {
      		let result = { data: null, status: false, message: 'Setting save Issue', code: statusCode.nulledData };
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
						result.message = 'Could not save setting.';
					}
      		} else {

      			let setting_data = {
      				message: "Setting successfully save."
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = setting_data;
      		}

      		response.sendResponse(result.data, result.status, result.message, result.code, null);
      	});



		
		
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, 500, null);
	}

	return true;
}

const saveSettings = async (session,body, res) => {
	const response = new baseResponse(res);
	try {

		const user_id = session._id;



		if(body.settings){
			for (const [key, setting] of Object.entries(body.settings)) {

	            const query2 = { "setting_key": key,  "user_id": user_id };
				const update = { $set: {"setting_key": key, setting_value: setting, user_id: user_id } };
				const options = { upsert:true };

				SettingModal.updateOne(query2, update, options).then( 
			        async (settingd) => {
			                return settingd;
			  		}
				)
			}
		}
		    let result = { data: null, status: false, message: ".", code: 202 };
			// success message
			result.status = true;
			result.message = "";
			result.code = statusCode.success;
			result.data = "";

  		response.sendResponse(result.data, result.status, result.message, result.code, null);
	
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, 500, null);
	}

	return true;
}
const getSettings = async (session,body, res) => {
	const response = new baseResponse(res);
	try {

		const user_id = session._id;

		 await SettingModal.find({user_id:user_id}).then( 
		           async (settings) => {
		           	        let result = { data: null, status: false, message: ".", code: 202 };

		           	        let settingss = {};

		           	        if(settings){
								for (const [key, setting] of Object.entries(settings)) {

						           settingss[setting.setting_key] = setting.setting_value;
								}
							}
							// success message
							let setting_data = {
								settingsData : settingss
							}
							result.status = true;
							result.message = "";
							result.code = statusCode.success;
							result.data = setting_data;

					  		response.sendResponse(result.data, result.status, result.message, result.code, null);
			  			}
		  		).catch(
				    (error) => {
				    	response.sendResponse(null, false,  error.message, statusCode.error, null);
				    }
				)
	
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, 500, null);
	}

	return true;
}
const notificationStatus = async (body, res) => {
	const response = new baseResponse(res);
	try {


		    const setting_data = await SettingModal.findOne({setting_key:'notification_status'}).then( 
			        async (setting) => {
			                return setting;
			  		}
				)
		    let noti_status = "0";
		    if(setting_data && setting_data._id){
                   noti_status = setting_data.setting_value;
		    }
		    let result = { data: null, status: false, message: ".", code: 202 };
			// success message
			const data_message = {
				notificationStatus:noti_status
			}
			result.status = true;
			result.message = "";
			result.code = statusCode.success;
			result.data = data_message;

  		response.sendResponse(result.data, result.status, result.message, result.code, null);
	
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, 500, null);
	}

	return true;
}




module.exports = {
	createAndUpdate,
	saveSettings,
	notificationStatus,
	getSettings
}