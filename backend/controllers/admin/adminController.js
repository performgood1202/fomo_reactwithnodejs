require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js")
let baseResponse = require("../../Util/baseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const club = require('../../models/club.js');
const paymentHistory = require('../../models/paymentHistory.js');
const Promotion = require('../../models/promotion.js');
const {PlansModal} = require('../../models/plans.js');
const Subscription = require('../../models/subscription.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');


const dashboardData = async (body, res) => {
	const response = new baseResponse(res);
	try {
		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);

		const body_data = {status: { $ne: "3" }};
		club.find(body_data).then( 
           async (clubs) => {
           	        let result = { data: null, status: false, message: "Featch issue", code: 202 };

                    let dashboardData = {totalClub:clubs.length, activeClub:0, inactiveClub:0, declineClub:0,total_earnings:0,yearDataEarning:null,upcommingAds:0,ongoingAds:0,totalAds:0};

	                const promotionDatta =     await Promotion.find({}).sort({'promotionStartDate': 1}).then( 
							            async (promotions) => {

							           	      

							                    const promotionDatta = {totalAds:0,activeAds:0,upcommingAds:0};

							            	    if(promotions && promotions.length > 0){

							            	    	var activeAds = 1;
							            	    	var upcommingAds = 1;
							            	    	var totalAds = 1;



							            	    	for (const [key, promotionValues] of Object.entries(promotions)) {




							            	    		var promotionStartDate = new Date(promotionValues.promotionStartDate);

														var promotionEndDate = new Date(promotionValues.promotionEndDate);


													    if(cr_date > promotionStartDate && cr_date < promotionEndDate){

													    	promotionDatta.activeAds = activeAds;

													    	activeAds++;

													    	promotionDatta.totalAds = totalAds;

													    	totalAds++;

													    }else if(promotionEndDate > cr_date){

													    	promotionDatta.upcommingAds = upcommingAds;

													    	upcommingAds++;

													    	promotionDatta.totalAds = totalAds;

													    	totalAds++;

													    }
													}
							            	    }
			                                    return promotionDatta;
							            	    
							           	        
								  		}
							  		);

	                if(promotionDatta && promotionDatta.totalAds){
	                	dashboardData.upcommingAds = promotionDatta.upcommingAds;
	                	dashboardData.ongoingAds = promotionDatta.activeAds;
	                	dashboardData.totalAds = promotionDatta.totalAds;
	                }

                    /* Payment data */
                        const total_earnings_data = await paymentHistory.find({status: "1"}).then( 
									           async (payments) => {

									           	let price = 0

									           	if(payments && payments.length > 0){

							            	    	for (const [key, payment] of Object.entries(payments)) {
							                            price = Number(payment.price) + price;
							                            
							            	    	}
									           	}

									           	return price;
									           	        
									  		});
                        if(total_earnings_data){
                        	dashboardData.total_earnings = total_earnings_data;
                        }

                        let yearDataEarning = await getYearData("all");



	                    if(yearDataEarning && yearDataEarning.length > 0){
	                    	 dashboardData.yearDataEarning = yearDataEarning;
	                    }
                    /* Payment data */
                    
                    /* active */
                    const activeClubBody  = {status:"1"};

	  				const active_club_data = await club.find(activeClubBody).then( 
				           async (clubs) => {
				           	        return  {activeClub:clubs.length};
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)
					if(active_club_data && active_club_data.activeClub){
						dashboardData.activeClub = active_club_data.activeClub;
					}	
					/* inactive */

					const inactiveClubBody  = {status:"0"};

	  				const inactive_club_data = await club.find(inactiveClubBody).then( 
				           async (clubs) => {
				           	        return {inactiveClub:clubs.length};
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)
					if(inactive_club_data && inactive_club_data.inactiveClub){
						dashboardData.inactiveClub = inactive_club_data.inactiveClub;
					}
					/* decline */

					const declineClubBody  = {status:"2"};

	  				const decline_club_data = await club.find(declineClubBody).then( 
				           async (clubs) => {
				           	        return {declineClub:clubs.length};
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(null, false,  error.message, statusCode.error, null);
						    }
						)
					if(decline_club_data && decline_club_data.declineClub){
						dashboardData.declineClub = decline_club_data.declineClub;
					}
					let dashboard_data = {
	      				dashboard: dashboardData
	      			}

	      			result.status = true;
	      			result.message = "";
	      			result.code = statusCode.success;
	      			result.data = dashboard_data;
	      			response.sendResponse(result.data, result.status, result.message, result.code, null);
	  			}
  		).catch(
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
const earningData = async (body, res) => {
	const response = new baseResponse(res);
	try {
		const body_data = {status: "1" };

	
        
		


		paymentHistory.find(body_data).sort({'_id': -1}).then( 
           async (payments) => {
           	        let result = { data: null, status: false, message: "Featch issue", code: 202 };

                    let earningData = {total_earnings:0, total_subscription_earning:0, total_promotion_earning:0, recent_payments:null,yearDataSub:null,yearDataPromotion:null};
                    
                    /* start */

                    let yearDataSub = await getYearData("subscription");
                    let yearDataPromotion = await getYearData("promotion");



                    if(yearDataSub && yearDataSub.length > 0){
                    	 earningData.yearDataSub = yearDataSub;
                    }
                    if(yearDataPromotion && yearDataPromotion.length > 0){
                    	 earningData.yearDataPromotion = yearDataPromotion;
                    }




                    if(payments && payments.length > 0){

                    	let paymentsData = [];

                    	var count = 0;

            	    	for (const [key, payment] of Object.entries(payments)) {
                            earningData.total_earnings = Number(payment.price) + earningData.total_earnings;
                            if(payment && payment.payment_type == "subscription"){
                            	earningData.total_subscription_earning =  Number(payment.price) + earningData.total_subscription_earning; 
                            }
                            if(payment && payment.payment_type == "promotion"){
                            	earningData.total_promotion_earning =  Number(payment.price) + earningData.total_promotion_earning; 
                            }

                            let paymentdata = {payment:payment,club:null};

                            const club_data =   await club.findOne({_id:payment.club_id}).then( 
				                                    async (club) => {
				                                        return club;
				                                    }
				                             )
                            if(club_data && club_data._id){
                                paymentdata.club = club_data;
                            }
                            if(count < 6){
                              paymentsData.push(paymentdata);
                            }

                            count++



            	    	}
            	    	earningData.recent_payments = paymentsData;
            	    }	



                    /*end*/
                    
					let earning_data = {
	      				earningData: earningData
	      			}

	      			result.status = true;
	      			result.message = "";
	      			result.code = statusCode.success;
	      			result.data = earning_data;
	      			response.sendResponse(result.data, result.status, result.message, result.code, null);
	  			}
  		).catch(
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

const getYearData = async (payment_type) => {


	

	const FIRST_MONTH = 1
	const LAST_MONTH = 12
	const MONTHS_ARRAY = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]

	let TODAY = new Date();
	let YEAR_BEFORE = new Date(TODAY.getFullYear()+"-01-01 12:00:00");

	let match_data = {};

	if(payment_type == "all"){

        match_data =  { status : "1",created_at: { $gte: YEAR_BEFORE, $lte: TODAY } };

	}else{
		match_data =  { 
			              status : "1",
				      	  payment_type : payment_type,
				          created_at: { $gte: YEAR_BEFORE, $lte: TODAY }
				    };
	}

	const datat = await paymentHistory.aggregate( [
	  { 
	      $match: match_data,
	  },
	  { 
	      $group: {
	            _id: { "year_month": { $substrCP: [ "$created_at", 0, 7 ] } }, 
	            sum: {
			        $sum: "$price",
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

const updateProfile = async (session,body, res) => {
	const response = new baseResponse(res);
	try {
		if(body.data && body.data.fName){

		//	console.log(body)

		        let update = {};

			    const query3 = { "_id": session._id };
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

		      			if(body.features){
		      				RemovePlanByID(body.id);
		      				__that.AddPlanFeatures(body.features,body,res);
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
			console.log(body)
		}


	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const getPromotionDashboard = async (body, res) => {
	const response = new baseResponse(res);
	try {

		let cr_date = "";

		if(body.cr_date){

			cr_date  = moment(body.cr_date).utcOffset(0, true);
		   
		}else{

			cr_date  = moment().utcOffset(0, true);

		}

		cr_date = new Date(cr_date);


		Promotion.find({}).sort({'promotionStartDate': 1}).then( 
            async (promotions) => {

           	        let result = {data: null,  status: false, message: 'Issue in fetch Promotions.', code: statusCode.nulledData };

                    const promotionDatta = {totalAds:promotions.length,activeAds:0,inactiveAds:0,upcommingAds:0,upcommingPromotion:[],activePromotion:[]};
            	    if(promotions && promotions.length > 0){

            	    	var activeAds = 1;
            	    	var inactiveAds = 1;
            	    	var upcommingAds = 1;



            	    	for (const [key, promotionValues] of Object.entries(promotions)) {




            	    		var promotionStartDate = new Date(promotionValues.promotionStartDate);

							var promotionEndDate = new Date(promotionValues.promotionEndDate);


						    promotionValues.status = null;

						    var sort;

						    const club_data =   await club.findOne({_id:promotionValues.club_id}).then( 
				                                    async (club) => {
				                                        return club;
				                                    }
				                             )
                            var club_d = null;
                            if(club_data && club_data._id){
                                club_d = club_data;
                            }


						    

						    if(cr_date > promotionStartDate && cr_date < promotionEndDate){

						    	promotionValues.status = 1;
						    	sort = 1;
						    	promotionDatta.activeAds = activeAds;

						    	

						    	var org_datas = {promotion:promotionValues,sort:sort,club:club_d};

						    	if(activeAds < 6){
						    		promotionDatta.activePromotion.push(org_datas);
						    	}
						    	activeAds++;

						    }else if(promotionEndDate > cr_date){

						    	promotionValues.status  = 2;
						    	sort = 2;
						    	promotionDatta.upcommingAds = upcommingAds;

						    	var org_datas = {promotion:promotionValues,sort:sort,club:club_d};

						    	if(upcommingAds < 6){
						    		promotionDatta.upcommingPromotion.push(org_datas);
						    	}
						    	upcommingAds++;

						    } else if(promotionStartDate < cr_date){

						    	promotionValues.status  = 0;
						    	sort = 3;
						    	promotionDatta.inactiveAds = inactiveAds;
						    	inactiveAds++;

						    }
						}
            	    }
            	    let promotion_data = {
	      				promotionData: promotionDatta
	      			}

	      			result.status = true;
	      			result.message = "";
	      			result.code = statusCode.success;
	      			result.data = promotion_data;
	      			response.sendResponse(result.data, result.status, result.message, result.code, null);
           	        
	  		}
  		).catch(
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
const payments = async (body, res) => {
	const response = new baseResponse(res);
	try {
		const body_data = { status: "1" };


        let and_data = [];

        if(body.payment_type && body.payment_type != ""){
        	and_data.push({payment_type: body.payment_type});
        }

        
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		paymentHistory.find(body_data).sort({'_id': -1}).then( 
           async (payments) => {
           	        let result = {};

                    let paymentsData = [];



                    if(payments && payments.length > 0){

                    	var count = 0;

            	    	for (const [key, payment] of Object.entries(payments)) {


            	    		let club_body = {_id:payment.club_id};

            	    		let and_club_data = [];

            	    		if(body.search && body.search != ""){

		                    	var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

			                    if(format.test(body.search)){
			                    	body.search = "zzzzzzzzzz";
			                    }

	           	       	    	and_club_data.push({name: {'$regex': body.search,'$options' : 'i'}});

							}

							if(and_club_data.length > 0){

								club_body["$and"] = and_club_data;
							}
                            
                            const datt = {payment:payment,club:null};

                            const club_data =   await club.findOne(club_body).then( 
				                                    async (club) => {
				                                        return club;
				                                    }
				                             )
                            if(club_data && club_data._id){
                                datt.club = club_data;
                                paymentsData.push(datt);
                            }

                            
            	    	}
            	    }	



                    /*end*/
                    
					let payment_data = {
	      				paymentsData: paymentsData
	      			}

	      			result.status = true;
	      			result.message = "";
	      			result.code = statusCode.success;
	      			result.data = payment_data;
	      			response.sendResponse(result.data, result.status, result.message, result.code, null);
	  			}
  		).catch(
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
const paymentsFetch = async (body, res) => {
	const response = new baseResponse(res);
	try {
		const body_data = { _id: body.id };


		paymentHistory.findOne(body_data).sort({'_id': -1}).then( 
           async (payment) => {

           	        let result = {};

           	        const paymentData = {payment:null,club:null,subscription:null,plan:null};


                    if(payment && payment._id){

                    	paymentData.payment = payment;


        	    		let club_body = {_id:payment.club_id};
                        

                        const club_data =   await club.findOne(club_body).then( 
			                                    async (club) => {
			                                        return club;
			                                    }
			                             )
                        if(club_data && club_data._id){
                            paymentData.club = club_data;

                                var sub_data = {club_id:club_data._id};


			      				const subscription = await Subscription.findOne(sub_data).then( 
						         async (subscription) => {
			                                   return subscription;
							  				//tempObj["subscription"] = subscription;
							  			}
						  		);
								if(subscription && subscription._id){

									paymentData.subscription = subscription;



									var plan_data_params = {_id:subscription.plan_id};

									const plan = await PlansModal.findOne(plan_data_params).then( 
							         async (plan) => {
				                                   return plan;
								  				//tempObj["subscription"] = subscription;
								  			}
							  		)

									if(plan && plan._id){

										paymentData.plan = plan;

									}

								}
                        }
            	    }	



                    /*end*/
                    
					let payment_data = {
	      				paymentData: paymentData
	      			}

	      			result.status = true;
	      			result.message = "";
	      			result.code = statusCode.success;
	      			result.data = payment_data;
	      			response.sendResponse(result.data, result.status, result.message, result.code, null);
	  			}
  		).catch(
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
	earningData,
	updateProfile,
	getPromotionDashboard,
	payments,
	paymentsFetch
}