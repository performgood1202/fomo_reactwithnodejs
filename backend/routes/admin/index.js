var express = require('express');
var router = express.Router();
const middleware = require('../middleware');

let plansController = require('../../controllers/admin/plans/plansController.js');

let settingController = require('../../controllers/admin/setting/settingController.js');

let featureController = require('../../controllers/admin/plans/featureController.js');

let adminController = require('../../controllers/admin/adminController.js');

let clubController = require('../../controllers/clubController.js');

let promotionController = require('../../controllers/promotionController.js');

let queryController = require('../../controllers/queryController.js');

let accountController = require('../../controllers/accountController.js');

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
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});
var cpUpload = upload.fields([
    { name: 'profileImage', maxCount: 10 }
])


router.post("/dashboarddata", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await adminController.dashboardData(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/earningdata", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await adminController.earningData(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/payments", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await adminController.payments(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/payment/fetch/:id", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await adminController.paymentsFetch(req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/password/change", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await accountController.changePassword(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/profile/update", middleware.authenticate,middleware.isSuperAdmin,cpUpload, async (req, res) => {
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

		let result = await accountController.updateProfile(req.session,req_data, res);
	} catch(err) {
		console.log(err);
	}
});
/*settings*/
router.post("/setting/save", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await settingController.saveSettings(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/notification_status", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await settingController.notificationStatus(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.get("/plans", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/plan/:id",  middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.fetchPlanDetail(req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/plan/create", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.create(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/plan/update", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.update(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/plan/remove", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.remove(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/plan/addfeaturetoplan", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.addFeatureToPlan(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/planfeature/:planId", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await plansController.getPlanFeature(req.params, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/setting/createandupdate", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await settingController.createAndUpdate(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.get("/features", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await featureController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/feature/create", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await featureController.create(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/feature/update", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await featureController.update(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/feature/remove", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await featureController.remove(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/* clubs */

router.get("/club/recentclubrequests", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.recentClubRequests(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/club/clubrequests", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.clubRequests(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/clubs", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/club/:id", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.getClubById(req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/club/remove", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.remove(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/club/acceptclubrequest", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.acceptClubRequest(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/club/declineclubrequest", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await clubController.declineClubRequest(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/*Promotions*/
router.get("/club/getpromotions/:club_id", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {

		let result = await promotionController.getPromotionByClub(req.params, res);
		
	} catch(err) {
		console.log(err);
	}
});
router.post("/promotion/detail", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {

		let result = await promotionController.getPromotionDetail(req.body, res);
		
	} catch(err) {
		console.log(err);
	}
});
router.post("/promotion/history", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {

		let result = await promotionController.getPromotionHistory(req.body, res);
		
	} catch(err) {
		console.log(err);
	}
});

router.post("/promotion/setting/save", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await promotionController.savePromotionSetting(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/promotion/settings/", middleware.authenticate,middleware.authenticate, async (req, res) => {
	try {
		let result = await promotionController.getPromotionSettings(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/promotiondashboard/", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await adminController.getPromotionDashboard(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
/*Queries*/
router.get("/queries/fetch/", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await queryController.fetchQuaries(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/query/detail/:query_id", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await queryController.fetchQuaryDetail(req.session, req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/query/resolve/", middleware.authenticate,middleware.isSuperAdmin, async (req, res) => {
	try {
		let result = await queryController.resolveQuery(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});


module.exports = router;
