require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let baseResponse = require("../../Util/baseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const menuModal = require('../../models/menu.js');

const create = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];

        let or_data = [];

		and_data.push({club_id:body.data.club_id});

		and_data.push({code: body.data.code });

		body_data["$and"] = and_data;

		menuModal.find(body_data).then(menus => {		
			if(menus.length < 1){

				let menu = new menuModal({
					club_id	: body.data.club_id,
					name	: body.data.name,
					code : body.data.code,
					price : body.data.price,
					cuisine : body.data.cuisine,
					food_type : body.data.food_type,
					item_type : body.data.item_type,
					drink_type : body.data.drink_type,
					category : body.data.category,
					menuImage : body.menuImage,
				});

				menu.save()
				.then(data => {		
					
					let result = {data: null,  status: false, message: 'Issue in creating menu.', code: statusCode.nulledData };
					let event_data =  {
						message: "Successfully add menu!"
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

			}else{
				response.sendResponse(null, false,  "Menu code already exist", statusCode.error, null);
			}
		}).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}
const update = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];

		and_data.push({club_id:body.data.club_id});

		and_data.push({code: body.data.code });

		and_data.push({ _id: { $ne: body.data.menu_id } });

		body_data["$and"] = and_data;

		menuModal.find(body_data).then(menus => {	

			if(menus.length < 1){

				    let update = {};

			        let update_data = {};

				    update_data["name"] = body.data.name;
				    update_data["code"] = body.data.code;
				    update_data["price"] = body.data.price;
				    update_data["cuisine"] = body.data.cuisine;
				    update_data["food_type"] = body.data.food_type;
				    update_data["item_type"] = body.data.item_type;
				    update_data["drink_type"] = body.data.drink_type;
				    update_data["category"] = body.data.category;
				    update_data["status"] = body.data.status;

				    if(body.menuImage && body.menuImage != "" && body.menuImage != null){
				    	 update_data["menuImage"] = body.menuImage;
				    }

				    update["$set"] = update_data;

				    menuModal.findByIdAndUpdate(body.data.menu_id, update)
					.then(data => {		
			            
						
						let result = {data: null,  status: false, message: 'Issue in update menu.', code: statusCode.nulledData };
						let event_data =  {
							message: "Successfully update menu!"
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

			}else{
				response.sendResponse(null, false,  "Menu code already exist", statusCode.error, null);
			}

	    }).catch(
		    (error) => {
		    	response.sendResponse(null, false,  error.message, statusCode.error, null);
		    }
		)
		
		   /**/

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



   	    
		

		and_data.push({club_id:body.club_id});

		if(body.search && body.search != undefined && body.search != ""){
			

			and_data.push({name: {'$regex': body.search,'$options' : 'i'}});

		}
		if(body.item_type && body.item_type != undefined && body.item_type != ""){

			and_data.push({item_type: body.item_type});

		}
		if(body.food_type && body.food_type != undefined && body.food_type != ""){

			and_data.push({food_type: body.food_type});

		}
		if(body.drink_type && body.drink_type != undefined && body.drink_type != ""){

			and_data.push({drink_type: body.drink_type});

		}
		if(body.category && body.category != undefined && body.category != ""){

			and_data.push({category: body.category});

		}
		if(body.cuisine && body.cuisine != undefined && body.cuisine != ""){

			and_data.push({cuisine: body.cuisine});

		}

		body_data["$and"] = and_data;

		if(body.upcomming && !body.past){

			and_data.push({event_date: {'$gte': new Date()}});

		}else if(body.past && !body.upcomming){

			and_data.push({event_date: {'$lt': new Date()}});
		}

		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}



	    menuModal.find(body_data).then( 
            async (menus) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch menu.', code: statusCode.nulledData };

            	    
		            let data =  {
						menuData: menus
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
		and_data.push({_id:body.menu_id});

		body_data["$and"] = and_data;

		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}

	    menuModal.findOne(body_data).then( 
            async (menu) => {
            	    let result = {data: null,  status: false, message: 'Issue in fetch events.', code: statusCode.nulledData };


            	    if(menu){

				            let data =  {
								menuDetail: menu
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
const remove = async (body, res) => {
	const response = new baseResponse(res);
	try{
		let body_data = {};

        let and_data = [];

		and_data.push({club_id:body.club_id});
		and_data.push({_id:body.menu_id});

		body_data["$and"] = and_data;

		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

	    menuModal.findOne(body_data).deleteOne().then( 
            async (menu) => {
            	    let result = {data: null,  status: false, message: 'Issue in delete menu.', code: statusCode.nulledData };

                    let data =  {
						message: "Menu Successfully delete!"
					}
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
	create,
	update,
	fetch,
	remove,
	fetchDetail,
}