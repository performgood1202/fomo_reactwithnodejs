require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let appBaseResponse = require("../../Util/appBaseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const userData = require('../../models/userData.js');
const Club = require('../../models/club.js');
const EventBenefitModal = require('../../models/benefit.js');
const EventModal = require('../../models/events.js');
const EventImageModal = require('../../models/eventImage.js');
const SettingModal = require('../../models/setting.js');
const Booking = require('../../models/booking.js');
let config = process.env;

const moment = require('moment');



const getEvents = async (params,body, res) => {

	const response = new appBaseResponse(res);

	

	try {


		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}
		cr_date = new Date(cr_date);

		let body_data = {};

        let and_data = [];

        and_data.push({event_end_date: {'$gte': cr_date}});

        if(body.search && body.search != ""){

			and_data.push({title: {'$regex': body.search,'$options' : 'i'}});

		}

        body_data["$and"] = and_data;

        var perPage = 10;

        let page = parseInt(params.page);

        page = page >= 1 ? page : 1;

        page = parseInt(page);

        let skippage = page - 1

       // var page = Math.max(0, body.page);

		const event_data = await EventModal.find(body_data).sort({'booking_count': -1}).limit(perPage)
            .skip(perPage * skippage).then( 
            async (events) => {

                    let eventDatas = [];

            	    if(events && events.length > 0){

            	    	let ev = 0;

            	    	for (const [key, eventsValues] of Object.entries(events)) {


            	    		var event_date = new Date(eventsValues.event_date);


					    	const data_eventtt  = {event:eventsValues,benefit:[],images:[]};

					    	const event_body = {eventid:eventsValues._id};

           	       	    	
                            const benefits =    await EventBenefitModal.find(event_body).then( 
				                                    async (benefits) => {
				                                        return benefits;
					                                    }
					                             );

				            
				            if(benefits && benefits.length > 0){

				            	data_eventtt.benefit = benefits;
				            	
				            }  
				            const images =   await EventImageModal.find(event_body).then( 
				                                    async (images) => {
				                                        return images;
				                                    }
				                             );

				            
				            if(images && images.length > 0){

				            	data_eventtt.images = images;
				            	
				            }  



					    	eventDatas.push(data_eventtt);
							   

				           
  
						}
            	    }

            	    let totalPage = await EventModal.find(body_data).count().then( 
                                async (count) => {
                                    return count;
                                    }
                            );

            	    totalPage = Math.ceil(totalPage / perPage);



            	    let send_data = {events:eventDatas,page:page,perPage:perPage,totalPage:totalPage}
            	    return send_data;
		  	}
  		);

  		let result = {};

  
		// success message
		result.status = 200;
		result.message = "";
		result.isSuccess = true;
		result.data = event_data;

  		response.sendResponse(result.status, result.message, result.isSuccess, result.data);

	} catch(err) {
		//throw err;
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}
const getClubEvent = async (postData,body, res) => {

	const response = new appBaseResponse(res);

	

	try {

		let cr_date = "";

		if(postData.cr_date){

			cr_date  = moment(postData.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);

		let body_data = {club_id:body.club_id};

        let and_data = [];

        and_data.push({event_end_date: {'$gte': cr_date}});

        body_data["$and"] = and_data;

        var perPage = 10;

        let page = parseInt(body.page);

        page = page >= 1 ? page : 1;

        page = parseInt(page);

        let skippage = page - 1

       // var page = Math.max(0, body.page);

		const event_data = await EventModal.find(body_data).sort({'event_date': 1}).limit(perPage)
            .skip(perPage * skippage).then( 
            async (events) => {

                    let eventDatas = [];

            	    if(events && events.length > 0){

            	    	let ev = 0;

            	    	for (const [key, eventsValues] of Object.entries(events)) {


            	    		var event_date = new Date(eventsValues.event_date);


					    	const data_eventtt  = {event:eventsValues,benefit:[],images:[]};

					    	const event_body = {eventid:eventsValues._id};

           	       	    	
                            const benefits =    await EventBenefitModal.find(event_body).then( 
				                                    async (benefits) => {
				                                        return benefits;
					                                    }
					                             );

				            
				            if(benefits && benefits.length > 0){

				            	data_eventtt.benefit = benefits;
				            	
				            }  
				            const images =   await EventImageModal.find(event_body).then( 
				                                    async (images) => {
				                                        return images;
				                                    }
				                             );

				            
				            if(images && images.length > 0){

				            	data_eventtt.images = images;
				            	
				            }  



					    	eventDatas.push(data_eventtt);
							   

				           
  
						}
            	    }

            	    let totalPage = await EventModal.find(body_data).count().then( 
                                async (count) => {
                                    return count;
                                    }
                            );

            	    totalPage = Math.ceil(totalPage / perPage);



            	    let send_data = {events:eventDatas,page:page,perPage:perPage,totalPage:totalPage}
            	    return send_data;
		  	}
  		);

  		let result = {};

  
		// success message
		result.status = 200;
		result.message = "";
		result.isSuccess = true;
		result.data = event_data;

  		response.sendResponse(result.status, result.message, result.isSuccess, result.data);

	} catch(err) {
		//throw err;
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}

const getEventDetail = async (body, res) => {

	const response = new appBaseResponse(res);

	

	try {

		let body_data = {_id:body.event_id};

       // var page = Math.max(0, body.page);

		const event_data = await EventModal.findOne(body_data).sort().then( 
            async (event) => {
            	    if(event && event._id){

            	    	const data_eventtt  = {event:event,club:null,user:null,benefit:[],images:[],tax:"",total_av_seats:event.avail_seats,total_guest_seats:event.avail_guest_seats};

            	    	/*const booking_count =    await Booking.find({event_id:event._id,status: { $ne: "2" }}).then( 
				                                    async (bk_data) => {
				                                            let bk_seat = 0;       

						                                    if(bk_data && bk_data.length > 0){


						                                          for (const [key, booking_data] of Object.entries(bk_data)) {

						                                                if(booking_data.is_guest && booking_data.is_guest == "1"){
							                                              
							                                            }else{
							                                               bk_seat = parseInt(booking_data.quantity) +  bk_seat; 
							                                            }

						                                          }

						                                    }  
						                                    return bk_seat;
					                                    }
					                             );

            	    	const booking_guest_count =    await Booking.find({event_id:event._id,status: { $ne: "2" }})
            	    	                                    .then(async( bk_data) => {
						                                    let bk_seat = 0;       

						                                    if(bk_data && bk_data.length > 0){


						                                          for (const [key, booking_data] of Object.entries(bk_data)) {

						                                             if(booking_data.is_guest && booking_data.is_guest == "1"){
						                                                bk_seat = parseInt(booking_data.quantity) +  bk_seat;
						                                             }

						                                             

						                                          }

						                                    }  
						                                    return bk_seat;
						                              })

                        if(booking_count){
                        	data_eventtt.total_av_seats = parseInt(event.avail_seats) - booking_count;
                        }
                        if(booking_guest_count){
                        	data_eventtt.total_guest_seats = parseInt(event.avail_guest_seats) - booking_guest_count;
                        }

*/


					    	

					    	const event_body = {eventid:event._id};

           	       	    	
                            const benefits =    await EventBenefitModal.find(event_body).then( 
				                                    async (benefits) => {
				                                        return benefits;
					                                    }
					                             );

				            
				            if(benefits && benefits.length > 0){

				            	data_eventtt.benefit = benefits;
				            	
				            }  
				            const clubData =    await Club.findOne({_id:event.club_id}).then( 
				                                    async (benefits) => {
				                                        return benefits;
					                                    }
					                             );

				            
				            if(clubData && clubData._id){

				            	data_eventtt.club = clubData;

				            	const userData =    await User.findOne({_id:clubData.user_id}).then( 
				                                    async (benefits) => {
				                                        return benefits;
					                                    }
					                             );

				            
					            if(userData && userData._id){

					            	data_eventtt.user = userData;
					            	
					            }
					            	
				            } 

				            const images =   await EventImageModal.find(event_body).then( 
				                                    async (images) => {
				                                        return images;
				                                    }
				                             );

				            const clubdata =   await Club.findOne({_id:event.club_id}).then( 
				                                    async (club) => {
				                                        return club;
				                                    }
				                             );

				            if(clubdata && clubdata._id){

				            	const settingdata =   await SettingModal.findOne({user_id:clubdata.user_id,"setting_key":"tax"}).then( 
				                                    async (setting) => {
				                                        return setting;
				                                    }
				                             );

				            	if(settingdata && settingdata._id){

				            		if(settingdata.setting_key == "tax"){
				            			data_eventtt.tax = settingdata.setting_value;
				            		}

				            	}

				            }

				            
				            if(images && images.length > 0){

				            	data_eventtt.images = images;
				            	
				            }  


				            /* Booking check*/

				            let booking_seats = 0;

					            let booking_data_count = await Booking.find({event_id:event._id,payment_status:"1",status: { $ne: "2" }}).then(async(bk_data) => {
	                                    let bk_seat = 0;       
	                                    let guest_seat = 0;       

	                                    if(bk_data && bk_data.length > 0){


	                                          for (const [key, booking_data] of Object.entries(bk_data)) {

	                                             if(booking_data.is_guest && booking_data.is_guest == "1"){
	                                                guest_seat = parseInt(booking_data.quantity) +  guest_seat;
	                                             }else{
	                                             	bk_seat = parseInt(booking_data.quantity) +  bk_seat;
	                                             }

	                                             

	                                          }

	                                    }  
	                                    return {bk_seat,guest_seat};
	                            })

	                        if(booking_data_count && booking_data_count.bk_seat)  {
	                        	data_eventtt.total_av_seats = event.avail_seats - booking_data_count.bk_seat;
	                        	data_eventtt.total_guest_seats = event.avail_guest_seats - booking_data_count.guest_seat;
	                        }





				            /* end */

				            let result = {};

  
							// success message
							result.status = 200;
							result.message = "";
							result.isSuccess = true;
							result.data = data_eventtt;

					  		response.sendResponse(result.status, result.message, result.isSuccess, result.data);
							   
            	    }else{
            	    	response.sendResponse(201, "No event found", false, null);
            	    }

            	    
		  	}
  		);

  		

	} catch(err) {
		//throw err;
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}


module.exports = {
	getEvents,
	getClubEvent,
	getEventDetail
}