const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js")
let appBaseResponse = require("../../Util/appBaseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const club = require('../../models/club.js');
const userData = require('../../models/userData.js');
const accountController = require('../../controllers/accountController.js');
const thisController = require('./accountController.js');
const Stripe = require('../../config/stripe.js');

const createProfile = async (body, res) => {

	const response = new appBaseResponse(res);

	try {

		let device_token = "";

		if(body.data.device_token && body.data.device_token != ""){
			device_token = body.data.device_token;
		}

		let genrtPass = generatePassword(18);


		let name = body.data.name.split(" ");

		let fName = "";

		let lName = "";



   	    if(name[0] && name[0] != undefined && name[0] != ""){

			fName = name[0];

		}
		

		if(name[1] && name[1] != undefined && name[1] != ""){

			lName = name[1];

		}

		let loginType = "";

		if(body.loginType && body.loginType != ""){
			loginType = body.loginType;
		}




		

      	await User.find({phone:body.data.phone}).then( 
           async (userphoneDta) => {
           	        if(userphoneDta.length < 1){

           	       	     /* start */
           	       	       let user = new User({
					            fName: fName,
					            lName: lName,
					            email: body.data.email.toLowerCase(),
					            password: genrtPass,
					            phone_country_code: body.data.phone_country_code,
					            phone: body.data.phone,
					            profileImage: body.profileImage,
					            loginType:loginType,
					            roleId: "4",
					            device_token:device_token,
					      	});

           	       	        await user.save(async (err) => {
				      		let result = { status: 201, message: '', isSuccess: false, data: null };


				      		
				      		if(err) {
								if (err.code === 11000) {
									result.message =  'E-mail already exists';
								} else {
									if (err.errors) {
										for (const [key, value] of Object.entries(err.errors)) {
				                             result.message = value.message;
				                             break;
										}
									} else {
										result.message = 'Save user issue.';
									}
								}
				      		} else {
				      			// success message
				  			        let userDataBody = new userData({
										userId:user._id,
										dob: body.data.dob,
										gender: body.data.gender,
									});

									const get_user_data = await userDataBody.save().then( 
							           async (userdata) => {
							           	       return userdata;
								  			}
							  		)
				                    /* Login */
							  		let tokenObj = { email: body.data.email }
									let token = await jwtHelper.getToken(tokenObj);

									if(token) {

										setSession(user.email, token);

										let club_data = null;



										let user_data = {
											token,
											user,
											clubData : club_data,
											userData : get_user_data,
										}
						      			// success message
						      			result.status = 200;
						      			result.message = "Successfully save User";
						      			result.isSuccess = true;
						      			result.data = user_data;

									}else{

										result.message = 'Token generate error.';

									}	
				      		}

				      		response.sendResponse(result.status, result.message, result.isSuccess, result.data);
				      	});

           	       	     /* end */

           	       }else{
           	       	  response.sendResponse(201, "Phone Number already exist", false, null);
           	       }
	  			}
  		).catch(
		    (error) => {
		    	response.sendResponse(201, error.message, false, null);
		    }
		)
      	
	} catch(err) {
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}

const updateProfile = async(session, body, res) => {
	const response = new appBaseResponse(res);
	try{

		let id = session._id;

		let body_data_user = {};

        let and_data_user = [];

		and_data_user.push({phone:body.data.phone});

		and_data_user.push({ _id: { $ne: id } });

		body_data_user["$and"] = and_data_user;




	    await User.find(body_data_user).then( 
           async (userphoneDta) => {
           	        if(userphoneDta.length < 1){


				        let update = {};

				        let name = body.data.name.split(" ");

						let fName = "";

						let lName = "";



				   	    if(name[0] && name[0] != undefined && name[0] != ""){

							fName = name[0];

						}
						

						if(name[1] && name[1] != undefined && name[1] != ""){

							lName = name[1];

						}


					    const query3 = { "_id": id };
					    if(body.profileImage){
			                update = { $set: {fName: fName,lName: lName,  phone_country_code: body.data.phone_country_code,phone: body.data.phone, profileImage: body.profileImage } };
					    }else{
			                update = { $set: {fName: fName,lName: lName,  phone_country_code: body.data.phone_country_code, phone: body.data.phone } };
					    }
						
						const options = {};
						User.findByIdAndUpdate(query3, update, options, function(err, res) {
				      		let result = { status: 201, message: '', isSuccess: false, data: null };
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

				      			

				      				let userdata_body = {userId:session._id};

						  			let update_userData = {};

							        let update_data_parms = {};

							        if(body.data.dob && body.data.dob != ""){
							        	update_data_parms["dob"] = body.data.dob;
							        }

							        if(body.data.gender && body.data.gender != ""){
							        	update_data_parms["gender"] = body.data.gender;
							        }

								    update_userData["$set"] = update_data_parms;

									userData.find(userdata_body).updateOne(userdata_body,update_userData).then( 
						                    async (user_data) => {

						                    }
						            ).catch(
									    (error) => {
									    	return;
									    }
									)
				      			
				      			// success message
				      			result.status = 200;
				      			result.message = "Successfully update User";
				      			result.isSuccess = true;
				      			result.data = null;
				      		}

				      		response.sendResponse(result.status, result.message, result.isSuccess, result.data);
				      	});
				    }else{
           	       	  response.sendResponse(201, "Phone Number already exist", false, null);
           	        }
	  			}
  		).catch(
		    (error) => {
		    	response.sendResponse(201, error.message, false, null);
		    }
		)  	
	} catch(err){
		console.log(err.message)
		response.sendResponse(201, err.message, false, null);
	}
	return;
}

const login = async (user, res) => {
	const response = new appBaseResponse(res);

	try {

		let result = { status: 201, message: '', isSuccess: false, data: null };
         

        let tokenObj = { email: user.email }
		let token = await jwtHelper.getToken(tokenObj);

		if(token) {

			const get_user_data = await userData.findOne({userId:user._id}).then( 
							           async (userdata) => {
							           	       return userdata;
								  			}
							  		)

			setSession(user.email, token);

			let club_data = null;



			let user_data = {
				token,
				user,
				clubData : club_data,
				userData : get_user_data,
				otp:null,
				phone:null,
			}
  			// success message
  			result.status = 200;
  			result.message = "Successfully User login!";
  			result.isSuccess = true;
  			result.data = user_data;

		}else{

			result.message = 'Token generate error.';

		}
		response.sendResponse(result.status, result.message, result.isSuccess, result.data);


      	
	} catch(err) {
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}
const socialLogin = async (body, res) => {
	const response = new appBaseResponse(res);

	try {

		let genrtPass = generatePassword(18);


		let name = body.name.split(" ");

		let fName = "";

		let lName = "";



   	    if(name[0] && name[0] != undefined && name[0] != ""){

			fName = name[0];

		}
		

		if(name[1] && name[1] != undefined && name[1] != ""){

			lName = lName[0];

		}

		await User.findOne({email:body.email,roleId:"4"}).then( 
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


                         const login_data = await login(user,res);
           	       	   

           	        }else{
           	       	   /* start */
           	       	       let user = new User({
					            fName: fName,
					            lName: lName,
					            email: body.email.toLowerCase(),
					            password: genrtPass,
					            phone_country_code: body.phone_country_code,
					            phone: body.phone,
					            loginType:"Google",
					            roleId: "4"
					      	});

           	       	        await user.save(async (err) => {
					      		let result = { status: 201, message: '', isSuccess: false, data: null };


					      		
					      		if(err) {
									if (err.code === 11000) {
										result.message =  'E-mail/Phone already exists';
									} else {
										if (err.errors) {
											for (const [key, value] of Object.entries(err.errors)) {
					                             result.message = value.message;
					                             break;
											}
										} else {
											result.message = 'Save user issue.';
										}
									}
					      		} else {
					      			// success message
					  			        let userDataBody = new userData({
											userId:user._id,
										});

										const get_user_data = await userDataBody.save().then( 
								           async (userdata) => {
								           	       return userdata;
									  			}
								  		)
					                    /* Login */

					                    const login_data = await login(user,res);

								  		
					      		}

					      		response.sendResponse(result.status, result.message, result.isSuccess, result.data);
					      	});
	           	    }
	  			}
  		).catch(
		    (error) => {
		    	response.sendResponse(201, error.message, false, null);
		    }
		)




      	
	} catch(err) {
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}
const checkSocialProfile = async (body, res) => {
	const response = new appBaseResponse(res);

	try {

		await User.findOne({email:body.email,roleId:"4"}).then( 
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

                        const login_data = await login(user,res);
           	       	   

           	        }else{
           	        	let result = { status: 200, message: 'Not exist!', isSuccess: true, data: null };
           	       	    /* start */
           	       	    response.sendResponse(result.status, result.message, result.isSuccess, result.data);
	           	    }
	  			}
  		).catch(
		    (error) => {
		    	response.sendResponse(201, error.message, false, null);
		    }
		)




      	
	} catch(err) {
		response.sendResponse(201, err.message, false, null);
	}

	return true;
}
const setSession = (email, token) => {
	try {
		Session.findOne({ email: email }, async (err, val) => {
			if(val && val.email) {
				val.token = token;
				val.ts = Date.now();

				val.updateOne(val, (err) => {});
			} else {
				let sess = new Session({
		            email,
		            token,
		            valid: '1'
		      	});
				sess.save();
			}
		});
	} catch(err) {
		console.log(err);
		throw err;
	}

	return true;
}
const getUserSession = async (token, req, res, next, send401) => {

	const response = new appBaseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {
		// Session.findOne({ token: token }).populate('userValue').exec(function(err, value) {
		Session.findOne({ token: token }).exec(function(err, value) {
		   	if(err) {
		   		response.sendResponse(401, "Authetication failed", false, null);
		   	} else {
		   		if(value && value.email) {
		   			User.findOne({ email: value.email }).exec(function(err, user) {
		   				if(err) {
		   					response.sendResponse(401, "Email not match", false, null);
		   				} else {
		   					if(user && user.email) {
		   						req.session = user;
            					next();
		   					} else {
		   						response.sendResponse(401, "Authetication failed", false, null);
		   					}
		   				}
		   			});
		   		} else {
		   			response.sendResponse(401, "Authetication failed", false, null);
		   		}
		   	}
		});
	} catch(err) {
		response.sendResponse(201,  err.message, false, null);
	}

	return true;
}
const info = async(session, res) => {
	const response = new appBaseResponse(res);

	let club_data = null;



	if(session && session._id){

		await User.findOne({_id:session._id}).then( 
           async (user) => {
           	        if(user && user._id){


                        const get_user_data = await userData.findOne({userId:user._id}).then( 
							           async (userdata) => {
							           	       return userdata;
								  			}
							  		)


						let result = {};



						let user_data = {
							user,
							userData : get_user_data,
						}
			  			// success message
			  			result.status = 200;
			  			result.message = "";
			  			result.isSuccess = true;
			  			result.data = user_data;

			  			response.sendResponse(result.status, result.message, result.isSuccess, result.data);
           	       	   

           	        }else{
           	       	   response.sendResponse(401, "Authetication failed", false, null);
	           	    }
	  			}
  		).catch(
		    (error) => {
		    	response.sendResponse(401, error.message, false, null);
		    }
		)


	}else{
		response.sendResponse(401, "Authetication failed", false, null);
	}

	
	return true;
}
const deleteAccount = async(session,body, res) => {
	const response = new appBaseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		    let user_body = {_id:session._id};

  			let update_user = {};

	        let update_data_parms = {};

	        update_data_parms["status"] = "2";

		    update_user["$set"] = update_data_parms;

			await User.find(user_body).updateOne(user_body,update_user).then( 
                    async (user_data) => {
                    	// success message
                    	let result = {};

						result.status = 200;
						result.message = "Successfully delete account";
						result.isSuccess = true;
						result.data = null;

			        	response.sendResponse(result.status, result.message, result.isSuccess, result.data);

                    }
            ).catch(
			    (error) => {
			    	response.sendResponse(201,  error.message, false, null);
			    }
			)
			
			
		
	} catch(err) {
		response.sendResponse(201,  err.message, false, null);
	}

	return true;
}

const getCard = async(session,body, res) => {
	const response = new appBaseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		User.findOne({_id:session._id}).then( 
	            async (user) => {
	              
	              if(user){

	                /*  for customer */



	                let stripe_customer_id = "";

	                if(user && user.stripe_customer_id && user.stripe_customer_id != ""){

	                        stripe_customer_id = user.stripe_customer_id;

	                        let get_card = await Stripe.getCard(stripe_customer_id);

	                        if(get_card && get_card.data){

	                        	let dataCards = {
	                        		cards: get_card.data
	                        	}

	                        	let result = {};

								result.status = 200;
								result.message = "";
								result.isSuccess = true;
								result.data = dataCards;

					        	response.sendResponse(result.status, result.message, result.isSuccess, result.data);
	                        }

	                }else{

	                  response.sendResponse(201, "Stripe customer not found!", false, null);

	                }

	                


	              }else{
	                response.sendResponse(201, "User not found!", false, null);
	              }
	        }
	      ).catch(
	        (error) => {
	          response.sendResponse(201, error.message, false, null);
	        }
	    )




		//let get card = await Stripe.getCard()
			
		
	} catch(err) {
		response.sendResponse(201,  err.message, false, null);
	}

	return true;
}
const saveCard = async(session,body, res) => {
	const response = new appBaseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		User.findOne({_id:session._id}).then( 
	            async (user) => {
	              
	              if(user){

	                /*  for customer */



	                let stripe_customer_id = "";

	                if(user && user.stripe_customer_id && user.stripe_customer_id != ""){
	                        stripe_customer_id = user.stripe_customer_id;

	                }else{
	                        let customer_data =  await Stripe.createCustomer(user);

	                        if(customer_data.id){

	                            stripe_customer_id = customer_data.id;

	                            let user_body = {_id:session._id};

		                        let updateData = {};

		                        let update_data_parms = {};


		                        update_data_parms["stripe_customer_id"] = stripe_customer_id;

		                        updateData["$set"] = update_data_parms;

		                        User.find(user_body).updateOne(user_body,updateData).then( 
		                                      async (user_d) => {

                                      }
                                );


	                        }else{
	                          response.sendResponse(201, customer_data, false, null);
	                        } 

	                }
	                /* end  for customer */

	                if(stripe_customer_id && stripe_customer_id != ""){

                         
                        let save_card = await Stripe.saveCard(body,stripe_customer_id);

                        if(save_card && save_card.url){

                        	    let result = {};
                        	    let return_data = {
                        	   	  url : save_card.url
                        	    };

								result.status = 200;
								result.message = "Successfully save card!";
								result.isSuccess = true;
								result.data = return_data;

					        	response.sendResponse(result.status, result.message, result.isSuccess, result.data);

                        }else{

                        	response.sendResponse(201, "Add Card issue. Please enter valid card info!", false, null);

                        }




	                  //let customer_data =  await Stripe.createCheckoutSession(user,body,stripe_customer_id);
	                }else{
	                  response.sendResponse(201, "Stripe customer not found!", false, null);
	                }

	                


	              }else{
	                response.sendResponse(201, "User not found!", false, null);
	              }
	        }
	      ).catch(
	        (error) => {
	          response.sendResponse(201, error.message, false, null);
	        }
	    )



		//let get card = await Stripe.getCard()
			
		
	} catch(err) {
		response.sendResponse(201,  err.message, false, null);
	}

	return true;
}
const deleteCard = async(session,body, res) => {
	const response = new appBaseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		
             
            let delete_card = await Stripe.deleteCard(body.card_id);


            if(delete_card && delete_card.id){

            	   let result = {};

					result.status = 200;
					result.message = "Successfully delete card!";
					result.isSuccess = true;
					result.data = "";

		        	response.sendResponse(result.status, result.message, result.isSuccess, result.data);

            }else{

            	response.sendResponse(201, "No Card exist!", false, null);

            }
        


		//let get card = await Stripe.getCard()
			
		
	} catch(err) {
		response.sendResponse(201,  err.message, false, null);
	}

	return true;
}
const successSaveCard = async(body,params, res) => {
	const response = new appBaseResponse(res);

	// 'select * from tUserSession  as A inner join tUserMaster as B ON A.username = B.username WHERE A.token = str_token;';
	try {

		
            let result = {};

			result.status = 200;
			result.message = "Successfully save card!";
			result.isSuccess = true;
			result.data = "";

        	response.sendResponse(result.status, result.message, result.isSuccess, result.data);


		//let get card = await Stripe.getCard()
			
		
	} catch(err) {
		response.sendResponse(201,  err.message, false, null);
	}

	return true;
}
function generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var specialChars = "@#$%&*&@!)(";
  var allChars = numberChars + specialChars + upperChars + lowerChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
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
	createProfile,
	login,
	socialLogin,
	checkSocialProfile,
	updateProfile,
	getUserSession,
	info,
	deleteAccount,
	getCard,
	saveCard,
	deleteCard,
	successSaveCard
}