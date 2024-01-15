var express = require('express');
router = express.Router();
const middleware = require('../middleware');

let bookingController = require('../../controllers/app/bookingController.js');


/*start*/

router.get("/mybookings/:page", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await bookingController.mybookings(req.session, req.params, req.body, res);



	} catch(err) {
		console.log(err);
	}
});
router.get("/mybooking/:id", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await bookingController.mybookingById(req.session, req.params, res);



	} catch(err) {
		console.log(err);
	}
});

router.post("/cancelBooking/", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await bookingController.cancelBooking(req.session, req.body, res);



	} catch(err) {
		console.log(err);
	}
});
router.post("/getPaymenturl/", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await bookingController.getPaymenturl(req.session, req.body, res);



	} catch(err) {
		console.log(err);
	}
});
router.get("/success_payment/:checkout_session_id", async (req, res) => {
	try {

	  
      let result = await bookingController.confirmPayment(req.params, res);


	} catch(err) {
		console.log(err);
	}
});

router.post("/socialShare", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

	  
      let result = await bookingController.socialShare(req.session, req.body, res);


	} catch(err) {
		console.log(err);
	}
});

router.post("/currentBooking", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

	  
      let result = await bookingController.currentBooking(req.session, req.body, res);


	} catch(err) {
		console.log(err);
	}
});

/* Query*/
router.post("/bookingQuery", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

	  
      let result = await bookingController.bookingQuery(req.session, req.body, res);


	} catch(err) {
		console.log(err);
	}
});

module.exports = router;