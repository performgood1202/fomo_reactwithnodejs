require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js")
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const Session = require('../models/session.js');
const User = require('../models/user.js');
const club = require('../models/club.js');
const promotionPriceModal = require('../models/promotionPrice.js');
const Promotion = require('../models/promotion.js');
const SendEmail = require('../helpers/send-email.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');


const savePromotionSetting = async (body, res) => {
	const response = new baseResponse(res);
	try {


		if(body && body != undefined && Object.keys(body).length){


			if(Object.keys(body).length > 0){

				promotionPriceModal.deleteMany({}).then(function(){
				});

			    for (const [key, value] of Object.entries(body)) {

			    	let promotionPrice = new promotionPriceModal({
						position	: value.position,
						time	: value.time,
						price	: value.price,	
					});

					promotionPrice.save()
					.then(data => {		
						
					}).catch( (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					});
	            }
	            let result = {data: null,  status: false, message: 'Issue in creating settings.', code: statusCode.nulledData };
				let setting_data =  {
					message: "Successfully add settings!"
				}
	            result.status = true;
	  			result.message = "";
	  			result.code = statusCode.success;
	  			result.data = setting_data;
	  			response.sendResponse(result.data, result.status, result.message, result.code, null);
	  		}else{
	  			response.sendResponse(null, false, "Setting data required", 500, null);
	  		}	

		}else{
			response.sendResponse(null, false, "Setting not saved", 500, null);
		}


		
		
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, 500, null);
	}

	return true;
}

const getPromotionSettings = async (body, res) => {
	const response = new baseResponse(res);
	try {

		promotionPriceModal.find({})
		.then(data => {		

			    let result = {data: null,  status: false, message: 'Issue in Fetching settings.', code: statusCode.nulledData };

			    let setting_data = {
      				promotionSettings: data
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = setting_data;
      			response.sendResponse(result.data, result.status, result.message, result.code, null);
			
		}).catch( (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		});


		
		
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, 500, null);
	}

	return true;
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


            	    const promo_data = {promotion:promotion,club:null};

            	    const club_data =   await club.findOne({_id:promotion.club_id}).then( 
				                                    async (club) => {
				                                        return club;
				                                    }
				                             )
                    if(club_data && club_data._id){
                        promo_data.club = club_data;
                    }
            	    
		            let data =  {
						promotionDetail: promo_data
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
const getPromotionHistory = async (body, res) => {
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


		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}



	    Promotion.find(body_data).sort({'promotionStartDate': 1}).then( 
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

						    var org_datas = {promotion:promotionValues,sort:sort,club:null};

						    const club_data =   await club.findOne({_id:promotionValues.club_id}).then( 
				                                    async (club) => {
				                                        return club;
				                                    }
				                             )
                            $noexist = 0;
		                    if(club_data && club_data._id){
		                        org_datas.club = club_data;

		                            if(body.search && body.search != undefined && body.search != ""){

		                            	var club_name = club_data.name.toLowerCase();

		                            	var title = promotionValues.title.toLowerCase();

							   	    	var match = body.search.toLowerCase();

							            if(!club_name.match(match) && !title.match(match)){
							            	$noexist = 1;
							            }

									}
		                    }

		                    if($noexist == 0){

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

const getPromotionByClub = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {};

        let and_data = [];

        let or_data = [];


        and_data.push({club_id: body.club_id});
		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}



	    Promotion.find(body_data).sort({'promotionStartDate': 1}).then( 
            async (promotions) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch managers.', code: statusCode.nulledData };

                    let promotionDatas = [];

            	    if(promotions && promotions.length > 0){

            	    	for (const [key, promotionValues] of Object.entries(promotions)) {


            	    		var promotionStartDate = new Date(promotionValues.promotionStartDate);

							var promotionEndDate = new Date(promotionValues.promotionEndDate);

						    var cr_date = new Date();

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
						promotionDataByClub: promotionDatas
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


module.exports = {
	savePromotionSetting,
	getPromotionSettings,
	getPromotionDetail,
	getPromotionHistory,
	getPromotionByClub
}