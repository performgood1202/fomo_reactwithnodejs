require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let appBaseResponse = require("../../Util/appBaseResponse.js");
const jwtHelper = require('../../Util/jwtHelper')
const User = require('../../models/user.js');
const Session = require('../../models/session.js');
const userData = require('../../models/userData.js');
const Club = require('../../models/club.js');
const EventBenefitModal = require('../../models/benefit.js');
const EventModal = require('../../models/events.js');
const Booking = require('../../models/booking.js');
const EventImageModal = require('../../models/eventImage.js');
const Stripe = require('../../config/stripe.js');
const queryModal = require('../../models/query.js');
const SendEmail = require('../../helpers/send-email.js');
const moment = require('moment');
const notificationController = require('../notificationController.js');
const firebaseController = require('../firebaseController.js');

const SettingModal = require('../../models/setting.js');
let config = process.env;





const getPaymenturl = async (session, body, res) => {

  const response = new appBaseResponse(res);

  

  try {

    await User.findOne({_id:session._id}).then( 
            async (user) => {
              
              if(user){

                /*  for customer */



                let stripe_customer_id = "";

                if(user && user.stripe_customer_id && user.stripe_customer_id != ""){
                        stripe_customer_id = user.stripe_customer_id;
                }else{
                        let customer_data =  await Stripe.createCustomer(user);

                        if(customer_data.id){

                          stripe_customer_id = customer_data.id;

                          let user_body = {_id:session._id};

                          let updateData = {};

                            let update_data_parms = {};


                          update_data_parms["stripe_customer_id"] = stripe_customer_id;

                          updateData["$set"] = update_data_parms;

                           await User.find(user_body).updateOne(user_body,updateData).then( 
                                      async (user_d) => {

                                      }
                              );


                        }else{
                          response.sendResponse(201, customer_data, false, null);
                        } 

                }
                /* end  for customer */

                if(stripe_customer_id && stripe_customer_id != ""){

                        let deleteOldPaymentData = await deleteOldPayment();

                        if(deleteOldPaymentData && deleteOldPaymentData == "1"){
                            await createPayment(session, body, stripe_customer_id,res);
                        }else{
                          response.sendResponse(201, "Delete old payment issue!", false, null);
                        }

                        //await createPayment(session, body, stripe_customer_id,res)



                  //let customer_data =  await Stripe.createCheckoutSession(user,body,stripe_customer_id);
                }else{
                  response.sendResponse(201, "Stripe customer not found!", false, null);
                }

                


              }else{
                response.sendResponse(201, "User not found!", false, null);
              }
        }
      ).catch(
        (error) => {
          response.sendResponse(201, error.message, false, null);
        }
    )

  } catch(err) {
    //throw err;
    response.sendResponse(201, err.message, false, null);
  }

  return true;
}

const checkSeat = async (event,quantity) => {

  
   let booking_data_count = await Booking.find({event_id:event._id,status: { $ne: "2" }}).then(async(bk_data) => {
                                    let bk_seat = 0;       

                                    if(bk_data && bk_data.length > 0){


                                          for (const [key, booking_data] of Object.entries(bk_data)) {

                                            if(booking_data.is_guest && booking_data.is_guest == "1"){


                                              
                                            }else{
                                               bk_seat = parseInt(booking_data.quantity) +  bk_seat; 
                                            }

                                          }

                                    }  
                                    return bk_seat;
                              })

   booking_data_count = booking_data_count + parseInt(quantity);

   if(booking_data_count > event.avail_seats){
      return false;
   }else{
      return true;
   }  


}
const checkGuestSeat = async (event,quantity,is_guest) => {

  
   let booking_data_count = await Booking.find({event_id:event._id,status: { $ne: "2" }}).then(async(bk_data) => {
                                    let bk_seat = 0;       

                                    if(bk_data && bk_data.length > 0){


                                          for (const [key, booking_data] of Object.entries(bk_data)) {

                                             if(booking_data.is_guest && booking_data.is_guest == "1"){
                                                bk_seat = parseInt(booking_data.quantity) +  bk_seat;
                                             }

                                             

                                          }

                                    }  
                                    return bk_seat;
                              })

   booking_data_count = booking_data_count + parseInt(quantity);

  // console.log(booking_data_count)

   if(booking_data_count > event.avail_guest_seats){
      return false;
   }else{
      return true;
   }  


}
const deleteOldPayment = async () => {

  
   let booking_data_count = await Booking.find({payment_status:"0"}).then(async(bk_data) => {   

                                    if(bk_data && bk_data.length > 0){


                                        for (const [key, booking_data] of Object.entries(bk_data)) {

                                            let cr_date = new Date();
                                            let created_date = booking_data.createdAt;
                                            let future_created_date = new Date(created_date.getTime() + 15*60000);

                                           // if(cr_date > future_created_date){
                                                 let expireSessionData =  await Stripe.expireSession(booking_data.checkout_session_id);


                                                 if(expireSessionData && expireSessionData.id){

                                                      await Booking.findOne({_id:booking_data._id}).deleteOne().then(async(bk_data) => { 
                                                            return true;
                                                      })



                                                 }
                                           // }

                                        }

                                    }  
                                    return "1";
                              })

   return "1";

  


}




const createPayment = async (session, body, stripe_customer_id, res) => {

	const response = new appBaseResponse(res);

	try{


		await EventModal.findOne({_id:body.event_id}).then( 
            async (event) => {
            	
            	if(event){

                let checkSeatdata = await checkSeat(event,body.quantity);

                 let checkGuestSeatData = false;

                 if(body.is_guest && body.is_guest == "1"){

                    checkGuestSeatData = await checkGuestSeat(event,body.quantity,body.is_guest);

                    checkSeatdata = true;

                 }else{

                    checkGuestSeatData = true;

                 }

                  if(checkSeatdata){

                    

                     if(checkGuestSeatData){
                     

                  		let price = event.booking_price * parseInt(body.quantity);

                        let tax = "";

                        const clubdata =   await Club.findOne({_id:event.club_id}).then( 
                                                      async (club) => {
                                                          return club;
                                                      }
                                               );

                        if(clubdata && clubdata._id){

                           const settingdata =   await SettingModal.findOne({user_id:clubdata.user_id,"setting_key":"tax"}).then( 
                                                async (setting) => {
                                                    return setting;
                                                }
                                         );

                           if(settingdata && settingdata._id){

                              if(settingdata.setting_key == "tax"){

                                 let tax_percentage = settingdata.setting_value;

                                 tax = (price * tax_percentage) / 100;

                                 price = price + tax;

                              }

                           }

                        }

                  		let pr_name = event.title;

                        if(body.card && body.card != ""){

                            let createCardPaymentData =  await Stripe.createCardPayment(pr_name,price,stripe_customer_id,body.card);

                            if(createCardPaymentData && createCardPaymentData.id){

                              if(createCardPaymentData.status == "succeeded"){

                               let createBookingCard_data = await createBookingWithCard(session,body,event,price,tax,createCardPaymentData.id,res);

                              }else{
                                response.sendResponse(201, "Pending payment with card issue", false, null);
                              }
                            }else{
                               response.sendResponse(201, createCardPaymentData, false, null);
                            }

                        }else{



                        		let createCheckoutSession =  await Stripe.createCheckoutSession(pr_name,price,stripe_customer_id);

                        		if(createCheckoutSession && createCheckoutSession.id){

                                          const checkout_session_id = createCheckoutSession.id;

                                          const checkout_session_url = createCheckoutSession.url;


                                          let createBooking_data = await createBooking(session,body,event,price,tax,checkout_session_id);

                                          if(createBooking_data  && createBooking_data._id){
                                              /* start */
                                              let body_data = {_id:event._id};

                                              await updateEventBookingCount(body_data)
                                              /*end*/

                                                const data_return = {
                                                      payment_url : checkout_session_url
                                                }
                                                

                                                let result = {};

              
                                                // success message
                                                result.status = 200;
                                                result.message = "";
                                                result.isSuccess = true;
                                                result.data = data_return;

                                                response.sendResponse(result.status, result.message, result.isSuccess, result.data);

                                          }else{
                                             response.sendResponse(201, "Create booking issue!", false, null);
                                          }

                        			

                        		}else{
                                          response.sendResponse(201, "session create error!", false, null);
                        		}
                        }    
                     }else{
                        response.sendResponse(201, "No Guest seat available!", false, null);
                     }   
                  }else{
                     response.sendResponse(201, "No seat available!", false, null);
                  }   

            	}else{
            		response.sendResponse(201, "Event not found!", false, null);
            	}
            }	
        ).catch(
		    (error) => {
		    	response.sendResponse(201, error.message, false, null);
		    }
		)
	



	} catch(err) {
		//throw err;
		response.sendResponse(201, err.message, false, null);
	}
}




const createBooking =  async (session,body,event,total_price,tax,checkout_session_id) => {


      try{

            let is_guest = "0";

            if(body.is_guest && body.is_guest == "1"){
               is_guest = "1";
            }

            let instagram_link = "";

            if(body.instagram_link && body.instagram_link != ""){
                 instagram_link = body.instagram_link;
            }

            let booking = new Booking({
                                    user_id: session._id,
                                    event_id: body.event_id,
                                    club_id: event.club_id,
                                    name: event.title,
                                    price: event.booking_price,
                                    quantity: body.quantity,
                                    total_price: total_price,
                                    tax: tax,
                                    checkout_session_id: checkout_session_id,
                                    instagram_link : instagram_link,
                                    is_guest: is_guest,
                              });
            const booking_data =  await booking.save().then((bk_data) => {
                                    return bk_data;
                              }).catch(
                                  (error) => {
                                    return error.message;
                                  }
                              )

            return booking_data;



      } catch(err) {
            //throw err;
            return err.message;
      }
}
const createBookingWithCard =  async (session,body,event,total_price,tax,stripe_payment_id,res) => {

    const response = new appBaseResponse(res);

      try{

            let is_guest = "0";

            if(body.is_guest && body.is_guest == "1"){
               is_guest = "1";
            }

            let instagram_link = "";

            if(body.instagram_link && body.instagram_link != ""){
                 instagram_link = body.instagram_link;
            }

            let booking = new Booking({
                                    user_id: session._id,
                                    event_id: body.event_id,
                                    club_id: event.club_id,
                                    name: event.title,
                                    price: event.booking_price,
                                    quantity: body.quantity,
                                    total_price: total_price,
                                    tax: tax,
                                    stripe_payment_id: stripe_payment_id,
                                    instagram_link : instagram_link,
                                    is_guest: is_guest,
                                    status: "1",
                                    payment_status: "1",
                              });
            await booking.save().then(async(bk_data) => {

                            let body_data = {_id:event._id};

                            await updateEventBookingCount(body_data)
                            /*end*/



                            if(bk_data && bk_data.event_id){

                                User.findOne({_id:bk_data.user_id}).then(
                                  async (customer) => {

                                    if(customer && customer._id){

                                        Club.findOne({_id:bk_data.club_id}).then(
                                          async (clubbb) => {
                                            

                                            if(clubbb && clubbb.user_id){
                                              let notification_link = "";

                                              if(bk_data.event_id){
                                                notification_link = "/owner/bookings/"+bk_data.event_id;
                                              }
                                              let message_noti = "<h3>"+customer.fName+" "+customer.lName+" <span>has booked an event.</span></h3>";
                                              await notificationController.Save(message_noti,clubbb.user_id,"Booking","Booking",notification_link);

                                            }
                                        })
                                    }
                                })       
                            } 
                              const data_return = {
                                    payment_url : "",
                              }

                              let titlee = "Event Booking!";
                              let textt = "Event has been successfully booked!";
                              let params = {
                                  "type" : "booking",
                                  "booking_id" : bk_data.id,
                                  "event_id" : bk_data.event_id,
                              }

                              await firebaseController.sendNotification(titlee,textt,params,session);

                              let result = {};


                              // success message
                              result.status = 200;
                              result.message = "Successfully add booking!";
                              result.isSuccess = true;
                              result.data = data_return;

                              response.sendResponse(result.status, result.message, result.isSuccess, result.data);
                           

                  }).catch(
                      (error) => {
                         response.sendResponse(201, error.message, false, null);
                      }
                  )




      } catch(err) {
          response.sendResponse(201, err.message, false, null);
      }
}

const updateEventBookingCount = async (body_data) => {
   try{
      await EventModal.findOne(body_data).then( 
            async (eventtt_data) => {

                if(eventtt_data && eventtt_data._id){

                    let bk_count = 1;

                    if(eventtt_data.booking_count && eventtt_data.booking_count != ""){
                        bk_count = eventtt_data.booking_count + 1;
                    }

                    let updateData = {};

                    let update_data_parms = {};

                    update_data_parms["booking_count"] = bk_count;

                    updateData["$set"] = update_data_parms;

                    await EventModal.find(body_data).updateOne(body_data,updateData).then( 
                      async (bkkk) => {
                         return bkkk;

                      }
                    )
                }

            }
          )
    } catch(err) {
        return err.message
    }
}
const confirmPayment = async (body, res) => {

      const response = new appBaseResponse(res);

      try{


            if(body.checkout_session_id){

                  let session_data = await Stripe.StripeSession(body.checkout_session_id);

                  if(session_data && session_data.id){

                        if(session_data.payment_status == "paid"){


                              let body_data = {checkout_session_id:body.checkout_session_id};

                              let updateData = {};

                              let update_data_parms = {};


                              update_data_parms["stripe_payment_id"] = session_data.payment_intent;
                              update_data_parms["payment_status"] = "1";
                              update_data_parms["status"] = "1";

                              updateData["$set"] = update_data_parms;

                              Booking.find(body_data).updateOne(body_data,updateData).then( 
                                async (booking) => {

                                   // console.log()

                                    Booking.findOne(body_data).then( 
                                      async (bookingD) => {

                                          
                                          if(bookingD && bookingD.event_id){

                                              User.findOne({_id:bookingD.user_id}).then(
                                                async (customer) => {

                                                  if(customer && customer._id){

                                                      Club.findOne({_id:bookingD.club_id}).then(
                                                        async (clubbb) => {

                                                          if(clubbb && clubbb.user_id){
                                                            let notification_link = "";

                                                            let titlee = "Event Booking!";
                                                            let textt = "Event has been successfully booked!";
                                                            let params = {
                                                                "type" : "booking",
                                                                "booking_id" : bookingD.id,
                                                                "event_id" : bookingD.event_id,
                                                            }

                                                            await firebaseController.sendNotification(titlee,textt,params,customer);

                                                            if(bookingD.event_id){
                                                              notification_link = "/owner/bookings/"+bookingD.event_id;
                                                            }
                                                            let message_noti = "<h3>"+customer.fName+" "+customer.lName+" <span>has booked an event.</span></h3>";
                                                            await notificationController.Save(message_noti,clubbb.user_id,"Booking","Booking",notification_link);

                                                          }
                                                      })
                                                  }
                                              })       
                                          } 
                                    })


                                    let data_return = {
                                          payment : true
                                    }



                                    let result = {};
                                    // success message
                                    result.status = null;
                                    result.message = "";
                                    result.isSuccess = true;
                                    result.data = null;
                                   // return true;

                                    response.emptyResponse();

                                }
                              ).catch(
                                  (error) => {
                                    response.sendResponse(201, error.message, false, null);  
                                  }
                              )

                        }else{
                              response.sendResponse(201, "Payment status not paid!", false, null);  
                        }





                  }else{
                     response.sendResponse(201, "session id not found!", false, null); 
                  }


            }else{

                  response.sendResponse(201, "session id issue!", false, null);

            }


      } catch(err) {
            //throw err;
            response.sendResponse(201, err.message, false, null);
      }
}

const mybookings =  async (session,params,body,res) => {

      const response = new appBaseResponse(res);

      try{


        var perPage = 10;

        let page = parseInt(params.page);

        page = page >= 1 ? page : 1;

        page = parseInt(page);

         Booking.find({user_id:session._id, payment_status:"1"}).sort({booking_id : -1}).then( 

               async (bookings) => {

                  let bk_data = {upComingBooking:null,pastBooking:null};

                  if(bookings && bookings.length > 0){


                        const upComingBooking = [];
                        const pastBooking = [];
                        let bookingTotalPage = 0;



                        for (const [key, booking] of Object.entries(bookings)) {

                              
                             /*start*/
                              const event_data = await EventModal.findOne({_id:booking.event_id}).then( 
                                       async (event) => {

                                          return event;
                                              
                                    });
                              if(event_data && event_data._id){

                                   var event_date = new Date(event_data.event_date);

                                   var cr_date = new Date();

                                   const booking_dattt = {booking:booking,event:event_data,club:null,benefit:[],images:[],cancel_booking:0};



                                    let event_prev_date = new Date(event_date);

                                    event_prev_date.setDate(event_prev_date.getDate() - 1);

                                    if(cr_date >= event_prev_date){

                                       booking_dattt.cancel_booking = 1;

                                    }


                                   const club =    await Club.findOne({_id:event_data.club_id}).then( 
                                                async (club) => {
                                                    return club;
                                                   }
                                            );

                        
                                    if(club && club._id){

                                       booking_dattt.club = club;
                                       
                                    } 

                                   const event_body = {eventid:event_data._id};

                           
                                   const benefits =    await EventBenefitModal.find(event_body).then( 
                                                async (benefits) => {
                                                    return benefits;
                                                   }
                                            );

                        
                                    if(benefits && benefits.length > 0){

                                       booking_dattt.benefit = benefits;
                                       
                                    }  
                                    const images =   await EventImageModal.find(event_body).then( 
                                                            async (images) => {
                                                                return images;
                                                            }
                                                     );

                                    
                                    if(images && images.length > 0){

                                       booking_dattt.images = images;
                                       
                                    }  


                                   if(event_date >= cr_date){
                                      upComingBooking.push(booking_dattt);
                                   }else{


                                      pastBooking.push(booking_dattt);
                                      bookingTotalPage++;


                                   }


                              }
                             /*end*/

                        }

                        let past_booking_data = await paginate(pastBooking, perPage, page);

                        totalPage = Math.ceil( bookingTotalPage / perPage);

                        past_booking_data = {bookings:past_booking_data,page:page,perPage:perPage,totalPage:totalPage};

                        bk_data.upComingBooking = upComingBooking;
                        bk_data.pastBooking = past_booking_data;

                  } 

                  const data_return = bk_data;

                  let result = {};


                  // success message
                  result.status = 200;
                  result.message = "";
                  result.isSuccess = true;
                  result.data = data_return;

                  response.sendResponse(result.status, result.message, result.isSuccess, result.data);

                    
       
               }
         ).catch(
             (error) => {
               response.sendResponse(201, error.message, false, null);  
             }
         )


      } catch(err) {
            //throw err;
         response.sendResponse(201, err.message, false, null);
      }
}
const mybookingById =  async (session,body,res) => {

const response = new appBaseResponse(res);

      try{

         Booking.findOne({user_id:session._id,_id:body.id}).then( 

               async (booking) => {

                  if(booking && booking._id){
                              
                             /*start*/
                              const event_data = await EventModal.findOne({_id:booking.event_id}).then( 
                                       async (event) => {

                                          return event;
                                              
                                    });
                              if(event_data && event_data._id){

                                   var event_date = new Date(event_data.event_date);

                                   var cr_date = new Date();

                                   const booking_dattt = {booking:booking,event:event_data,club:null,benefit:[],images:[],cancel_booking:0};


                                    let event_prev_date = new Date(event_date);

                                    event_prev_date.setDate(event_prev_date.getDate() - 1);

                                    console.log(cr_date,event_prev_date)

                                    if(cr_date >= event_prev_date){

                                       booking_dattt.cancel_booking = 1;
                                       
                                    }


                                   const club =    await Club.findOne({_id:event_data.club_id}).then( 
                                                async (club) => {
                                                    return club;
                                                   }
                                            );

                        
                                    if(club && club._id){

                                       booking_dattt.club = club;
                                       
                                    } 

                                   const event_body = {eventid:event_data._id};

                           
                                   const benefits =    await EventBenefitModal.find(event_body).then( 
                                                async (benefits) => {
                                                    return benefits;
                                                   }
                                            );

                        
                                    if(benefits && benefits.length > 0){

                                       booking_dattt.benefit = benefits;
                                       
                                    }  
                                    const images =   await EventImageModal.find(event_body).then( 
                                                            async (images) => {
                                                                return images;
                                                            }
                                                     );

                                    
                                    if(images && images.length > 0){

                                       booking_dattt.images = images;
                                       
                                    }  


                                     /* if(event_date >= cr_date){
                                         upComingBooking.push(booking_dattt);
                                      }else{
                                         pastBooking.push(booking_dattt);
                                      }*/

                                     const data_return = booking_dattt;

                                    let result = {};


                                    // success message
                                    result.status = 200;
                                    result.message = "";
                                    result.isSuccess = true;
                                    result.data = data_return;

                                    response.sendResponse(result.status, result.message, result.isSuccess, result.data);


                              }else{
                                  response.sendResponse(201, "Event not found!", false, null);  
                              }
                             /*end*/

                      

                  }else{
                     response.sendResponse(201, "Booking not found!", false, null);  
                  }

                  

                    
       
               }
         ).catch(
             (error) => {
               response.sendResponse(201, error.message, false, null);  
             }
         )


      } catch(err) {
            //throw err;
         response.sendResponse(201, err.message, false, null);
      }
}

const cancelBooking = async (session, body, res) => {

  const response = new appBaseResponse(res);

  

  try {

    await Booking.findOne({_id:body.booking_id,user_id:session._id}).then( 
            async (booking) => {
              
              if(booking && booking._id){

                if(booking.stripe_vendor_payment_intent_id && booking.stripe_vendor_payment_intent_id != ""){

                  response.sendResponse(201, "You are no able to cancel booking now!", false, null);

                }else{

                    if(booking.stripe_payment_id && booking.stripe_payment_id != ""){

                        $refund_payment = await Stripe.refundPayment(booking.stripe_payment_id);

                        if($refund_payment.id){

                                let body_data = {_id:booking._id};

                                let updateData = {};

                                let update_data_parms = {};

                                update_data_parms["status"] = "2";

                                updateData["$set"] = update_data_parms;

                                Booking.find(body_data).updateOne(body_data,updateData).then( 
                                  async (booking) => {

                                      let result = {};
                                      // success message
                                      result.status = 200;
                                      result.message = "Successfully cancel booking!";
                                      result.isSuccess = true;
                                      result.data = null;

                                      response.sendResponse(result.status, result.message, result.isSuccess, result.data);

                                  }
                                ).catch(
                                    (error) => {
                                      response.sendResponse(201, error.message, false, null);  
                                    }
                                )


                        }else{
                           response.sendResponse(201, $refund_payment, false, null);
                        }

                    }else{
                      response.sendResponse(201, "User not able to cancel because payment not completed!", false, null);
                    }
                } 


              }else{
                response.sendResponse(201, "Booking not found!", false, null);
              }
        }
      ).catch(
          (error) => {
            response.sendResponse(201, error.message, false, null);
          }
      )

  } catch(err) {
    //throw err;
    response.sendResponse(201, err.message, false, null);
  }

  return true;
}

const paginate = async (array, page_size, page_number) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const socialShare =  async (session,body,res) => {

const response = new appBaseResponse(res);

      try{
  
          let body_data = {_id:body.booking_id,user_id:session._id};


          let updateData = {};

          let update_data_parms = {};

          update_data_parms["instagram_link"] = body.instagram_link;

          updateData["$set"] = update_data_parms;

          await Booking.find(body_data).updateOne(body_data,updateData).then( 
                  async (booking) => {


                      let result = {};
                      // success message
                      result.status = 200;
                      result.message = "Successfully add instagram link!";
                      result.isSuccess = true;
                      result.data = null;

                      response.sendResponse(result.status, result.message, result.isSuccess, result.data);

                  }
                ).catch(
                    (error) => {
                      response.sendResponse(201, error.message, false, null);  
                    }
                )

               
        


      } catch(err) {
            //throw err;
         response.sendResponse(201, err.message, false, null);
      }
}

const currentBooking =  async (session,body,res) => {

    const response = new appBaseResponse(res);

      try{

        await Booking.find({user_id:session._id}).then( 
              async (bookings) => {

                if(bookings && bookings.length > 0){


                  let cr_booking  = null;


                    for (const [keyBooking, booking] of Object.entries(bookings)) {

                          let body_data = {};

                          let and_data = [];

                          let or_data = [];

                          let cr_date = moment(body.cr_date).utcOffset(0, true);

                          cr_date = new Date(cr_date);

                          and_data.push({_id: booking.event_id});
                          and_data.push({event_date: {'$lte': cr_date }});
                          and_data.push({event_end_date: {'$gte': cr_date }});

                          body_data["$and"] = and_data;


                          const event_check = await EventModal.findOne(body_data).then( 
                                  async (event) => {
                                    return event;
                              })

                          if(event_check && event_check._id){
                              cr_booking = booking;
                              break;
                          }
                    } 

                  if(cr_booking  && cr_booking._id){

                        const data_return = {
                          booking_id : cr_booking._id
                        };

                        let result = {};


                        // success message
                        result.status = 200;
                        result.message = "";
                        result.isSuccess = true;
                        result.data = data_return;

                        response.sendResponse(result.status, result.message, result.isSuccess, result.data);
                      
                  }else{
                    response.sendResponse(201, "Bookings not found", false, null); 
                  }
                  

                }else{
                   response.sendResponse(201, "Bookings not found", false, null); 
                }

        }).catch(
            (error) => {
              response.sendResponse(201, error.message, false, null);  
            }
        )
  
          

      } catch(err) {
            //throw err;
         response.sendResponse(201, err.message, false, null);
      }
}
const bookingQuery =  async (session,body,res) => {

    const response = new appBaseResponse(res);

      try{

          await Booking.findOne({user_id:session._id,_id:body.booking_id}).then( 
              async (booking) => {

                if(booking && booking.club_id){


                      const club_data = await Club.findOne({_id:booking.club_id}).then( 
                                  async (club) => {
                                    return club;
                              })

                      if(club_data && club_data._id){

                            let query = new queryModal({
                              name    : session.fName+" "+session.lName,
                              email   : session.email,
                              phone   : "+"+session.phone_country_code+""+session.phone,
                              message   : body.message,
                              user_type : "App",
                              query_type  : "Booking",
                              assign_to : club_data.user_id,
                            });



                            query.save().then(
                              async (query) => {
                                let user_mail = await SendEmail.sendQueryMailToUser(query);
                                let admin_mail = await SendEmail.sendQueryMailToAdmin(query,club_data.email);

                                          
                                if(query && query._id){

                                      if(club_data && club_data.user_id){
                                        let notification_link = "";

                                        if(query._id){
                                          notification_link = "/owner/query/"+query._id;
                                        }
                                        let message_noti = "<h3>"+session.fName+" "+session.lName+" <span>has a query.</span></h3>";
                                        await notificationController.Save(message_noti,club_data.user_id,"Query","App",notification_link);

                                      }         
                                }

                                let result = {};


                                // success message
                                result.status = 200;
                                result.message = "Query send successfully!";
                                result.isSuccess = true;
                                result.data = null;

                                response.sendResponse(result.status, result.message, result.isSuccess, result.data);
                              }
                            )
                            .catch(
                                (error) => {
                                  response.sendResponse(201, error.message, false, null); 
                                }
                              )

                      }else{
                        response.sendResponse(201, "Club not found!", false, null); 
                      }

                }else{
                   response.sendResponse(201, "Booking not found", false, null); 
                }

        }).catch(
            (error) => {
              response.sendResponse(201, error.message, false, null);  
            }
        )
  
          

      } catch(err) {
            //throw err;
         response.sendResponse(201, err.message, false, null);
      }
}
const pushNotification = async (cr_date,body_data_user,hourD) => {
   try{

   

      const events = await Booking.find(body_data_user).then( 
            async (bookings) => {

            bookings.forEach(async function(booking,index){


                const events = await EventModal.findOne({_id:booking.event_id}).then( 
                      async (event) => {

                        if(event && event._id){

                            let event_date = event.event_date;

                            event_date = new Date(event_date);

                            if(event_date >= cr_date){

                              const diffTime = Math.abs(event_date - cr_date) / 36e5;

                              let noti = false;

                              let bk_body = {_id:booking._id};
                              let updateData = {};

                              let update_data_parms = {};

                              if(hourD == "24"){
                                  if(diffTime <= 24){
                                       
                                      noti = true;

                                      

                                      


                                      update_data_parms["push_notification_for_24hour"] = "1";

                                      updateData["$set"] = update_data_parms;

                                       await Booking.find(bk_body).updateOne(bk_body,updateData).then( 
                                                  async (user_d) => {
                                                         console.log("save noti 24hour")
                                                  }
                                          ).catch((error) => {
                                            return;
                                          });

                                  }
                              }
                              if(hourD == "2"){
                                  if(diffTime <= 2){
                                       
                                      noti = true;

                                      update_data_parms["push_notification_for_2hour"] = "1";

                                      updateData["$set"] = update_data_parms;

                                       await Booking.find(bk_body).updateOne(bk_body,updateData).then( 
                                                  async (user_d) => {
                                                         console.log("save noti 2hour")
                                                  }
                                          ).catch((error) => {
                                            return;
                                          });
                                  }
                              }

                              if(noti){
                                  let user_id = booking.user_id;

                                  await User.findOne({_id:user_id}).then( 
                                        async (user) => {
                                          
                                          if(user){

                                            let titlee = "Event!";
                                            let textt = "Your Event has been start soon!";
                                            let params = {
                                                "type" : "booking",
                                                "booking_id" : booking.id,
                                                "event_id" : booking.event_id,
                                            }

                                            await firebaseController.sendNotification(titlee,textt,params,user);

                                          }
                                        }).catch((error) => {
                                          return;
                                        });

                                  
                              }

                              

                            }

                            

                        }

                        


                });


            });
                

        }
      );
  
    
  } catch(err){
    console.log(err.message)
  }
}
const CheckEventStart = async () => {
  try{

      let cr_date  = moment().utcOffset(0, true).toISOString();
      cr_date = new Date(cr_date);


      let body_data_user = {};

      let and_data_user = [];

      and_data_user.push({payment_status:"1"});

      and_data_user.push({status:"1"});

      and_data_user.push({ push_notification_for_24hour: { $ne: "1" } });

      body_data_user["$and"] = and_data_user;

      await pushNotification(cr_date,body_data_user,"24");

      let body_data_user2 = {};

      let and_data_user2 = [];

      and_data_user2.push({payment_status:"1"});

      and_data_user2.push({status:"1"});

      and_data_user2.push({ push_notification_for_2hour: { $ne: "1" } });

      body_data_user2["$and"] = and_data_user2;

      await pushNotification(cr_date,body_data_user2,"2");

      
    
  } catch(err){
    console.log(err.message)
  }
}
module.exports = {
	 getPaymenturl,
   confirmPayment,
   mybookings,
   mybookingById,
   cancelBooking,
   socialShare,
   currentBooking,
   bookingQuery,
   CheckEventStart
}