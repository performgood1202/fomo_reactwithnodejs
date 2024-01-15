import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck} from 'react-icons/ai';

import DataTable from 'react-data-table-component';

import { useNavigate, Link, useParams} from "react-router-dom";

import ActionRequest from "./ActionRequest";
import AcceptModal from "./AcceptModal";
import DeclineModal from "./DeclineModal";
import moment from "moment";



import {
  	FEATCH_CLUB_REQUEST,
  	CLEAR_REQUEST_MESSAGE,
  	FEATCH_CLUB_BY_ID
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.club.clubData,
  	successMessageClubRequest: state.club.successMessageClubRequest,
    errorMessageClubRequest: state.club.errorMessageClubRequest,
});

const mapDispatchToProps = (dispatch) => ({
	getClubById: (id) => {
    	dispatch({ type: FEATCH_CLUB_BY_ID, payload: agent.club.fetchClubById(id) });
  	},
    clearRequestMessage: () => {
        dispatch({ type: CLEAR_REQUEST_MESSAGE });
    }
});

const getDate = (date)=> {
	
		return moment(date).format("DD, MMM, YYYY");
}

const EditRequest = (props) => {

	let {getClubById,club_id,clubData,clearRequestMessage,successMessageClubRequest,errorMessageClubRequest} = props;

	let navigate = useNavigate();

	const params = useParams();

	if(params.id !== undefined){
		club_id = params.id;
	}


  	const [acceptmodalshow,setAcceptModalShow] = useState(false);
    const [declinemodalshow,setDeclineModalShow] = useState(false);
    const [club,setClubData] = useState("");
    const [clubPhone,setclubPhone] = useState("");

    let row = {_id:club_id};

    useEffect(() => {  	
  	   if(club_id){
  	    	getClubById(club_id);
  	   }	
  		
  	}, [club_id]) 

    useEffect(() => {  	
  	   if(clubData){
  	   	    
  	    	setClubData(clubData);

  	    	let coutry_code = "";

  	    	if(clubData.phone_country_code){

  	    		coutry_code = "+"+clubData.phone_country_code;
  	    	}


  	    	setclubPhone(coutry_code+clubData.phone);


  	   }	
  		
  	}, [clubData]) 

    useEffect(() => {       
        if(successMessageClubRequest){


            setTimeout(function(){
                clearRequestMessage();
            },6000);

            navigate('/admin/request');

            
        }
    }, [successMessageClubRequest]) 

    useEffect(() => {       
        if(errorMessageClubRequest){

            setTimeout(function(){
                clearRequestMessage();
            },6000);
            
        }
    }, [errorMessageClubRequest]) 




  



	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        {errorMessageClubRequest ? <Badge bg="danger">{errorMessageClubRequest}</Badge> : <Fragment /> }
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn text-right mb-3 mt-3">
				        		<div className="outer-form btn-group-modal d-flex text-right">
			                        <Button className="custom-btn orange-btn ml-1 mr-30px" type="submit" onClick={() => setAcceptModalShow(true)}>Accept</Button>
			                        <Button className="custom-btn purple-btn ml-1" type="button" onClick={() => setDeclineModalShow(true)}>Decline </Button>
			                    </div>
			                    <div>
			                      <AcceptModal acceptmodalshow={acceptmodalshow} setAcceptModalShow={setAcceptModalShow} row={row} /> 
			                      <DeclineModal declinemodalshow={declinemodalshow} setDeclineModalShow={setDeclineModalShow} row={row} /> 
			                    </div>
                            </div>
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Club Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Club name</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="name"
			                                            readOnly
			                                            value={(club && club.name)?club.name:''}
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
			                                            value={(club && club.address)?club.address:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="phone"
			                                            value={clubPhone}
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
			                                            name="email"
			                                            value={(club && club.email)?club.email:''}
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
			                                            name="website"
			                                            value={(club && club.website)?club.website:''}
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
								        <Row>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscriptions</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.plan && club.plan.name)?club.plan.name:''}
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
			                                            value={(club && club.plan_type && club.plan_type == '0')?'Monthly':(club && club.plan_type && club.plan_type == '1')?'Yearly':''}
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
								        <Row>
								        	
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscription start date</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.subscription && club.subscription.subscription_start_date)? getDate(club.subscription.subscription_start_date) :''}
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
			                                            value={(club && club.subscription && club.subscription.subscription_recurring_date)? getDate(club.subscription.subscription_recurring_date) :''}
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
								        <Row>
								        	
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Amount</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.plan_type && club.plan_type == '0' && club.plan)?club.plan.month_price:(club && club.plan_type && club.plan_type == '1' && club.plan)?club.plan.year_price:''}
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
			                                            value="stripe"
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
			                                            name="email"
			                                            value={(club && club.subscription && club.subscription.status && club.subscription.status == "1")? "Paid" :''}
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
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRequest);