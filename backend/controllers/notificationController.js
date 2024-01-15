require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js");
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const User = require('../models/user.js');
const Session = require('../models/session.js');
const queryModal = require('../models/query.js');
const notificationModal = require('../models/notification.js');
const SendEmail = require('../helpers/send-email.js');
const socketController = require('./socketController');

const Save = async (message, assign_to, notification_type, notification_from, notification_link ) => {

    
    
    let notification = new notificationModal({
			message		      : message,
			assign_to	      : assign_to,
			notification_type : notification_type,
			notification_from : notification_from,
			notification_link : notification_link,
		});



		notification.save().then(
			async (query) => {
				await socketController.newNotificationRecived(assign_to, "send");
				return query;
			}
		);

	
}
const getNotificationCount = async (session,body, res) => {
    
    const response = new baseResponse(res);
	try{

		notificationModal.find({assign_to:session._id,read:0}).count().then(
			async (noti) => {
                let result = {data: null,  status: false, message: 'Issue in creating query.', code: statusCode.nulledData };
				let query_data =  {
					notificationCount: noti
				}
	            result.status = true;
	  			result.message = "";
	  			result.code = statusCode.success;
	  			result.data = query_data;
	  			response.sendResponse(result.data, result.status, result.message, result.code, null);


			}
		).catch((error) => {
		    	response.sendResponse(null, false, error.message, 500, null);
		  	}
	  	)

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	
}
const getNotifications = async (session,body, res) => {
    
    const response = new baseResponse(res);
	try{

		notificationModal.find({assign_to:session._id,read:0}).then(
			async (noti) => {
                let result = {data: null,  status: false, message: 'Issue in creating query.', code: statusCode.nulledData };
				let query_data =  {
					notificationData: noti
				}
	            result.status = true;
	  			result.message = "";
	  			result.code = statusCode.success;
	  			result.data = query_data;
	  			response.sendResponse(result.data, result.status, result.message, result.code, null);


			}
		).catch((error) => {
		    	response.sendResponse(null, false, error.message, 500, null);
		  	}
	  	)

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	
}
const readNotification = async (session,body, res) => {
    
    const response = new baseResponse(res);
	try{

		let data_body = {_id:body.notification_id,assign_to:session._id};

		let update_Data = {};

        let update_data_parms = {};


	    update_data_parms["read"] = "1";

	    update_Data["$set"] = update_data_parms;

		notificationModal.find(data_body).updateOne(data_body,update_Data).then( 
                async (noti) => {
                	await socketController.newNotificationRecived(session.id, "send");
                	let result = {};
                    let return_data =  {
						readNotificationData: "success"
					}
		            result.status = true;
		  			result.message = "";
		  			result.code = statusCode.success;
		  			result.data = return_data;
		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
                }
        ).catch(
		    (error) => {
		    	response.sendResponse(null, false, error.message, 500, null);
		    }
		)

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	
}
module.exports = {
	Save,
	getNotificationCount,
	getNotifications,
	readNotification
}
