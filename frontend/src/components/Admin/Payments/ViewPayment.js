import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem,Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';

import DataTable from 'react-data-table-component';

import { useNavigate,Link, useParams } from "react-router-dom";

import moment from "moment";

import Loader from "../../Loader";


import {
  	FEATCH_PAYMENT_BY_ID,
  	ADMIN_CLEAR_MESSAGES,
  	PAGE_ATTR,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.club.clubData,
  	successMsg: state.club.successMsg,
    paymentData: state.admin.paymentData,
});

const mapDispatchToProps = (dispatch) => ({
	getPaymentById: (id) => {
    	dispatch({ type: FEATCH_PAYMENT_BY_ID, payload: agent.admin.fetchPaymentById(id) });
  	},
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});
const getDate = (date)=> {
	
		return moment(date).format("DD, MMM, YYYY");
}
const renderStatus = (status)=> {
	
		switch (status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="yellow-back bk-tag">INACTIVE</span>
		    	</Fragment>
		    )	
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back bk-tag">ACTIVE</span>
		    	</Fragment>
		    )
		    break;
		  case "2":
		    return (
		    	<Fragment>
		    	   <span className="orange-back bk-tag">DECLINE</span>
		    	</Fragment>
		    )
		    break;  
		}
}
const renderPromotionStatus = (row)=> {

		switch (row.promotion.status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="orange-back bk-tag">Inactive</span>
		    	</Fragment>
		    )	
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back bk-tag">Live</span>
		    	</Fragment>
		    )
		    break;
		  case "2":
		    return (
		    	<Fragment>
		    	   <span className="pink-back bk-tag">Upcoming</span>
		    	</Fragment>
		    )
		    break;  
		}
}

const ViewPayment = (props) => {

	let {paymentData,getPaymentById,successMsg,errorMsg,successMsgDelete,errorMsgDelete,clearMessage,club} = props;

	const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("");
		}
  		
  	}, [pageheading]) 

	let [row,setRow] = useState({});

	const [isLoading, setIsLoading] = useState(false);



	let navigate = useNavigate();

	const params = useParams();

	let payment_id;

	if(params.id !== undefined){
		payment_id = params.id;
	}



    useEffect(() => {  	
  	   if(payment_id){
  	    	getPaymentById(payment_id);
  	   }	
  		
  	}, [payment_id]) 

  




  



	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn text-left mb-3 mt-3 d-flex align-items-center">
				        		<h3 className="mr-10px">{(club && club.name)?club.name:''}</h3>
				        		{(club && club.status)? renderStatus(club.status) :''}	
                            </div>
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Club Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row className="mb-4">
								            <Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Club name</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.club && paymentData.club.name)?paymentData.club.name:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Address</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="address"
			                                            value={(paymentData && paymentData.club && paymentData.club.address)?paymentData.club.address:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-4">

								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.club && paymentData.club.address)?paymentData.club.phone:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>

								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Email</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.club && paymentData.club.email)?paymentData.club.email:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Website</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.club && paymentData.club.website)?paymentData.club.website:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Subscriptions Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row className="mb-4">
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscriptions</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.plan && paymentData.plan.name)?paymentData.plan.name:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscriptions type</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.club.plan_type &&  paymentData.club.plan_type == '0')?'Monthly':( paymentData.club &&  paymentData.club.plan_type &&  paymentData.club.plan_type == '1')?'Yearly':''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Number of Months/Years</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value="1"
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-4">
								        	
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscription start date</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.subscription && paymentData.subscription.subscription_start_date)? getDate(paymentData.subscription.subscription_start_date) :''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscription end date</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.subscription && paymentData.subscription.subscription_recurring_date)? getDate(paymentData.subscription.subscription_recurring_date) :''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div> 

                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Payment Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row className="mb-4">
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Amount</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(paymentData && paymentData.payment && paymentData.payment.price)?"€"+paymentData.payment.price:'€'}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Payment method</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value="Stripe"
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Status</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value="Paid"
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        
								      </Form.Group>
								    </Form>
				        		</div>
                            </div> 
                            {/* end */}
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPayment);