import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { useNavigate,Link } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import Loader from "../../Loader";
import  "./style.scss";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import {CardElement,Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FileUploader } from "react-drag-drop-files";
import { 
	ADMIN_CLEAR_MESSAGES, 
	ADD_MANAGER,
	GET_PROMOTION_SETTING,
	CREATE_PROMOTION,
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];





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


const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	promotionSettings: state.admin.promotionSettings,
});

const mapDispatchToProps = (dispatch) => ({
	createPromotion: (formData) => {
    	dispatch({ type: CREATE_PROMOTION, payload: agent.owner.createPromotion(formData) });
  	},
  	getPromotionSettings: () => {
    	dispatch({ type: GET_PROMOTION_SETTING, payload: agent.admin.getPromotionSettings() });
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const CreateMain = (props) => {	
	const {saveManagerDetail, getPromotionSettings,promotionSettings, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg, createPromotion} = props;

	const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

	const formRef = useRef();
	const [title, setTitle] = useState('');
	const [hours, setHours] = useState('');
	const [price, setPrice] = useState('');
	const [position, setPosition] = useState('');
	const [show, setShow] = useState(true);
	const [showAlert, setAlert] = useState(false);
	const [resClass, setResClass] = useState('');
	const [alertMsg, setAlertMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [cardNumber, setCardNo] = useState('');
	const [cardExpiry, setCardExpiry] = useState('');
	const [cardCvv, setCvv] = useState('');
	const [cardName, setCname] = useState('');
	const [disableSubmit, setSubmit] = useState(false);
	const [errMsg, setErr] = useState('');

	const [promotionDate, setpromotionDate] = useState("");
	const [promotionInputDate, setpromotionInputDate] = useState("");

	const [hourPrice, sethourPrice] = useState(10);

	let navigate = useNavigate();



	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		setErr("");
			

		   // let final_price = parseInt(hours) * 10;



	        const token =  await stripe.createToken(elements.getElement(CardNumberElement)).then(function(result) {
	        	if(result.error !== undefined){
	        		setErr(result.error.message);
	        		setIsLoading(false);
	        	}
	        	if(result.token !== undefined){
	        		const stripe_token = result.token.id;
	        		const formData = new FormData();
	        		if(club_id && club_id != ""){
	        			if(promotionDate != ""){

	        				var promotionDate_final = moment(promotionDate).format("YYYY-MM-DD");
				        	formData.append("club_id", club_id);
				        	formData.append("title", title);
				        	formData.append("priceId", hours);
				        	formData.append("position", position);
				        	formData.append("source", stripe_token);
				        	formData.append("promotionDate", promotionDate_final);
				        	formData.append("promotionImage", promotionImage);

				        	createPromotion(formData);

	        			}else{
	        				setIsLoading(false);
	        				setErr("Please choose date!");
	        			}
	        			
			        }else{
			        	setIsLoading(false);
			        	setErr("Club id not exist");
			        }
	        	}else{
	        		setIsLoading(false);
	        	}
			});
		
    	
    	setTimeout(() => {
    		clearMessages();
    	}, 3000);
	}

	const [promotionImage, setpromotionImage] = useState(null);
	const handleChangeImage = (file) => {
	   setpromotionImage(file);
	};
	const [idProof, setIdProof] = useState(null);

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	useEffect(() => {
		if(errorMsg){
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [errorMsg]);

  	useEffect(() => {
		if(successMsg){
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
			navigate("/owner/promotions");
		}
  	}, [successMsg]);

  	const [promotionSettingsData, setpromotionSettingsData] = useState([]);
  	const [promotionHoursData, setpromotionHoursData] = useState([]);


  	useEffect(() => {
		getPromotionSettings()
  	}, []);
    useEffect(() => {
		if(promotionSettings){
			setpromotionSettingsData(promotionSettings);
		}
  	}, [promotionSettings]);



  	const removeErrors = (e) => {
    	e.target.classList.remove('errors');
    }

	const checkValidation = () => {
		let errors = false;
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


	const [isOpen, setIsOpen] = useState(false);
	const handleChangeDate = (e) => {

	setIsOpen(!isOpen);
	setpromotionDate(e);
	setpromotionInputDate(moment(e).format("DD MMMM YYYY"));
	};
	const handleClickDate = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};
	const setHoursFunc = (_id) => {
		setHours(_id);

		var price = "";

		promotionSettingsData.forEach(function(promo,index){
			
			if(promo._id == _id){
				price = promo.price;
			}

		})
		setPrice(price);

		
	};
	const setPositionFunc = (position) => {

		setPosition(position);
		setpromotionHoursData([]);

		setPrice("");
		setHours("");

		var price = "";

		let hourss = [];

		if(position != ""){

			promotionSettingsData.forEach(function(promo,index){

				if(promo.position == position){
					hourss.push(promo);
				}

			})
		}
		setTimeout(function(){
            setpromotionHoursData(hourss);
		},500);
		
		
	};

	const positions = [1,2,3,4,5];


	

	return (
		<Fragment>
				{isLoading && <Loader /> }
				<section className="create-promotion-sec">
					<Container fluid>
				      <Row>
				        <Col lg={12}>
				           
					        <Form onSubmit={handleSubmit} ref={formRef}>
					        <div className="plans-outer">
					        	<Row>
					        		<Col lg={6}>
					        			<div className="add-row-btn text-left mb-3 mt-3">
								        	<h4>New Promotion</h4>
			                            </div>
					        		</Col>
					        		<Col lg={6}>
						        		
					        		</Col>
					        	</Row>
					        	<hr/>	
					        	<Row>
					        	    <Col lg={12} className="text-center">
					        	       <FileUploader handleChange={handleChangeImage} name="promotionImage"  types={fileTypes} />
					        	    </Col>
					        	</Row>			        	
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Promotion Details</h5>
					        		<hr />
					        		{showAlert && 
										<Alert variant={resClass}>
									        <p className="m-0">{alertMsg}</p>
									   	</Alert>
								   	}
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Promotion Title</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            name="title"
				                                            defaultValue={title}
				                                            onChange={ (e) => setTitle(e.target.value) }
				                                            required
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Position</Form.Label>
				                                        <Form.Select name="position" defaultValue={position} onChange={(e)=>setPositionFunc(e.target.value)} required>
									        			     <option value=''></option>
										        			{ positions.map((position_val, index)=>{ 
                                                           		return (
                                                           			<option key={index} value={position_val}>{position_val}</option>
                                                           			)
                                                           		})
                                                           	}
                                                       	</Form.Select>
									        		</div>
									        	</Col>
									        	{(position && position != '')?
										        	<Col lg={2}>
										        		<div className="outer-form">
										        			<Form.Label>Hours</Form.Label>
										        			<Form.Select onChange={ (e) => setHoursFunc(e.target.value) } required>
														        <option value=''></option>
	                                                            { promotionHoursData.map((promotionHours, index)=>{ 
	                                                           		return (
	                                                           			<option key={index} value={promotionHours._id}>{promotionHours.time}</option>
	                                                           			)
	                                                           		})
	                                                           	}		
														    </Form.Select>
										        		</div>
										        	</Col>
									        	:''}

									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Date</Form.Label>
									        			<div className="date_div">
										        			<Form.Control 
					                                            type="text" 
					                                            value={promotionInputDate}
					                                            readOnly={true}
					                                            onClick={handleClickDate}
					                                            required
					                                        />
										        			{isOpen && (
														        <DatePicker minDate={new Date()} selected={promotionDate} onChange={handleChangeDate} inline />
														    )}
													    </div>
									        		</div>
									        	</Col>
									        </Row>
									        {(hours && hours != '')?
										        <Row>
									        	    <Col lg={4}>
									        	       <Form.Label>Price</Form.Label>
										        			<Form.Control 
					                                            type="text" 
					                                            value={price}
					                                            readOnly={true}
					                                            required
					                                        />
									        	    </Col>
									        	</Row>	
									        :''}	
									        
									        
									    </Form.Group>
					        		</div>
	                            </div>  
	                        	
	                        	<div className="darkblue-sec mt-5 mb-5">
					        		<Row>
								    	
								        <Col lg={12}>
								            <h5>Payment</h5>
							        		<hr />
									        <div className="outer-form-plan">
											    <Form.Group className="mb-3">
											    								    	
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
											                    <div className="master-card-input">
												                    <CardCvcElement
												                        options={options}
												                    />
												                </div>     
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
											        	<Col lg={12} className="mt-4">
											        		<div className="outer-form checkout-btn-outer">
											        			<Button type="submit" className="custom-btn orange-btn" disabled={disableSubmit}>Checkout</Button>
											        		</div>
											        	</Col>
											        	<Col lg={12} className="mt-3">
											        		<span className="text-danger">{errMsg}</span>
											        		<span className="text-success">{successMsg}</span>
											        		    {(errorMsg || successMsg) ?
										                            <div className="add-row-btn text-center mb-3 mt-3">
														        		{errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
										                                {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
										                            </div>
										                        :''}  
											        	</Col>
											        </Row>
											    </Form.Group>									    
											</div>
										</Col>
								    </Row>
	                            </div> 
							</div>
							</Form>
						</Col>
				      </Row>
				    </Container>
				</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMain);