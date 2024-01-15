var express = require('express');
router = express.Router();
const middleware = require('../middleware');

let eventController = require('../../controllers/app/eventController.js');


/*start*/
router.post("/events/:page", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await eventController.getEvents(req.params,req.body, res);

	} catch(err) {
		console.log(err);
	}
});

router.post("/getClubEvent/:club_id/:page", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await eventController.getClubEvent(req.body, req.params, res);

	} catch(err) {
		console.log(err);
	}
});

router.get("/getEventDetail/:event_id", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await eventController.getEventDetail(req.params, res);

	} catch(err) {
		console.log(err);
	}
});
module.exports = router;