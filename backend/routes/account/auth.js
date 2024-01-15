var express = require('express');
var router = express.Router();
const middleware = require('../middleware');

let accountController = require('../../controllers/accountController.js');


router.post("/login", async (req, res) => {
	try {
		let result = await accountController.login(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/ForgotPassword", async (req, res) => {
	try {
		let result = await accountController.ForgotPassword(req.body, res);
	} catch(err) {
		console.log(err);
	}
});
router.post("/ResetPassword", async (req, res) => {
	try {
		let result = await accountController.ResetPassword(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/register", async (req, res) => {
	try {
		let result = await accountController.register(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/create_admin", async (req, res) => {
	try {
		let result = await accountController.createAdmin(req.body, res);
	} catch(err) {
		console.log(err);
	}
});

router.get("/info", middleware.authenticate, async (req, res) => {
	try {
		let result = await accountController.info(req.session, res);
	} catch(err) {
		console.log(err);
	}
});

router.post("/profile/update",middleware.authenticate, async (req, res) => {
	try {
		let result = await accountController.updateProfile(req.session, req.body, res);
	} catch(err) {
		console.log(err);
	}
});


module.exports = router;