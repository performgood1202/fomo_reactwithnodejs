import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../../agent";
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import Modal from '../../../Popup';
import visa from "../../../../assets/images/visa.png";
import { BiCalendar } from 'react-icons/bi';
import { AiOutlineCheckCircle, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import {CardElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
	OWNER_SUBSCRIBE_PLAN,
  	ADMIN_CLEAR_MESSAGES,
  	PLAN_FEATURES,
  	PLAN_FETCH
} from "../../../../constants/actionTypes";
import Loader from "../../../Loader";


import moment from "moment";

const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	plans: state.plan.plans,
  	plan_features: state.plan.plan_features,
  	features: state.plan.features,
});

const useOptions = () => {
    const fontSize = "18px";
    const options = useMemo(
            () => ({
            	showIcon: true,
                style: {
                    base: {
                    	iconColor: '#F0810F',
                        fontSize,
                        color: "#fff",
                        letterSpacing: "0.025em",
                        fontFamily: "Gadugi",
                        borderRadius: "3px",
                        backgroundColor: "#000361",
                        "::placeholder": {
                            color: "#6c757d"
                        }
                    },
                    invalid: {
                        color: "#dc3545",
                        iconColor: '#dc3545',
                    }
                }
            }),
        [fontSize]
    );
    return options;
};

const mapDispatchToProps = (dispatch) => ({
	subscribePlan: (formData) => {
    	dispatch({ type: OWNER_SUBSCRIBE_PLAN, payload: agent.owner.subscribePlan(formData) });
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    fetchPlans: () => {
    	dispatch({ type: PLAN_FETCH, payload: agent.Plans.fetch() });
  	},
  	fetchFeatures: () => {
  		dispatch({ type: PLAN_FEATURES, payload: agent.Plans.features() });
  	},
});


const MainView = (props) => {
	const { subscribePlan, clearMessages, spSuccess, successMsg,errorMsg,spError,plan,plan_id,clubData,fetchFeatures,fetchPlans,features, plan_features } = props;
	const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

    let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");

	const [isLoading, setIsLoading] = useState(false);
	const [club_name, setClub] = useState('');
	const [planPrice, setPrice] = useState('');
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [website, setWebsite] = useState('');
	const [cardNumber, setCardNo] = useState('');
	const [cardExpiry, setCardExpiry] = useState('');
	const [cardCvv, setCvv] = useState('');
	const [cardName, setCname] = useState('');
	const [auto_renew, setAutoRenew] = useState(false);
	const [priceId, setPriceId] = useState('');
	const [plan_type, setPlanType] = useState('');
	const [errMsg, setErr] = useState('');
	const [disableSubmit, setSubmit] = useState(false);
	const [modalShow, setModalShow] = useState(false);

	let planDetail = {};
	if(props.plan !== undefined){
		if(props.plan.detail !== undefined){
			planDetail = props.plan.detail;
		}
	}

	let navigate = useNavigate();

	useEffect(() => {
  		if(planDetail){
  			setPlanType("0");
  		}
  	}, [planDetail]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		clearMessages();
		setErr("");
		setIsLoading(true);

		if(plan_id && plan_id != "" && plan_type && plan_type != "" && clubData && clubData._id){

			const token =  await stripe.createToken(elements.getElement(CardNumberElement)).then(function(result) {
	        	if(result.error !== undefined){
	        		setErr(result.error.message);
	        		setIsLoading(false);
	        	}
	        	if(result.token !== undefined && plan_id != ''){
	        		const stripe_token = result.token.id;
	        		let auto_renew_value = "0";
	        		if(auto_renew){
                       auto_renew_value = "1";
	        		}
	        		const formData = {
	        			plan_id: plan_id,
	        			plan_type: plan_type,
	        			source: stripe_token,
	        			auto_renew: auto_renew_value,
	        			cr_date: cr_date,
	        		};
	        		setPlanType(plan_type);
					
	        		subscribePlan(formData);
	        	}
			});

		}else{
			setErr("Plan id and Plan type required");
    		setIsLoading(false);
		}
		
	};

	useEffect(() => {
  		if(successMsg){
  			setModalShow(true);
  			setIsLoading(false);
  			clearMessages();
  			setTimeout(function(){

  				window.location.href = "/owner/dashboard";

  			},2000)

  			elements.getElement(CardNumberElement).clear();
			elements.getElement(CardExpiryElement).clear();
			elements.getElement(CardCvcElement).clear();
  		}
  	}, [successMsg]);

  	useEffect(() => {
  		if(errorMsg){
  			elements.getElement(CardNumberElement).clear();
			elements.getElement(CardExpiryElement).clear();
			elements.getElement(CardCvcElement).clear();
  			setErr(errorMsg);
  			setIsLoading(false);
  			clearMessages();
  		}
  	}, [errorMsg]);

  	useEffect(() => {
  		fetchPlans();
  		fetchFeatures();
  	}, []);
    useEffect(() => {
  		if(features && plan_features){
  			debugger;
  		}
  	}, [features]);


    const handleChangeRadio = (e) => {
    	setPlanType(e.target.value);
    }
    const handleClose = () => {
    	setModalShow(false);
    	window.location.href = "/owner/dashboard";
    }

    const removeErrors = (e) => {
    	e.target.classList.remove('errors');
    }


	return (
		<Fragment>
			{isLoading && <Loader /> }
			<section className="owner-banner-section owner-subscribe-banner-section">
				<Container>
			      <Row>
					
			        <Col lg={12}>

			            {/* Modal box code*/}
						<Modal show={modalShow} onHide={handleClose} onClose={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
							<div className="content">
	                			<h4 className="modal-title text-center"><AiOutlineCheckCircle /></h4>
			                    <div className="form-modal mt-4 mb-4">		                        
			                        <h4 className="text-center">Congratulations, Plan successfully upgrade.</h4>
			                    </div>
			                </div>
					    </Modal>
						{/* Modal code end*/}
				        

						<Form onSubmit={handleSubmit}>
  
					    {/*Plan */}

                            <div className="basic-plan-outer">
                                <Row>
		                            <Col lg={5}>
								        <div className="basic-plan-inner">
											<h5>{props.plan.detail !== null ? planDetail.name : ''} </h5>
										</div>
									</Col>
									<Col lg={7}>
								        <div className="basic-plan-radio">
											<div className="monthly-plan-radio">
												<div className="monthly-plan-inner">
													<h5><span className="font-weight400">Monthly Plan</span> <br /><span className="orange-text">€{props.plan.detail !== null ? planDetail.month_price : ''}</span></h5>
													 <Form.Check 
											            type="radio"
											            checked={(plan_type == "0")?true:false}
											            onChange={handleChangeRadio}
											            name="plan_type"
											            value="0"
											          />											
											    </div>
												<div className="monthly-plan-inner orange-back">
													<h5><span className="font-weight400">Yearly Plan</span> <br /><span>€{props.plan.detail !== null ? planDetail.year_price : ''}</span></h5>
													<Form.Check 
											            type="radio"
											            checked={(plan_type == "1")?true:false}
											            onChange={handleChangeRadio}
											            name="plan_type"
											            value="1"
											          />
												</div>
											</div>
										</div>
									</Col>
								</Row>

                            </div>
                            <hr className="mb-5" />

                        {/*Features*/}

	                            <div className="darkblue-sec mt-5 mb-5">
		                            <div className="profile-edit-outer d-flex align-items-center justify-content-between">
					        			<div className="profile-edit">
					        				<h5>Features</h5>
					        			</div>
					        		</div>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<ul className="all-feature">
					        			  {(features && features.length > 0)?
					        			  	features.map(function(feature,key){
					        			  		var tick = false;

															
												if(plan_features && plan_features[plan_id] != undefined){

													if(plan_features[plan_id].includes(feature._id)){
														tick = true;
													}

												}
								                return(
						        			       <li key={key}>
						        			           <div className="li-feature">
							        			           <span>{feature.name}</span>
							        			           <span>
							        			                {(tick)?
															      <AiOutlineCheck />
															    :
															      <AiOutlineClose />
															    }
							        			           </span>
							        			        </div>   
						        			       </li>
						        			    ) 
						        			})    

					        			  :''}
					        			</ul>
					        		</div>
	                            </div>

	                        {/* end Features*/}

                        {/* end Plan*/}
						<div className="darkblue-sec payment_sec">
							
						    <Row>
						    	<Col lg={12}>
						    		<div className="profile-edit-outer d-flex align-items-center justify-content-between">
					        			<div className="profile-edit">
					        				<h5>Payment</h5>
					        			</div>	
					        		</div>
					        		<hr />
						    	</Col>

						        <Col lg={12}>
							        <div className="basic-form-outer">
									    <Form.Group className="mb-3">
									    	<input type="hidden" name="plan_id" defaultValue={props.plan.detail !== null ? planDetail._id : ''} />									    	
						    				<Row>
									            <Col lg={6}>
									                <div className="outer-form">
									                    <Form.Label>Card Number</Form.Label>
									                    <div className="master-card-input">
									                        <CardNumberElement
									                          options={options}
									                        />
									                    </div>
									                </div>
									            </Col>
									            <Col lg={4}>
									                <div className="outer-form">
									                    <Form.Label>Expiration</Form.Label>
									                    <div className="master-card-input">
									                        <CardExpiryElement
									                          options={options}
									                        />
									                    </div>                    
									                </div>
									            </Col>
									            <Col lg={2}>
									                <div className="outer-form">
									                    <Form.Label>CVV</Form.Label>
									                    <CardCvcElement
									                        options={options}
									                    />
									                </div>
									            </Col>
									        </Row>
						    				
									        <Row>									        	
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Name on card</Form.Label>
									        			<Form.Control type="text" name="cardholder_name" id="cardholder_name" onKeyUp={removeErrors} defaultValue={cardName} onChange={(e) => setCname(e.target.value)} required />
									        		</div>
									        	</Col>
									        	<Col lg={12}>
									        		<div className="outer-form">
									        		    <div className="auto_renew d-flex align-items-center checkbox">
										        			<Form.Label>Auto Renew</Form.Label>
										        			<Form.Check type="checkbox" name="auto_renew" onChange={(e) => setAutoRenew(!auto_renew)} />
										        		</div>	
									        		</div>
									        	</Col>
									        	<Col lg={12}>
									        		<div className="outer-form checkout-btn-outer">
									        			<Button type="submit" className="custom-btn orange-btn" disabled={disableSubmit}>Checkout</Button>
									        		</div>
									        	</Col>
									        	<Col lg={12}>
									        		<span className="text-danger">{errMsg}</span>
									        		<span className="text-success">{successMsg}</span>
									        	</Col>
									        </Row>
									    </Form.Group>									    
									</div>
								</Col>
						    </Row>

						   
						</div>
						</Form>
					</Col>
			    </Row>
			</Container>
		</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);