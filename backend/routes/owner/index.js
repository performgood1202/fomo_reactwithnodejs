var express = require('express');
var router = express.Router();
const middleware = require('../middleware');

let ownerController = require('../../controllers/owner/ownerController.js');
let eventController = require('../../controllers/owner/eventController.js');
let menuController = require('../../controllers/owner/menuController.js');
let staffController = require('../../controllers/manager/staffController.js');
let queryController = require('../../controllers/queryController.js');
let accountController = require('../../controllers/accountController.js');
let bookingController = require('../../controllers/app/bookingController.js');
let orderController = require('../../controllers/manager/orderController.js');

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
    { name: 'promotionImage', maxCount: 10 },
    { name: 'eventImages[]', maxCount: 10 },
    { name: 'performerImage', maxCount: 10 },
    { name: 'menuImage', maxCount: 10 },
    { name: 'idProof', maxCount: 10 },
])



router.post("/dashboarddata", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.dashboardData(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/password/change", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await accountController.changePassword(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});


router.post("/manager/create", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {


		let req_data = {data:req.body,profileImage:null,idProof:null};

		if(req.files && req.files["profileImage"] && req.files["profileImage"].length > 0){

			req.files["profileImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}
		if(req.files && req.files["idProof"] && req.files["idProof"].length > 0){

			req.files["idProof"].forEach(function(image){

                req_data.idProof = image.location;

			})
		}


		let result = await ownerController.managerCreate(req_data, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/manager/update", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {


		let req_data = {data:req.body,profileImage:null,idProof:null};

		if(req.files && req.files["profileImage"] && req.files["profileImage"].length > 0){

			req.files["profileImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}
		if(req.files && req.files["idProof"] && req.files["idProof"].length > 0){

			req.files["idProof"].forEach(function(image){

                req_data.idProof = image.location;

			})
		}

		let result = await ownerController.updateManager(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/managers/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.getClubManagers(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/manager/delete", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		
		let result = await ownerController.deleteManager(req.body, res);

	} catch(err) {
		console.log(err);
	}
});
router.post("/manager/detail", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.getManagerDetail(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/* Promotions */
router.post("/promotion/create", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {


		let req_data = {data:req.body,promotionImage:null};

		if(req.files && req.files["promotionImage"] && req.files["promotionImage"].length > 0){

			req.files["promotionImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}
		
		let result = await ownerController.createPromotion(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/promotions/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.getPromotions(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/promotion/detail", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.getPromotionDetail(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/*Events*/
router.post("/events/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await eventController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/event/create", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {

		
		let req_data = {data:req.body,eventImages:[],performerImage:null};

		if(req.files && req.files["eventImages[]"] && req.files["eventImages[]"].length > 0){


			req.files["eventImages[]"].forEach(function(image){

                req_data.eventImages.push(image.location);

			})
		}
		if(req.files && req.files["performerImage"] && req.files["performerImage"].length > 0){

			req.files["performerImage"].forEach(function(image){

                req_data.performerImage = image.location;

			})
		}

	    let result = await eventController.create(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/event/update", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {

		let req_data = {data:req.body,eventImages:[],performerImage:null};

		if(req.files && req.files["eventImages[]"] && req.files["eventImages[]"].length > 0){


			req.files["eventImages[]"].forEach(function(image){

                req_data.eventImages.push(image.location);

			})
		}
		if(req.files && req.files["performerImage"] && req.files["performerImage"].length > 0){

			req.files["performerImage"].forEach(function(image){

                req_data.performerImage = image.location;

			})
		}
		let result = await eventController.update(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/event/delete", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		
		let result = await eventController.deleteEvent(req.body, res);

	} catch(err) {
		console.log(err);
	}
});
router.post("/event/deleteimage", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		
		let result = await eventController.deleteEventImage(req.body, res);

	} catch(err) {
		console.log(err);
	}
});
router.post("/event/fetch", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		
		let result = await eventController.fetchDetail(req.body, res);

	} catch(err) {
		console.log(err);
	}
});
/*Menu*/
router.post("/menu/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await menuController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/menu/detail", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await menuController.fetchDetail(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/menu/remove", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await menuController.remove(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/menu/create", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {

		
		let req_data = {data:req.body,menuImage:null};


		if(req.files && req.files["menuImage"] && req.files["menuImage"].length > 0){

			req.files["menuImage"].forEach(function(image){

                req_data.menuImage = image.location;

			})
		}

		let result = await menuController.create(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/menu/update", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {

		
		let req_data = {data:req.body,menuImage:null};

		if(req.files && req.files["menuImage"] && req.files["menuImage"].length > 0){

			req.files["menuImage"].forEach(function(image){

                req_data.menuImage = image.location;

			})
		}
		let result = await menuController.update(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
/*Staff*/
router.post("/staff/create", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {

		
		let req_data = {data:req.body,idProof:null,profileImage:null};

		if(req.files && req.files["idProof"] && req.files["idProof"].length > 0){

			req.files["idProof"].forEach(function(image){

                req_data.idProof = image.location;

			})
		}
		if(req.files && req.files["profileImage"] && req.files["profileImage"].length > 0){

			req.files["profileImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}

		let result = await staffController.create(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/staff/members",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await staffController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/staff/detail",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await staffController.detail(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/staff/update", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {

		
		let req_data = {data:req.body,idProof:null,profileImage:null};

		if(req.files && req.files["idProof"] && req.files["idProof"].length > 0){

			req.files["idProof"].forEach(function(image){

                req_data.idProof = image.location;

			})
		}
		if(req.files && req.files["profileImage"] && req.files["profileImage"].length > 0){

			req.files["profileImage"].forEach(function(image){

                req_data.profileImage = image.location;

			})
		}

		let result = await staffController.update(req_data, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/staff/delete",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await staffController.deleteStaff(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
/*Contact*/
router.post("/contact/add",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await queryController.create(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/*stripe account*/
router.post("/saveStripeAccount",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.saveStripeAccount(req.session,req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/checkStripeAccountStatus/:stripe_account_id",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.checkStripeAccountStatus(req.session,req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/setupStripe/:stripe_account_id",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.setupStripe(req.session,req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/loginStripe/:stripe_account_id",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.loginStripe(req.session,req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/fetchBankDetails/:stripe_account_id",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.fetchBankDetails(req.session,req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/editBankDetails/:stripe_account_id/:bank_account_id",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.editBankDetails(req.session,req.params, res);
	} catch(err) {
		console.log(err);
	}
});

router.get("/deleteStripeAccount/:stripe_account_id", async (req, res) => {
	try {
		let result = await ownerController.deleteStripeAccount(req.params, res);
	} catch(err) {
		console.log(err);
	}
});
/* subscription */
router.get("/getSubscription/",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.getSubscription(req.session,req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/subscribePlan/",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.subscribePlan(req.session,req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/cancelSubscription/",middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await ownerController.cancelSubscription(req.session,req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/*Profile*/

router.post("/profile/update", middleware.authenticate,middleware.isClubOwner,cpUpload, async (req, res) => {
	try {
let req_data = {};

		if(req.files && req.files.profileImage && req.files.profileImage.length > 0){

			let profileData = req.files.profileImage;

			let profile_image = "";

			profileData.forEach(function(image){

                  profile_image =  image.location;

			})

			req_data = {
				data :  req.body,
				path :  profile_image,
			}

		}else{
			req_data = {
				data :  req.body,
			}

		}

		let result = await accountController.updateProfile(req.session, req_data, res);
	} catch(err) {
		console.log(err);
	}
});
/*Bookings*/
router.post("/bookings/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await eventController.bookings(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/booking/assignTable", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await eventController.assignTable(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
/* Earnings */
router.get("/fetchEarningData", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.fetchEarningData(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/fetchOrderEarnings/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.fetchOrderEarnings(req.session, req.body, res);



	} catch(err) {
		console.log(err);
	}
});
router.get("/fetchEventEarnings/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await ownerController.fetchEventEarnings(req.session, req.body, res);



	} catch(err) {
		console.log(err);
	}
});



/* order */
router.post("/getOrderBill/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {

		let result = await orderController.getOrderBill(req.session, req.body, res);



	} catch(err) {
		console.log(err);
	}
});

/*Queries*/
router.get("/queries/fetch/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await queryController.fetchQuaries(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/query/detail/:query_id", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await queryController.fetchQuaryDetail(req.session, req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/query/resolve/", middleware.authenticate,middleware.isClubOwner, async (req, res) => {
	try {
		let result = await queryController.resolveQuery(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;
