require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let appBaseResponse = require("../../Util/appBaseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const menuModal = require('../../models/menu.js');
const Club = require('../../models/club.js');
const EventBenefitModal = require('../../models/benefit.js');
const EventModal = require('../../models/events.js');
const Booking = require('../../models/booking.js');
const EventImageModal = require('../../models/eventImage.js');

const getClubMenus = async (club_id,body,booking, res) => {
  
    const response = new appBaseResponse(res);
	try{

		let body_data = {};

        let and_data = [];

        let or_data = [];



		and_data.push({club_id:club_id});
		and_data.push({status:"1"});

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

	

		
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}

		let table_no = "";

		if(booking && booking.table_no && booking.table_no != ""){
			table_no = booking.table_no;
		}



	    menuModal.find(body_data).then( 
            async (menus) => {

            	    
	      			const data_return = {
                         menuData : menus,
                         table_no : table_no,
                    }

	                let result = {};


	                  // success message
	                  result.status = 200;
	                  result.message = "";
	                  result.isSuccess = true;
	                  result.data = data_return;

                    response.sendResponse(result.status, result.message, result.isSuccess, result.data);
		  	}
  		).catch(
		    (error) => {
		    	response.sendResponse(201, error.message, false, null);
		    }
		)

	} catch(err){
		response.sendResponse(201, err.message, false, null);
	}    


}
const getMenus = async (session, params, body, res) => {
	const response = new appBaseResponse(res);
	try{

		await Booking.findOne({_id:params.booking_id,user_id:session._id}).then( 
            async (booking) => {
              
              if(booking && booking.event_id){

              	    await EventModal.findOne({_id:booking.event_id}).then( 
				            async (event) => {
				              
				              if(event && event.club_id){

				              	   await getClubMenus(event.club_id,body,booking,res);
				              
				              }
				                
				        }
				    ).catch(
				          (error) => {
				            response.sendResponse(201, error.message, false, null);
				          }
				    )
              
              }
                
        }).catch(
          (error) => {
            response.sendResponse(201, error.message, false, null);
          }
        )

	} catch(err){
		response.sendResponse(null, false, err.message, 201, null);
	}
}

module.exports = {
	getMenus
}