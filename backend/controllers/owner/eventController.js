require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let baseResponse = require("../../Util/baseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const EventModal = require('../../models/events.js');
const PerformanceModal = require('../../models/performance.js');
const EventBenefitModal = require('../../models/benefit.js');
const EventImageModal = require('../../models/eventImage.js');
const Booking = require('../../models/booking.js');
const Club = require('../../models/club.js');
const {getDistance,geolib,convertDistance} = require('geolib');

const moment = require('moment');

const firebaseController = require('../firebaseController.js');

const create = async (body, res) => {
	const response = new baseResponse(res);
	try{
		/*body.data.eventDate = "2022-10-07";
		body.data.eventTime = "07:01";
		body.data.hours = "1";
		//body.data.club_id = "2";*/

		const eventDate = new Date(body.data.eventDate);
		const eventTime = body.data.eventTime.split(":");
		eventDate.setUTCHours(eventTime[0],eventTime[1],0,0);


		var event_end_date = new Date(moment(eventDate,'YYYY-MM-DD HH:mm'));
		event_end_date.setHours(event_end_date.getHours() + parseInt(body.data.hours));




        var filter_data =  { '$and' : [ 
                        { '$or' : [ 
                                    { '$and': [ { event_date: {'$lte': eventDate} } , { event_end_date: {'$gte': eventDate} } ] },

                                    { '$and': [ { event_date: {'$gte': eventDate} }, { event_date: {'$lte':event_end_date} } ] },

                                    { '$and': [ { event_end_date: {'$gte': eventDate} }, { event_end_date: {'$lte':event_end_date} } ] },

                                ] },  



                        {club_id : body.data.club_id}

                    ] };
      //   console.log(body_data)

		const event_check = await EventModal.findOne(filter_data).then( 
            async (event) => {

              /*start*/

                if(event  && event._id){

                	
                    
                    response.sendResponse(null, false,"Event already exist", statusCode.error, null);


                }else{



					let event = new EventModal({
						title	: body.data.title,
						event_date : eventDate,
						event_end_date : event_end_date,
						hours : body.data.hours,
						event_time : body.data.eventTime,
						avail_seats : body.data.seats,
						avail_guest_seats : body.data.guest_seats,
						booking_price : body.data.price,
						performerName : body.data.performerName,
						performerDescription : body.data.performerDescription,
						performerImage : body.performerImage,
						club_id : body.data.club_id,
						// event_images : ,			
					});

					event.save()
					.then(async data => {		
			             
			            let {benefits} =  body.data;
			            let {eventImages} =  body;

			            if(benefits.length > 0){
			            	benefits.forEach(function(value,index){
			            		if(value != ""){
			            			let benefit = new EventBenefitModal({
										benefit: value,
										eventid: data._id
									});
									benefit.save();

			            		}
			            	})
			            }
			            if(eventImages.length > 0){
			            	eventImages.forEach(function(eventImage,index){
			            		if(eventImage != ""){
			            			let image = new EventImageModal({
										image: eventImage,
										eventid: data._id
									});
									image.save();

			            		}
			            	})
			            }

			            await sendNotiToNearByUser(data);

						
						let result = {data: null,  status: false, message: 'Issue in creating event.', code: statusCode.nulledData };
						let event_data =  {
							message: "Successfully add event!"
						}
						result.status = true;
			  			result.message = "";
			  			result.code = statusCode.success;
			  			result.data = event_data;
			  			response.sendResponse(result.data, result.status, result.message, result.code, null);
					}).catch( (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					});
				}	

              /*end*/
            	    
		  	}
  		).catch(
		    (error) => {
		    	 response.sendResponse(null, false,error.message, statusCode.error, null);
		    }
		)





	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const sendNotiToNearByUser = async (event) => {

	try{
		
		const clubD = await Club.findOne({_id:event.club_id}).then( 
            async (clubDD) => {

            	if(clubDD){
            		if(clubDD.lat && clubDD.long){
            			let lat = clubDD.lat;
            			let long = clubDD.long;

            			    const userD = await User.find({"lat": { "$exists" : true, "$ne" : "" }, "long": { "$exists" : true, "$ne" : "" }, "roleId": "4"}).then( 
					            async (userr) => {

					            	if(userr && userr.length > 0){
						            	userr.forEach(async function(user,index){

						            		if(user.lat && user.long && user.device_token){
							            		let gettt = getDistance(
												    { latitude: lat, longitude: long },
												    { latitude: user.lat, longitude: user.long }
												);

												var dist = convertDistance(gettt, 'km');

												if(dist <= 50){
													let titlee = "New Event!";
		                                            let textt = clubDD.name+" added new event!";
		                                            let params = {
		                                                "type" : "event",
		                                                "event_id" : event.id,
		                                                "club_id" : clubDD.id,
		                                            }
		                                            await firebaseController.sendNotification(titlee,textt,params,user);
												}

												
											}
										});	
					            	}

					        }).catch(
							    (error) => {
							    	return;
							    }
							)


            		}
            	}

        }).catch(
		    (error) => {
		    	return;
		    }
		)

	} catch(err){
		console.log(err.message);
	}

}
const update = async (body, res) => {
	const response = new baseResponse(res);
	try{


		let update = {};

        let update_data = {};


	    const query3 = { "_id": body.data.event_id };

	    const eventDate = new Date(body.data.eventDate);
		const eventTime = body.data.eventTime.split(":");
		eventDate.setUTCHours(eventTime[0],eventTime[1],0,0);

		var event_end_date = new Date(moment(eventDate,'YYYY-MM-DD HH:mm'));

	    event_end_date.setHours(event_end_date.getHours() + parseInt(body.data.hours));


		var filter_data =  { '$and' : [ 
                        { '$or' : [ 
                                    { '$and': [ { event_date: {'$lte': eventDate} } , { event_end_date: {'$gte': eventDate} } ] },

                                    { '$and': [ { event_date: {'$gte': eventDate} }, { event_date: {'$lte':event_end_date} } ] },

                                    { '$and': [ { event_end_date: {'$gte': eventDate} }, { event_end_date: {'$lte':event_end_date} } ] },

                                ] },  



                        {club_id : body.data.club_id},
                        {"_id": { $ne: body.data.event_id }}

                    ] };
      //   console.log(body_data)

		const event_check = await EventModal.findOne(filter_data).then( 
            async (event) => {

              /*start*/

                if(event  && event._id){
                    
                    response.sendResponse(null, false,"Event already exist", statusCode.error, null);


                }else{
		
					   



					    update_data["title"] = body.data.title;
					    update_data["event_date"] = eventDate;
					    update_data["event_end_date"] = event_end_date;
					    update_data["hours"] = body.data.hours;
					    update_data["event_time"] = body.data.eventTime;
					    update_data["avail_seats"] = body.data.seats;
					    update_data["avail_guest_seats"] = body.data.guest_seats;
					    update_data["booking_price"] = body.data.price;
					    update_data["performerName"] = body.data.performerName;
					    update_data["performerDescription"] = body.data.performerDescription;

					    if(body.performerImage && body.performerImage != "" && body.performerImage != null){
					    	 update_data["performerImage"] = body.performerImage;
					    }

					    update["$set"] = update_data;

					    EventModal.findByIdAndUpdate(body.data.event_id, update)
						.then(data => {		
				             
				            let {benefits} =  body.data;
				            let {eventImages} =  body;


				            EventBenefitModal.find({"eventid":body.data.event_id}).deleteMany()
				                  .then(data => {	
				                  	if(benefits.length > 0){
						            	benefits.forEach(function(value,index){
						            		if(value != ""){
						            			let benefit = new EventBenefitModal({
													benefit: value,
													eventid: body.data.event_id
												});
												benefit.save();

						            		}
						            	})
						            }
				            });	

				           
				            if(eventImages.length > 0){
				            	eventImages.forEach(function(eventImage,index){
				            		if(eventImage != ""){
				            			let image = new EventImageModal({
											image: eventImage,
											eventid: body.data.event_id
										});
										image.save();
				            		}
				            	})
				            }
							
							let result = {data: null,  status: false, message: 'Issue in creating event.', code: statusCode.nulledData };
							let event_data =  {
								message: "Successfully update event!"
							}
							result.status = true;
				  			result.message = "";
				  			result.code = statusCode.success;
				  			result.data = event_data;
				  			response.sendResponse(result.data, result.status, result.message, result.code, null);
						}).catch( (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						});
                }	

              /*end*/
            	    
		  	}
  		).catch(
		    (error) => {
		    	 response.sendResponse(null, false,error.message, statusCode.error, null);
		    }
		)
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const deleteEventImage = async (body, res) => {
	const response = new baseResponse(res);
	try{
		
		    EventImageModal.find({"_id":body._id}).deleteOne()
                  .then(data => {	
                  	let result = {data: null,  status: false, message: 'Issue in delete event image.', code: statusCode.nulledData };
					let event_data =  {
						message: "Successfully delete event image!"
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
const deleteEvent = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];



		and_data.push({club_id:body.club_id});
		and_data.push({_id:body.event_id});

		body_data["$and"] = and_data;

		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		
		    EventModal.find(body_data).deleteOne()
                  .then( async (data) => {	

                  	const event_body = {eventid:body.event_id};

           	       	    	
                    const benefits =   await EventBenefitModal.find(event_body).deleteMany().then( 
		                                    async (benefits) => {
		                                        return benefits;
		                                    }
		                             )
                    const images =   await EventImageModal.find(event_body).deleteMany().then( 
				                                    async (images) => {
				                                        return images;
				                                    }
				                             )

                  	let result = {data: null,  status: false, message: 'Issue in delete event.', code: statusCode.nulledData };
					let event_data =  {
						message: "Successfully delete event!"
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
const fetch = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {};

        let and_data = [];

        let or_data = [];



   	    if(body.search && body.search != undefined && body.search != ""){
   	    	
   	    	let namee_search = body.search.replace(/[^a-zA-Z0-9]/g, '');

			and_data.push({title: {'$regex': body.search,'$options' : 'i'}});

		}
		

		and_data.push({club_id:body.club_id});

		body_data["$and"] = and_data;

		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);



		if(body.upcomming && !body.past){

			and_data.push({event_end_date: {'$gte': cr_date }});

		}else if(body.past && !body.upcomming){

			and_data.push({event_end_date: {'$lt': cr_date }});
		}

		if(!body.upcomming && !body.past){
			and_data.push({event_end_date: {'$gte': cr_date }});
		}


		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}



	    EventModal.find(body_data).sort({'event_date': 1}).then( 
            async (events) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch events.', code: statusCode.nulledData };

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


            	    


            	    
		            let data =  {
						eventData: eventDatas
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
const fetchDetail = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {};

        let and_data = [];

        let or_data = [];

		and_data.push({club_id:body.club_id});
		and_data.push({_id:body.event_id});

		body_data["$and"] = and_data;

		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}

		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);



	    EventModal.findOne(body_data).then( 
            async (event) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch events.', code: statusCode.nulledData };


            	    if(event){


            	    		var event_end_date = event.event_end_date;

            	    		event.status = 0;


            	    		if(event_end_date >= cr_date){

						    	event.status = 1;

						    }

            	    		const data_eventtt  = {event:event,benefit:[],images:[],event_booked:0};

            	    		const event_body = {eventid:event.id};



           	       	    	
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

				            const booking_data_func =  await Booking.find({event_id:event._id,payment_status:"1",status: { $ne: "2" }}).sort({"booking_id":-1}).then((bk_data) => {
                                                return bk_data;
                                          })
                            let booking_data = [];
				            if(booking_data_func){

				            	$bkk = 0;

				            	for (const [key_booking, booking] of Object.entries(booking_data_func)) {

						            let booking_dd = {booking:booking,customer:null};
                                    
                                    const cust_data =  await User.findOne({_id:booking.user_id}).then((usr_data) => {
                                                return usr_data;
                                          })

                                    if(cust_data && cust_data._id){
                                    	booking_dd.customer =  cust_data;
                                    	if($bkk < 7){
	                                    	booking_data.push(booking_dd);
	                                    }
	                                    $bkk++;
                                    }
                                    data_eventtt.event_booked++;

								}

				            }

				            let data =  {
								eventDetail: data_eventtt,
								bookingData: booking_data,
							}
			      			// success message
			      			result.status = true;
				  			result.message = "";
				  			result.code = statusCode.success;
				  			result.data = data;

            	    }

            	    
		           

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
/*Bookings*/
const bookings = async (session, body, res) => {

      const response = new baseResponse(res);

      try{

         const user_id = session._id

         EventModal.findOne({_id:body.event_id,club_id:body.club_id}).then( 
            async (event) => {

               if(event && event._id){

               	    let booking_body_data = {event_id:body.event_id};

					        let booking_and_data = [];

					        let booking_or_data = [];

					        booking_and_data.push({payment_status: "1"});
					        booking_and_data.push({status: { $ne: "2" }});



			   	      if(body.guest_list && !body.tickets){

									booking_and_data.push({is_guest: "1"});

								}
								if(body.tickets && !body.guest_list){

									booking_and_data.push({is_guest: {"$ne" : "1"}});
								}
						        /* join  */
								if(booking_and_data.length > 0){

									booking_body_data["$and"] = booking_and_data;
								}
                     Booking.find(booking_body_data).sort({"booking_id":-1}).then( 
                       async (bookings) => {

                          // console.log()

                            let booking_data = [];
				            if(bookings){

				            	for (const [key_booking, booking] of Object.entries(bookings)) {

						            let booking_dd = {booking:booking,event,customer:null};

						            let body_data = {_id:booking.user_id};

							        let and_data = [];

							        let or_data = [];



							   	    if(body.search && body.search != ""){

				                    	var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

					                    if(format.test(body.search)){
					                    	body.search = "zzzzzzzzzz";
					                    }

					                    let namee_search = body.search.split(" ");


			           	       	    	if(namee_search[0] && namee_search[0] != undefined && namee_search[0] != ""){

											or_data.push({fName: {'$regex': namee_search[0],'$options' : 'i'}});
											or_data.push({phone: {'$regex': namee_search[0],'$options' : 'i'}});

										}
										

										if(namee_search[1] && namee_search[1] != undefined && namee_search[1] != ""){

											and_data.push({lName: {'$regex': namee_search[1],'$options' : 'i'}});

										}
									}
									if(and_data.length > 0){

										body_data["$and"] = and_data;
									}
									if(or_data.length > 0){

										body_data["$or"] = or_data;
									}
				                                    
                                    const cust_data =  await User.findOne(body_data).then((usr_data) => {
                                                return usr_data;
                                          })

                                    if(cust_data && cust_data._id){
                                    	booking_dd.customer =  cust_data;
                                    	booking_data.push(booking_dd);
                                    }

								}

				            }

                           let data_return = {
                                 eventBookingData : booking_data
                           }



                            let result = {};
                           // success message
                            result.status = true;
				  			result.message = "";
				  			result.code = statusCode.success;
				  			result.data = data_return;

                           response.sendResponse(result.data, result.status, result.message, result.code, null);

                       }
                     ).catch(
                         (error) => {
                           response.sendResponse(null, false,  error.message, statusCode.error, null);
                         }
                     )
               }else{

                	response.sendResponse(null, false,  "Event not found!", statusCode.error, null);
                  
               }

            }
         ).catch(
             (error) => {
               response.sendResponse(null, false,  error.message, statusCode.error, null);
             }
         )

      } catch(err) {
            //throw err;
           response.sendResponse(null, false,  err.message, statusCode.error, null);
      }
}
const assignTable = async (session, body, res) => {

      const response = new baseResponse(res);

      try{

        const user_id = session._id;

        Booking.find({event_id:body.event_id,table_no:body.table_no}).sort({"booking_id":-1}).then( 
           async (bookings) => {

               if(bookings && bookings.length > 0){

                   response.sendResponse(null, false,  "Table no already assign!", statusCode.error, null);

               }else{

               	    let booking_body = {event_id:body.event_id,_id:body.booking_id};

		  			let updateData = {};

			        let update_data_parms = {};


				    update_data_parms["table_no"] = body.table_no;

				    updateData["$set"] = update_data_parms;

					Booking.find(booking_body).updateOne(booking_body,updateData).then( 
		                    async (user_d) => {
		                    	let data_return = {
	                                 message : "Successfully assign table!"
		                        }



	                            let result = {};
	                           // success message
	                            result.status = true;
					  			result.message = "";
					  			result.code = statusCode.success;
					  			result.data = data_return;

	                           response.sendResponse(result.data, result.status, result.message, result.code, null);

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
                

      } catch(err) {
            //throw err;
           response.sendResponse(null, false,  err.message, statusCode.error, null);
      }
}

module.exports = {
	create,
	update,
	fetch,
	fetchDetail,
	deleteEvent,
	deleteEventImage,
	bookings,
	assignTable,
}