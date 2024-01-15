var express = require('express');
var router = express.Router();
var statusCode = require("../Util/statusCode.js")
var baseResponse = require("../Util/baseResponse.js");


router.post("/test", async (req, res) => {
	res.send("server is working");
});


module.exports = router;