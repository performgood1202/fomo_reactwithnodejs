require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let appBaseResponse = require("../../Util/appBaseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const StaffModal = require('../../models/staff.js');
const userData = require('../../models/userData.js');
const Club = require('../../models/club.js');
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
let config = process.env;

const {getDistance,geolib,convertDistance} = require('geolib');

const moment = require('moment');


const dashboardData = async (session, body, res) => {

	const response = new appBaseResponse(res);

	

	try {

		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);

		if(body.latitude && body.longitude && session){

            let user_body = {_id:session._id};

  			let update_user = {};

	        let update_data_parms = {};

	        update_data_parms["lat"] = body.latitude;
	        update_data_parms["long"] = body.longitude;

		    update_user["$set"] = update_data_parms;

			await User.find(user_body).updateOne(user_body,update_user).then( 
                    async (user_data) => {
                    }
            ).catch(
			    (error) => {
			    	console.log("update lat error")
			    }
			)

		}


		let data_dash = {promotions:[],events:[],nearByClubs:[]}

		const pr_data = await Promotion.find().sort({'position': 1}).then( 
            async (promotions) => {

                    let promotionDatas = [];

            	    if(promotions && promotions.length > 0){

            	    	for (const [key, promotionValues] of Object.entries(promotions)) {


            	    		




            	    		var promotionStartDate = new Date(promotionValues.promotionStartDate);

							var promotionEndDate = new Date(promotionValues.promotionEndDate);


						    if(cr_date > promotionStartDate && cr_date < promotionEndDate){

						    	let pr_data = {detail:promotionValues,club:null};

	            	    		const club_d =    await Club.findOne({_id:promotionValues.club_id}).then( 
						                                    async (club) => {
						                                        return club;
							                                    }
							                             );

						            
					            if(club_d && club_d._id){

					            	pr_data.club = club_d;
					            	
					            }  

						    	promotionDatas.push(pr_data);

						    }
						    
						}
            	    }

            	    return promotionDatas;
		  	}
  		);

  		

  		let eventSearch = {};

  		let clubSearch = {status:"1",stripe_account_status:"1"};

  		if(body.search && body.search != ""){

			clubSearch["name"] = {'$regex': body.search,'$options' : 'i'};

			eventSearch = {title: {'$regex': body.search,'$options' : 'i'}}

		}else{
			
			if(pr_data && pr_data.length > 0){
	  			data_dash.promotions = pr_data;
	  		}
		}

  		/* events */

  		let body_data = {};

        let and_data = [];

        and_data.push({event_end_date: {'$gte': new Date()}});

        if(body.search && body.search != ""){

			and_data.push({title: {'$regex': body.search,'$options' : 'i'}});

		}

        body_data["$and"] = and_data;


  		const event_data = await EventModal.find(body_data).sort({'booking_count': -1}).limit(10).then( 
            async (events) => {
                    let eventDatas = [];

            	    if(events && events.length > 0){

            	    	let ev = 0;

            	    	for (const [key, eventsValues] of Object.entries(events)) {


            	    		var event_end_date = new Date(eventsValues.event_end_date);


						    if(event_end_date >= cr_date ){

						    	if(ev < 6){

							    	const data_eventtt  = {event:eventsValues,benefit:[],images:[]};

							    	const event_body = {eventid:eventsValues.id};

		           	       	    	
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
							    ev++;	

						    }

				           
  
						}
            	    }
            	    return eventDatas;
		  	}
  		);

  		if(event_data && event_data.length > 0){
  			data_dash.events = event_data;
  		}

  		/* Clubs */

  		


  		const clubs_data = await Club.find(clubSearch).sort({'event_date': 1}).then( 
            async (clubs) => {

            	    let clubDatas = [];

            	    if(clubs && clubs.length > 0){

            	    	for (const [key, clubValues] of Object.entries(clubs)) {

                            let datas = {club:clubValues,user:null,distance:100000};

                            if(clubValues.lat && clubValues.long){

                            	let gettt = getDistance(
								    { latitude: body.latitude, longitude: body.longitude },
								    { latitude: clubValues.lat, longitude: clubValues.long }
								);

								var dist = convertDistance(gettt, 'km');

								datas.distance = dist;

                            }else{

                            	datas.distance = 100000;

                            }
                            const userd =   await User.findOne({_id:clubValues.user_id}).then( 
						                                    async (user) => {
						                                        return user;
						                                    }
						                             );
                            if(userd && userd._id){

                            	datas.user = userd;

                            	clubDatas.push(datas);

                            }
                            
  
						}
						clubDatas.sort((a,b) => a.distance - b.distance);
            	    }

            	    let finalClub = [];

            	    if(clubDatas.length > 0){

            	    	$kkk = 0;

            	    	for (const [key, clubDatasValues] of Object.entries(clubDatas)) {
                            

                            if($kkk <  10){

                            	finalClub.push(clubDatasValues);

                            }

                            $kkk++;
                           
  
						}

            	    }
            	    return finalClub;
		  	}
  		);

  		if(clubs_data && clubs_data.length > 0){
  			data_dash.nearByClubs = clubs_data;
  		}
  		let result = {};

  
		// success message
		result.status = 200;
		result.message = "";
		result.isSuccess = true;
		result.data = data_dash;

  		response.sendResponse(result.status, result.message, result.isSuccess, result.data);
  		

	} catch(err) {
		//throw err;
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}


module.exports = {
	dashboardData
}