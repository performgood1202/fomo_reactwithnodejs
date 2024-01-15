const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js")
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const User = require('../models/user.js');
const Session = require('../models/session.js');
const club = require('../models/club.js');
const userData = require('../models/userData.js');
const Subscription = require('../models/subscription.js');
const SendEmail = require('../helpers/send-email.js')

const login = async (body, res) => {
	const response = new baseResponse(res);
	try {
		User.findOne({ email: body.email }, async (err, user) => {

			let result = { data: null, status: false, message: "Login issue", code: 202 };

			if(user == null || user == ""){
               result.message = 'User not exist.';
			}else{

				const validPassword = user.comparePassword(body.password);
				if(validPassword && validPassword == true) {
					if(user.status == '1') {
						let tokenObj = { email: body.email }
						let token = await jwtHelper.getToken(tokenObj);

						if(token) {
							setSession(user.email, token);

							let club_data = null;



							if(user && user._id){
								const club_data = await this.getClubData(user.roleId,user._id);

								let obj = {
									token,
									user,
									clubData : club_data,

								}
								result.data = obj;
								

							}else{
								let obj1 = {
									token,
									user,
									clubData : club_data,

								}
								result.data = obj1;

							}

							
							
							result.code = 200;
							result.status = true;
							result.message = "";
						}
					} else {
						result.message = 'User has been disabled.';
					}
				} else {
					result.message = 'Password invalid';
				}

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

const ForgotPassword = async (body, res) => {
	const response = new baseResponse(res);
	try {
		User.findOne({ email: body.email }, async (err, user) => {

			let result = { data: null, status: false, message: "Something went wrong!", code: 202 };

			if(user == null || user == ""){
               result.message = 'User not exist.';
			}else{

				let tokenObj = { email: body.email }
				let token = await jwtHelper.getToken(tokenObj);

				if(token) {

					setSession(user.email, token);

					await SendEmail.sendPasswordLinkEmail(user,token);

					let dataa = {
						message : "Please check email to reset password!"
					}

					result.code = 200;
					result.status = true;
					result.message = "";
					result.data = dataa;

				}else{
					result.message = 'Token error.';
				}

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
const ResetPassword = async (body, res) => {
	const response = new baseResponse(res);
	try {
		User.findOne({ _id: body.user_id }, async (err, user) => {

			let result = { data: null, status: false, message: "Something went wrong!", code: 202 };

			if(user == null || user == ""){
               result.message = 'User not exist.';
               response.sendResponse(result.data, result.status, result.message, result.code, null);
			}else{

                let session = await Session.findOne({ token: body.token, email: user.email }).then( 
							     async (session) => {
							                if(session && session._id){
                                                
                                                user.password = body.password;

												user.save((err) => {

										      		if(err) {
														// Check if error is a validation rror
														if (err.errors) {
															  for (const [key, value] of Object.entries(err.errors)) {
							                                     result.message = value.message;
							                                     break;
															  }
														} else {
															result.message = 'Password reset Issue.';
														}
										      		} else {
										      			// success message
										      			let user_data = {
										      				message: "Password successfully changed."
										      			}
										      			// success message
										      			result.status = true;
										      			result.message = "";
										      			result.code = statusCode.success;
										      			result.data = user_data;
										      		}

										      		response.sendResponse(result.data, result.status, result.message, result.code, null);
										      	});

							                }else{
							                	result.message = "Invalid link or expired!";
									    	    response.sendResponse(result.data, result.status, result.message, result.code, null);

							                }
							  			}
									).catch(
									    (error) => {
									    	result.message = error.message;
									    	response.sendResponse(result.data, result.status, result.message, result.code, null);
									    }
									) 
			}

			
		});
	} catch(err) {
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", 500, null);
	}

	return true;
}

const register = async (body, res) => {
	const response = new baseResponse(res);

	try {
		let user = new User({
            fName: body.fName,
            lName: body.lName,
            email: body.email.toLowerCase(),
            password: body.password,
            roleId: "4"
      	});

      	return user.save((err) => {
      		let result = { status: false, message: 'Register Issue', code: statusCode.nulledData };
      		if(err) {
				if (err.code === 11000) {
					result.message =  'E-mail already exists';
				} else {
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
				}
      		} else {
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      		}

      		response.sendResponse(null, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", statusCode.error, null);
	}

	return true;
}
const createAdmin = async (body, res) => {
	const response = new baseResponse(res);
	try {
		let user = new User({
            fName: "Fomoapp",
            lName: "admin",
            email: "sunil.kumar@xcelance.com",
            password: "Welcome@123",
            roleId: "1"
      	});

      	return user.save((err) => {
      		let result = { status: false, message: 'Register Issue', code: statusCode.nulledData };
      		if(err) {
				if (err.code === 11000) {
					result.message =  'E-mail already exists';
				} else {
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
				}
      		} else {
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      		}

      		response.sendResponse(null, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", statusCode.error, null);
	}

	return true;
}

const setSession = (email, token) => {
	try {
		Session.findOne({ email: email }, async (err, val) => {
			if(val && val.email) {
				val.token = token;
				val.ts = Date.now();

				val.updateOne(val, (err) => {});
			} else {
				let sess = new Session({
		            email,
		            token,
		            valid: '1'
		      	});
				sess.save();
			}
		});
	} catch(err) {
		console.log(err);
		throw err;
	}

	return true;
}

const getUserSession = async (token, req, res, next, send401) => {

	const response = new baseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {
		// Session.findOne({ token: token }).populate('userValue').exec(function(err, value) {
		Session.findOne({ token: token }).exec(function(err, value) {
		   	if(err) {
		   		response.sendResponse(null, false, "Authetication failed", 401, null);
		   	} else {
		   		if(value && value.email) {
		   			User.findOne({ email: value.email }).exec(function(err, user) {
		   				if(err) {
		   					response.sendResponse(null, false, "Email not match", 401, null);
		   				} else {
		   					if(user && user.email) {
		   						req.session = user;
            					next();
		   					} else {
		   						send401(res);
		   					}
		   				}
		   			});
		   		} else {
		   			response.sendResponse(null, false, "Authetication failed", 401, null);
		   		}
		   	}
		});
	} catch(err) {
		response.sendResponse(null, false, err.message, 401, null);
	}

	return true;
}
const getUserSessionForSocket = async (token) => {


	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		let session = await Session.findOne({ token: token }).then( 
			     async (session) => {
			                return session;
			  			}
					)

		if(session && session.email){

			let user = await User.findOne({ email:  session.email }).then( 
			     async (user) => {
			                return user;
			  			}
					)
			if(user && user._id){
   				return user;
   			}else{
   				return null;
   			}

		}else{
			return null;
		}
	} catch(err) {
		return null;
	}
}
const getManagerClub = async (userId) => {


	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		let body_UserData = {userId:userId};

		let user_data = await userData.findOne(body_UserData).then( 
		     async (userdata) => {
		                return userdata;
		  			}
				)

		let data_return = null;

		if(user_data && user_data.club_id){
			data_return =  {club_id : user_data.club_id};
		}
		return data_return;
	} catch(err) {
		return null;
	}
}

exports.getClubData = async(roleId,user_id) => {

	let clubDatas =  null;

	

    if(roleId == "2"){
		body_data = {user_id:user_id};

		


        club_data = await club.findOne(body_data).then( 
		     async (club) => {
		                return club;
		  			}
				)
        
        if(club_data && club_data.status){

        	clubDatas = club_data;

        	

        }
	}
	if(roleId == "3"){
		body_UserData = {userId:user_id};

		user_data = await userData.findOne(body_UserData).then( 
		     async (userdata) => {
		                return userdata;
		  			}
				)

		if(user_data && user_data.club_id){

			body_club = {_id:user_data.club_id};

        	
	        club_data = await club.findOne(body_club).then( 
			     async (club) => {
			                return club;
			  			}
					)
	        
	        if(club_data && club_data.status){

	        	clubDatas = club_data;

	        }

        }


	}
	return clubDatas;
	
}

const info = async(session, res) => {
	const response = new baseResponse(res);

	let club_data = null;



	if(session && session._id){

		const club_data = await this.getClubData(session.roleId,session._id);
		let obj = {
			user: session,
			clubData: club_data,
		}
		if(club_data && club_data._id){
			if(club_data.status == "1"){
				await checkSubscription(club_data);
			}
			
		}
	    response.sendResponse(obj, true, "", statusCode.success, null);

	}else{
		let obj1 = {
			user: session,
			clubData: club_data,
		}
	    response.sendResponse(obj1, true, "", statusCode.success, null);

	}

	
	return true;
}

const updateProfile = async(session, body, res) => {
	const response = new baseResponse(res);
	try{

		let id = session._id;

		let body_data_user = {};

        let and_data_user = [];


		and_data_user.push({phone:body.data.phone});
		
       
		and_data_user.push({ _id: { $ne: id } });

		body_data_user["$and"] = and_data_user;



	    await User.find(body_data_user).then( 
           async (userphoneDta) => {
           	
           	        if(userphoneDta.length < 1){
					        let update = {};

						    const query3 = { "_id": id };
						    if(body.path){
			                    update = { $set: {fName: body.data.fName,lName: body.data.lName, phone: body.data.phone,phone_country_code: body.data.phone_country_code, profileImage: body.path } };
						    }else{
			                    update = { $set: {fName: body.data.fName,lName: body.data.lName, phone: body.data.phone,phone_country_code: body.data.phone_country_code } };
						    }
							
							const options = {};
							User.findByIdAndUpdate(query3, update, options, function(err, res) {
					      		let result = { data: null, status: false, message: 'User Update Issue', code: statusCode.nulledData };
					      		if(err) {
									
										// Check if error is a validation rror
										if (err.errors) {
											  for (const [key, value] of Object.entries(err.errors)) {
			                                     result.message = value.message;
			                                     break;
											  }
										} else {
											result.message = 'Could not Update user.';
										}
					      		} else {

					      			if(body.data.club_name && body.data.club_name != undefined){

					      				let clubdata_body = {user_id:session._id};

							  			let update_clubData = {};

								        let update_data_parms = {};


									    update_data_parms["name"] = body.data.club_name;
									    update_data_parms["address"] = body.data.club_address;
									    update_data_parms["phone"] = body.data.club_phone;
									    update_data_parms["phone_country_code"] = body.data.club_phone_country_code;
									    update_data_parms["website"] = body.data.club_website;

									    if( body.data.lat != "" && body.data.lat != ""){

									    	update_data_parms["lat"] = body.data.lat;
									        update_data_parms["long"] = body.data.long;



									    }

									    update_clubData["$set"] = update_data_parms;

										club.find(clubdata_body).updateOne(clubdata_body,update_clubData).then( 
							                    async (club_data) => {

							                    }
							            ).catch(
										    (error) => {
										    	return;
										    }
										)
					      			}



					      			let user_data = {
					      				message: "User successfully updated."
					      			}
					      			// success message
					      			result.status = true;
					      			result.message = "";
					      			result.code = statusCode.success;
					      			result.data = user_data;
					      		}

					      		response.sendResponse(result.data, result.status, result.message, result.code, null);
					      	});
					}else{
           	       	  response.sendResponse(null, false,"Phone Number already exist", 500, null);
           	        }
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

const changePassword = async(session,body, res) => {
	const response = new baseResponse(res);
	try{
		let id = session._id;
		User.findOne({ _id: id }, async (err, user) => {


			if(user == null || user == ""){
               response.sendResponse(null, false, "User not exist.", 500, null);
			}else{
				const validPassword = await user.comparePassword(body.current_password);

				if(validPassword && validPassword == true) {

					user.password = body.new_password;

					user.save((err) => {
			      		let result = { data: null, status: false, message: "Password change Issue", code: statusCode.nulledData };
			      		if(err) {
							// Check if error is a validation rror
							if (err.errors) {
								  for (const [key, value] of Object.entries(err.errors)) {
                                     result.message = value.message;
                                     break;
								  }
							} else {
								result.message = 'Password change Issue.';
							}
			      		} else {
			      			// success message
			      			let user_data = {
			      				message: "Password successfully changed."
			      			}
			      			// success message
			      			result.status = true;
			      			result.message = "";
			      			result.code = statusCode.success;
			      			result.data = user_data;
			      		}

			      		response.sendResponse(result.data, result.status, result.message, result.code, null);
			      	});
				} else {
					response.sendResponse(null, false, "Password invalid.", 500, null);
				}

			}

		});
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const checkSubscription = async(club_data) => {
	try{


		Subscription.findOne({ club_id: club_data._id }, async (err, subscription) => {
		
			if(subscription && subscription.subscription_recurring_date){
				const cr_date = new Date();
				const rec_date = new Date(subscription.subscription_recurring_date);

				if(cr_date > rec_date){

					if(subscription.status  != "1"){

						update = { $set: {status: "0" } };

						club.findByIdAndUpdate({_id:club_data._id}, update, function(err, res) {

						});
					}
				}
			}

		});
		
	} catch(err){
		console.log( err.message );
	}
}

module.exports = {
	login,
	register,
	createAdmin,
	getUserSession,
	getUserSessionForSocket,
	info,
	updateProfile,
	changePassword,
	getManagerClub,
	ForgotPassword,
	ResetPassword
}