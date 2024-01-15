require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js")
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const Session = require('../models/session.js');
const User = require('../models/user.js');
const club = require('../models/club.js');
const {PlansModal} = require('../models/plans.js');
const Subscription = require('../models/subscription.js');
const paymentHistory = require('../models/paymentHistory.js');
const SendEmail = require('../helpers/send-email.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const StripeConfig = require('../config/stripe.js')
let config = process.env;


const fetch = async (body, res) => {
	const response = new baseResponse(res);
	try {

		
		let clubsData = [];

		let body_data = {};

		let and_data = [];

		if(body.name && body.name != ""){

			and_data.push({name: {'$regex': body.name,'$options' : 'i'}});

		}
		if(body.plan_type && body.plan_type != ""){

			and_data.push({plan_type: body.plan_type});

		}
		and_data.push({status: { $ne: "3" }});

		let or_data = [];

		if(body.active){

			or_data.push({status: "1"});

		}
		if(body.inactive){
			or_data.push({status: "0"});
		}

		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}

       


		club.find(body_data,async (err, clubs) => {







			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch clubs.';
					}
      		} else {


      			
      			for (const [key, clubSingle] of Object.entries(clubs)) {


      				var club_data = {_id:clubSingle._id};


      				const club_d = await club.findOne(club_data).then( 
			         async (clubdata) => {
                                   return clubdata;
				  				//tempObj["subscription"] = subscription;
				  			}
			  		).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)


      				let clubObj = { _id: null,  name : null, status : null , plan_type : null , subscription : null , plan : null };
      				if(club_d._id){
      					clubObj._id = club_d._id;
      					clubObj.name = club_d.name;
      					clubObj.status = club_d.status;
      					clubObj.plan_type = club_d.plan_type;
      				}

      				if(clubObj._id){
      					var sub_data = {club_id:clubObj._id};



	      				


	      				const subscription = await Subscription.findOne(sub_data).then( 
				         async (subscription) => {
	                                   return subscription;
					  				//tempObj["subscription"] = subscription;
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)
						if(subscription && subscription._id){

							const subObj = { plan_id : subscription.plan_id, subscription_start_date : subscription.subscription_start_date,subscription_recurring_date : subscription.subscription_recurring_date, status : subscription.status };

							clubObj.subscription = subObj;

							var plan_data_params = {_id:subscription.plan_id};

							const plan = await PlansModal.findOne(plan_data_params).then( 
					         async (plan) => {
		                                   return plan;
						  				//tempObj["subscription"] = subscription;
						  			}
					  		).catch(
							    (error) => {
							    	response.sendResponse(null, false,  error.message, statusCode.error, null);
							    }
							)

							if(plan && plan._id){

								const planObj = { name : plan.name };

								clubObj.plan = planObj;

							}

						}
					}

					clubsData.push(clubObj);
      			}

      			let clubs_data = {
      				clubs: clubsData
      			}

      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = clubs_data;
      		}

      		
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
		
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const clubRequests = async (body, res) => {
	const response = new baseResponse(res);
	try {

		let data = {status:0};

		
		let clubsData = [];



		club.find(data, async (err, clubs) => {

			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch clubs.';
					}
      		} else {


      			
      			for (const [key, club] of Object.entries(clubs)) {


      				const clubObj = { _id: club._id,  name : club.name, status : club.status , plan_type : club.plan_type , subscription : null , plan : null };
      				


      				var sub_data = {club_id:club._id};


      				const subscription = await Subscription.findOne(sub_data).then( 
			         async (subscription) => {
                                   return subscription;
				  				//tempObj["subscription"] = subscription;
				  			}
			  		).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)
					if(subscription && subscription._id){

						const subObj = { plan_id : subscription.plan_id, subscription_start_date : subscription.subscription_start_date, status : subscription.status };

						clubObj.subscription = subObj;

						var plan_data_params = {_id:subscription.plan_id};

						const plan = await PlansModal.findOne(plan_data_params).then( 
				         async (plan) => {
	                                   return plan;
					  				//tempObj["subscription"] = subscription;
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)

						if(plan && plan._id){

							const planObj = { name : plan.name };

							clubObj.plan = planObj;

						}

					}

					clubsData.push(clubObj);
      			}

      			let clubs_data = {
      				clubs: clubsData
      			}

      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = clubs_data;
      		}

      		
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
		
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const recentClubRequests = async (body, res) => {
	const response = new baseResponse(res);
	try {

		let data = {status:0};

		
		let clubsData = [];



		club.find(data, async (err, clubs) => {

			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch clubs.';
					}
      		} else {


      			
      			for (const [key, club] of Object.entries(clubs)) {


      				const clubObj = { _id: club._id,  name : club.name, address : club.address, status : club.status , plan_type : club.plan_type , subscription : null , plan : null };
      				


      				var sub_data = {club_id:club._id};


      				const subscription = await Subscription.findOne(sub_data).then( 
			         async (subscription) => {
                                   return subscription;
				  				//tempObj["subscription"] = subscription;
				  			}
			  		).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)
					if(subscription && subscription._id){

						const subObj = { plan_id : subscription.plan_id, subscription_start_date : subscription.subscription_start_date, status : subscription.status };

						clubObj.subscription = subObj;

						var plan_data_params = {_id:subscription.plan_id};

						const plan = await PlansModal.findOne(plan_data_params).then( 
				         async (plan) => {
	                                   return plan;
					  				//tempObj["subscription"] = subscription;
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)

						if(plan && plan._id){

							const planObj = { name : plan.name };

							clubObj.plan = planObj;

						}

					}

					clubsData.push(clubObj);
      			}

      			let clubs_data = {
      				clubs: clubsData
      			}

      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = clubs_data;
      		}

      		
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		}).sort({_id: -1}).limit(6);
		
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const acceptClubRequest = async (body, res) => {
	const response = new baseResponse(res);
	try {

		club.findOne({ "_id": body.id }).then( 
               async (clubData) => {

               	    if(clubData && clubData.user_id){

               	    	User.findOne({ "_id": clubData.user_id }).then( 
				               async (user) => {

				               	    if(user && user._id){

				               	    	let genrtPass = generatePassword(18);

				               	    	user.password = genrtPass;

				               	    	user.save((err) => {
								      		let result = { data: null, status: false, message: "Password generate Issue", code: statusCode.nulledData };
								      		if(err) {
												// Check if error is a validation rror
												if (err.errors) {
													  for (const [key, value] of Object.entries(err.errors)) {
					                                    response.sendResponse(null, false,value.message, statusCode.error, null);;
					                                     break;
													  }
												} else {
													result.message = 'Password generate Issue.';
												}
								      		} else {

								      			/*start*/

								      			    const query = { "_id": body.id };
													const update = { $set: {status: "1" } };
													const options = {};

													club.findByIdAndUpdate(query, update, options).then( 
											               async (club) => {

											               	    let result = { data: null, status: false, message: "Featch issue", code: 202 };

											               	    let site_url = config.SITE_URL;


											               	    var userDatta = {};
											               	    userDatta["email"] = user.email;
											               	    userDatta["password"] = genrtPass;
											               	    userDatta["site_url"] = site_url;


											                    let sendmail = await SendEmail.sendAcceptClubRequestEmail(userDatta);

											                    let club_data = {
													  				message: "Club accept succssfully."
													  			}
													  			const query_payment = { "club_id": body.id  };
																const update_payment = { $set: {"status": "1" } };

																paymentHistory.find({club_id:body.id}).updateOne(query_payment, update_payment).then( 
															        async (paymentHis) => {
															                return paymentHis;
															  		}
																)
													  			

											                    result.status = true;
												      			result.message = "";
												      			result.code = statusCode.success;
												      			result.data = club_data;

												  				//let adminEmail = await SendEmail.sendClubInfoToAdmin(cclub);
												  				response.sendResponse(result.data, result.status, result.message, result.code, null);
												  			}
											  		).catch(function(error){

												    	response.sendResponse(null, false,  error.message, statusCode.error, null);
												    });


								      			/*end*/
								      			
								      		}

								      	});
				               	    	
				               	    }else{
				               	    	 response.sendResponse(null, false,  "User not exist!", statusCode.error, null);
				               	    }
					  			}
				  		).catch(function(error){

					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    });


               	    }else{
               	    	  response.sendResponse(null, false,  "Club not exist!", statusCode.error, null);
               	    }
	  			}
  		).catch(function(error){

	    	response.sendResponse(null, false,  error.message, statusCode.error, null);
	    });

		/*const query = { "_id": body.id };
		const update = { $set: {status: "1" } };
		const options = {};

		club.findByIdAndUpdate(query, update, options).then( 
               async (club) => {

               	    let result = { data: null, status: false, message: "Featch issue", code: 202 };

               	    let site_url = config.SITE_URL;


                    let sendmail = await SendEmail.sendAcceptClubRequestEmail(user,site_url);

                    let club_data = {
		  				message: "Club accept succssfully."
		  			}

                    result.status = true;
	      			result.message = "";
	      			result.code = statusCode.success;
	      			result.data = club_data;

	  				//let adminEmail = await SendEmail.sendClubInfoToAdmin(cclub);
	  				response.sendResponse(result.data, result.status, result.message, result.code, null);
	  			}
  		).catch(function(error){

	    	response.sendResponse(null, false,  error.message, statusCode.error, null);
	    });*/

	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const declineClubRequest = async (body, res) => {
	const response = new baseResponse(res);
	try {

		

		const sub_data = {club_id:body.id};

		const subscription = await Subscription.findOne(sub_data).then( 
		               async (subscription) => {



		               const refund_sub = await StripeConfig.refundSubscription(subscription);

		               if(refund_sub && refund_sub.status){

		               	        const query = { "_id": body.id };
								const update = { $set: {status:"2" } };
								const options = {};

		               	        club.findByIdAndUpdate(query, update, options).then( 
						               async (club) => {

						               	    let result = { data: null, status: false, message: "Featch issue", code: 202 };


						                    let sendmail = await SendEmail.sendDeclineClubRequestEmail(club);

						                    let club_data = {
								  				message: "Club decline succssfully."
								  			}
								  			const query_payment = { "club_id": body.id  };
											const update_payment = { $set: {"status": "2" } };

											paymentHistory.find({club_id:body.id}).updateOne(query_payment, update_payment).then( 
										        async (paymentHis) => {
										                return paymentHis;
										  		}
											)

						                    result.status = true;
							      			result.message = "";
							      			result.code = statusCode.success;
							      			result.data = club_data;

							  				//let adminEmail = await SendEmail.sendClubInfoToAdmin(cclub);
							  				response.sendResponse(result.data, result.status, result.message, result.code, null);
							  			}
						  		).catch(function(error){

							    	response.sendResponse(null, false,  error.message, statusCode.error, null);
							    });



		               }else{
		               	   response.sendResponse(null, false,  refund_sub, statusCode.error, null);
		               }

               	  
	  			}
  		).catch(function(error){

	    	response.sendResponse(null, false,  error.message, statusCode.error, null);
	    });

		/*
*/
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const getClubById = async (body, res) => {
	const response = new baseResponse(res);
	try {
		let data = {_id:body.id};

		
		let clubsData = [];



		club.findOne(data, async (err, club) => {

			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch Club.';
					}
      		} else {



      				const clubObj = { _id: club._id,  name : club.name, address : club.address, phone : club.phone,phone_country_code : club.phone_country_code, email : club.email,website : club.website, status : club.status , plan_type : club.plan_type , subscription : null , plan : null };
      				
                    

      				var sub_data = {club_id:club._id};


      				const subscription = await Subscription.findOne(sub_data).then( 
			         async (subscription) => {
                                   return subscription;
				  				//tempObj["subscription"] = subscription;
				  			}
			  		).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)
					if(subscription && subscription._id){

						const subObj = { plan_id : subscription.plan_id, subscription_start_date : subscription.subscription_start_date, subscription_recurring_date : subscription.subscription_recurring_date, status : subscription.status };

						clubObj.subscription = subObj;

						var plan_data_params = {_id:subscription.plan_id};

						const plan = await PlansModal.findOne(plan_data_params).then( 
				         async (plan) => {
	                                   return plan;
					  				//tempObj["subscription"] = subscription;
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)

						if(plan && plan._id){

							const planObj = { name : plan.name, month_price : plan.month_price, year_price : plan.year_price };

							clubObj.plan = planObj;

						}

					}

      			let clubs_data = {
      				clubData: clubObj
      			}

      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = clubs_data;
      		}

      		
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});

	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}

const remove = async (body, res) => {
	const response = new baseResponse(res);
	try {

        /* remove subscription */
		
		var sub_data = {club_id:body._id};


		const subscription = await Subscription.findOne(sub_data).then( 
		     async (subscription) => {
		                   return subscription;
		  			}
				).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)

		if(subscription && subscription.stripe_subscription_id){

		    const clubddd = await club.findOne({_id:body._id}).then( 
	               async (club) => {
                        return club;
		  			}
	  		);

	  		if(clubddd && clubddd._id){

	  			let deleted = {};


	  			if(clubddd.status  != "2"){

	  				deleted = await stripe.subscriptions.del(
					  subscription.stripe_subscription_id
					);

	  			}else{

	  				deleted.status = "canceled";

	  			}


			    

				if(deleted && deleted.status && deleted.status == "canceled"){
					const query = { "_id": body._id };
					const update = { $set: {status: "3" } };
					const options = {};

					 /* change status club */

					club.findByIdAndUpdate(query, update, options).then( 
			               async (club) => {

			               	        const query2 = { "_id": club.user_id };
									const update2 = { $set: {status: "0" } };

									 /* change status user */


			               	        User.findByIdAndUpdate(query2, update2, options).then( 
							               async (user) => {
							               	    let result = { data: null, status: false, message: "Update issue", code: 202 };



							                    let club_data = {
									  				message: "Club delete succssfully."
									  			}

							                    result.status = true;
								      			result.message = "";
								      			result.code = statusCode.success;
								      			result.data = club_data;

								  				//let adminEmail = await SendEmail.sendClubInfoToAdmin(cclub);
								  				response.sendResponse(result.data, result.status, result.message, result.code, null);
								  			}
							  		).catch(function(error){

								    	response.sendResponse(null, false,  error.message, statusCode.error, null);
								    });
				  			}
			  		).catch(function(error){

				    	response.sendResponse(null, false,  error.message, statusCode.error, null);
				    });
				}else{
					response.sendResponse(null, false,  "Delete subscription issue from stripe", statusCode.error, null);
				}
			}else{
				response.sendResponse(null, false,  "Club not found", statusCode.error, null);

			}	

			

		}		

	} catch(err) {
		//console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
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
	fetch,
	remove,
	recentClubRequests,
	clubRequests,
	getClubById,
	acceptClubRequest,
	declineClubRequest,
}