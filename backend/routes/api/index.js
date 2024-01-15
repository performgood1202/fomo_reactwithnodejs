var express = require('express');
var router = express.Router();
const middleware = require('../middleware');
const stripe = require('stripe');
let config = process.env;

const endpointSecret = config.WEBHOOK_ENDPOINT_SECRET


let plansController = require('../../controllers/admin/plans/plansController.js');

let featureController = require('../../controllers/admin/plans/featureController.js');

let queryController = require('../../controllers/queryController.js');

let subscriptionController = require('../../controllers/subscriptionController.js');

let settingController = require('../../controllers/settingController.js');

let notificationController = require('../../controllers/notificationController.js');


router.get("/plans", async (req, res) => {
	try {
		let result = await plansController.fetchApiPlans(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/features", async (req, res) => {
	try {
		let result = await featureController.fetch(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/plan/:id", async (req, res) => {
	try {
		let result = await plansController.fetchPlanDetail(req.params, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/sendquery", async (req, res) => {
	try {
		let result = await queryController.create(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/webhook", async (req, res) => {

	

	  try {
	   // event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
	    let result = await subscriptionController.webhookEvent(req.body,res);

	  } catch (err) {
	  	
	  	console.log(err.message);
	   
	  }
});

/* setting*/

router.post("/saveSetting", middleware.authenticate, async (req, res) => {
	try {
		let result = await settingController.saveSettings(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/getSettings", middleware.authenticate, async (req, res) => {
	try {
		let result = await settingController.getSettings(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});

/* Notifications*/
router.get("/getNotificationCount", middleware.authenticate, async (req, res) => {
	try {
		let result = await notificationController.getNotificationCount(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.get("/getNotifications", middleware.authenticate, async (req, res) => {
	try {
		let result = await notificationController.getNotifications(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.get("/readNotification/:notification_id", middleware.authenticate, async (req, res) => {
	try {
		let result = await notificationController.readNotification(req.session, req.params, res);
	} catch(err) {
		console.log(err);
	}
});


module.exports = router;