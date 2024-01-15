require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js")
let baseResponse = require("../Util/baseResponse.js");
const dbConst = require("../Util/dbConstants.js");
const jwtHelper = require('../Util/jwtHelper')
const User = require('../models/user.js');
const Session = require('../models/session.js');
const PlansModal = require('../models/plans.js');
const Club = require('../models/club.js');
const paymentHistory = require('../models/paymentHistory.js');
const Subscription = require('../models/subscription.js');
const Promotion = require('../models/promotion.js');
const Stripe = require('../config/stripe.js')
const SendEmail = require('../helpers/send-email.js')
const notificationController = require('./notificationController.js');
let config = process.env;

const moment = require('moment');


const create = async (body, res) => {
	const response = new baseResponse(res);

	try{
		let checkSmtp = await SendEmail.checkSmtp();

		if(checkSmtp){

			if(checkSmtp.status == true){

				const checkExist = await checkUser(body);
				if(body.name != "" && body.email != "" && body.address != "" && body.phone != "" && body.price_id != "" && body.plan_id != ""){
					if(checkExist.status){
						if(checkExist.message == "no_data"){

						/* start */

						    User.findOne({ phone: body.phone}).then(async (userdd) => {
										if(userdd && userdd._id){

											return response.responser(statusCode.Unauthorized , null, "Phone Already exist!");

										}else{

											/*start*/
											    const customerSub = await Stripe.addNewCustomerAndSubscribe(body);
										  		if (typeof customerSub === 'string') {
										  			return response.responser(statusCode.Unauthorized , null, customerSub);
										  		}else if(customerSub && customerSub.plan && customerSub.plan.amount){

										  			const sub_price = customerSub.plan.amount / 100;

											  		const createUser = await registerUser(body);
											  		if (createUser.status) {
												  		let planType = '';
												  		if(body.plan_type == 'monthly'){
												  			planType = '0';
												  		}else if(body.plan_type == 'yearly'){
												  			planType = '1';
												  		}

												  		let club = new Club({
													  			name: body.name,
															  	email: body.email,
															  	address: body.address,
															  	phone: body.phone,
															  	phone_country_code: body.phone_country_code,
															  	website: body.website,
															  	stripe_customer_id: customerSub.customer,
															  	user_id: createUser.data.id,
															  	plan_type: planType,
															  	lat: body.lat,
															  	long: body.long,
													  		});

													  	club.save()
													  	.then((cclub) => {
													    	let recuDate = new Date(); 

													    	if(customerSub && customerSub.current_period_end){

														    	recuDate = new Date(customerSub.current_period_end * 1000);

														    }else{
														    	if (planType == '0') {
																	recuDate.setMonth(recuDate.getMonth() + 1);
																} else {
																	recuDate.setFullYear(recuDate.getFullYear() + 1);
																}

														    }
														    let sub_status = "1";

														    if(body.auto_renew != "1"){

														    	sub_status = "2";

														    }

													  		let subscription = new Subscription({
													  			club_id: cclub.id,
													  			stripe_subscription_id: customerSub.id,
															  	plan_id: body.plan_id,
															  	price_id: body.price_id,
															  	subscription_recurring_date: recuDate,
															  	status: sub_status,
													  		});
													  		subscription.save()
													  		.then(
														  			async (subscription) => {

												                    	let payment = new paymentHistory({
																			  			club_id: cclub._id,
																			  			user_id: cclub.user_id,
																					  	price: sub_price,
																					  	payment_type: "subscription",
																					  	subscription_id: customerSub.id,
																					  	status: "0",
																			  		});
																  		payment.save().then((payment) => {
																  			console.log("subscription payment save : "+ownerSubscriptions.id);
																	  	}).catch((error) => {
														                    return;;
														                })


														  				

														  				let site_url = config.SITE_URL;
														  				let clubEmail = await SendEmail.sendLoginDetailsToClubEmail(createUser,site_url);
														  				let adminEmail = await SendEmail.sendClubInfoToAdmin(cclub);

														  				User.findOne({roleId:1}).then(
																			async (superUser) => {

																				if(superUser && superUser.id){
																					let notification_link = "";

																					if(cclub._id){
																						notification_link = "/admin/club/"+cclub._id;
																					}
																					let message_noti = "<h3>"+body.name+" <span>has requested for subscription.</span></h3>";

								                                                    await notificationController.Save(message_noti,superUser.id,"Subscription","Club",notification_link);


																				}
																			}
																		)
														  				

														  				return response.responser(statusCode.success , subscription, "subscription created succssfully.")
														  			}
													  			)
														  		.catch(
																    (error) => {
																    	return response.responser(statusCode.Unauthorized , null, error);
																    }
																)
														}).catch((error) => {
														    return response.responser(statusCode.Unauthorized , null, error.errors[Object.keys(error.errors)[0]].message)
														});
												  	}else {
														return response.responser(statusCode.Unauthorized , null, createUser.message)
													}
												}else{
													return response.responser(statusCode.Unauthorized , null, "Subscription error!");
												}	
											 /*End*/

										}
									}			
								)
								.catch(
									(err) => {
										return response.responser(statusCode.Unauthorized , null, err.message);
									}
								);
						/* end */

							
						}else{
							return response.responser(statusCode.Unauthorized , null, checkExist.message);
						}
					}
				}else{

					return response.responser(statusCode.Unauthorized , null, "Please fill the required field!");

				}	
			}else{
				console.log(checkSmtp.message)

			   return response.responser(statusCode.Unauthorized , null,"Mail not working on server!");

			}	
		}else{

			return response.responser(statusCode.Unauthorized , null, "SMTP issue!");

		}	
	}catch(err){
		console.log(err);
		throw err;
		response.sendResponse(null, false, "Something went wrong", statusCode.error, null);
	}

	

	return true;
}

const checkUser = async (data) => {
	let result = { status: false, message: 'Fetch issue',data:null };
	let userRecord = User.find({ email: data.email.toLowerCase()})
	.then((user) => {
			if(Object.keys(user).length === 0){
				result.status = true;
      			result.message = "no_data";
      			result.data = '';
      			return result;
			}else{
				result.status = true;
      			result.message = "Email address already exists.";
      			result.data = '';
      			return result;
			}
		}			
	)
	.catch(
		(err) => {
			result.status = false;
  			result.message = "no_data";
  			result.data = '';
  			return result;
		}
	);
	return userRecord;
}

const registerUser = async (userRequest) => {
		let userEmail = userRequest.email.toLowerCase();
		let genrtPass = generatePassword(18);
		// console.log(dbConst.roles.clubOwner);
        
        let name = userRequest.name;

        name = name.split(" ");

        let fName = "";
        let lName = "";

        if(name && name[0] != undefined){
        	fName = name[0];
        }
        if(name && name[1] != undefined){
        	lName = name[1];
        }




		let user = new User({
            fName: fName,
            lName: lName,
            email: userEmail,
            phone: userRequest.phone,
            phone_country_code: userRequest.phone_country_code,
            password: genrtPass,
            roleId: dbConst.roles.clubOwner
      	});

		let result = { status: false, message: 'Register Issue',data:null };

		const responseUser = user.save()
		.then(
			(user) => {
				result.status = true;
      			result.message = "user saved";
      			result.data = {email:userEmail, password:genrtPass, id:user._id};
      			return result;
			}
			
		)
		.catch(
			(err) => {
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
				return result;
			}
		)

		return responseUser;
      	
}
const webhookEvent = async (event, res) => {
	const response = new baseResponse(res);

   
	try{

		if(event && event.type && event.type == "invoice.paid"){
            if(event.data && event.data.object && event.data.object.subscription){



            	const objects = event.data.object;


            	const lines = event.data.object.lines;

               


            	const subscription_id = event.data.object.subscription;

            	let end_sub = "";

            	if(lines && lines.data && lines.data.length > 0){
            		const line_data = lines.data;
            		line_data.forEach(function(line,index){

		           	   if(line.subscription && line.subscription == subscription_id){

		           	   	  if(line.period && line.period.end){
		           	   	  	end_sub = line.period.end;
		           	   	  }

		           	   }

		            });
            	}

            	let txnId = "";

            	if(event.data.object.charge){
            		txnId = event.data.object.charge;
            	}
                


            	const total_price  = objects.total / 100;

            	Subscription.findOne({stripe_subscription_id:subscription_id})
        	        .then( async (subscription) => {


		  				if(subscription && subscription.club_id){

		  					Club.findOne({_id:subscription.club_id})
			        	        .then( async (club) => {

					  				if(club && club._id){

					  					/*start*/


					  						paymentStatus = "1";
					  					
						  					let update_sub = {};

						  					let exist = 0;



						  					if(end_sub != ""){

						  						let recuDate = new Date(end_sub * 1000);

                                                let sub_rec_date = moment(recuDate).format('MM/DD/YYYY');
                                                let website_rec_date = moment(subscription.subscription_recurring_date).format('MM/DD/YYYY');
                                                if(sub_rec_date == website_rec_date){
                                                   exist = 1;
                                                }
						  						update_sub = { $set: {subscription_recurring_date : recuDate, status: "1" } };

						  						
						  					}else{

						  						update_sub = { $set: { status: "1" } };

						  					}
						  					

						  					if(exist == 0){

						  						console.log("exist")

							  					Subscription.find({stripe_subscription_id:subscription_id}).updateOne({stripe_subscription_id:subscription_id}, update_sub, function(err, res) {

												});


								  					let payment = new paymentHistory({
														  			club_id: club._id,
														  			user_id: club.user_id,
																  	price: total_price,
																  	payment_type: "subscription",
																  	subscription_id: subscription_id,
																  	txnId: txnId,
																  	status: paymentStatus,
														  		});
											  		payment.save().then((payment) => {
											  			console.log("subscription payment save : "+subscription_id);
												  		return response.responser(statusCode.success , null, "Save succssfully.")
												  	});
											}else{
												return response.responser(statusCode.success , null, "First Time club enter.")
											}	  	
										  	
										  	/*end*/



					  				}else{
					  					return response.responser(statusCode.success , null, "Club not found.")
					  				}
					  			}
				  			).catch(
							    (error) => {
							    	console.log(error.message)
							    	return response.responser(statusCode.Unauthorized , null, error.message);
							    }
							)


		  				}else{
		  					return response.responser(statusCode.success , null, "subscription not found.")
		  				}
		  			}
	  			).catch(
				    (error) => {
				    	console.log(error.message)
				    	return response.responser(statusCode.Unauthorized , null, error.message);
				    }
				)

            }
		}else if(event && event.type && event.type == "charge.succeeded"){

			return response.responser(statusCode.success , null, "charge success.")

			//const stripeResponse = await this.promotionChargeHook(event,res);

		}else{

			return response.responser(statusCode.success , null, "Hook execute.")

		}
		
	}catch(err){
		console.log(err.message);
		response.sendResponse(null, false, "Something went wrong", statusCode.error, null);
	}

	

	return true;
      	
}
exports.promotionChargeHook = async (event, res) => {
	const response = new baseResponse(res);


	try{


		   if(event.data && event.data.object && event.data.object.balance_transaction){

            	const objects = event.data.object;

            	const txnId = event.data.object.balance_transaction;

            	const total_price  = objects.amount / 100;

            	Promotion.findOne({txnId:txnId})
        	        .then( async (promotion) => {


		  				if(promotion && promotion.club_id){

		  					Club.findOne({_id:promotion.club_id})
			        	        .then( async (club) => {

					  				if(club && club._id){

					  					/*start*/


					  					paymentHistory.find({txnId:txnId})
						        	        .then( async (paymentHis) => {

								  				if(paymentHis && paymentHis.length < 1){

								  					/*start*/

									  					let payment = new paymentHistory({
															  			club_id: club._id,
															  			user_id: club.user_id,
																	  	price: total_price,
																	  	payment_type: "promotion",
																	  	txnId: txnId,
																	  	status: "1",
															  		});
												  		payment.save().then((payment) => {
													  		return response.responser(statusCode.success , null, "Save succssfully.")
													  	});
												  	
												  	/*end*/


								  				}
								  			}
							  			);

									  	/*end*/


					  				}
					  			}
				  			).catch(
							    (error) => {
							    	console.log(error.message)
							    	return response.responser(statusCode.Unauthorized , null, error.message);
							    }
							)


		  				}
		  			}
	  			).catch(
				    (error) => {
				    	console.log(error.message)
				    	return response.responser(statusCode.Unauthorized , null, error.message);
				    }
				)

            }

		

		
	}catch(err){
		

		response.sendResponse(null, false,err.message, statusCode.error, null);
	}

	

	return true;
      	
}

function generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var specialChars = "@#$%&*&@!)(";
  var allChars = numberChars + specialChars + upperChars + lowerChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

module.exports = {
	create,
	webhookEvent
}