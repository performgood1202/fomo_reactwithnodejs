require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../../Util/statusCode.js")
let baseResponse = require("../../../Util/baseResponse.js");
const jwtHelper = require('../../../Util/jwtHelper')
const User = require('../../../models/user.js');
const Session = require('../../../models/session.js');
const {PlansModal} = require('../../../models/plans.js');
const {featureModal,createFeature,updateFeature,getFeatures,removeFeature} = require('../../../models/feature.js');
const {planFeatureModal,RemoveFeatureByID} = require('../../../models/planfeature.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const fetch = async (body, res) => {
	const response = new baseResponse(res);
	try {

		const featureResponse = await getFeatures(body);

	    let result = {data: null,  status: false, message: 'Create Issue', code: statusCode.nulledData };

	    if(featureResponse && featureResponse.success == false){
            response.sendResponse(null, false, featureResponse.message, statusCode.error, null);
	    }else if(featureResponse != "" && featureResponse != null && featureResponse != undefined){

	    	let feature_data = {
  				features: featureResponse
  			}
	    	result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = feature_data;

	    }else{

  			result.message = "something went wrong";

	    }
	    response.sendResponse(result.data, result.status, result.message, result.code, null);

		
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

	    const featureResponse = await createFeature(body);

	    let result = {data: null,  status: false, message: 'Create Issue', code: statusCode.nulledData };

	    if(featureResponse && featureResponse.success == false){
            response.sendResponse(null, false, featureResponse.message, statusCode.error, null);
	    }else if(featureResponse != "" && featureResponse != null && featureResponse != undefined){

	    	let feature_data = {
  				message: "successfully saved!"
  			}
	    	result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = feature_data;

	    }else{

  			result.message = "something went wrong";

	    }
	    response.sendResponse(result.data, result.status, result.message, result.code, null);

		
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, statusCode.error, null);
	}

	return true;
}



const update = async (body, res) => {
	const response = new baseResponse(res);
	try {

		const featureResponse = await updateFeature(body);
	    
	    let result = {data: null,  status: false, message: 'Update Issue', code: statusCode.nulledData };

	    if(featureResponse && featureResponse.success == false){
            response.sendResponse(null, false, featureResponse.message, statusCode.error, null);
	    }else if(featureResponse != "" && featureResponse != null && featureResponse != undefined){

	    	let feature_data = {
  				message: "successfully update!"
  			}
	    	result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = feature_data;

	    }else{

  			result.message = "something went wrong";

	    }
	    response.sendResponse(result.data, result.status, result.message, result.code, null);


	} catch(err) {
		//throw err;
		response.sendResponse(null, false,  err.message, statusCode.error, null);
	}

	return true;
}
const remove = async (body, res) => {
	const response = new baseResponse(res);
	try {

		const featureResponse = await removeFeature(body);
		
		const featurePlanResponse = await RemoveFeatureByID(body.id);
	    
	    let result = {data: null,  status: false, message: 'Delete Issue', code: statusCode.nulledData };

	    if(featureResponse && featureResponse.success == false){
            response.sendResponse(null, false, featureResponse.message, statusCode.error, null);
	    }else if(featureResponse != "" && featureResponse != null && featureResponse != undefined){

	    	let feature_data = {
  				message: "successfully delete!"
  			}
	    	result.status = true;
  			result.message = "";
  			result.code = statusCode.success;
  			result.data = feature_data;

	    }else{

  			result.message = "something went wrong";

	    }
	    response.sendResponse(result.data, result.status, result.message, result.code, null);

		
	} catch(err) {
		//throw err;
		response.sendResponse(null, false, err.message, statusCode.error, null);
	}

	return true;
}

module.exports = {
	create,
	fetch,
	update,
	remove
}