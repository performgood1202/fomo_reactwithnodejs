const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// User Model Definition
const featureSchema = new Schema({
  	name: { type: String, required: true },
  	status: { type: String, enum : ['0', '1'], default: '1' },
}, { timestamps: { created_at: 'created_at',updated_at: 'updated_at' } });

const getFeatures = async () => {


    const  result_data = mongoose.model('Feature').find().catch(function(error){

					    	const return_result = { success:false, message:error.message};
							return return_result;
					    });

    return result_data;

}
const createFeature = async (body) => {

	const data = { name: body.name};

    const  result_data = mongoose.model('Feature').create(data).catch(function(error){

					    	const return_result = { success:false, message:error.message};
							return return_result;
					    });

    return result_data;

}
const updateFeature = async (body) => {

	const query = { "_id": body.id };
	const update = { $set: {name: body.name } };
	const options = {};



	const result_data = mongoose.model('Feature').findByIdAndUpdate(query, update, options).catch(function(error){

	                    	const return_result = { success:false, message:error.message};
					    	return return_result;
					    });



    return result_data;



}
const removeFeature = async (body) => {

	const data = { "_id": body.id };


	const result_data = mongoose.model('Feature').findByIdAndRemove(data).catch(function(error){

	                    	const return_result = { success:false, message:error.message};
					    	return return_result;
					    });

   

    return result_data;



}

const featureModal =  mongoose.model('Feature', featureSchema);

module.exports = {
	featureModal,
	createFeature,
	updateFeature,
	removeFeature,
	getFeatures
}

