var express = require('express');
router = express.Router();
const middleware = require('../middleware');

let menuController = require('../../controllers/app/menuController.js');




/*start*/

router.post("/menus/:booking_id", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {
	try {

		let result = await menuController.getMenus(req.session, req.params, req.body, res);



	} catch(err) {
		console.log(err);
	}
});

module.exports = router;