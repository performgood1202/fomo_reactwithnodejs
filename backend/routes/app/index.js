
var express = require('express');
var app = express()
var http = require('http').createServer(app);
var router = express.Router();
const middleware = require('../middleware');

let plansController = require('../../controllers/admin/plans/plansController.js');

let featureController = require('../../controllers/admin/plans/featureController.js');

let queryController = require('../../controllers/queryController.js');

let appController = require('../../controllers/app/appController.js');

let accountController = require('../../controllers/app/accountController.js');

let userController = require('../../controllers/app/userController.js');

const { S3Client } = require('@aws-sdk/client-s3');

let aws = require('aws-sdk');
let multer = require('multer');
let multerS3 = require('multer-s3');


let s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_AWS_ACCESS_KEY,
    secretAccessKey: process.env.S3_AWS_SECRET_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});


var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET,
        metadata: function (request, file, cb) {
            return cb(null, {
                'Content-Type': `application/${file.mimetype.split('/')[1]}`,
                'Content-Disposition': `inline;fileName=${file.originalname}`,
            });
        },
        key: function (req, file, cb) {

        	let fieldname = file.fieldname;
        	fieldname = fieldname.replace("[]","");

            return cb(null, `${fieldname}/${file.originalname}`);
        }
    })
});
var cpUpload = upload.fields([
    { name: 'profileImage', maxCount: 10 },
])


router.post("/getOtp", async (req, res) => {
	try {
		let result = await appController.getOtp(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/verifyOtp", async (req, res) => {
	try {
		let result = await appController.verifyOtp(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/socialLogin", async (req, res) => {
	try {
		let result = await accountController.socialLogin(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/checkSocialProfile", async (req, res) => {
	try {
		let result = await accountController.checkSocialProfile(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/createProfile", cpUpload, async (req, res) => {
	try {


		let req_data = {data:req.body,profileImage:null};

		if(req.files && req.files["profileImage"] && req.files["profileImage"].length > 0){

			req.files["profileImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}

		let result = await accountController.createProfile(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/updateProfile", middleware.authenticateApp, middleware.isAppUser, cpUpload, async (req, res) => {
	try {


		let req_data = {data:req.body,profileImage:null};

		if(req.files && req.files["profileImage"] && req.files["profileImage"].length > 0){

			req.files["profileImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}

		let result = await accountController.updateProfile(req.session,req_data, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/deleteAccount", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await accountController.deleteAccount(req.session,req.body, res);

	} catch(err) {
		console.log(err);
	}
});
router.post("/saveCard", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await accountController.saveCard(req.session,req.body, res);

	} catch(err) {
		console.log(err);
	}
});
router.get("/getCard", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await accountController.getCard(req.session,req.body, res);

	} catch(err) {
		console.log(err);
	}
});
router.post("/deleteCard", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await accountController.deleteCard(req.session,req.body, res);

	} catch(err) {
		console.log(err);
	}
});

router.post("/dashboardData", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await userController.dashboardData(req.session, req.body, res);

	} catch(err) {
		console.log(err);
	}
});

router.get("/info", middleware.authenticateApp, async (req, res) => {
	try {

		let result = await accountController.info(req.session, res);

	} catch(err) {
		console.log(err);
	}
});
router.get("/success_save_card/:checkout_session_id", async (req, res) => {
	try {

	  
       let result = await accountController.successSaveCard(req.body,req.params, res);


	} catch(err) {
		console.log(err);
	}
});


/* Club Routes*/

const club = require('./club.js');

router.use('/', club);

/* End Club Routes */

/* Event Routes*/

const event = require('./event.js');

router.use('/', event);

/* End Event Routes */


/* Booking Routes*/

const booking = require('./booking.js');

router.use('/', booking);

/* End booking Routes */

/* Menus Routes*/

const menus = require('./menus.js');

router.use('/', menus);

/* End Menus Routes */

/* Orders Routes*/

const orders = require('./orders.js');

router.use('/', orders);

/* End Orders Routes */




module.exports = router;