const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js")
let appBaseResponse = require("../../Util/appBaseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const Otp = require('../../models/otp.js');
const userData = require('../../models/userData.js');
const accountController = require('./accountController.js');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const serviceId = process.env.TWILIO_SERVICE_ID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



const getOtp = async(body, res) => {
	const response = new appBaseResponse(res);
	try{

		if(body.phone && body.phone != ""){
			let code = generateCode(4);

			let phone_number_with_coutry_code  = body.phone_country_code+body.phone;

			const query2 = { "phone": phone_number_with_coutry_code };
			const update = { $set: {"phone": phone_number_with_coutry_code, otp: code } };
			const options = { upsert:true };

			Otp.updateOne(query2, update, options, function(err, res) {
	      		let result = { status: 201, message: '', isSuccess: false, data: null };
	      		if(err) {
					
						// Check if error is a validation rror
						if (err.errors) {
							for (const [key, value] of Object.entries(err.errors)) {
                                 result.message = value.message;
                                 break;
							}
						} else {
							result.message = 'Otp issue.';
						}
	      		} else {

	      			let phone_number = phone_number_with_coutry_code;
	      			phone_number = phone_number.replace("+","");

	      			client.messages
					  .create({
					     body: 'Otp: '+code,
					     messagingServiceSid: serviceId,
					     to: "+"+phone_number
					   })
					  .then(message => console.log(message.sid));

	      			
	      			// success message
	      			result.status = 200;
	      			result.message = "Successfully send otp!";
	      			result.isSuccess = true;
	      			result.data = null;
	      		}

	      		response.sendResponse(result.status, result.message, result.isSuccess, result.data);
	      	});

		}else{
			response.sendResponse(201, 'Phone invalid!', false, null);
		}

		
	} catch(err){
		response.sendResponse(201, err.message, false, null);
	}
}
const verifyOtp = async(body, res) => {
	const response = new appBaseResponse(res);
	try{

		let phone_number_with_coutry_code  = body.phone_country_code+body.phone;

		const body_data = {phone:phone_number_with_coutry_code,otp:body.otp};

		const otppp = await Otp.findOne(body_data).then( 
				         async (otp) => {
	                                if(otp && otp._id){

	                                	User.findOne({phone:body.phone,phone_country_code:body.phone_country_code,roleId:"4"}).then( 
								            async (user) => {
									         	if(user && user._id){

									         		if(body.device_token){
									         			let user_body = {_id:user._id};

											  			let update_user = {};

												        let update_data_parms = {};

												        update_data_parms["device_token"] = body.device_token;;

													    update_user["$set"] = update_data_parms;

														await User.find(user_body).updateOne(user_body,update_user).then( 
											                    async (user_data) => {
											                    }
											            ).catch(
														    (error) => {
														    	
														    }
														)

									         		}
                                                    const login_data = accountController.login(user,res);


									         	}else{

									         		let otp_data = {
									      				otp: otp.otp,
									      				phone: otp.phone,
									      			}
									      			
									      			response.sendResponse(200, 'Successfully verified!', true, otp_data);

									         	}
					                                
									  	}).catch(
										    (error) => {
										    	response.sendResponse(201,  error.message, false, null);
										    }
										)

	                                }else{

	                                	response.sendResponse(201, 'Invalid otp!', false, null);

	                                }
					  			}
				  		).catch(
						    (error) => {
						    	response.sendResponse(201,  error.message, false, null);
						    }
						)

		
		
	} catch(err){
		response.sendResponse(201, err.message, false, null);
	}
}
function generateCode(n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
        
        if ( n > max ) {
            return generate(max) + generate(n - max);
        }
        
        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;
        
        return ("" + number).substring(add); 
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
	getOtp,
	verifyOtp
}