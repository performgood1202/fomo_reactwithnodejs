const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise;

let db = process.env;
let databaseName = `dev database: ${db.DB_DATABASE}`; // Database name
let ftpdUri = db.FTP_URI;

let uri = `mongodb://${db.DB_HOST}/${db.DB_DATABASE}`;
if(db.NODE_ENV == 'prod') {
	uri = `mongodb://${db.DB_USERNAME}:${db.DB_PASSWORD}@${db.DB_HOST}/${db.DB_DATABASE}`;
	databaseName = `production database: ${db.DB_DATABASE}`;
}

const setConnection = async () => {
	var mongoDB = mongoose.connect(uri);
	
	mongoDB.then(function (db) {
	  	console.log('Connected to ' + databaseName); // Return success message
	}).catch(function (err) {
	  	console.log('Could NOT connect to database: ', err); // Return error message
	});
}

module.exports = {
	setConnection
}