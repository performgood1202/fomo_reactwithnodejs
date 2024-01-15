require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../../Util/statusCode.js")
let baseResponse = require("../../../Util/baseResponse.js");
const jwtHelper = require('../../../Util/jwtHelper')
const User = require('../../../models/user.js');
const Session = require('../../../models/session.js');
const {PlansModal,getPlanById,updateMonthPlan,updateYearPlan} = require('../../../models/plans.js');
const {planFeatureModal,RemovePlanByID} = require('../../../models/planfeature.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const fetch = async (body, res) => {
	const response = new baseResponse(res);
	try {
		PlansModal.find({}, async (err, plans) => {

			let result = { data: null, status: false, message: "Featch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch plans.';
					}
      		} else {
      			let plans_data = {
      				plans: plans
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const fetchApiPlans = async (body, res) => {
	const response = new baseResponse(res);
	try {
		let planFeatures = {};
		/* sort by month price */
		PlansModal.find({status:1},null, {sort: {month_price: 1}}, async (err, plans) => {
			let result = { data: null, status: false, message: "Featch issue", code: 202 };
			if(err){
				if (err.errors) {
					result.message = err;
				} else {
					result.message = 'Could not Fetch plans.';
				}
			} else {
      			if(plans.length > 0){
      				let planid = '';
      				plans.map((d,k) =>{
						let featuresArr = [];
						planid = d._id;
						planFeatureModal.find({planId : d._id}, async (ferr, featureData) => {
							if(ferr) {
								
							} else {
								if(featureData.length > 0){
									featureData.map((f, j) => {
										featuresArr.push(f.featureId);
									});
									planFeatures[d._id] = featuresArr;
								}
								if(plans.length == k+1){
									let responseData = {};
									responseData.plans = plans;
									responseData.features = planFeatures;

									// success message
					      			result.status = true;
					      			result.message = "";
					      			result.code = statusCode.success;
					      			result.data = responseData;
					      			response.sendResponse(result.data, result.status, result.message, result.code, null);
								}
							}
						});
      				});
      			}
      		}
		});
		// PlansModal.find({status:1},null, {sort: {month_price: 1}})
		// .then(data => {		
		// PlansModal.find({status:1},null, {sort: {month_price: 1}}, async (errd, data) => {
		// 	if(errd){

		// 	}else{
		// 		if(data.length > 0){
		// 			data.map((d, k) => {
		// 				let featuresArr = [];
		// 				planFeatureModal.find({planId : d._id}, async (err, featureData) => {
		// 					if(err) {
								
		// 					} else {
		// 						if(featureData.length > 0){
		// 							featureData.map((f, j) => {
		// 								featuresArr.push(f.featureId);
		// 							});
		// 							planFeatures[d._id] = featuresArr;
		// 						}
		// 					}
		// 					console.log("1");
		// 				});
		// 				console.log(planFeatures);
		// 			}
		// 		}
		// 	}
		// });
				// planFeatureModal.find({ planId: d._id }, function(featureData){
				// 	console.log(featureData);
					// if(featureData.length > 0){
					// 	featureData.map((f, j) => {
					// 		featuresArr.push(f.featureId);
					// 	});
					// 	planFeatures[d._id] = featuresArr;
					// }
				// });
    //         	planFeatureModal.find({ planId: d._id })
    //         	.then(featureData => {
				// 	if(featureData.length > 0){
				// 		featureData.map((f, j) => {
				// 			featuresArr.push(f.featureId);
				// 		});
				// 		planFeatures[d._id] = featuresArr;
				// 	}
				// })	
				// .catch(error => {
				// 	console.log(error);
				// });				
        	// });
        	// console.log(planFeatures);
        	// data.features = "testingg";
        	// console.log(data);
			// planFeatureModal.find({ planId: data._id })
			// .then(featureData =>{
			// 	console.log(featureData.featureId);
			// 	planFeatures.push(featureData.featureId);
			// })	
			// .catch(error => {
			// 	console.log(error);
			// })
		// })
		// });
		// PlansModal.find({status:1},null, {sort: {month_price: 1}}, async (err, plans) => {

		// 	let result = { data: null, status: false, message: "Featch issue", code: 202 };

		// 	if(err) {
		// 			// Check if error is a validation rror
		// 			if (err.errors) {
		// 				result.message = err;
		// 			} else {
		// 				result.message = 'Could not Fetch plans.';
		// 			}
  //     		} else {
  //     			let plans_data = {
  //     				plans: plans
  //     			}
  //     			// success message
  //     			result.status = true;
  //     			result.message = "";
  //     			result.code = statusCode.success;
  //     			result.data = plans_data;
  //     		}
			

		// 	response.sendResponse(result.data, result.status, result.message, result.code, null);
		// });
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const create = async (body, res) => {
	const response = new baseResponse(res);
	try {


		const product = await stripe.products.create({
		  name: body.name,
		});
		if(product && product.id){
		
			const month_stripe_price = await stripe.prices.create({
				  unit_amount: body.month_price * 100,
				  currency: 'EUR',
                  recurring: {interval: 'month'},
				  product: product.id,
				});

			const year_stripe_price = await stripe.prices.create({
				  unit_amount: body.year_price * 100,
				  currency: 'EUR',
                  recurring: {interval: 'year'},
				  product: product.id,
				});

			if(month_stripe_price && month_stripe_price.id && year_stripe_price && year_stripe_price.id ){

				let plans = new PlansModal({
		            name: body.name,
		            month_stripe_price_key: month_stripe_price.id,
		            year_stripe_price_key: year_stripe_price.id,
		            month_price: body.month_price,
		            year_price: body.year_price,
		      	});
				plans.save((err) => {
		      		let result = {data: null,  status: false, message: 'Plan create Issue', code: statusCode.nulledData };
		      		if(err) {
						
							// Check if error is a validation rror
							if (err.errors) {
								  for (const [key, value] of Object.entries(err.errors)) {
                                     result.message = value.message;
                                     break;
								  }
							} else {
								result.message = 'Could not create plan.';
							}
		      		} else {
		      			let plans_data = {
		      				message: "Plans successfully save."
		      			}
		      			// success message
		      			result.status = true;
		      			result.message = "";
		      			result.code = statusCode.success;
		      			result.data = plans_data;
		      		}

		      		response.sendResponse(result.data, result.status, result.message, result.code, null);
		      	});

			}else{

				response.sendResponse(null, false, "create plan issue", statusCode.error, null);

			}
		}else{
			response.sendResponse(null, false, "Product stripe issue", statusCode.error, null);
		}
		
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, statusCode.error, null);
	}

	return true;
}


exports.updateStripePlan = async (data,body,res) => {

	const response = new baseResponse(res);

	const result_res = { success:false };

    try {

    	const month_price = body.month_price * 100;
        


		const stripePriceDataMonth = await stripe.prices.retrieve(
		  data.month_stripe_price_key
		);

		if(stripePriceDataMonth && stripePriceDataMonth.product){

			const product_data = await stripe.products.update(
			  stripePriceDataMonth.product,
			  {name: body.name}
			);

			if(stripePriceDataMonth.unit_amount != month_price){

				const month_stripe_price = await stripe.prices.create({
					  unit_amount: month_price,
					  currency: 'EUR',
	                  recurring: {interval: 'month'},
					  product: stripePriceDataMonth.product,
					});

				if(month_stripe_price && month_stripe_price.id ){

					const modelResponse = await updateMonthPlan(data.id,month_stripe_price.id);

				}

			}

		}

		const year_price = body.year_price * 100;
        


		const stripePriceDataYear = await stripe.prices.retrieve(
		  data.year_stripe_price_key
		);

		if(stripePriceDataYear && stripePriceDataYear.product){

			if(stripePriceDataYear.unit_amount != year_price){

				const year_stripe_price = await stripe.prices.create({
					  unit_amount: year_price,
					  currency: 'EUR',
	                  recurring: {interval: 'year'},
					  product: stripePriceDataYear.product,
					});

				if(year_stripe_price && year_stripe_price.id ){

					const modelResponse = await updateYearPlan(data.id,year_stripe_price.id);

				}

			}

		}
	} catch(err) {
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	result_res.success = true;


	return result_res;

}
exports.AddPlanFeatures = async (features,body,res) => {
	const response = new baseResponse(res);

	try {

		if(features.length > 0){

			features.forEach(function(value,index){

				let planFeature = new planFeatureModal({
		            planId: body.id,
		            featureId: value,
		      	});
				planFeature.save((err) => {
		      		let result = {data: null,  status: false, message: 'Assign feature Issue', code: statusCode.nulledData };
		      		if(err) {
						
							// Check if error is a validation rror
							if (err.errors) {
								result.message = err;
							} else {
								result.message = 'Could not save user.';
							}

		      		    console.log("_____________________"+err);
		      		} 
		      	});

			});

		}
	} catch(err) {
		console.log(err)
	}

	return true;
     
}

const update = async (body, res) => {
	const response = new baseResponse(res);
	const __that = this;
	try {

		const planData = await getPlanById(body.id);

		if(planData && planData.month_stripe_price_key){

			const stripeResponse = await this.updateStripePlan(planData,body,res);

			if(stripeResponse && stripeResponse.success){


				const query3 = { "_id": body.id };
				const update = { $set: {name: body.name,description: body.description, month_price: body.month_price, year_price: body.year_price } };
				const options = {};
				PlansModal.findByIdAndUpdate(query3, update, options, function(err, res) {
		      		let result = { data: null, status: false, message: 'Plan Update Issue', code: statusCode.nulledData };
		      		if(err) {
						
							// Check if error is a validation rror
							if (err.errors) {
								  for (const [key, value] of Object.entries(err.errors)) {
                                     result.message = value.message;
                                     break;
								  }
							} else {
								result.message = 'Could not Update Plan.';
							}
		      		} else {

		      			if(body.features){
		      				RemovePlanByID(body.id);
		      				__that.AddPlanFeatures(body.features,body,res);
		      			}



		      			let plans_data = {
		      				message: "Plan successfully updated."
		      			}
		      			// success message
		      			result.status = true;
		      			result.message = "";
		      			result.code = statusCode.success;
		      			result.data = plans_data;
		      		}

		      		response.sendResponse(result.data, result.status, result.message, result.code, null);
		      	});
			}

		}else{
			response.sendResponse(null, false,  "Plan not exist", statusCode.error, null);
		}

	} catch(err) {
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}

const remove = async (body, res) => {
	const response = new baseResponse(res);
	try {

		PlansModal.findByIdAndRemove({ "_id": body.id }, function(err, res) {
      		let result = { data: null, status: false, message: 'Plans delete Issue', code: statusCode.nulledData };
      		if(err) {
      			console.log("__________innererror:::: "+err);
				
					// Check if error is a validation rror
					if (err.errors) {
						  for (const [key, value] of Object.entries(err.errors)) {
                             result.message = value.message;
                             break;
						  }
					} else {
						result.message = 'Could not delete Plan.';
					}
      		} else {

      			let plans_data = {
      				message: "Plan successfully deleted."
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}

      		response.sendResponse(result.data, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, statusCode.error, null);
	}

	return true;
}

const fetchPlanDetail = async (body, res) => {
	const response = new baseResponse(res);
	try {
		PlansModal.findById(body.id, function(err,plan){
			let result = { data: null, status: false, message: "Fetch issue", code: 202 };

			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch plan detail.';
					}
      		} else {
      			let plans_data = {
      				plan: plan
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_data;
      		}
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const getPlanFeature = async (body, res) => {
	const response = new baseResponse(res);
	try {
		var data = {"planId":body.planId};
		planFeatureModal.find(data, function(err,features){
			let result = { data: null, status: false, message: "Fetch issue", code: 202 };


			if(err) {
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not Fetch plan detail.';
					}
      		} else {
      			let features_data = {
      				planfeature: features
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = features_data;
      		}
			

			response.sendResponse(result.data, result.status, result.message, result.code, null);
		});
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const addFeatureToPlan = async (body, res) => {
	const response = new baseResponse(res);
	try {
		let planFeature = new planFeatureModal({
            planId: body.planId,
            featureId: body.featureId,
      	});
		planFeature.save((err) => {
      		let result = {data: null,  status: false, message: 'Assign feature Issue', code: statusCode.nulledData };
      		if(err) {
				
					// Check if error is a validation rror
					if (err.errors) {
						result.message = err;
					} else {
						result.message = 'Could not save user.';
					}
      		} else {
      			let plans_feature_data = {
      				message: "Assign feature successfully."
      			}
      			// success message
      			result.status = true;
      			result.message = "";
      			result.code = statusCode.success;
      			result.data = plans_feature_data;
      		}

      		response.sendResponse(result.data, result.status, result.message, result.code, null);
      	});
	} catch(err) {
		console.log(err);
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}

module.exports = {
	create,
	fetch,
	update,
	remove,
	fetchApiPlans,
	fetchPlanDetail,
	addFeatureToPlan,
	getPlanFeature
}