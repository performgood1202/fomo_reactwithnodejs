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


import {
  	GET_CURRENT_ORDERS,
  	GET_ORDER_DETAIL,
  	SET_ORDER_STATUS,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	bookingData: state.manager.bookingData,
  	orderData: state.manager.orderData,
  	orderStatusSuccessMsg: state.manager.orderStatusSuccessMsg,
  	orderStatusErrorMsg: state.manager.orderStatusErrorMsg,
});

const mapDispatchToProps = (dispatch) => ({ 
	getCurrentOrders: (formData) => {
    	dispatch({ type: GET_CURRENT_ORDERS, payload: agent.manager.getCurrentOrders(formData) });
  	},
  	getOrderDetail: (booking_id,order_id) => {
    	dispatch({ type: GET_ORDER_DETAIL, payload: agent.manager.getOrderDetail(booking_id,order_id) });
  	},
  	setOrderStatus: (formData) => {
    	dispatch({ type: SET_ORDER_STATUS, payload: agent.manager.setOrderStatus(formData) });
  	},
  	clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }

});
const ENDPOINT = process.env.REACT_APP_BACKEND;

const renderStatus = (status)=> {
	
		switch (status) {
		    case "0":

			    return (
			    	<Fragment>
			    	   <span className="orange-back bk-tag">Pending</span>
			    	</Fragment>
			    )	
		    break;
		    case "1":
			    return (
			    	<Fragment>
			    	   <span className="green-back bk-tag">Preparing</span>
			    	</Fragment>
			    )
		    break;
		    case "2":
			    return (
			    	<Fragment>
			    	   <span className="pink-back bk-tag">Served</span>
			    	</Fragment>
			    )
		    break; 
		    case "3":
			    return (
			    	<Fragment>
			    	   <span className="green-back bk-tag">Complete</span>
			    	</Fragment>
			    )
		    break;  
		}
}
const renderOrderStatus = (row)=> {
	
		switch (row.status) {
		    case "0":

			    return (
			    	<Fragment>
			    	   <span className="orange-back bk-tag">Pending</span>
			    	</Fragment>
			    )	
		    break;
		    case "1":
			    return (
			    	<Fragment>
			    	   <span className="green-back bk-tag">Preparing</span>
			    	</Fragment>
			    )
		    break;
		    case "2":
			    return (
			    	<Fragment>
			    	   <span className="pink-back bk-tag">Served</span>
			    	</Fragment>
			    )
		    break; 
		    case "3":
			    return (
			    	<Fragment>
			    	   <span className="green-back bk-tag">Complete</span>
			    	</Fragment>
			    )
		    break;    
		}
}

const MainView = (props) => {
	 const {bookingData,getCurrentOrders,getOrderDetail,orderData,setOrderStatus,orderStatusErrorMsg,orderStatusSuccessMsg,clearAdminMessages} = props;

	const [pending, setPending] = useState(false);

	const [bookinglist,setBookingList] = useState([]);

	const [activeOrder,setActiveOrder] = useState("");
	const [activeBooking,setActiveBooking] = useState("");

	const [orderList,setOrderList] = useState("");

	const [BillModalShow,setBillModalShow] = useState(false);

	const [searchFilter, setSearchFilter] = useState("");

	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");

	let navigate = useNavigate();

	let order_id;
	let booking_id;

	const params = useParams();

	if(params.order_id !== undefined && params.booking_id !== undefined){
		order_id = params.order_id;
		booking_id = params.booking_id;
	}

	useEffect(() => {  		
		if(order_id && booking_id){
			setActiveOrder(order_id);
			setActiveBooking(booking_id);
			getOrderDetail(booking_id,order_id);
		}
  	}, [order_id,booking_id]) 

	const submitFormSearch = (e) =>{
		e.preventDefault();
	}


	useEffect(() => {  		

		

		getCurrentOrderFunc();

  	}, []) 

    useEffect(() => {  		
		if(bookingData){
			setBookingList(bookingData);
		}
  	}, [bookingData]) 
  	 let socket;

  	useEffect(() => {
  		const token = window.localStorage.getItem("jwt");
  		if(token){
		    socket = socketIOClient(`${process.env.REACT_APP_BACKEND}?query=${token}`, {
	           transports: ["websocket"],
	        });

	        socket.on("connect", () => {
	          console.log("connected to server", socket);
	        });
		    socket.on("newOrderRecived", (data) => {
		       getCurrentOrderFunc();
		    });
		}else{
			if (socket) socket.close();
		}   
	}, []);

	const getCurrentOrderFunc = () => {
           
            let formData = {
					cr_date : cr_date,
				}
			getCurrentOrders(formData);	
	}


	const orderFunc = (booking_id,order_id) => {
           
           if(bookingData){

           	    navigate("/manager/orders/"+booking_id+"/"+order_id);

             	/*getOrderDetail(booking_id,order_id);

             	setActiveOrder(order_id);
             	setActiveBooking(booking_id);*/
           	   
           }
	}
	const orderStatusFunc = (booking_id,order_id,status) => {
           
           if(bookingData){

           	    let formData = {
           	    	booking_id : booking_id,
           	    	order_id : order_id,
           	    	status : status,
           	    }

             	setOrderStatus(formData);
           	   
           }
	}

	useEffect(() => {  		
		if(orderStatusSuccessMsg){
			getOrderDetail(activeBooking,activeOrder);
			getCurrentOrderFunc();
			clearAdminMessages();
		}
  	}, [orderStatusSuccessMsg]) 

  	useEffect(() => {  		
		if(orderData && activeOrder){
			setOrderList(orderData);
		}else{
			setOrderList(null);
		}
  	}, [orderData,activeOrder]) 

  	const filterData = () => {



		let formData = {
					cr_date : cr_date,
					search:searchFilter,
				}
		getCurrentOrders(formData);	

	}


	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        {(bookinglist && bookinglist.length > 0)?
				        <Col lg={12}>
					        <div className="plans-outer">
					            <div className="add-row-btn mb-3 mt-3">
					        		<Row>
								        <Col lg={6}>
									        <div className="search-box">
									        	<Form onSubmit={submitFormSearch}>
											      <Form.Group controlId="formBasicEmail">
										        	<div className="search-btn-outer">
										        		<Form.Control type="text" onChange={(e) => setSearchFilter(e.target.value)} onKeyUp={(e) => filterData()} placeholder="Search by booking id (Ex: #001)" />
										        		<AiOutlineSearch />
										        	</div>
											       </Form.Group>
											    </Form>
									        </div>
										</Col>
									
								     </Row>
	                            </div>
	                            <hr />


					        	
					        	<div className="orderTable">
					        	    <Row>
					        	        <Col lg={8}>
								        	<Table striped>
										        <thead>
											        <tr>
											          <th>
												          <div className="row">
													          <div className="col-md-3">
													          <p>Customer</p>
													          </div>
													          <div className="col-md-3">
													          <p>Booking ID</p>
													          </div>
													          <div className="col-md-3">
													          <p>Table no.</p>
													          </div>
													          <div className="col-md-3">
													          <p>Status</p>
													          </div>
												          </div>
											          </th>
											        </tr>
										        </thead>
										        <tbody>
										            { 
										            	bookinglist.map((bookingData, index)=>{ 

										            	        let activeBookingClass = "";

										                	    if(activeBooking == bookingData.booking._id){
	                                                                activeBookingClass = "active-tr";
										                	    }

				                                                return (
															        <tr key={index} className={activeBookingClass}>
															            <td>
																          <div className="row">
																	          <div className="col-md-3">
																	            <div className="d-flex menu-name-column">
																				   <Image src={(bookingData.customer.profileImage)?bookingData.customer.profileImage:profile} />
																				   <span className="text-white">{bookingData.customer.fName} {bookingData.customer.lName}</span>
																				</div>
																	          </div>
																	          <div className="col-md-3">
																	             <span className="text-white">#00{bookingData.booking.booking_id}</span>
																	          </div>
																	          <div className="col-md-3">
																	            <span className="text-white">{(bookingData && bookingData.booking.table_no)? bookingData.booking.table_no :''}</span>
																	          </div>
																	          <div className="col-md-3">
																	             {renderStatus(bookingData.booking_status)}
																	          </div>
																          </div>
																          <div className="row">
																          	<div className="col-md-12">
																	                { (bookingData.orderData && bookingData.orderData.orders && bookingData.orderData.orders.length > 0)? bookingData.orderData.orders.map((orderD, indexInner)=>{

																	                	    let activeOrderClass = "";

																	                	    if(activeOrder == orderD._id){
	                                                                                            activeOrderClass = "active";
																	                	    }

																	                	    return (
																	                	    	<Fragment key={indexInner}>
																	                	    	   <span className={"orderno "+activeOrderClass} onClick={(e) => orderFunc(bookingData.booking._id,orderD._id)}>#{orderD.order_id}</span>
																	                	    	</Fragment>
																	                	   	)

																						})

																	                   :''
									                                            }	
																          	</div>
																          </div>
															          </td>
															        </tr>
															    )
	                                               		})
	                                               	}		    
										        </tbody>
										    </Table>
										</Col>  
										<Col lg={4}>

										    {(orderList) ?

											    <div className="right-order-list">
											    	<div className="title-order d-flex justify-content-between align-items-center">
											    		<h3>Order Details</h3>
											    		<span>{moment(orderList.order.createdAt).format("DD/MMMM/YYYY HH:mm")}</span>
											    	</div>
											    	<div className="status-div">
											    		{renderOrderStatus(orderList.order)}
											    	</div>
											    	<hr />
											    	<div className="order-list-table">
											        	{ orderList.orderItems.map((orderItem, indexOrder)=>{ 



				                                                return (
														    		<div className="left-order-items d-flex justify-content-between align-items-center mb-2" key={indexOrder}>
														    			<div className="name-items-outer d-flex">
														    				<Image src={(orderItem.menu.menuImage)?orderItem.menu.menuImage:noimage} />
																			<div className="name-item-order">
																				<p>{orderItem.menu.name}</p>
																				<span><b>x{orderItem.item.quantity}</b></span>
																			</div>					   
														    			</div>
														    			<div className="price-order">
														    				<p><b>€{orderItem.item.total_price}</b></p>
														    			</div>
														    		</div>
														    	)
														    })
	                                                   	}			
											    		
											    	</div>
											    	<div className="action-btn-div text-center mt-5">

											    	    {(orderList.order.status == "0") ?
											    		  <Button className="orange-btn custom-btn" onClick={(e) => orderStatusFunc(orderList.booking._id,orderList.order._id,"1")} >Move to Preparing</Button>
											    	    : (orderList.order.status == "1") ?
											    	       <Button className="orange-btn custom-btn" onClick={(e) => orderStatusFunc(orderList.booking._id,orderList.order._id,"2")}>Move to Served</Button>
											    	    : ''} 
											    	    {(orderList.booking_status == "2" || orderList.booking_status == "3") ?
											    	       <Fragment>
												    	       <Button className="orange-btn custom-btn"  onClick={() => setBillModalShow(true)}>Generate Bill</Button>
												    	       <BillModal booking_id={orderList.booking._id} event_id={orderList.booking.event_id} BillModalShow={BillModalShow} setBillModalShow={setBillModalShow} /> 
											    	       </Fragment>

											    	    :''}




											    	</div>
											    </div>
											:''}    

										</Col>  
								    </Row>
							    </div>   
							</div>
						</Col>
					:
					   <Col lg={12}>
					        <div className="plans-outer">
					            <div className="add-row-btn mb-3 mt-5">
					        		<Row>

								        <Col lg={6}>
									        <div className="search-box">
									        	<p>Orders not found!</p>
									        </div>
										</Col>
									
								     </Row>
	                            </div>
	                            <hr />
	                        </div>    
					   </Col>
				    }	
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);