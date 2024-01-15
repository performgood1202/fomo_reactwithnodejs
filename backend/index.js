require('dotenv').config();
const express = require('express');
const path = require('path');
const util = require('util');
const cookieParser = require('cookie-parser');
let cors = require('cors')
let dbConfig = require(`./config/connection.js`);
let useragent = require('express-useragent');
const schedule = require('node-schedule');

let indexRoute = require('./routes/index.js');
let authRoute = require('./routes/account/auth.js');
let adminRoute = require('./routes/admin');
let ownerRoute = require('./routes/owner');
let managerRoute = require('./routes/manager');
let apiRoute = require('./routes/api');
let appRoute = require('./routes/app');
let subscriptionRoute = require('./routes/subscription');

let ownerController = require('./controllers/owner/ownerController.js');
let bookingController = require('./controllers/app/bookingController.js');
const socketController = require('./controllers/socketController.js');



var app = express()
var http = require('http').createServer(app);
/* socket */
var io = require('socket.io')(http, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  },
  cookie: false,
  transports: ["websocket"]

});

io.on('connection', client => {

	socketController.addNewClient(client);

  client.on('disconnect', () => {
    
    socketController.removeClient(client);

  });

});
/* end socket */
dbConfig.setConnection();

app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({
  	extended: false
}))
app.use(cookieParser());
app.use(useragent.express());

app.use(function(req, res, next) {
  	res.header('server', '*');
 	next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/owner", ownerRoute);
app.use("/manager", managerRoute);
app.use("/api", apiRoute);
app.use("/app", appRoute);
app.use("/subscription", subscriptionRoute);

http.listen(process.env.PORT || 8082, function () {
	let _msgg = `Server listening on port: ${http.address().port} with config: ${process.env.NODE_ENV}`;
  	console.log(_msgg)
});
const job = schedule.scheduleJob('*/59 * * * *', function(req,res){
    try {
		 ownerController.checkEvent();
     bookingController.CheckEventStart();
	} catch(err) {
		console.log(err);
	}
});



