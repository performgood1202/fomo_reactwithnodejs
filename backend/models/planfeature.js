const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// User Model Definition
const planFeatureSchema = new Schema({
  	planId: { type: String, required: true },
  	featureId: { type: String, required: true },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

const RemovePlanByID = async (planId) => {

	const data = { "planId": planId };


	const result_data = mongoose.model('PlanFeature').find(data).deleteMany().catch(function(error){

	                    	const return_result = { success:false, message:error.message};
					    	return return_result;
					    });
   

    return result_data;



}
const RemoveFeatureByID = async (featureId) => {
	
	const data = { "featureId": featureId };


	const result_data = mongoose.model('PlanFeature').find(data).deleteMany().catch(function(error){

	                    	const return_result = { success:false, message:error.message};
					    	return return_result;
					    });
   

    return result_data;



}

const planFeatureModal =  mongoose.model('PlanFeature', planFeatureSchema);

module.exports = {
	planFeatureModal,
	RemovePlanByID,
	RemoveFeatureByID
}

