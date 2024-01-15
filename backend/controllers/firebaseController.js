require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../Util/statusCode.js");
let baseResponse = require("../Util/baseResponse.js");
const jwtHelper = require('../Util/jwtHelper')
const User = require('../models/user.js');
const Session = require('../models/session.js');
const queryModal = require('../models/query.js');
const notificationModal = require('../models/notification.js');
const SendEmail = require('../helpers/send-email.js');
const socketController = require('./socketController');

var admin = require("firebase-admin");

var serviceAccount = require("../blankapp.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const sendNotification = async (title,text,params,user) => {
   
          const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
          };
          console.log("here")

          const  registrationToken = user.device_token;
          //const  registrationToken = "evPO3zvASNGxmEXh3rX2pK:APA91bHkrBkpNtk1sSxxtxtPtqKH9NlJGYSB7f0O9FodJLUa0egRCG4s8HTiuXqV7C4WtN4M-APXCbqdyC38qZDirrDlCrUZnMaIOK6cLtHqMmD8ETyXLfk2AYYrfLxDNElg00QOZcee";
          const message = { 
                            notification: {
  		                        title: title,
  		                        body: text,
  		                        //icon: 'http://122.160.12.75:4567/fomoapp/backend/uploads/icon/icon.png'
                            },
      						          data: params
                          };
          const options =  notification_options;
          
            admin.messaging().sendToDevice(registrationToken, message, options)
            .then( response => {

             console.log(response.results)
             
            })
            .catch( error => {
                console.log(error);
            });
}
module.exports = {
	sendNotification
}
