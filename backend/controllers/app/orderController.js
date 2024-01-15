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
const EventImageModal = require('../../models/eventImage.js');
const SettingModal = require('../../models/setting.js');
const Booking = require('../../models/booking.js');
const Orders = require('../../models/orders.js');
const Menu = require('../../models/menu.js');
const OrderItems = require('../../models/orderItems.js');
const socketController = require('../socketController');
const notificationController = require('../notificationController.js');
const firebaseController = require('../firebaseController.js');
let config = process.env;

const moment = require('moment');



const getOrders = async (session,body, res) => {

	const response = new appBaseResponse(res);

	

	try {
		await Orders.find({booking_id:body.booking_id,user_id:session._id}).then( 
            async (orders) => {
              
            let order_data = [];
            let order_total_price = 0;
            if(orders && orders.length > 0){
	             for (const [key, order] of Object.entries(orders)) {

                        /*start*/

                        const order_data_params = {order:order,orderItems:null};


                        const orderItemData =    await OrderItems.find({order_id:order._id}).then( 
                                    async (items) => {


                                    	    let items_data = [];

                                    	        /*start*/
                                    	        if(items && items.length > 0){

                                    	            for (const [keyItem, item] of Object.entries(items)) {
                                                           
                                                           let itemData = {item:item,menu:null};

                                                            const menuDataa =    await Menu.findOne({_id:item.menu_id}).then( 
								                                    async (menu) => {

								                                    	    return menu;
								                                          
								                                       }
								                                ).catch(
														          (error) => {
														            return;
														          }
														        )
                                                            if(menuDataa && menuDataa._id){
                                                            	itemData.menu = menuDataa;

                                                            	items_data.push(itemData);
                                                            }

                                    	            }
                                    	        }    
                                    	    return items_data;

                                    	        /*end*/
                                          
                                       }
                                ).catch(
						          (error) => {
						            return;
						          }
						        )

                        if(orderItemData && orderItemData.length > 0){
                        	order_data_params.orderItems = orderItemData;
                        }

                        order_data.push(order_data_params);

                        order_total_price = order_total_price + Number(order.total_price);

                        /*end */

	             }
	        }   

	        let final_data = {orders:order_data,order_total_price:order_total_price};

	          let result = {};


	          // success message
	          result.status = 200;
	          result.message = "";
	          result.isSuccess = true;
	          result.data = final_data;

	          response.sendResponse(result.status, result.message, result.isSuccess, result.data);


                
        }).catch(
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
const createOrder = async (session,body, res) => {

	const response = new appBaseResponse(res);

	

	try {
		await Booking.findOne({_id:body.booking_id,user_id:session._id}).then( 
            async (booking) => {
              
                if(booking && booking.event_id){
                	await EventModal.findOne({_id:booking.event_id}).then( 
			            async (event) => {
			              
			                if(event && event.club_id){
			                       
			                   await saveOrder(session,body,booking.event_id,event.club_id, res);

			                }else{
			                	 response.sendResponse(201, "event not found!", false, null);
			                }
			                
			        }).catch(
			          (error) => {
			            response.sendResponse(201, error.message, false, null);
			          }
			        )
                      
                    

                }else{
                	 response.sendResponse(201, "Booking not found!", false, null);
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

	return true;
}
const saveOrder = async (session, body, event_id, club_id, res) => {

	const response = new appBaseResponse(res);

	

	try {
		
		let orderData = new Orders({
            booking_id: body.booking_id,
            user_id: session._id,
            club_id: club_id,
      	});

      	await orderData.save().then( 
            async (order) => {
              
	            if(order && order._id){

	            	if(body.menus){
	            		let total_price = 0;

						for (const [menu_id, quantity] of Object.entries(body.menus)) {
                              
                              /*start*/

                                let menu_data = await Menu.findOne({_id:menu_id}).then( 
									            async (menu) => {
									              
										            return menu;
										        }).catch(
										          (error) => {
										            return;
										          }
										        )

                                if(menu_data && menu_data._id){

                                    let menu_price = Number(menu_data.price) * quantity;


                                    let OrderItemsData = new OrderItems({
												            order_id: order._id,
												            menu_id: menu_id,
												            price : menu_data.price,
												            quantity : quantity,
												            total_price : menu_price,
												      	});

                                    let orderItem = await OrderItemsData.save().then( 
                                           async (orderItem) => {
                                           	     return orderItem;
                                           }).catch(
									          (error) => {
									            return;
									          }
									        )

                                    if(orderItem && orderItem._id){

                                       total_price = total_price + Number(menu_price);

                                    }

                                    
                                      

                                }



                              /*end */
			               
						}
						/* update order */

						let order_body = {_id:order._id};

		                let updateData = {};

		                let update_data_parms = {};


		                update_data_parms["total_price"] = total_price;
		                update_data_parms["status"] = "0";

		                updateData["$set"] = update_data_parms;

		                await Orders.find(order_body).updateOne(order_body,updateData).then( 
		                            async (orderUpdateData) => {
                                      return orderUpdateData;
	                            }
	                    ).catch(
				          (error) => {
				            return;
				          }
				        )

	                    await EventModal.findOne({_id:event_id}).then( 
		                            async (event) => {
                                    if(event && event.club_id){
                                    	await socketController.newOrderRecived(event.club_id, "send");
                                    }
	                            }
	                    ).catch(
				          (error) => {
				            return;
				          }
				        )



	                    


						/* end update order */

						/* start noti*/

						    await userData.find({club_id:club_id}).then( 
			                            async (managers) => {
	                                    if(managers && managers.length > 0){
	                                    	for (const [key, manager] of Object.entries(managers)) {

	                                    		let notification_link = "";

												if(order._id){
												   notification_link = "/manager/orders/"+body.booking_id+"/"+order._id;
												}
												let message_noti = "<h3>"+session.fName+" "+session.lName+" <span>has placed an order.</span></h3>";
												await notificationController.Save(message_noti,manager.userId,"Order","App",notification_link);

	                                    	}
	                                    }
		                            }
		                    ).catch(
					          (error) => {
					            return;
					          }
					        )


					        let titlee = "Order!";
                            let textt = "You have created new order!";
                            let params = {
                                "type" : "order",
                                "order_id" : order.id,
                                "booking_id" : body.booking_id,
                            }

                            await firebaseController.sendNotification(titlee,textt,params,session);

							

                        /* end start noti*/

		                  let result = {};


		                  // success message
		                  result.status = 200;
		                  result.message = "Order successfully!";
		                  result.isSuccess = true;
		                  result.data = null;

		                  response.sendResponse(result.status, result.message, result.isSuccess, result.data);
					}

	            }else{
	            	response.sendResponse(201, "Menus not exist!", false, null);
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

	return true;
}

module.exports = {
	createOrder,
	getOrders
}