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
const SendEmail = require('../../helpers/send-email.js')
let config = process.env;
const moment = require('moment');
const fs = require('fs');
var easyinvoice = require('easyinvoice');
const ejs = require('ejs');

const generateOrderInvoice = async (session,body, res) => {

	const response = new baseResponse(res);
	try{


		let data = fs.readFileSync(process.cwd()+'/views/invoice/invoice.ejs');

		 await Booking.findOne({_id:body.booking_id,event_id:body.event_id}).then( 
	            async (booking) => {

	            if(booking && booking._id){

	                    /*start*/


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


							ejs.renderFile(process.cwd()+'/views/invoice/invoice.ejs', { invoicedata : booking_inner }, async (err, data2) => {
							    if (err) {
							      response.sendResponse(null, false, "Invoice generate issue!", 500, null);
							    } else {
							    	//res.render(data2);
							    	let html = data2;
									let buff = new Buffer.from(html);
									let base64data = buff.toString('base64');
							    	// Our new data object, this will replace the empty object we used earlier.
									let data = {
									    "customize": {
									         "template": base64data // Must be base64 encoded html
									    },
									}
								   

									let data_return2 = await easyinvoice.createInvoice(data, async function (resultInvoice) {

										let order_invoice_url = process.env.UPLOAD_URL+"uploads/invoices/invoice_"+booking_inner.booking._id+".pdf";
										let order_invoice_path = process.cwd()+"/uploads/invoices/invoice_"+booking_inner.booking._id+".pdf";
									   
									        fs.writeFileSync(order_invoice_path, resultInvoice.pdf, 'base64');
   
									        let bodyData = {_id:booking_inner.booking._id};

								  			let updateData = {};

									        let update_data_parms = {};


										    update_data_parms["order_invoice_url"] = order_invoice_url;

										   

										    updateData["$set"] = update_data_parms;

								  			await Booking.find(bodyData).updateOne(bodyData,updateData).then( 
								                    async (bk) => {
								                        return bk;
								                    }
								            )
								            let clubEmail = await SendEmail.sendOrderInvoiceEmail(booking_inner.customer,booking_inner.booking.booking_id,order_invoice_path);


										    let result = {};

											let order_data_return =  {
												message: "Invoice successfully send in customer email!"
											}
											result.status = true;
											result.message = "";
											result.code = statusCode.success;
											result.data = order_data_return;
											response.sendResponse(result.data, result.status, result.message, result.code, null);

									});
							   }
							});
							
				
				        }


	                    /*end */
	        }else{
	        	response.sendResponse(null, false, "Booking not found!", 500, null);
	        }  

	            
	    }).catch(
	      (error) => {
	        response.sendResponse(500, error.message, false, null);
	      }
	    )




				         
	
	} catch(err){
		response.sendResponse(null, false, err.message, 500, null);
	}
	return true;
}

module.exports = {
	generateOrderInvoice
}