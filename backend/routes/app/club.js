var express = require('express');
router = express.Router();
const middleware = require('../middleware');

let clubController = require('../../controllers/app/clubController.js');


/*start*/

router.post("/getClub/:page", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await clubController.getClub(req.params,req.body, res);

	} catch(err) {
		console.log(err);
	}
});
module.exports = router;