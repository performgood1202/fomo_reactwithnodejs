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
const {getDistance,geolib,convertDistance} = require('geolib');


const getClub = async (params, body, res) => {

	const response = new appBaseResponse(res);

	

	try {
       
       /* Clubs */



        var perPage = 10;

        let page = parseInt(params.page);

        page = page >= 1 ? page : 1;

        page = parseInt(page);



		let body_data = {};

		let and_data = [];
		let or_data = [];

		and_data.push({status:"1"});

		if(body.search && body.search != ""){

			and_data.push({name: {'$regex': body.search,'$options' : 'i'}});

			/*let events_club = await eventClubs(body.search);

			if(events_club && Array.isArray(events_club) && events_club.length > 0){

				or_data.push({_id: {'$in': events_club }});
			}*/



		}
		and_data.push({stripe_account_status: "1"});

		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}
        if(or_data.length > 0){

			body_data["$or"] = or_data;
		}
		


  		const clubs_data = await Club.find(body_data).then( 
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

            	    let datttt = await paginate(clubDatas, perPage, page);

            	    totalPage = Math.ceil(clubs.length / perPage);

            	    let send_data = {clubs:datttt,page:page,perPage:perPage,totalPage:totalPage};
            	    let result = {};

  
					// success message
					result.status = 200;
					result.message = "";
					result.isSuccess = true;
					result.data = send_data;

			  		response.sendResponse(result.status, result.message, result.isSuccess, result.data);

		  	}
  		);

	} catch(err) {
		//throw err;
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}
const paginate = async (array, page_size, page_number) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const eventClubs = async (search) => {
    try {

        let body_data = {};

        let and_data = [];

		and_data.push({title: {'$regex': search,'$options' : 'i'}});
		
		body_data["$and"] = and_data;


  		const club_ids = await EventModal.find(body_data).then( 
            async (events) => {

            	let club_ids = [];

            	    if(events && events.length > 0){

            	    	for (const [key, event] of Object.entries(events)) {

                              club_ids.push(event.club_id);
            	    	}

            	    }
                return club_ids;

		  	}
  		);

  		return club_ids;

	} catch(err) {
		return err.message;
	}
}

module.exports = {
	getClub
}