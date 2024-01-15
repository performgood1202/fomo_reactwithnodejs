require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let baseResponse = require("../../Util/baseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const StaffModal = require('../../models/staff.js');
const userData = require('../../models/userData.js');
const club = require('../../models/club.js');
const EventModal = require('../../models/events.js');
const Promotion = require('../../models/promotion.js');
const SettingModal = require('../../models/setting.js');
const promotionPriceModal = require('../../models/promotionPrice.js');
const Stripe = require('../../config/stripe.js');
const EventBenefitModal = require('../../models/benefit.js');
const EventImageModal = require('../../models/eventImage.js');
const Subscription = require('../../models/subscription.js');
const {PlansModal} = require('../../models/plans.js');
const SendEmail = require('../../helpers/send-email.js')
const paymentHistory = require('../../models/paymentHistory.js');
const Booking = require('../../models/booking.js');
const Orders = require('../../models/orders.js');
const notificationController = require('../notificationController.js');
let config = process.env;

const moment = require('moment');


const dashboardData = async (body, res) => {
	const response = new baseResponse(res);
	try {
		
		let result = { data: null, status: false, message: "Featch issue", code: 202 };
		let body_data = {club_id:body.club_id};

        let and_data = [];

        let cr_date  = moment(body.cr_date).utcOffset(0, true);

		cr_date = new Date(cr_date);

        and_data.push({event_end_date: {'$gte': cr_date}});


		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		let dashboardData = {totalUpcomingEvent:0, totalSeats:0, totalPromotion:0,upcommingEventData:[],totalEarning:0,yearEventData:null,yearOrderData:null};

 	    let bk_data =  await Booking.find({club_id:body.club_id,payment_status:"1",status:"1"})
				                  .then( async (bookings) => {	

				                   return bookings;
				            });
		if(bk_data && bk_data.length > 0){
            for (const [key, bk_d] of Object.entries(bk_data)) {
                 dashboardData.totalEarning = Number(bk_d.total_price) + dashboardData.totalEarning;
            }

		}		

		let order_data =  await Orders.find({club_id:body.club_id,status:"3"})
				                  .then( async (Orders) => {	
				                     
				                   return Orders;
				            });
		if(order_data && order_data.length > 0){
            for (const [key, order_d] of Object.entries(order_data)) {
                 dashboardData.totalEarning = Number(order_d.total_price) + dashboardData.totalEarning;
            }
		}	 

		let yearEventData = await getYearPaymentData("booking",body.club_id);
		let yearOrderData = await getYearPaymentData("order",body.club_id);

		dashboardData.yearEventData = yearEventData;
		dashboardData.yearOrderData = yearOrderData;





		const events = await EventModal.find(body_data).sort({'event_date': 1}).then( 
            async (events) => {
                    let eventDatas = [];

            	    if(events && events.length > 0){

            	    	for (const [key, eventsValues] of Object.entries(events)) {



            	    		var event_end_date = eventsValues.event_end_date;


            	    		eventsValues.status = 0;


            	    		if(event_end_date >= cr_date){

						    	eventsValues.status = 1;
						    	sort = 1;

						    }

            	    		const data_eventtt  = {event:eventsValues,benefit:[],images:[]};

            	    		const event_body = {eventid:eventsValues.id};

           	       	    	
                            const benefits =   await EventBenefitModal.find(event_body).then( 
				                                    async (benefits) => {
				                                        return benefits;
				                                    }
				                             ).catch(
											    (error) => {
											    	response.sendResponse(null, false,  error.message, statusCode.error, null);
											    }
											)

				            
				            if(benefits && benefits.length > 0){

				            	data_eventtt.benefit = benefits;
				            	
				            }  
				            const images =   await EventImageModal.find(event_body).then( 
				                                    async (images) => {
				                                        return images;
				                                    }
				                             ).catch(
											    (error) => {
											    	response.sendResponse(null, false,  error.message, statusCode.error, null);
											    }
											)

				            
				            if(images && images.length > 0){

				            	data_eventtt.images = images;
				            	
				            }  
				            eventDatas.push(data_eventtt);

				           
  
						}
            	    }
            	    return eventDatas;
	  		}
  		);

  		if(events && events.length > 0){

  			let upcoming_event = [];

            
            dashboardData.totalUpcomingEvent = events.length;

            count_seats = 0;

            events.forEach(function(event,index){

           	   if(event.event.avail_seats && event.event.avail_seats != "" ){

           	   	  count_seats = parseInt(event.event.avail_seats) + count_seats;

           	   }
           	   if(index < 4){
           	    	upcoming_event[index] = event;
           	   }

            });
            dashboardData.upcommingEventData = upcoming_event;
            dashboardData.totalSeats = count_seats;
  		}
  		const promotions = await Promotion.find({club_id:body.club_id}).then( 
           async (promotions) => {
                 return promotions; 
	  			}
  		);

  		if(promotions && promotions.length > 0){
           
           dashboardData.totalPromotion = promotions.length;
  		}

  		let dashboard_data = {
			dashboard: dashboardData
		}

		result.status = true;
		result.message = "";
		result.code = statusCode.success;
		result.data = dashboard_data;
		response.sendResponse(result.data, result.status, result.message, result.code, null);
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const managerCreate = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];

        let or_data = [];

		and_data.push({club_id:body.data.club_id});

		and_data.push({emp_code: body.data.emp_code });

		body_data["$and"] = and_data;

		await User.find({phone:body.data.phone}).then( 
           async (userphoneDta) => {

           	    if(userphoneDta.length < 1){


        

			        userData.find(body_data).then(userDDD => {	
			        	if(userDDD.length < 1){
							let userBody = new User({
								fName: body.data.first_name,
					            lName: body.data.last_name,
					            email: body.data.email.toLowerCase(),
					            phone: body.data.phone,
					            phone_country_code: body.data.phone_country_code,
					            profileImage: body.profileImage,
					            password: body.data.password,
					            roleId: '3'
							});

							userBody.save(async (err,user)  => {
								let result = {data: null,  status: false, message: 'Issue in creating manager.', code: statusCode.nulledData };
								if(err) {	
								        console.log(err);	
								        if (err.errors) {
											  for (const [key, value] of Object.entries(err.errors)) {
					                             result.message = value.message;
					                             break;
											  }
										}else if (err.code &&  err.code === 11000) {
											result.message =  'E-mail already exist!';
										} else {
											result.message = 'Could not create manager.';
										}				
									
					      		} else {

					      			const userId = user.id;

					      			let userDataBody = new userData({
										userId:userId,
										club_id: body.data.club_id,
										shift: body.data.shift,
										position: body.data.position,
										salary: body.data.salary,
										emp_code: body.data.emp_code,
							            hiring_date: body.data.hiring_date,
							            idProof: body.idProof,
									});

									const active_club_data = await userDataBody.save().then( 
							           async (userdata) => {
							           	        //console.log(userdata);
								  			}
							  		).catch(
									    (error) => {
									    	response.sendResponse(null, false,  error.message, statusCode.error, null);
									    }
									)

					      			let manager_data =  {
										message: "Manager successfully add."
									}
					      			// success message
					      			result.status = true;
						  			result.message = "";
						  			result.code = statusCode.success;
						  			result.data = manager_data;
								  	     
					      		}

					      		response.sendResponse(result.data, result.status, result.message, result.code, null);
							});
						}else{
							response.sendResponse(null, false,  "Employee code already exist", statusCode.error, null);
						}     	
					}).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)  
			    }else{
           	       	   response.sendResponse(null, false,  "Phone Number already exist", statusCode.error, null);
           	       }
	  		}		 
		).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)		 	

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const deleteManager = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];



		and_data.push({club_id:body.club_id});
		and_data.push({_id:body.user_id});

		body_data["$and"] = and_data;

		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		
		    User.find(body_data).deleteOne()
                  .then( async (data) => {	

                  	const userdata_body = {userId:body.user_id};

           	       	    	
                    const userdata =   await userData.find(userdata_body).deleteOne().then( 
		                                    async (userdata) => {
		                                        return userdata;
		                                    }
		                             )
                   
                  	let result = {data: null,  status: false, message: 'Issue in delete manager.', code: statusCode.nulledData };
					let event_data =  {
						message: "Successfully delete manager!"
					}
					result.status = true;
		  			result.message = "";
		  			result.code = statusCode.success;
		  			result.data = event_data;
		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
            }).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)	

		    

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const updateManager = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data_user = {};

        let and_data_user = [];

		and_data_user.push({phone:body.data.phone});

		and_data_user.push({ _id: { $ne: body.data.user_id } });

		body_data_user["$and"] = and_data_user;

		


		await User.find(body_data_user).then( 
           async (userphoneDta) => {

           	    if(userphoneDta.length < 1){

           	    	let body_data = {};

			        let and_data = [];

			        let or_data = [];

					and_data.push({club_id:body.data.club_id});

					and_data.push({emp_code: body.data.emp_code });

					and_data.push({ userId: { $ne: body.data.user_id } });

					body_data["$and"] = and_data;

				    userData.find(body_data).then(userDDD => {	
						if(userDDD.length < 1){

						        let update = {};

						        let update_data = {};

							    const query3 = { "_id": body.data.user_id };

							    update_data["fName"] = body.data.first_name;
							    update_data["lName"] = body.data.last_name;
							    update_data["phone"] = body.data.phone;
							    update_data["phone_country_code"] = body.data.phone_country_code;

							    if(body.profileImage && body.profileImage != "" && body.profileImage != null){
							    	 update_data["profileImage"] = body.profileImage;
							    }
							    if(body.data.password && body.data.password != "" && body.data.password != null){
							    	 update_data["password"] = body.data.password;
							    }
							   

							    update["$set"] = update_data;

								
								const options = {};
								User.findByIdAndUpdate(body.data.user_id, update, options, function(err, res) {

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

						      			let userdata_body = {userId:body.data.user_id,club_id:body.data.club_id};

						      			let update_userData = {};

								        let update_data_parms = {};


									    update_data_parms["shift"] = body.data.shift;
									    update_data_parms["position"] = body.data.position;
									    update_data_parms["salary"] = body.data.salary;
									    update_data_parms["emp_code"] = body.data.emp_code;
									    update_data_parms["hiring_date"] = body.data.hiring_date;

									    if(body.idProof && body.idProof != "" && body.idProof != null){
									    	 update_data_parms["idProof"] = body.idProof;
									    }
									   

									    update_userData["$set"] = update_data_parms;

						      			userData.find(userdata_body).updateOne(userdata_body,update_userData).then( 
						                        async (userData) => {
						                          return userData;
						                        }
						                 ).catch(
										    (error) => {
										    	response.sendResponse(null, false,  error.message, statusCode.error, null);
										    }
										)


						      			let user_data = {
						      				message: "manager successfully updated."
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
							response.sendResponse(null, false,  "Employee code already exist", statusCode.error, null);
						}     	
					}).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)
				}else{
					  response.sendResponse(null, false,  "Phone Number already exist", statusCode.error, null);
           	       }
	  			}
  		).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)	      	

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const getClubManagers = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {club_id:body.clubId};



	    userData.find(body_data).then( 
            async (userdata) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch managers.', code: statusCode.nulledData };
            	    let managers = [];
           	        if(userdata && userdata.length > 0){

           	       	   

           	       	    for (const [key, userdataValues] of Object.entries(userdata)) {

           	       	    	let body_data = {};

		                    let and_data = [];

		                    let or_data = [];

		                   /* var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

		                    if(format.test(body.search)){
		                    	body.search = "zzzzzzzzzz";
		                    }


		                    //let namee_search = body.search.replace(/[^a-zA-Z0-9]/g, '');
		                    let namee_search = body.search.replace(/[^a-zA-Z0-9]/g, '');*/

		                    if(body.search && body.search != ""){

		                    	var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

			                    if(format.test(body.search)){
			                    	body.search = "zzzzzzzzzz";
			                    }

			                    let namee_search = body.search.split(" ");


	           	       	    	if(namee_search[0] && namee_search[0] != undefined && namee_search[0] != ""){

									and_data.push({fName: {'$regex': namee_search[0],'$options' : 'i'}});

								}
								

								if(namee_search[1] && namee_search[1] != undefined && namee_search[1] != ""){

									and_data.push({lName: {'$regex': namee_search[1],'$options' : 'i'}});

								}
							}
							

							and_data.push({_id:userdataValues.userId});

							body_data["$and"] = and_data;

							if(or_data.length > 0 ){

								body_data["$or"] = or_data;

							}
                            
                            const userr =   await User.findOne(body_data).then( 
				                                    async (user) => {
				                                        return user;
				                                    }
				                             ).catch(
											    (error) => {
											    	response.sendResponse(null, false,  error.message, statusCode.error, null);
											    }
											)

				            
				            if(userr && userr._id){

				            	let data = {info:userdataValues,user:null};
				            	data.user = userr;
				            	managers.push(data);
				            }   

				           
  
						}

		           }
		            let manager_data =  {
						managerData: managers
					}
	      			// success message
	      			result.status = true;
		  			result.message = "";
		  			result.code = statusCode.success;
		  			result.data = manager_data;

		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
		  	}
  		).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)

		


	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}


const getManagerDetail = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {club_id:body.clubId,userId:body.userId};

	    userData.findOne(body_data).then( 
            async (userdata) => {

            	    let result = {data: null,  status: false, message: 'Issue in fetch managers.', code: statusCode.nulledData };
            	    let managerDetail = {};
           	        if(userdata ){

           	       	    	let body_data = {_id:userdata.userId}
                            
                            const userr =   await User.findOne(body_data).then( 
				                                    async (user) => {
				                                        return user;
				                                    }
				                             ).catch(
											    (error) => {
											    	response.sendResponse(null, false,  error.message, statusCode.error, null);
											    }
											)

				            
				            if(userr && userr._id){

				            	managerDetail = {info:userdata,user:userr};
				            }   


		           }
		            let manager_data =  {
						managerDetail: managerDetail
					}
	      			// success message
	      			result.status = true;
		  			result.message = "";
		  			result.code = statusCode.success;
		  			result.data = manager_data;

		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
		  	}
  		).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)

		


	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const createPromotion = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let club_body_data = {_id:body.data.club_id}
                            
        const club_data =   await club.findOne(club_body_data).then( 
                                async (club) => {
                                    return club;
                                }
                         ).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)
        if(club_data && club_data.stripe_customer_id)  {

        	let price_body = {_id:body.data.priceId};

        	const priceDat =   await promotionPriceModal.findOne(price_body).then( 
                                async (priceData) => {
                                    return priceData;
                                }
                         ).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)
            if(priceDat && priceDat._id){
            	if(priceDat.price && priceDat.price != ""){

            		var price = priceDat.price;
            		var hours = priceDat.time;
            		var position = priceDat.position;

            		var promotionDate = new Date(body.data.promotionDate);
                    promotionDate.setUTCHours(0,0,0,0);

					var promotionTillDate = new Date(promotionDate);
				    promotionTillDate.setUTCHours(promotionTillDate.getUTCHours() + hours);



				    let cr_date  = moment().utcOffset(0, true).toISOString();

		            cr_date = new Date(cr_date);


				    let body_data = {};

                    let and_data = [];



                    and_data.push({promotionStartDate: {'$lte': promotionDate}});

                    and_data.push({promotionEndDate: {'$gt':promotionDate}});



                    and_data.push({position: position});

                    body_data["$and"] = and_data;

            		const promotions_check = await Promotion.find(body_data).then( 
			            async (promotions) => {

			                return promotions;
			            	    
					  	}
			  		).catch(
					    (error) => {
					    	 response.sendResponse(null, false,error.message, statusCode.error, null);
					    }
					)

					if(promotions_check && promotions_check != undefined && Array.isArray(promotions_check) && promotions_check.length < 1){
                        //response.sendResponse(null, false, "Already not exist!", statusCode.error, null);
                        /* Create promo*/

                            const payPromotion = await Stripe.payPromotion(price,club_data.stripe_customer_id);

				        	if(payPromotion && payPromotion.transaction_id){

				        		let payment = new paymentHistory({
									  			club_id: club_data._id,
									  			user_id: club_data.user_id,
											  	price: price,
											  	payment_type: "promotion",
											  	txnId: payPromotion.transaction_id,
											  	status: "1",
									  		});
						  		payment.save().then((payment) => {
							  		console.log("subscription payment save : "+payPromotion.transaction_id);
							  	}).catch(
								    (error) => {
								    	return;
								    }
								)



				        		let promotionBody = new Promotion({
									club_id: body.data.club_id,
						            title: body.data.title,
						            hours: hours,
						            position: position,
						            promotionStartDate: promotionDate,
						            promotionEndDate: promotionTillDate,
						            promotionImage: body.promotionImage,
						            txnId: payPromotion.transaction_id,
						            price: price,
								});

								promotionBody.save(async (err,promotion)  => {
									let result = {data: null,  status: false, message: 'Issue in creating promotion.', code: statusCode.nulledData };
									if(err) {		
									        if (err.errors) {
												  for (const [key, value] of Object.entries(err.errors)) {
						                             result.message = value.message;
						                             break;
												  }
											} else {
												result.message = 'Could not create promotion.';
											}				
										
						      		} else {

						      			User.findOne({roleId:1}).then(
											async (superUser) => {

												if(superUser && superUser.id){
													let notification_link = "";

													if(promotion._id){
														notification_link = "/admin/promotion/"+promotion._id;
													}
													let message_noti = "<h3>"+club_data.name+" <span>has paid for Promotion.</span></h3>";

                                                    await notificationController.Save(message_noti,superUser.id,"Promotion","Club",notification_link);


												}
											}
										)


						      			
						      			let data =  {
											message: "Promotion successfully add."
										}
						      			result.status = true;
							  			result.message = "";
							  			result.code = statusCode.success;
							  			result.data = data;
									  	     
						      		}

						      		response.sendResponse(result.data, result.status, result.message, result.code, null);
								});

				        	}else if(payPromotion && payPromotion.error_message && payPromotion.error_message != null){
				                response.sendResponse(null, false, payPromotion.error_message, statusCode.error, null);
				        	}else{
				        		response.sendResponse(null, false, "Payment not completed", statusCode.error, null);
				        	}

                        /* End promo*/
					}else{
						response.sendResponse(null, false, "Already exist promotion. Please choose different position or hours!", statusCode.error, null);
					}


            	}else{
					response.sendResponse(null, false, "Price not fonud", statusCode.error, null);
				}
            }else{
            	response.sendResponse(null, false, "Prices not exist", statusCode.error, null);
            }            

           

        }else{
        	response.sendResponse(null, false, "Stripe Customer not exist", statusCode.error, null);
        }        
		

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}


const getPromotions = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);


		let body_data = {};

        let and_data = [];

        let or_data = [];



   	    if(body.search && body.search != undefined && body.search != ""){

			and_data.push({title: {'$regex': body.search,'$options' : 'i'}});

		}


		and_data.push({club_id:body.club_id});

		body_data["$and"] = and_data;
/*
		if(body.active){

			or_data.push({status: "1"});

		}
		if(body.inactive){
			or_data.push({status: "0"});
		}*/

		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}





	    Promotion.find(body_data).then( 
            async (promotions) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch managers.', code: statusCode.nulledData };

                    let promotionDatas = [];

            	    if(promotions && promotions.length > 0){

            	    	for (const [key, promotionValues] of Object.entries(promotions)) {




            	    		var promotionStartDate = new Date(promotionValues.promotionStartDate);

							var promotionEndDate = new Date(promotionValues.promotionEndDate);


						    promotionValues.status = null;

						    var sort;

						    if(cr_date > promotionStartDate && cr_date < promotionEndDate){

						    	promotionValues.status = 1;
						    	sort = 1;

						    }else if(promotionEndDate > cr_date){

						    	promotionValues.status  = 2;
						    	sort = 2;

						    } else if(promotionStartDate < cr_date){

						    	promotionValues.status  = 0;
						    	sort = 3;

						    }

						    var org_datas = {promotion:promotionValues,sort:sort};


						    if(!body.active && !body.inactive){
						    	promotionDatas.push(org_datas);
						    }else if(body.active && !body.inactive && promotionValues.status == "1"){
                                promotionDatas.push(org_datas);
						    }else if(body.inactive && !body.active && promotionValues.status == "0"){
						    	promotionDatas.push(org_datas);
						    }else if(body.active && body.inactive && (promotionValues.status == "0" || promotionValues.status == "1")){
						    	promotionDatas.push(org_datas);
						    }

						}
						promotionDatas.sort((a,b) => a.sort - b.sort);
            	    }

            	    
		            let data =  {
						promotionData: promotionDatas
					}

					//console.log(promotions);
	      			// success message
	      			result.status = true;
		  			result.message = "";
		  			result.code = statusCode.success;
		  			result.data = data;

		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
		  	}
  		).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)

		


	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const getPromotionDetail = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {};

        let and_data = [];

        let or_data = [];



   	    if(body.search && body.search != undefined && body.search != ""){
   	    	
   	    	let namee_search = body.search.replace(/[^a-zA-Z0-9]/g, '');

			and_data.push({title: {'$regex': namee_search,'$options' : 'i'}});

		}
		

		and_data.push({club_id:body.club_id});
		and_data.push({_id:body.promotion_id});

		body_data["$and"] = and_data;
/*
		if(body.active){

			or_data.push({status: "1"});

		}
		if(body.inactive){
			or_data.push({status: "0"});
		}*/

		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}



	    Promotion.findOne(body_data).then( 
            async (promotion) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch managers.', code: statusCode.nulledData };
            	    
		            let data =  {
						promotionDetail: promotion
					}
	      			// success message
	      			result.status = true;
		  			result.message = "";
		  			result.code = statusCode.success;
		  			result.data = data;

		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
		  	}
  		).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)

		


	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
/* save stripe account */
const saveStripeAccount = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		club.findOne({user_id:session._id}).then( 
                async (clubData) => {


                	if(clubData && clubData.stripe_account_id && clubData.stripe_account_id != ""){

                		let body_data = {
				            	stripe_account_id : clubData.stripe_account_id,
				            }

                		setupStripe(session,body_data,res);

                		/*const addBankAccount =  await Stripe.addBankAccount(clubData.stripe_account_id,body);

                		saveBankAccount(session,addBankAccount,res);*/

                	}else{

                		const addAcccount = await Stripe.addAcccount(session,body);


						if(addAcccount && addAcccount.id){
							let clubdata_body = {user_id:session._id};

				  			let update_clubData = {};

					        let update_data_parms = {};


						    update_data_parms["stripe_account_id"] = addAcccount.id;

						    update_clubData["$set"] = update_data_parms;

							club.find({user_id:session._id}).updateOne(clubdata_body,update_clubData).then( 
				                    async (club_data) => {

				                    }
				            );

				            let body = {
				            	stripe_account_id : addAcccount.id,
				            }

				            setupStripe(session,body,res);

				           /*const addBankAccount =  await Stripe.addBankAccount(addAcccount.id,body);
				           saveBankAccount(session,addBankAccount,res);*/

						}else{
							response.sendResponse(null, false, addAcccount, 500, null);
						}

                	}

                	/*if(addBankAccount && addBankAccount.id){
                      // console.log(addBankAccount)
                	}else{
                		response.sendResponse(null, false, addBankAccount, 500, null);
                	}*/

                }
        ).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)

		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const editBankDetails = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		const fetchStripeBankDetails =  await Stripe.editBankDetails(body.stripe_account_id,body.bank_account_id);


		if(fetchStripeBankDetails && fetchStripeBankDetails.url){


			let result = {};

        	let success_data =  {
				loginUrl: fetchStripeBankDetails.url
			}
			result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = success_data;
  			response.sendResponse(result.data, result.status, result.message, result.code, null);

		}else{
			response.sendResponse(null, false, fetchStripeBankDetails, 500, null);
		}
		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const fetchBankDetails = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		const fetchStripeBankDetails =  await Stripe.fetchStripeBankDetails(body.stripe_account_id);


		if(fetchStripeBankDetails && Array.isArray(fetchStripeBankDetails)){

			let result = {};

        	let success_data =  {
				bankDetails: fetchStripeBankDetails
			}
			result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = success_data;
  			response.sendResponse(result.data, result.status, result.message, result.code, null);

		}else{
			response.sendResponse(null, false, fetchStripeBankDetails, 500, null);
		}

		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const deleteStripeAccount = async (body, res) => {
	const response = new baseResponse(res);
	try{

		
		const deleteStripeAccount =  await Stripe.deleteStripeAccount(body.stripe_account_id);

        console.log(deleteStripeAccount)
		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const loginStripe = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		const loginStripeFunc =  await Stripe.loginStripeFunc(body.stripe_account_id);

		if(loginStripeFunc && loginStripeFunc.url){

			let result = {};

        	let success_data =  {
				loginUrl: loginStripeFunc.url
			}
			result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = success_data;
  			response.sendResponse(result.data, result.status, result.message, result.code, null);

		}else{
			response.sendResponse(null, false, loginStripeFunc, 500, null);
		}

		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const setupStripe = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		const setupStripe =  await Stripe.setupStripe(body.stripe_account_id);

		if(setupStripe && setupStripe.url){

			const datta = {stripe_account_id:body.stripe_account_id,setupUrl:setupStripe.url};

			let result = {};

        	let success_data =  {
				setupData: datta
			}
			result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = success_data;
  			response.sendResponse(result.data, result.status, result.message, result.code, null);

		}else{
			response.sendResponse(null, false, setupStripe, 500, null);
		}

		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const checkStripeAccountStatus = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		const checkStripeAccountStatus =  await Stripe.checkStripeAccountStatus(body.stripe_account_id);



		if(checkStripeAccountStatus && checkStripeAccountStatus.charges_enabled && checkStripeAccountStatus.payouts_enabled){

			let clubdata_body = {user_id:session._id};

  			let update_clubData = {};

	        let update_data_parms = {};


		    update_data_parms["stripe_account_status"] = "1";

		    update_clubData["$set"] = update_data_parms;

			club.find({user_id:session._id}).updateOne(clubdata_body,update_clubData).then( 
                    async (club_data) => {
                    	let result = {};

                    	let success_data =  {
							accountVarify: "Account varified!"
						}
						result.status = true;
			  			result.message = "";
			  			result.code = statusCode.success;
			  			result.data = success_data;
			  			response.sendResponse(result.data, result.status, result.message, result.code, null);
                        
                    }
            ).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)

		}else if(checkStripeAccountStatus && checkStripeAccountStatus.id){
			response.sendResponse(null, false, "", 500, null);
		}else{
			response.sendResponse(null, false, checkStripeAccountStatus, 500, null);
		}

		
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const getSubscription = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		    club.findOne({user_id:session._id}).then( 
                    async (club_data) => {
                    	if(club_data && club_data._id){

                    		Subscription.findOne({club_id: club_data._id}).then( 
				                    async (subscription) => {
				                    	if(subscription && subscription._id){


                                            const data = {subscription:subscription,plan:null};

				                    		const plandata = await PlansModal.findOne({_id: subscription.plan_id}).then( 
								                    async (plan) => {
								                    	return plan;
								                        
								                    }
								            )

								            if(plandata && plandata._id){
								            	data.plan = plandata;
								            }
								            let result = {};

					                    	let success_data =  {
												subscriptionData: data
											}
											result.status = true;
								  			result.message = "";
								  			result.code = statusCode.success;
								  			result.data = success_data;
								  			response.sendResponse(result.data, result.status, result.message, result.code, null);
				                    	}
				                        
				                    }
				            ).catch(
							    (error) => {
							    	response.sendResponse(null, false,  error.message, statusCode.error, null);
							    }
							)

                    	}
                        
                    }
            ).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const cancelSubscription = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		
		    club.findOne({user_id:session._id}).then( 
                    async (club_data) => {
                    	if(club_data && club_data._id){

                    		Subscription.findOne({club_id: club_data._id}).then( 
				                    async (subscription_data) => {
				                    	if(subscription_data && subscription_data._id){

				                    		const cancelStripeSubscription =  await Stripe.cancelStripeSubscription(subscription_data.stripe_subscription_id);


				                    		if(cancelStripeSubscription && cancelStripeSubscription.id){

				                    			    let subdata_body = {_id:subscription_data._id};

										  			let update_subData = {};

											        let update_data_parms = {};


												    update_data_parms["status"] = "2";

												    update_subData["$set"] = update_data_parms;

													Subscription.find(subdata_body).updateOne(subdata_body,update_subData).then( 
										                    async (sub_update_data) => {

										                    let site_url = config.SITE_URL;
											  				let clubEmail = await SendEmail.sendCancelSubToUser(session,site_url);
											  				let adminEmail = await SendEmail.sendCancelSubToAdmin(club_data);	

										                    let result = {};

									                    	let success_data =  {
																message: "Successfully cancel subscription"
															}
															result.status = true;
												  			result.message = "";
												  			result.code = statusCode.success;
												  			result.data = success_data;
												  			response.sendResponse(result.data, result.status, result.message, result.code, null);

										                        
										            }).catch(
													    (error) => {
													    	response.sendResponse(null, false,  error.message, statusCode.error, null);
													    }
													)

				                    		}else{

				                    			response.sendResponse(null, false,  cancelStripeSubscription, statusCode.error, null);

				                    		}


				                    	}
				                        
				                    }
				            ).catch(
							    (error) => {
							    	response.sendResponse(null, false,  error.message, statusCode.error, null);
							    }
							)

                    	}
                        
                    }
            ).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)
		
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const subscribePlan = async (session, body, res) => {
	const response = new baseResponse(res);
	try{

		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);

		    await club.findOne({user_id:session._id}).then( 
                    async (club_data) => {
                    	if(club_data && club_data.stripe_customer_id){

                    		   await Subscription.findOne({club_id:club_data._id}).then( 
					                    async (subscription_data) => {
					                    	if(subscription_data && subscription_data._id){

					                    		await PlansModal.findOne({_id:body.plan_id}).then( 
									                    async (plan) => {
									                    	if(plan && plan._id){

									                    		let price_id = "";

									                    		if(body.plan_type == "0"){

                                                                    price_id = plan.month_stripe_price_key;

									                    		}else{

									                    			price_id = plan.year_stripe_price_key;
									                    		}
									                           
									                           
									                           const ownerSubscriptions = await Stripe.updateSubscription(body,subscription_data.stripe_subscription_id,club_data.stripe_customer_id,price_id);
                                                                if(ownerSubscriptions && ownerSubscriptions.id){


                                                                	    const total_price  = ownerSubscriptions.plan.amount / 100;

                                                                	    let recuDate  = cr_date;

																    	if(ownerSubscriptions && ownerSubscriptions.current_period_end){

																	    	recuDate = new Date(ownerSubscriptions.current_period_end * 1000);

																	    }else{
																	    	if (body.plan_type == '0') {
																				recuDate.setMonth(recuDate.getMonth() + 1);
																			} else {
																				recuDate.setFullYear(recuDate.getFullYear() + 1);
																			}

																	    }

                                                               	        let subdata_body = {_id:subscription_data._id};

															  			let update_subData = {};

																        let update_data_parms = {};


																	    update_data_parms["stripe_subscription_id"] = ownerSubscriptions.id;
																	    update_data_parms["plan_id"] = plan._id;
																	    update_data_parms["price_id"] = price_id;
																	    update_data_parms["subscription_recurring_date"] = recuDate;
																	    update_data_parms["subscription_start_date"] = cr_date;

																	    if(body.auto_renew != "1"){

																	    	update_data_parms["status"] = "2";

																	    }else{
																	    	update_data_parms["status"] = "1";
																	    }

																	    update_subData["$set"] = update_data_parms;

																		Subscription.find({_id:subscription_data._id}).updateOne(subdata_body,update_subData).then( 
															                    async (sub_update_data) => {

															                    	let payment = new paymentHistory({
																						  			club_id: club_data._id,
																						  			user_id: club_data.user_id,
																								  	price: total_price,
																								  	payment_type: "subscription",
																								  	subscription_id: ownerSubscriptions.id,
																								  	status: "1",
																						  		});
																			  		payment.save().then((payment) => {
																			  			console.log("subscription payment save : "+ownerSubscriptions.id);
																				  	}).catch((error) => {
																	                    return;;
																	                })


															                    	let clubdata_body = {_id:club_data._id};

																		  			let update_clubData = {};

																			        let update_data_parms = {};


																				    update_data_parms["plan_type"] = body.plan_type;
																				    update_data_parms["status"] = "1";

																				    update_clubData["$set"] = update_data_parms;

																					club.find({_id:club_data._id}).updateOne(clubdata_body,update_clubData).then( 
																		                    async (update_club_data) => {

																		                    	return update_club_data;
																		                    	
																		                    }
																		            ).catch((error) => {
																	                    return;
																	                })



																	                let site_url = config.SITE_URL;
																	  				let clubEmail = await SendEmail.sendUpdatePlanInfoToUser(session,site_url);
																	  				let adminEmail = await SendEmail.sendUpdatePlanInfoToAdmin(club_data);


															                    	let result = {};

															                    	let success_data =  {
																						message: "Successfully plan subscribed!"
																					}
																					result.status = true;
																		  			result.message = "";
																		  			result.code = statusCode.success;
																		  			result.data = success_data;
																		  			response.sendResponse(result.data, result.status, result.message, result.code, null);
															                        
															                    }
															            ).catch(
																		    (error) => {
																		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
																		    }
																		)

                                                                }else{

                                                                 	response.sendResponse(null, false, "Plan not exist",ownerSubscriptions, null);

                                                                }
									                    	}else{
									                    		response.sendResponse(null, false, "Plan not exist", statusCode.error, null);
									                    	}
									                        
									                    }
									            ).catch(
												    (error) => {
												    	response.sendResponse(null, false,  error.message, statusCode.error, null);
												    }
												)
					                           

					                           //const ownerSubscriptions = await Stripe.updateSubscription(body,subscription.stripe_subscription_id,club_data.stripe_customer_id,price_id);

					                    	}else{
					                    		response.sendResponse(null, false, "Subscription not exist", statusCode.error, null);
					                    	}
					                        
					                    }
					            ).catch(
								    (error) => {
								    	response.sendResponse(null, false,  error.message, statusCode.error, null);
								    }
								)

                    	}else{
                    		response.sendResponse(null, false, "Stripe Customer not exist", statusCode.error, null);
                    	}
                        
                    }
            ).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)

		//const ownerSubscriptions = await ownerSubscriptions()

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const checkEvent = async () => {
	try{

	    let cr_date  = moment().utcOffset(0, true).toISOString();
        cr_date = new Date(cr_date);

	    let body_data_user = {};

        let and_data_user = [];

		and_data_user.push({payment_status:"1"});

		and_data_user.push({status:"1"});

		and_data_user.push({ vendor_payout_status: { $ne: "1" } });

		body_data_user["$and"] = and_data_user;

	    const events = await Booking.find(body_data_user).then( 
            async (bookings) => {

            	bookings.forEach(async function(booking,index){

            		   const events = await EventModal.findOne({_id:booking.event_id}).then( 
				            async (event) => {

				            	if(event && event._id){

				            			let event_date = event.event_date;

				            			event_date = new Date(event_date);

				            			event_date.setDate(event_date.getDate() - 1);


				            			if(cr_date >= event_date){

				            				await club.findOne({_id:event.club_id}).then( 
									            async (club) => {

									            	if(club && club._id && club.stripe_account_id){

									            		//console.log(club)

                                                        let price = booking.total_price;

                                                        let stripe_vendor_payment_intent_id = "";

                                                        if(booking.vendor_payout_status != "1"){

                                                        	if(booking.stripe_vendor_payment_intent_id && booking.stripe_vendor_payment_intent_id != ""){

                                                        		stripe_vendor_payment_intent_id = booking.stripe_vendor_payment_intent_id;

                                                        	}else{
                                             
		                                                        const transferToVendorData = await Stripe.transferToVendor(price,booking._id,club.stripe_account_id);

		                                                        if(transferToVendorData.id){

		                                                        	stripe_vendor_payment_intent_id = transferToVendorData.id;

		                                                        	let bookingdata_body = {_id:booking._id};

														  			let update_Data = {};

															        let update_data_parms = {};


																    update_data_parms["stripe_vendor_payment_intent_id"] = stripe_vendor_payment_intent_id;

																    update_Data["$set"] = update_data_parms;

																	const bk_data = await Booking.find(bookingdata_body).updateOne(bookingdata_body,update_Data).then( 
														                    async (bkk) => {
														                    	return bkk;

														                    }
														            );


		                                                        }
	                                                        }

	                                                        if(stripe_vendor_payment_intent_id != ""){

	                                                        	const transferToVendorConfirmData = await Stripe.transferToVendorConfirmData(stripe_vendor_payment_intent_id);

	                                                        	if(transferToVendorConfirmData.id && transferToVendorConfirmData.status && transferToVendorConfirmData.status == "succeeded"){

			                                                        	let bookingdata_body = {_id:booking._id};

															  			let update_Data = {};

																        let update_data_parms = {};


																	    update_data_parms["vendor_payout_status"] = "1";

																	    update_Data["$set"] = update_data_parms;

																		const bk_data = await Booking.find(bookingdata_body).updateOne(bookingdata_body,update_Data).then( 
															                    async (bkk) => {
															                    	return bkk;

															                    }
															            );

															            console.log("successfully send to vendor  "+ booking._id);


	                                                        	}else{
	                                                        		 console.log("transferToVendorConfirmData error");
	                                                        	}


	                                                        }else{
	                                                        	console.log("stripe_vendor_payment_intent_id empty");
	                                                        }
	                                                    }else{
	                                                    	console.log("already payout");
	                                                    }    


									            	}else{
									            		console.log("Club not exist");
									            	}

									            	


										  		}
									  		);

				            				
				            				
				            			}

				            	}

				            	


					  		}
				  		);



            	});
                

	  		}
  		);
	
		
	} catch(err){
		console.log(err.message)
	}
}
const fetchEarningData = async (session, body, res) => {
	const response = new baseResponse(res);
	try {

		    const body_data = {user_id: session._id };
        
            await club.findOne(body_data)
	                  .then( async (clubD) => {	
                     if(clubD && clubD._id){

                     	    /*  start */

                     	    let earningData = {eventEarning:0,orderEarning:0,orderEarningData:null,totalEarning:0,yearEventData:null,yearOrderData:null};

                     	    let bk_data =  await Booking.find({club_id:clubD._id,payment_status:"1",status:"1"})
									                  .then( async (bookings) => {	

									                   return bookings;
									            });
							if(bk_data && bk_data.length > 0){
                                for (const [key, bk_d] of Object.entries(bk_data)) {
                                     earningData.totalEarning = Number(bk_d.total_price) + earningData.totalEarning;
                                     earningData.eventEarning = Number(bk_d.total_price) + earningData.eventEarning;
                                }

                                let getBookingsWithOrderdata = await getBookingsWithOrder(bk_data,6);

                                if(getBookingsWithOrderdata && getBookingsWithOrderdata.length > 0){
                                	earningData.orderEarningData = getBookingsWithOrderdata;
                                }

							}		

							let order_data =  await Orders.find({club_id:clubD._id,status:"3"})
									                  .then( async (Orders) => {	
									                     
									                   return Orders;
									            });
							if(order_data && order_data.length > 0){
                                for (const [key, order_d] of Object.entries(order_data)) {
                                     earningData.totalEarning = Number(order_d.total_price) + earningData.totalEarning;
                                     earningData.orderEarning = Number(order_d.total_price) + earningData.orderEarning;
                                }
							}	 

							let yearEventData = await getYearPaymentData("booking",clubD.id);
							let yearOrderData = await getYearPaymentData("order",clubD.id);

							earningData.yearEventData = yearEventData;
							earningData.yearOrderData = yearOrderData;

							let result = {};

							let earning_data = {
			      				earningData: earningData
			      			}

			      			result.status = true;
			      			result.message = "";
			      			result.code = statusCode.success;
			      			result.data = earning_data;
			      			response.sendResponse(result.data, result.status, result.message, result.code, null);


                     	    /* end */

                     }else{
                     	response.sendResponse(null, false,  "Club not found", statusCode.error, null);
                     }
	                   
	            }).catch(
				    (error) => {
				    	response.sendResponse(null, false,  error.message, statusCode.error, null);
				    }
				)	


		
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const getBookingsWithOrder = async (bookings,pagination = 99999999999999999999999) => {

	try{

		let bookings_data = [];

		let kkk = 0;



		for (const [keyBooking, booking] of Object.entries(bookings)) {

			if(kkk < pagination){

				let booking_inner = {booking : booking, orderData : null , customer : null ,event_id : booking.event_id ,booking_status : null };





				/*start*/

				let orders = await Orders.find({booking_id:booking._id,status:"3"}).then( 
		            async (orders) => {

		            let order_data = [];
		            let order_total_price = 0;
		            let booking_status = 0;
		            let orders_status = [];
		            if(orders && orders.length > 0){
			             for (const [key, order] of Object.entries(orders)) {

		                        /*start*/

		                        const order_data_params = {order:order};
		                        
		                        order_data.push(order);

		                        order_total_price = order_total_price + Number(order.total_price);

		                        orders_status.push( order.status );

		                        /*end */

			             }
			        }   

			        if(orders_status.includes('0')){
	                    booking_status = "0";
			        }else if(orders_status.includes('1')){
	                    booking_status = "1";
			        }else if(orders_status.includes('2')){
	                    booking_status = "2";
			        }else if(orders_status.includes('3')){
	                    booking_status = "3";
			        }

			       



			        if(order_data && order_data.length > 0){


			        	let final_data = {orders:order_data,order_total_price:order_total_price,booking_status:booking_status};


	                
	                    return final_data;


			        }else{
			        	return [];
			        }

			        

		                
		        });

		         


		        if(orders && orders.orders &&  orders.orders.length > 0){

			        booking_inner.orderData = orders;

			        if(orders.booking_status){
			        	booking_inner.booking_status = orders.booking_status;
			        }

			        

			        let customerData = await User.findOne({_id:booking.user_id}).then( 
			            async (customer) => {
		                      return customer;
			        })


			        if(customerData && customerData._id){
			        	booking_inner.customer = customerData;
			        	bookings_data.push(booking_inner);
			        }
		        }


				/*end*/
				kkk++;
			}	



		}

		if(bookings_data.length > 0){
			bookings_data.sort((a,b) => a.booking_status - b.booking_status);
		}


		return bookings_data;
		

	} catch(err){
		return null;
	}
	return null;
}
const getYearPaymentData = async (type,club_id) => {


	

	const FIRST_MONTH = 1
	const LAST_MONTH = 12
	const MONTHS_ARRAY = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]

	let TODAY = new Date();
	let YEAR_BEFORE = new Date(TODAY.getFullYear()+"-01-01 12:00:00");

	let Modal = Orders;
	let match_data = {};

	if(type == "booking"){
		Modal = Booking;
        match_data =  { status : "1", payment_status: "1", club_id : club_id, createdAt: { $gte: YEAR_BEFORE, $lte: TODAY } };
	}else{
		Modal = Orders;
        match_data =  { status : "3", club_id : club_id, createdAt: { $gte: YEAR_BEFORE, $lte: TODAY } };

	}

	
    

	const datat = await Modal.aggregate( [
	  { 
	      $match: match_data,
	  },
	  { 
	      $group: {
	            _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
	            sum: {
			        $sum: "$total_price",
			    },
	      } 
	  },
	  {
	      $sort: { "_id.year_month": 1 }
	  },
	  { 
	      $project: { 
	          _id: 0, 
	          sum: 1, 
	          month_year: { 
	              $concat: [ 
	                 { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
	                 "-", 
	                 { $substrCP: [ "$_id.year_month", 0, 4 ] }
	              ] 
	          }
	      } 
	  },
	  { 
	      $group: { 
	          _id: null, 
	          data: { $push: { k: "$month_year", v: "$sum" } }
	      } 
	  },
	  { 
	      $addFields: { 
	          start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
	          end_year: { $substrCP: [ TODAY, 0, 4 ] },
	          months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
	          months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
	      } 
	  },
	  { 
	      $addFields: { 
	          template_data: { 
	              $concatArrays: [ 
	                  { $map: { 
	                       input: "$months1", as: "m1",
	                       in: {
	                           count: 0,
	                           month_year: { 
	                               $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
	                           }                                            
	                       }
	                  } }, 
	                  { $map: { 
	                       input: "$months2", as: "m2",
	                       in: {
	                           count: 0,
	                           month_year: { 
	                               $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
	                           }                                            
	                       }
	                  } }
	              ] 
	         }
	      }
	  },
	  { 
	      $addFields: { 
	          data: { 
	             $map: { 
	                 input: "$template_data", as: "t",
	                 in: {   
	                     k: "$$t.month_year",
	                     v: { 
	                         $reduce: { 
	                             input: "$data", initialValue: 0, 
	                             in: {
	                                 $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
	                                              { $add: [ "$$this.v", "$$value" ] },
	                                              { $add: [ 0, "$$value" ] }
	                                 ]
	                             }
	                         } 
	                     }
	                 }
	              }
	          }
	      }
	  },
	  {
	      $project: { 
	          data: { $arrayToObject: "$data" }, 
	          _id: 0 
	      } 
	  }
	] ).then( async (data) => {
	           	const dataaa = [];
	           	if(data && data.length > 0){
	           		const month_data = data[0].data;
	           		let kk = 1;

	           		for (const [key, value] of Object.entries(month_data)) {
	                    dataaa.push(value);
	                    kk++;
					}
	           	}
	           	return dataaa;

	        }).catch(
			    (error) => {
			    	return null;
			    }
			)
	return datat;		
}
const fetchOrderEarnings = async (session, body, res) => {
	const response = new baseResponse(res);
	try {

		    const body_data = {user_id: session._id };
        
            await club.findOne(body_data)
	                  .then( async (clubD) => {	
                     if(clubD && clubD._id){

                     	    /*  start */

                     	    let earningData = {eventEarning:0,orderEarning:0,orderEarningData:null,totalEarning:0,yearEventData:null,yearOrderData:null};

         	                await Booking.find({club_id:clubD._id,payment_status:"1",status:"1"})
						                  .then( async (bookings) => {	

						                     
						                    let getBookingsWithOrderdata = await getBookingsWithOrder(bookings);

						                    let result = {};

											let earning_data = {
							      				orderEarningData: getBookingsWithOrderdata
							      			}

							      			result.status = true;
							      			result.message = "";
							      			result.code = statusCode.success;
							      			result.data = earning_data;
							      			response.sendResponse(result.data, result.status, result.message, result.code, null);

						            }).catch((error) => {

									    	response.sendResponse(null, false,  error.message, statusCode.error, null);
									})
							

                     	    /* end */

                     }else{
                     	response.sendResponse(null, false,  "Club not found", statusCode.error, null);
                     }
	                   
	            }).catch(
				    (error) => {
				    	response.sendResponse(null, false,  error.message, statusCode.error, null);
				    }
				)	


		
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const fetchEventEarnings = async (session, body, res) => {
	const response = new baseResponse(res);
	try {

		    const body_data = {user_id: session._id };
        
            await club.findOne(body_data)
	                  .then( async (clubD) => {	
                     if(clubD && clubD._id){

                     	    /*  start */

                     	    let earningData = {eventEarning:0,orderEarning:0,orderEarningData:null,totalEarning:0,yearEventData:null,yearOrderData:null};

         	                await Booking.find({club_id:clubD._id,payment_status:"1",status:"1"})
						                  .then( async (bookings) => {	


						                  	let booking_data = [];


						                  	if(bookings && bookings.length > 0){
						                  		for (const [keyBooking, booking] of Object.entries(bookings)) {

						                  			let bk_return = {booking:booking,event:null};

						                  			let evnt_d = await EventModal.findOne({_id:booking.event_id})
						                                    .then( async (event) => {	
						                                    	return event;
						                                    })

						                            if(evnt_d && evnt_d._id){
						                            	 bk_return.event = evnt_d;
						                            	 booking_data.push(bk_return);
						                            }        



						                  		}
						                  	}

						                    let result = {};

											let earning_data = {
							      				eventEarningData: booking_data
							      			}

							      			result.status = true;
							      			result.message = "";
							      			result.code = statusCode.success;
							      			result.data = earning_data;
							      			response.sendResponse(result.data, result.status, result.message, result.code, null);

						            }).catch((error) => {

									    	response.sendResponse(null, false,  error.message, statusCode.error, null);
									})
							

                     	    /* end */

                     }else{
                     	response.sendResponse(null, false,  "Club not found", statusCode.error, null);
                     }
	                   
	            }).catch(
				    (error) => {
				    	response.sendResponse(null, false,  error.message, statusCode.error, null);
				    }
				)	


		
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
module.exports = {
	dashboardData,
	managerCreate,
	deleteManager,
	getClubManagers,
	getManagerDetail,
	updateManager,
	createPromotion,
	getPromotions,
	getPromotionDetail,
	saveStripeAccount,
	fetchBankDetails,
	loginStripe,
	setupStripe,
	checkStripeAccountStatus,
	editBankDetails,
	deleteStripeAccount,
	getSubscription,
	subscribePlan,
	cancelSubscription,
	checkEvent,
	fetchEarningData,
	fetchOrderEarnings,
	fetchEventEarnings
}