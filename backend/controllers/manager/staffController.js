require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let baseResponse = require("../../Util/baseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const StaffModal = require('../../models/staff.js');

const create = async (body, res) => {
	const response = new baseResponse(res);
	try{

		StaffModal.find({email:body.data.email,club_id:body.data.club_id}, async (err, staff_members) => {
			let result = { data: null, status: false, message: "Staff member details retrieve issue.", code: 202 };
			if(err) {
				if (err.errors) {
					for (const [key, value] of Object.entries(err.errors)) {
	                     result.message = value.message;
	                     response.sendResponse(null, false, result.message, 500, null);
	                     break;
					}

				} else {
					result.message = 'Could not Fetch Staff Members.';
					response.sendResponse(null, false, result.message, 500, null);
				}
      		} else {
      			if(staff_members.length < 1){  

      				StaffModal.find({emp_code:body.data.emp_code,club_id:body.data.club_id}, async (err, staff_members2) => {
						let result = { data: null, status: false, message: "Staff member details retrieve issue.", code: 202 };
						if(err) {
							if (err.errors) {
								for (const [key, value] of Object.entries(err.errors)) {
				                     result.message = value.message;
				                     response.sendResponse(null, false, result.message, 500, null);
				                     break;
								}

							} else {
								result.message = 'Could not Fetch Staff Members.';
								response.sendResponse(null, false, result.message, 500, null);
							}
			      		} else {
			      			if(staff_members2.length < 1){  

			      				/* start*/
			                       let staff = new StaffModal({
										first_name	: body.data.first_name,
										last_name	: body.data.last_name,
										email		: body.data.email,
										phone		: body.data.phone,
										phone_country_code		: body.data.phone_country_code,
										shift		: body.data.shift,
										position	: body.data.position,
										emp_code	: body.data.emp_code,
										salary		: body.data.salary,
										hiring_date	: body.data.hiring_date,
										image       : body.profileImage,
										id_proof	: body.idProof,
										club_id		: body.data.club_id, // club id here 	
									});

									staff.save((err) => {
										let result = {data: null,  status: false, message: 'Issue in creating staff member record.', code: statusCode.nulledData };
										if(err) {						
											if (err.errors) {
												  for (const [key, value] of Object.entries(err.errors)) {
							                         result.message = value.message;
							                         break;
												  }
											} else {
												result.message = 'Could not create staff.';
											}
							      		} else {
							      			let staff_data = {
							      				message: "Staff Member successfully save."
							      			}
							      			// success message
							      			result.status = true;
							      			result.message = "";
							      			result.code = statusCode.success;
							      			result.data = staff_data;
							      		}

							      		response.sendResponse(result.data, result.status, result.message, result.code, null);
									});
			      				/*end*/
			      			}else{
			                   response.sendResponse(null, false, "Employee code already exist.", 500, null);

			      			}
				      	}		
					});	

      			}else{
                   response.sendResponse(null, false, "Email already exist.", 500, null);

      			}
      		}		
		});
		

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const fetch = async(body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];

        let or_data = [];



   	    
		

		and_data.push({club_id:body.club_id});

		if(body.search && body.search != undefined && body.search != ""){


			/*var format = /[ `!$%^()_+\-=\[\]{};':"\\|,.<>\/?~]/;

            if(format.test(body.search)){
            	body.search = "zzzzzzzzzz";
            }*/


            //let namee_search = body.search.replace(/[^a-zA-Z0-9]/g, '');
            let namee_search = body.search;

			

            namee_search = namee_search.split(" ");


       	    if(namee_search[0] && namee_search[0] != undefined && namee_search[0] != ""){

       	    	and_data.push({first_name: { $regex : new RegExp("^" + namee_search[0], "i") } });

			}
			

			if(namee_search[1] && namee_search[1] != undefined && namee_search[1] != ""){

				and_data.push({last_name: { $regex : new RegExp("^" + namee_search[1], "i") } });

			}

		}
		if(body.shift && body.shift != undefined && body.shift != ""){

			and_data.push({shift: { $regex : new RegExp("^" + body.shift, "i") } });


		}
		if(body.position && body.position != undefined && body.position != ""){

			and_data.push({position: { $regex : new RegExp("^" + body.position, "i") } });

		}
	

		body_data["$and"] = and_data;
		
		
        /* join  */
		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		if(or_data.length > 0 ){

			body_data["$or"] = or_data;

		}
		StaffModal.find(body_data, async (err, staff_members) => {
			let result = { data: null, status: false, message: "Staff member details retrieve issue.", code: 202 };
			if(err) {
				if (err.errors) {
					result.message = err;
				} else {
					result.message = 'Could not Fetch Staff Members.';
				}
      		} else {
      			let staff_data = {
      				staff: staff_members
      			}

      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = staff_data;
      		}		

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err){
		response.sendResponse(null, false,  err.message, 500, null);
	}
}

const detail = async(body, res) => {
	const response =  new baseResponse(res);
	try{
		StaffModal.findById({_id:body.staff_id,club_id:body.club_id}, function(err,staff_mem_data){
			let result = { data: null, status: false, message: "Staff member detail retrieve issue.", code: 202 };
			if(err){
				if (err.errors) {
					result.message = err;
				} else {
					result.message = 'Could not Fetch Staff Member detail.';
				}
			}else{
				let staff_detail = {
					detail : staff_mem_data
				};
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = staff_detail;
			}
			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const update = async(body, res) => {
	const response = new baseResponse(res);
	try{



		let body_data = {};

        let and_data = [];

        let or_data = [];

		and_data.push({club_id:body.data.club_id});

		and_data.push({email: body.data.email });

		and_data.push({ _id: { $ne: body.data.staff_id } });

		body_data["$and"] = and_data;


        

        StaffModal.find(body_data).then(userDDD => {	
			if(userDDD.length < 1){

                 /*START*/

                    let body_data2 = {};

					let and_data2 = [];


					and_data2.push({club_id:body.data.club_id});

					and_data2.push({emp_code: body.data.emp_code });

					and_data2.push({ _id: { $ne: body.data.staff_id } });

					body_data2["$and"] = and_data2;




					StaffModal.find(body_data2).then(userDDD2 => {	
						if(userDDD2.length < 1){

				            let update = {};

					        let update_data = {};

						    const query3 = { "_id": body.data.staff_id };

						    update_data["first_name"] = body.data.first_name;
						    update_data["last_name"] = body.data.last_name;
						    update_data["email"] = body.data.email;
						    update_data["phone"] = body.data.phone;
						    update_data["phone_country_code"] = body.data.phone_country_code;
						    update_data["shift"] = body.data.shift;
						    update_data["position"] = body.data.position;
						    update_data["emp_code"] = body.data.emp_code;
						    update_data["salary"] = body.data.salary;
						    update_data["hiring_date"] = body.data.hiring_date;

						    if(body.profileImage && body.profileImage != "" && body.profileImage != null){
						    	 update_data["image"] = body.profileImage;
						    }
						    if(body.idProof && body.idProof != "" && body.idProof != null){
						    	 update_data["id_proof"] = body.idProof;
						    }

						   

						    update["$set"] = update_data;

							
							const options = {};

							StaffModal.findByIdAndUpdate(body.data.staff_id, update, options,function(err,staff_mem_data){
								let result = { data: null, status: false, message: "Staff member detail update issue.", code: 202 };
								if(err){
									if (err.errors) {
										result.message = err;
									} else {
										result.message = 'Could not update Staff Member detail.';
									}
								}else{
									let staff_data =  {
										message: "Staff member data successfully updated"
									}
					      			result.status = true;
					      			result.message = "";
					      			result.code = statusCode.success;
					      			result.data = staff_data;
								}
								response.sendResponse(result.data, result.status, result.message, result.code, null);
							});
						}else{
							response.sendResponse(null, false,  "Employee code already exist", statusCode.error, null);
						}     	
					}).catch(
					    (error) => {
					    	response.sendResponse(null, false,  error.message, statusCode.error, null);
					    }
					)   
                 /*END*/
			}else{
				response.sendResponse(null, false,  "Email already exist", statusCode.error, null);
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

const remove = async(params, res) => {
	const response =  new baseResponse(res);
	try{
		StaffModal.findByIdAndRemove(params.id, function(err,staff_mem_data){
			let result = { data: null, status: false, message: "Staff member detail delete issue.", code: 202 };
			if(err){
				if (err.errors) {
					result.message = err;
				} else {
					result.message = 'Staff Member detail not found.';
				}
			}else{
      			result.status = true;
      			result.message = "Staff member data successfully deleted";
      			result.code = statusCode.success;
      			result.data = staff_mem_data;
			}
			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

const deleteStaff = async (body, res) => {
	const response = new baseResponse(res);
	try{

		let body_data = {};

        let and_data = [];



		and_data.push({club_id:body.club_id});
		and_data.push({_id:body.staff_id});

		body_data["$and"] = and_data;

		if(and_data.length > 0){

			body_data["$and"] = and_data;
		}

		
		    StaffModal.find(body_data).deleteOne()
                  .then( async (data) => {	

                  	let result = {data: null,  status: false, message: 'Issue in delete manager.', code: statusCode.nulledData };
					let event_data =  {
						message: "Successfully delete staff!"
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

const search = async(body, res) => {
	const response =  new baseResponse(res);
	const q = body.query;

	let search_query = {};
	if(body.position !== undefined){
		const q = body.position;
		search_query = { "position": { $regex: '.*' + q + '.*', $options: 'i' } };
	}
	if(body.query !== undefined) {
		let q = body.query;

		search_query =  { 
							$or: [
								{ "first_name": { $regex: '.*' + q + '.*', $options: 'i' } },
								{ "last_name": { $regex: '.*' + q + '.*', $options: 'i' } }, 
								{ "email": { $regex: '.*' + q + '.*', $options: 'i' } }, 
								{ "phone": { $regex: '.*' + q + '.*', $options: 'i' } }, 
								{ "emp_code": { $regex: '.*' + q + '.*', $options: 'i' } }, 
							]
						};
	}
	if(body.shift !== undefined) {
		const q = body.shift;
		search_query = { "shift": { $regex: '.*' + q + '.*', $options: 'i' } };
	}

	if(Object.entries(search_query).length === 0){
		response.sendResponse(null, true, "Search request empty", 400, null);
	}

	try{
		StaffModal.find(search_query, function(err,staff_mem_data){
			let result = { data: null, status: false, message: "search query issue.", code: 202 };
			if(err){
				if (err.errors) {
					result.message = err;
				} else {
					result.message = 'Could not find data.';
				}
			}else{
				let message = '';
				if(Object.entries(staff_mem_data).length === 0){
					message = 'Matched record not found.';
				}
      			result.status = true;
      			result.message = message;
      			result.code = statusCode.success;
      			result.data = staff_mem_data;
			}
			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
}

module.exports = {
	create,
	fetch,
	detail,
	update,
	remove,
	search,
	deleteStaff
}