require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
let statusCode = require("../../Util/statusCode.js");
let baseResponse = require("../../Util/baseResponse.js");
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
const firebaseController = require('../firebaseController.js');
let config = process.env;
const moment = require('moment');


const getCurrentOrders = async (session,body, res) => {

	const response = new baseResponse(res);
	try{

		body_UserData = {userId:session._id};

		user_data = await userData.findOne(body_UserData).then( 
		     async (userdata) => {
		                return userdata;
		  			}
				)

		if(user_data && user_data.club_id){

			
				let body_data = {};

		        let and_data = [];

		        let or_data = [];

		        let cr_date = moment(body.cr_date).utcOffset(0, true);

		        cr_date = new Date(cr_date);

				and_data.push({event_date: {'$lte': cr_date }});
				and_data.push({event_end_date: {'$gte': cr_date }});
				and_data.push({club_id: user_data.club_id});

				body_data["$and"] = and_data;


				const event_check = await EventModal.findOne(body_data).then( 
		            async (event) => {
		            	if(event && event._id){

		            		let body_data = {};

					        let and_data = [];


							and_data.push({event_id:event._id});

							if(body.search && body.search != ""){
								if(body.search.includes("#00")){
									let search_id = body.search.replace("#00","");
									and_data.push({booking_id: search_id});
								}
							}

							

							body_data["$and"] = and_data;


	                        await Booking.find(body_data).then( 
					            async (bookings) => {
					              
					              if(bookings && bookings.length > 0 ){

					              	   await getBookingsWithOrder(bookings,res);


					              }else{
					              	  response.sendResponse(null, false, "No Bookings", 500, null);
					              }
					                
					        }).catch(
					          (error) => {
					            response.sendResponse(null, false, error.message, 500, null);
					          }
					        )
					    }else{
					    	response.sendResponse(null, false,"No Events", 500, null);
					    }  
		        })

        }
		

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	return true;
}

const getBookingsWithOrder = async (bookings, res) => {

	const response = new baseResponse(res);
	try{

		let bookings_data = [];

		for (const [keyBooking, booking] of Object.entries(bookings)) {

			let booking_inner = {booking : booking, orderData : null , customer : null ,booking_status : null };





			/*start*/

			let orders = await Orders.find({booking_id:booking._id}).then( 
	            async (orders) => {

	            let order_data = [];
	            let order_total_price = 0;
	            let booking_status = 0;
	            let orders_status = [];
	            if(orders && orders.length > 0){
		             for (const [key, order] of Object.entries(orders)) {

	                        /*start*/

	                        const order_data_params = {order:order};
	                        
	                        order_data.push(order);

	                        order_total_price = order_total_price + Number(order.total_price);

	                        orders_status.push( order.status );

	                        /*end */

		             }
		        }   

		        if(orders_status.includes('0')){
                    booking_status = "0";
		        }else if(orders_status.includes('1')){
                    booking_status = "1";
		        }else if(orders_status.includes('2')){
                    booking_status = "2";
		        }else if(orders_status.includes('3')){
                    booking_status = "3";
		        }

		       



		        if(order_data && order_data.length > 0){


		        	let final_data = {orders:order_data,order_total_price:order_total_price,booking_status:booking_status};


                
                    return final_data;


		        }else{
		        	return [];
		        }

		        

	                
	        });

	         


	        if(orders && orders.orders &&  orders.orders.length > 0){

		        booking_inner.orderData = orders;

		        if(orders.booking_status){
		        	booking_inner.booking_status = orders.booking_status;
		        }

		        

		        let customerData = await User.findOne({_id:booking.user_id}).then( 
		            async (customer) => {
	                      return customer;
		        })


		        if(customerData && customerData._id){
		        	booking_inner.customer = customerData;
		        	bookings_data.push(booking_inner);
		        }
	        }


			/*end*/



		}

		if(bookings_data.length > 0){
			bookings_data.sort((a,b) => a.booking_status - b.booking_status);
		}


		let result = {};

		let booking_data_return =  {
			bookingData: bookings_data
		}
		result.status = true;
		result.message = "";
		result.code = statusCode.success;
		result.data = booking_data_return;
		response.sendResponse(result.data, result.status, result.message, result.code, null);
		

	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	return true;
}

const getOrderDetail = async (session,body, res) => {

	const response = new baseResponse(res);
	try{

		

			/*start*/

			let orders = await Orders.findOne({booking_id:body.booking_id,_id:body.order_id}).then( 
	            async (order) => {

	            let order_data = [];
	            let order_total_price = 0;
	            if(order && order._id){

	                        /*start*/

	                        let booking = await Booking.findOne({_id:body.booking_id}).then( 
					            async (booking) => {
					              
					              return booking;
					                
					        })

					        let booking_status = await Orders.find({booking_id:body.booking_id}).then( 
					            async (allorders) => {

					            	let booking_status = 0;
						            let orders_status = [];
						            if(allorders && allorders.length > 0){
							             for (const [key, orderall] of Object.entries(allorders)) {

						                        /*start*/

						                        orders_status.push( orderall.status );

						                        /*end */

							             }
							        }   

							        if(orders_status.includes('0')){
					                    booking_status = "0";
							        }else if(orders_status.includes('1')){
					                    booking_status = "1";
							        }else if(orders_status.includes('2')){
					                    booking_status = "2";
							        }else if(orders_status.includes('3')){
					                    booking_status = "3";
							        }
					              
					                return booking_status;
					                
					        })


					        if(booking && booking._id){

			                        const order_data_params = {booking:booking,order:order,orderItems:null,booking_status:booking_status};


			                        const orderItemData =    await OrderItems.find({order_id:order._id}).then( 
			                                    async (items) => {

			                                    	    let items_data = [];

			                                    	        /*start*/

			                                    	            for (const [keyItem, item] of Object.entries(items)) {
			                                                           
			                                                           let itemData = {item:item,menu:null};

			                                                            const menuDataa =    await Menu.findOne({_id:item.menu_id}).then( 
											                                    async (menu) => {

											                                    	    return menu;
											                                          
											                                       }
											                                );
			                                                            if(menuDataa && menuDataa._id){
			                                                            	itemData.menu = menuDataa;

			                                                            	items_data.push(itemData);
			                                                            }

			                                    	            }
			                                    	    return items_data;

			                                    	        /*end*/
			                                          
			                                       }
			                                );

			                        if(orderItemData && orderItemData.length > 0){
			                        	order_data_params.orderItems = orderItemData;
			                        }

			                        let result = {};

									let order_data_return =  {
										orderData: order_data_params
									}
									result.status = true;
									result.message = "";
									result.code = statusCode.success;
									result.data = order_data_return;
									response.sendResponse(result.data, result.status, result.message, result.code, null);
                            }else{
                            	response.sendResponse(null, false, "Booking not found!", 500, null);
                            }

	                        /*end */
		        }else{
		        	response.sendResponse(null, false, "Order not found!", 500, null);
		        }  

	                
	        });

	         
	
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	return true;
}

const setOrderStatus = async (session,body, res) => {

	const response = new baseResponse(res);
	try{

		

			/*start*/
			let bodyData = {_id:body.order_id,booking_id:body.booking_id};

  			let updateData = {};

	        let update_data_parms = {};


		    update_data_parms["status"] = body.status;

		   

		    updateData["$set"] = update_data_parms;

  			await Orders.find(bodyData).updateOne(bodyData,updateData).then( 
                    async (order) => {
                        let result = {};

                        await Orders.findOne(bodyData).then( 
			                    async (orderDD) => {
			                    	if(orderDD){



			                    		await User.findOne({_id:orderDD.user_id}).then( 
							                    async (user) => {
							                    	if(user){




							                    		let textt = "";
							                    		if(body.status == "1"){

                                                            textt = "You order goes to preparing!";
                                                            let titlee = "Order!";
								                            let params = {
								                                "type" : "order",
								                                "order_id" : body.order_id,
								                                "booking_id" : body.booking_id,
								                            }

								                            await firebaseController.sendNotification(titlee,textt,params,session);
							                    		}
							                    		

							                    	}
							                        
							                    }
							             ).catch(
										    (error) => {
										    	return;
										    }
										)

			                    	}
			                        
			                    }
			             ).catch(
						    (error) => {
						    	return;
						    }
						)



						let order_data_return =  {
							message: "Success"
						}
						result.status = true;
						result.message = "";
						result.code = statusCode.success;
						result.data = order_data_return;
						response.sendResponse(result.data, result.status, result.message, result.code, null);
                    }
             ).catch(
			    (error) => {
			    	response.sendResponse(null, false,  error.message, statusCode.error, null);
			    }
			)

	         
	
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	return true;
}
const setOrderStatusComplete = async (booking_id) => {

	try{

		

			/*start*/
			let bodyData = {booking_id:booking_id};

  			let updateData = {};

	        let update_data_parms = {};


		    update_data_parms["status"] = "3";

		   

		    updateData["$set"] = update_data_parms;

  			await Orders.find(bodyData).updateMany(bodyData,updateData).then( 
                    async (order) => {
                    	    await Orders.findOne(bodyData).then( 
			                    async (orderDD) => {
			                    	if(orderDD){



			                    		await User.findOne({_id:orderDD.user_id}).then( 
							                    async (user) => {
							                    	if(user){



							                    			
                                                            let textt = "Thank you for order!";
                                                            let titlee = "Order!";
								                            let params = {
								                                "type" : "order",
								                                "order_id" : orderDD.id,
								                                "booking_id" : orderDD.booking_id,
								                            }
								                            await firebaseController.sendNotification(titlee,textt,params,user);
							                    		

							                    	}
							                        
							                    }
							             ).catch(
										    (error) => {
										    	return;
										    }
										)

			                    	}
			                        
			                    }
			             ).catch(
						    (error) => {
						    	return;
						    }
						)
                       return order;
                    }
            )

	         
	
	} catch(err){
		return;
	}
	return true;
}
const getOrderBill = async (session,body, res) => {

	const response = new baseResponse(res);
	try{
            await Booking.findOne({_id:body.booking_id,event_id:body.event_id}).then( 
	            async (booking) => {

	            if(booking && booking._id){

	                        /*start*/


							let booking_inner = {booking : booking, orderData : null , customer : null ,booking_status : null };

							await setOrderStatusComplete(booking._id);


							/*start*/

							let orders = await Orders.find({booking_id:booking._id}).then( 
					            async (orders) => {

					            let order_data = [];
					            let order_total_price = 0;
					            let booking_status = 0;
					            let orders_status = [];
					            if(orders && orders.length > 0){
						             for (const [key, order] of Object.entries(orders)) {

					                        /*start*/

					                        const order_data_params = {order:order,orderItems:null};


					                        const orderItemData =    await OrderItems.find({order_id:order._id}).then( 
					                                    async (items) => {

					                                    	    let items_data = [];

					                                    	        /*start*/

					                                    	            for (const [keyItem, item] of Object.entries(items)) {
					                                                           
					                                                           let itemData = {item:item,menu:null};

					                                                            const menuDataa =    await Menu.findOne({_id:item.menu_id}).then( 
													                                    async (menu) => {

													                                    	    return menu;
													                                          
													                                       }
													                                );
					                                                            if(menuDataa && menuDataa._id){
					                                                            	itemData.menu = menuDataa;

					                                                            	items_data.push(itemData);
					                                                            }

					                                    	            }
					                                    	    return items_data;

					                                    	        /*end*/
					                                          
					                                       }
					                                );

					                        if(orderItemData && orderItemData.length > 0){
					                        	order_data_params.orderItems = orderItemData;
					                        }
					                        
					                        order_data.push(order_data_params);

					                        order_total_price = order_total_price + Number(order.total_price);

					                        orders_status.push( order.status );



					                        /*end */

						             }
						        }   

						        if(orders_status.includes('0')){
				                    booking_status = "0";
						        }else if(orders_status.includes('1')){
				                    booking_status = "1";
						        }else if(orders_status.includes('2')){
				                    booking_status = "2";
						        }else if(orders_status.includes('3')){
				                    booking_status = "3";
						        }

						       



						        if(order_data && order_data.length > 0){


						        	let final_data = {orders:order_data,order_total_price:order_total_price,booking_status:booking_status};


				                
				                    return final_data;


						        }else{
						        	return [];
						        }

						        

					                
					        });

					         


					        if(orders && orders.orders &&  orders.orders.length > 0){

						        booking_inner.orderData = orders;

						        if(orders.booking_status){
						        	booking_inner.booking_status = orders.booking_status;
						        }

						        

						        let customerData = await User.findOne({_id:booking.user_id}).then( 
						            async (customer) => {
					                      return customer;
						        })


						        if(customerData && customerData._id){
						        	booking_inner.customer = customerData;
						        	
						        }
					        }


	                        let result = {};

							let order_data_return =  {
								orderBillData: booking_inner
							}
							result.status = true;
							result.message = "";
							result.code = statusCode.success;
							result.data = order_data_return;
							response.sendResponse(result.data, result.status, result.message, result.code, null);

	                        

	                        /*end */
		        }else{
		        	response.sendResponse(null, false, "Booking not found!", 500, null);
		        }  

	                
	        }).catch(
	          (error) => {
	            response.sendResponse(null, false, error.message, 500, null);
	          }
	        )

	         
	
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	return true;
}


module.exports = {
	getCurrentOrders,
	getOrderDetail,
	setOrderStatus,
	getOrderBill
}