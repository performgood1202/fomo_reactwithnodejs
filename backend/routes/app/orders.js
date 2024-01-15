var express = require('express');
router = express.Router();
const middleware = require('../middleware');

let orderController = require('../../controllers/app/orderController.js');

var multer = require('multer');
const path = require('path');

var storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/user/')
  },
  filename: function (req, file, cb) {
  //	     
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var uploadUser = multer({ storage: storageUser });


/*start*/

router.post("/createOrder/", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {

	try {

    let bodyy = {};

    if(req.body.menus && req.body.menus.length > 0){
        for (var i = 0; i < req.body.menus.length; i++) {
            let objectt = {};
            bodyy[req.body.menus[i].id] = req.body.menus[i].quantity;
           // bodyy.push(objectt)
        }
    }
    if(req.body.menus){
      req.body.menus = bodyy;
    }
    
   // console.log(req.body); 
	  let result = await orderController.createOrder(req.session, req.body, res);

	} catch(err) {
		console.log(err);
	}

});

router.get("/getOrders/:booking_id", middleware.authenticateApp, middleware.isAppUser, async (req, res) => {

  try {

    let result = await orderController.getOrders(req.session, req.params, res);

  } catch(err) {
    console.log(err);
  }

});


module.exports = router;