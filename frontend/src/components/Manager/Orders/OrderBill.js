import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Table,Image} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import DataTable from 'react-data-table-component';
import { useNavigate, Link, useParams} from "react-router-dom";
import moment from "moment";
import moment_timezone from "moment-timezone";
import socketIOClient from "socket.io-client";
import profile from "../../../assets/images/avtar.jpg";
import noimage from "../../../assets/images/no-image.png";
import BillModal from './BillModal';
import MessagePopup from '../../Popup/MessagePopup';
import Loader from "../../Loader";


import {
  	GET_ORDER_BILL,
  	ADMIN_CLEAR_MESSAGES,
  	PAGE_ATTR,
  	GENERATE_ORDER_INVOICE
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	currentUser: state.common.currentUser,
  	orderBillData: state.manager.orderBillData,
  	orderInvoiceSuccessMsg: state.manager.orderInvoiceSuccessMsg,
  	orderInvoiceErrorMsg: state.manager.orderInvoiceErrorMsg,
});

const mapDispatchToProps = (dispatch) => ({ 
  	getOrderBill: (formData,role) => {
  		if(role == "2"){
            dispatch({ type: GET_ORDER_BILL, payload: agent.owner.getOrderBill(formData) });
  		}else{
  			dispatch({ type: GET_ORDER_BILL, payload: agent.manager.getOrderBill(formData) });
  		}
    	
  	},
  	generateOrderInvoice: (formData) => {
    	dispatch({ type: GENERATE_ORDER_INVOICE, payload: agent.manager.generateOrderInvoice(formData) });
  	},
  	clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }

});

const OrderBill = (props) => {
	 const {currentUser,getOrderBill,orderBillData,orderData,clearAdminMessages,generateOrderInvoice,orderInvoiceSuccessMsg,orderInvoiceErrorMsg} = props;

	const [pending, setPending] = useState(false);

	const [popupshow, setPopupShow] = useState(false);
	const [msgerror, setMessageError] = useState(false);
	const [messagetext, setMessageText] = useState("");
	const [isLoading, setIsLoading] = useState(false);


	const [orderList,setOrderList] = useState(null);

	const [BillModalShow,setBillModalShow] = useState(false);

	const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Order Detail");
		}
  		
  	}, [pageheading]) 


	let event_id;
	let booking_id;

	const params = useParams();

	if(params.event_id !== undefined){
		event_id = params.event_id;
	}
	if(params.booking_id !== undefined){
		booking_id = params.booking_id;
	}


	useEffect(() => {  	

        if(booking_id && event_id){

			let formData = {
				event_id : event_id,
				booking_id : booking_id,
			}

			if(currentUser && currentUser.roleId){
				getOrderBill(formData,currentUser.roleId);
			}

			
		}

  	}, [event_id,booking_id]) 

    useEffect(() => {  		
		if(orderBillData && orderBillData.orderData.orders){
			setOrderList(orderBillData.orderData.orders);
		}
  	}, [orderBillData]) 

  	useEffect(() => {  		
		if(orderInvoiceSuccessMsg){

			setIsLoading(false);

			setPopupShow(true);

        	setMessageError(false);


            setMessageText(orderInvoiceSuccessMsg)

            clearAdminMessages();

            if(booking_id && event_id){

				let formData = {
					event_id : event_id,
					booking_id : booking_id,
				}
				if(currentUser && currentUser.roleId){
					getOrderBill(formData,currentUser.roleId);
				}
			}
			
		}
  	}, [orderInvoiceSuccessMsg,booking_id,event_id]) 

  	useEffect(() => {  		
		if(orderInvoiceErrorMsg){

			setIsLoading(false);

			setPopupShow(true);

        	setMessageError(true);


            setMessageText(orderInvoiceErrorMsg)

            clearAdminMessages();
			
		}
  	}, [orderInvoiceErrorMsg]) 

  	const generateInvoiceFunc = (event_id,booking_id) => {

  		clearAdminMessages();
           

   	    let formData = {
   	    	event_id : event_id,
   	    	booking_id : booking_id,
   	    }
   	    setIsLoading(true);

     	generateOrderInvoice(formData);
           	   
	}
	const downloadInvoiceFunc = (order_invoice_url) => {

		const link_d = document.createElement('a');
		link_d.href = order_invoice_url;
		link_d.target = "_blank";
		document.body.appendChild(link_d);
		link_d.click();
		document.body.removeChild(link_d);
	}
  	


	return (
		<Fragment>
		    {isLoading && <Loader /> }
		    <MessagePopup popupshow={popupshow} setPopupShow={setPopupShow} messagetext={messagetext} msgerror={msgerror} setIsLoading={setIsLoading} /> 
			<section className="order-detail-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">


				        	
				        	<div className="orderTable">
				        	    <Row>
				        	        <Col lg={8}>
				        	            { (orderList)?
								            	orderList.map((orderD, index)=>{ 
								            		
		                                                return (
		                                                	<Fragment key={index}>
			                                                	<h5>Order : #{orderD.order.order_id}</h5>
			                                                	<hr />
													        	<Table striped>
															        <thead>
																        <tr>
																          <th>
																	          <div className="row">
																		          <div className="col-md-3">
																		          <p>Items</p>
																		          </div>
																		          <div className="col-md-3">
																		          <p>Price</p>
																		          </div>
																		          <div className="col-md-3">
																		          <p>Qty.</p>
																		          </div>
																		          <div className="col-md-3 text-center">
																		          <p>Amount</p>
																		          </div>
																	          </div>
																          </th>
																        </tr>
															        </thead>
															        <tbody>

															            { (orderD.orderItems)?
																            	orderD.orderItems.map((orderItem, index)=>{ 
																            		
										                                                return (
										                                                	<tr key={index}>
																					            <td>
																						            <div className="row">
																							          <div className="col-md-3">
																							            <div className="d-flex menu-name-column">
																										   <Image src={(orderItem.menu.menuImage)?orderItem.menu.menuImage:noimage} />
																										   <span className="text-white">{orderItem.menu.name}</span>
																										</div>
																							          </div>
																							          <div className="col-md-3">
																							             <span className="text-white">€{orderItem.item.price}</span>
																							          </div>
																							          <div className="col-md-3">
																							            <span className="text-white">x{orderItem.item.quantity}</span>
																							          </div>
																							          <div className="col-md-3 amount-right">
																							              <span className="text-white">€{orderItem.item.total_price}</span>
																							          </div>
																						          </div>
																						         
																					          </td>
																					        </tr>
																						)
																				})
																		    :''	
																		}	


															        </tbody>

															    </Table>
														    </Fragment>
														)
												})
										    :''	
										}	
										{(orderBillData && orderBillData.orderData && orderBillData.orderData.order_total_price)?
												<div className="row order-subtotal">
													<div className="col-md-12 d-flex justify-content-between align-items-center">	
		                                                <div className="subtotal">
		                                                   <b>Subtotal</b>	   
										    			</div>
										    			<div className="price-order">
										    				<b>€{orderBillData.orderData.order_total_price}</b>
										    			</div>
													</div>
												</div>
										:""}			    
									</Col>  
									<Col lg={4}>


										    <div className="right-order-detail-list darkblue-sec mt-5">
										    	<div className="title-order d-flex justify-content-between align-items-center">
										    		<h5 className="m-0">Customer</h5>
										    	</div>
										    	<hr className="m-2" />
										    	{(orderBillData && orderBillData.customer)?
											    	<div className="order-list-table">
											        	<div className="d-flex menu-name-column">
														   <Image src={(orderBillData.customer.profileImage)?orderBillData.customer.profileImage:profile} />
														   <span className="text-white">
														        {orderBillData.customer.fName} {orderBillData.customer.lName} <br />
														        Booking ID: #00{orderBillData.booking.booking_id}
														   </span>
														</div>	
											    		
											    	</div>
											    :''}	
											    {(orderBillData && orderBillData.booking)?
											    	<div className="d-flex justify-content-between align-items-center mt-4">	
		                                                <div className="subtotal">
		                                                   <b>Table no.</b>	   
										    			</div>
										    			<div className="price-order">
										    				<b>{(orderBillData.booking.table_no)?orderBillData.booking.table_no:''}</b>
										    			</div>
													</div>
												:''}	
										    </div>
										    {(orderBillData && orderBillData.orderData)?

										    	<Fragment>

												    <div className="right-order-detail-list darkblue-sec mt-4 pb-0">
												    	<div className="title-order d-flex justify-content-between align-items-center">
												    		<h5 className="m-0">Bill</h5>
												    	</div>
												    	<hr className="m-2" />
												    	<div className="left-order-items d-flex justify-content-between align-items-center mb-2">
												    			<div className="name-items-outer d-flex">
																	<div className="name-item-order">
																		<p>Subtotal</p>
																	</div>					   
												    			</div>
												    			<div className="price-order">
												    				<p><b>€{orderBillData.orderData.order_total_price}</b></p>
												    			</div>
												    	</div>
												    	<div className="left-order-items1 d-flex justify-content-between align-items-center mb-2">
												    			<div className="name-items-outer d-flex">
																	<div className="name-item-order">
																		<p className="mb-0">Total</p>
																	</div>					   
												    			</div>
												    			<div className="price-order">
												    				<p className="mb-0"><b>€{orderBillData.orderData.order_total_price}</b></p>
												    			</div>
												    	</div>
												    </div>
												    {(currentUser && currentUser.roleId == "3")?
												        <Fragment>
														    <div className="action-btn-div text-center mt-5">
														        {(orderBillData && orderBillData.booking.order_invoice_url)?

														        	<Button className="orange-btn custom-btn" onClick={(e)=>downloadInvoiceFunc(orderBillData.booking.order_invoice_url)}>Download invoice</Button>
		   
														    	: ''
		                                                        }
														    </div>
														    <div className="action-btn-div text-center mt-5">
														        <Button className="orange-btn custom-btn" onClick={(e)=>generateInvoiceFunc(event_id,booking_id)}>Generate invoice</Button> 
														    </div>
														</Fragment>    
													:''}    
												    
												</Fragment>    
										    :''}
										   

									</Col>  
							    </Row>
						    </div>   
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderBill);