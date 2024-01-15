var express = require('express');
var router = express.Router();
const middleware = require('../middleware');

let subscriptionController = require('../../controllers/subscriptionController.js');

router.post("/create", async (req, res) => {
	try {
		let result = await subscriptionController.create(req.body, res);
	} catch(err) {
		console.log(err);
	}

});

module.exports = router;