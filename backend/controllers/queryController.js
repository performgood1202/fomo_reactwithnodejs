require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js");
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const User = require('../models/user.js');
const Session = require('../models/session.js');
const queryModal = require('../models/query.js');
const SendEmail = require('../helpers/send-email.js');
const notificationController = require('./notificationController.js');

const create = async (body, res) => {
	const response = new baseResponse(res);
	try{

		User.findOne({roleId:1}).then(
			async (user) => {

				if(user && user._id){
					/*start*/

					    

					  

						let query = new queryModal({
							name		: body.name,
							email		: body.email,
							phone		: body.phone,
							message		: body.message,
							user_type	: body.user_type,
							query_type	: body.query_type,
							assign_to	: user._id,
						});



						query.save().then(
							async (query) => {
								let user_mail = await SendEmail.sendQueryMailToUser(query);
								let admin_mail = await SendEmail.sendQueryMailToAdmin(query,user.email);

								let notification_link = "";

								if(query._id){
									notification_link = "/admin/query/"+query._id;
								}

								let message_noti = "<h3>"+body.name+" <span>has a query.</span></h3>";

					            await notificationController.Save(message_noti,user.id,"Query","Contact",notification_link);

								let result = {data: null,  status: false, message: 'Issue in creating query.', code: statusCode.nulledData };
								let query_data =  {
									message: "Query send successfully!"
								}
					            result.status = true;
					  			result.message = "";
					  			result.code = statusCode.success;
					  			result.data = query_data;
					  			response.sendResponse(result.data, result.status, result.message, result.code, null);
							}
						)
						.catch(
						    (error) => {
						    	response.sendResponse(null, false, error.message, 500, null);;
						  	}
					  	)

					/*End*/



				}else{
					response.sendResponse(null, false,  "Something went wrong!", statusCode.error, null);
				}
				
			}
		)
		.catch(
		    (error) => {
		    	response.sendResponse(null, false, error.message, 500, null);
		  	}
	  	)
		/*let query = new queryModal({
			name		: body.name,
			email		: body.email,
			phone		: body.phone,
			message		: body.message,
			user_type	: body.user_type,
			query_type	: body.query_type,
		});

		query.save()
		.then(
			async (query) => {
				let user_mail = await SendEmail.sendQueryMailToUser(query);
				let admin_mail = await SendEmail.sendQueryMailToAdmin(query);
				return response.responser(statusCode.success , query, "query send successfully.");
			}
		)
		.catch(
		    (error) => {
		    	console.log(error);
		    	throw error;
		    	return response.responser(statusCode.Unauthorized , null, error.errors[Object.keys(error.errors)[0]].message);
		  	}
	  	)*/

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const fetchQuaries = async (session,body, res) => {
	const response = new baseResponse(res);
	try{

		queryModal.find({assign_to:session._id}).then(
			async (queries) => {
                let result = {data: null,  status: false, message: 'Issue in creating query.', code: statusCode.nulledData };
				let query_data =  {
					queryData: queries
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
const fetchQuaryDetail = async (session,body, res) => {
	const response = new baseResponse(res);
	try{


		queryModal.findOne({assign_to:session._id,_id:body.query_id}).then(
			async (query) => {
                let result = {data: null,  status: false, message: 'Issue in fetch query.', code: statusCode.nulledData };
				let query_data =  {
					queryDetailData: query
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
const resolveQuery = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		    let update = {};

	        let update_data = {};

		    update_data["status"] = "1";

		    update["$set"] = update_data;

		    queryModal.findByIdAndUpdate(body.query_id, update).then(data => {		
	             
	            
				let result = {data: null,  status: false, message: 'Issue in query.', code: statusCode.nulledData };
				let event_data =  {
					message: "Successfully resolved query!"
				}
				result.status = true;
	  			result.message = "";
	  			result.code = statusCode.success;
	  			result.data = event_data;
	  			response.sendResponse(result.data, result.status, result.message, result.code, null);

			}).catch( (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			});

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}


module.exports = {
	create,
	fetchQuaries,
	fetchQuaryDetail,
	resolveQuery
}
