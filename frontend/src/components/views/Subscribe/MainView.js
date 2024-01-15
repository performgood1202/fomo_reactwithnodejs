import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import Modal from '../../Popup';
import visa from "../../../assets/images/visa.png";
import { BiCalendar } from 'react-icons/bi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import {CardElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import { SUBSCRIBE_PLAN } from "../../../constants/actionTypes";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import GooglePlacesAutocomplete,{geocodeByAddress,getLatLng} from 'react-google-places-autocomplete';

import {
  	CLEAR_MESSAGES,
} from "../../../constants/actionTypes";
import Loader from "../../Loader";

const mapStateToProps = (state) => ({
  	...state
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
    	dispatch({ type: SUBSCRIBE_PLAN, payload: agent.Plans.subscribe(formData) });
  	},clearMessages: () => {
        dispatch({ type: CLEAR_MESSAGES });
    }
});


const MainView = (props) => {
	const { subscribePlan, clearMessages, spSuccess, spError } = props;
	const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

	const [isLoading, setIsLoading] = useState(false);
	const [club_name, setClub] = useState('');
	const [planPrice, setPrice] = useState('');
	const [address, setAddress] = useState('');
	const [lat, setLat] = useState('');
	const [long, setLong] = useState('');
	const [phone, setPhone] = useState('');
	const [phone_country_code, setPhoneCountryCode] = useState('');
	const [phoneValue, setphoneValue] = useState('');
	const [email, setEmail] = useState('');
	const [website, setWebsite] = useState('');
	const [cardNumber, setCardNo] = useState('');
	const [cardExpiry, setCardExpiry] = useState('');
	const [cardCvv, setCvv] = useState('');
	const [cardName, setCname] = useState('');
	const [auto_renew, setAutoRenew] = useState(false);
	const [priceId, setPriceId] = useState('');
	const [planType, setPlanType] = useState('');
	const [errMsg, setErr] = useState('');
	const [successMsg, setSuccess] = useState('');
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
  		if(props.plan.spError !== null) {
  			setSubmit(false);
  			setIsLoading(false);
  			setErr(props.plan.spError);
  		}
  		if(props.plan.spSuccess !== null) {
  			setErr('');
  			if(props.plan.spSuccess == 'subscription created succssfully.'){
  				setIsLoading(false);
	  			// setSuccess("Plan subscribed successfully, please check your email.");
	  			setModalShow(true);
	  			setTimeout(() => {
	  				clearMessages();
	  				navigate('/');
	  			}, 4000)
  			}
  		}
  	}, [props]);

	const handleSubmit = async (e) => {
		clearMessages();
		e.preventDefault();
		setErr("");
		const validationsuccess = checkValidation();
		if(validationsuccess){
			setIsLoading(true);
			setSubmit(true);
		    let final_price = '';
		    let final_price_id = '';
		    let final_price_type = '';
		    let findCheck = '';
		    let cplan_id = document.getElementsByName("plan_id")[0].value;

		    if(planPrice == ''){
		    	const els = document.getElementsByName("price");
		    	for (let i=0;i<els.length;i++){
				  	if ( els[i].checked ) {
				    	final_price = els[i].value;
				    	findCheck = i;
				  	}
				}
				if(findCheck !== '' && priceId == ''){
					final_price_id = document.getElementsByName("price")[findCheck].getAttribute('data-sid');
				}
				if(findCheck !== '' && planType == ''){
					final_price_type = document.getElementsByName("price")[findCheck].getAttribute('data-plantype');
				}
		    }else{
		    	final_price = planPrice;
		    }

		    if(priceId != ''){
		    	final_price_id = priceId;
		    }
		    if(planType != ''){
				final_price_type = planType;
		    }

		    if (!stripe || !elements) {
	          // Stripe.js has not loaded yet. Make sure to disable
	          // form submission until Stripe.js has loaded.
	          return;
	        }
	        if(phone != "" && phone_country_code != ""){

	        	const token =  await stripe.createToken(elements.getElement(CardNumberElement)).then(function(result) {
		        	if(result.error !== undefined){
		        		setErr(result.error.message);
		        		setSubmit(false);
		        		setIsLoading(false);
		        	}
		        	if(result.token !== undefined && cplan_id != ''){
		        		const stripe_token = result.token.id;
		        		let auto_renew_value = "0";
		        		if(auto_renew){
                           auto_renew_value = "1";
		        		}
		        		if(address == ""){
		        			setErr("Address not found!");
			        		setSubmit(false);
			        		setIsLoading(false);


		        		}else if(lat == "" || long == ""){

		        			setErr("latitude and longitude not find with this address");
			        		setSubmit(false);
			        		setIsLoading(false);

		        		}else{
		        			const formData = {
			        			name: club_name,
			        			email: email,
			        			address: address,
			        			phone: phone,
			        			phone_country_code: phone_country_code,
			        			website: website,
			        			plan_id: cplan_id,
			        			price_id: final_price_id,
			        			plan_type: final_price_type,
			        			source: stripe_token,
			        			auto_renew: auto_renew_value,
			        			lat:lat,
			        			long:long,
			        		};
			        		subscribePlan(formData);
		        		}
		        		
		        		
		        	}
				});

	        }else{
	        	setErr("Phone field required!");
        		setSubmit(false);
        		setIsLoading(false);

	        }
	        
		}else{
			setSubmit(false);
			const element =  document.getElementsByClassName('errors')[0];
			element.scrollIntoView();
		}
	};

	const checkValidation = () => {
		let errors = false;
		if(club_name == ''){
			document.getElementsByName("club_name")[0].classList.add("errors");
			errors = true;
		}
		if(email == ''){
			document.getElementsByName("email")[0].classList.add("errors");
			errors = true;
		}
		if(phone == ''){
			document.getElementsByClassName("react-tel-input")[0].getElementsByTagName("input")[0].classList.add("errors");
			errors = true;
		}
		if(cardName == ''){
			document.getElementsByName("cardholder_name")[0].classList.add("errors");
			errors = true;
		}
		if(errors){
			return false;
		}else{
			return true;
		}
	}

    const handleChangeRadio = (event) => {
    	if(event.target.checked){
    		setPrice(event.target.value);
    		setPriceId(event.target.getAttribute('data-sid'));
    		setPlanType(event.target.getAttribute('data-plantype'));
    	}
    };

    const handleClose = () => {
    	setModalShow(false);
    }

    const removeErrors = (e) => {
    	e.target.classList.remove('errors');
    }
    const setPhoneFunc = (value, country, e, formattedValue) => {
    	if(country.dialCode){

    		setPhoneCountryCode(country.dialCode);

    		let phoneNumber = value.replace(country.dialCode,"");
    		setPhone(phoneNumber);
    		setphoneValue(value)

    	}
    	
    	document.getElementsByClassName("react-tel-input")[0].getElementsByTagName("input")[0].classList.remove("errors");
    }
    const setAddressFunc = (e) => {
    	setAddress(e.label);
    	geocodeByAddress(e.label)
    	      .then(results => getLatLng(results[0]))
			  .then(({ lat, lng }) => {
			  	 setLat(lat);
			     setLong(lng);

			  });
    }


	return (
		<Fragment>
			{isLoading && <Loader /> }
			<section className="banner-section subscribe-banner-section">
				<Container>
			      <Row>
					{/* Modal box code*/}
					<Modal show={modalShow} onHide={handleClose} onClose={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
						<div className="content">
                			<h4 className="modal-title text-center"><AiOutlineCheckCircle /></h4>
		                    <div className="form-modal mt-4 mb-4">		                        
		                        <h4 className="text-center">Congratulations, plan successfully subscribed. Check your email for details.</h4>
		                    </div>
		                </div>
				    </Modal>
					{/* Modal code end*/}
			        <Col lg={12}>
				        <div className="banner-content text-center">
							<h2>Subscribe to Blank</h2>
							<h6 className=" mb-5">Choose your billing cycle. All contracts last 12 months. You can also contact us for an offer Also we need to live the website.</h6>
						</div>

						<Form onSubmit={handleSubmit}>
						<div className="basic-plan-outer">
							<Row>
						        <Col lg={6}>
							        <div className="basic-plan-inner">
										<h4>{props.plan.detail !== null ? planDetail.name : ''} </h4>
									</div>
								</Col>
								<Col lg={6}>
							        <div className="basic-plan-radio">
										<div className="monthly-plan-radio">
											<div className="monthly-plan-inner">
												<h5><span className="font-weight400">Monthly Plan</span> <br /><span className="orange-text">€{props.plan.detail !== null ? planDetail.month_price : ''}</span></h5>
												<input type="radio" name="price" defaultValue={props.plan.detail !== null ? planDetail.month_price : ''} 
												onChange={handleChangeRadio} defaultChecked data-sid={props.plan.detail !== null ? planDetail.month_stripe_price_key : ''} data-plantype="monthly" />
											</div>
											<div className="monthly-plan-inner orange-back">
												<h5><span className="font-weight400">Annual Plan</span> <br /><span>€{props.plan.detail !== null ? planDetail.year_price : ''}</span></h5>
												<input type="radio" defaultValue={props.plan.detail !== null ? planDetail.year_price : ''} name="price" 
												onChange={handleChangeRadio} data-sid={props.plan.detail !== null ? planDetail.year_stripe_price_key : ''} data-plantype="yearly" />
											</div>
										</div>
									</div>
								</Col>
						    </Row>

						    <Row>
						    	<Col lg={12}>
						    		<h4 className="mt-5">Club Details </h4>
						    	</Col>
						        <Col lg={12}>
							        <div className="basic-form-outer">
										<Form.Group className="mb-3">
									        <Row>
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Club name</Form.Label>
									        			<Form.Control maxLength={50} type="text" name="club_name" id="club_name" defaultValue={club_name} onChange={(e) => setClub(e.target.value)} onKeyUp={removeErrors} />
									        		</div>
									        	</Col>
									        	<Col lg={6}>
									        		<div className="outer-form address-field">
									        			<Form.Label>Address</Form.Label>
									        			<GooglePlacesAutocomplete
									        			    className="form-control"
									        			    apiKey="AIzaSyCJw0QfJXXleECtFD5031OMG75lZMiC6dY"
									        			    selectProps={
									        			    	{
																    onChange:setAddressFunc,
																    styles: {
																      input: (provided) => ({
																        ...provided,
																        color:"#fff"
																      }),
																      option: (provided) => ({
																        ...provided,
																        color:'black'
																      }),
																      singleValue: (provided) => ({
																        ...provided,
																        color:"#fff"
																      }),
																    }
																}
															}
														    
														/>
									        		</div>
									        	</Col>
									        	<Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Phone</Form.Label>
									        			<PhoneInput country={'fi'} value={phoneValue} onChange={(value, country, e, formattedValue) => setPhoneFunc(value, country, e, formattedValue)} onKeyUp={removeErrors} />
									        			{/*<Form.Control type="tel" name="phone" id="phone" required defaultValue={phone} onKeyUp={handleKeyUp} onPaste={(e) => e.preventDefault()} />*/}
									        		</div>
									        	</Col>
									        	<Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Email</Form.Label>
									        			<Form.Control type="email" name="email" id="email" onKeyUp={removeErrors} defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
									        		</div>
									        	</Col>
									        	<Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Website</Form.Label>
									        			<Form.Control type="url" name="website" id="website" defaultValue={website} onChange={(e) => setWebsite(e.target.value)} />
									        		</div>
									        	</Col>
									        	
									        </Row>
								      	</Form.Group>
									</div>
								</Col>
						    </Row>
						</div>

						<div className="basic-plan-outer mt-5 mb-5">

						    <Row>
						    	<Col lg={12}>
						    		<h4 className="mt-5">Payment & Checkout </h4>
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
									        			<Form.Control type="text" name="cardholder_name" id="cardholder_name" onKeyUp={removeErrors} defaultValue={cardName} onChange={(e) => setCname(e.target.value)} />
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