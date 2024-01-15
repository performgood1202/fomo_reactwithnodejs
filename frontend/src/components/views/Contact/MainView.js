import React, { Fragment, useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { SEND_QUERY, AFTER_SUCCESS } from "../../../constants/actionTypes";
import Loader from "../../Loader";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const mapStateToProps = (state) => ({
  	...state,

});

const mapDispatchToProps = (dispatch) => ({
	sendquery: (formData) => {
    	dispatch({ type: SEND_QUERY, payload: agent.Query.sendQuery(formData) });
  	},clearMessages: () => {
        dispatch({ type: AFTER_SUCCESS });
    }
});

const MainView = (props) => {
	const formRef = useRef();
	const { sendquery, clearMessages, successMsg, errorMsg } = props;

	const [isLoading, setIsLoading] = useState(false);
	const [user_name, setUserName] = useState('');
	const [club_name, setClubName] = useState('');
	const [user_email, setUserEmail] = useState('');
	const [user_phone, setUserPhone] = useState('');
	const [message_query, setMessage] = useState('');
	const [query_type, setQueryType] = useState('Contact');
	const [user_type, setUserType] = useState('Web');
	const [show, setShow] = useState(true);
	const [showAlert, setAlert] = useState(false);
	const [resClass, setResClass] = useState('');
	const [alertMsg, setAlertMsg] = useState('');
	const [defaultCode, setDefault] = useState('fi');

	useEffect(() => {
		if(props.query !== undefined){
			if(props.query.errorMsg !== null) {
	  			setResClass('danger');
	  			setAlert(true);
	  			setAlertMsg("Something went wrong!");
	  			setIsLoading(false);
	  		}
	  		if(props.query.successMsg !== null) {
	  			setResClass('success');
	  			formRef.current.reset();
	  			setAlert(true);
	  			setAlertMsg('Thank you for sharing this with us, please check your email.');
	  			setIsLoading(false);
	  			setUserName('');
	  			setClubName('');
	  			setUserEmail('');
	  			setMessage('');
	  			setUserPhone('+358');
	  			setDefault('fi');
	  			setTimeout(() => {
	  				formRef.current.reset();
		    		setAlert(false);
		    		setAlertMsg('');
		    		setResClass('');
		    	}, 4000);
	  		}
		}
  	}, [props]);

	const handleSubmit = (e) => {
		const validationSucess = checkValidation();
		e.preventDefault();
		if(validationSucess){
			setIsLoading(true);
			const formData = {
	    			name: user_name,
	    			email: user_email,
	    			phone: user_phone,
	    			message: message_query,
	    			// club_name: club_name,
	    			query_type: query_type,
	    			user_type: user_type
	    		};
	    	sendquery(formData);
	    	setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
	    }
	}

	const checkValidation = () => {
		let errors = false;
		if(user_name == ''){
			document.getElementsByName("user_name")[0].classList.add("errors");
			errors = true;
		}
		if(user_email == ''){
			document.getElementsByName("user_email")[0].classList.add("errors");
			errors = true;
		}
		if(message_query == ''){
			document.getElementsByName("message_query")[0].classList.add("errors");
			errors = true;
		}
		if(errors){
			return false;
		}else{
			return true;
		}
	}

	const removeError = (e) => {
		e.target.classList.remove('errors');
	}

	return (
		<Fragment>
			{isLoading && <Loader /> }
			<section className="banner-section contact-banner-section">
				<Container>
			      <Row>
			        <Col lg={6}>
				        <div className="contact-content">
							<h4>We strive to serve our clients to the best of our ability so that they can better serve theirs.</h4>
							<p className="mb-5">We are at your service, always. Our nightclub, and bar management tool is improving by the second, thanks to your feedback.We invite you to contact us if you have any requests or questions. We are at your disposal 24/7 with a team of experts ready to help.</p>
							<div className="outer-contact-info mt-4">
								<div className="outer-contact-icon">
									< FaMapMarkerAlt />
									<p><a href="https://www.google.com/maps/place/Capellan+Puistotie+21,+00580+Helsinki,+Finland/@60.189192,24.9799228,17z/data=!3m1!4b1!4m5!3m4!1s0x4692096541845bf3:0x6f9df8613d19e01f!8m2!3d60.189192!4d24.9821115" target="_blank">
									Capellan puistotie 21 a 28, 00580 Helsinki</a></p>
								</div>
							</div>
							<div className="outer-contact-info mt-4">
								<div className="outer-contact-icon">
									< FaPhoneAlt />
									<p><a href="tel:+358443328138">(+358) 443328138</a></p>
								</div>
							</div>
							<div className="outer-contact-info mt-4">
								<div className="outer-contact-icon">
									< MdEmail />
									<p><a href="mailto:info@theblank.app">info@theblank.app</a> </p>
								</div>
							</div>
						</div>
					</Col>
					<Col lg={6}>
						<div className="contact-form-outer">
							<h4>Contact Us</h4>
							<Form onSubmit={handleSubmit} ref={formRef}>
							{showAlert && 
								<Alert variant={resClass}>
							        <p className="m-0">{alertMsg}</p>
							   	</Alert>
						   	}
						    <Form.Group className="mb-3">
						    	<Form.Control type="hidden" name="query_type" defaultValue={query_type} />
						      	<Form.Control type="hidden" name="user_type" defaultValue={user_type} />
						        <Row>
						        	<Col lg={12}>
						        		<div className="outer-form">
						        			<Form.Label>Name/Club Name</Form.Label>
						        			<Form.Control type="text" name="user_name" defaultValue={user_name} onChange={(e) => setUserName(e.target.value) } onKeyUp={removeError} />
						        		</div>
						        	</Col>
						        	<Col lg={6}>
						        		<div className="outer-form">
						        			<Form.Label>Email</Form.Label>
						        			<Form.Control type="email" name="user_email" defaultValue={user_email} onChange={(e) => setUserEmail(e.target.value)} onKeyUp={removeError} />
						        		</div>
						        	</Col>
						        	<Col lg={6}>
						        		<div className="outer-form">
						        			<Form.Label>Phone</Form.Label>
						        			<PhoneInput country={defaultCode} value={user_phone} onChange={(value) => setUserPhone(value)} />
						        		</div>
						        	</Col>
						        	<Col lg={12}>
						        		<div className="outer-form">
						        			<Form.Label>Message</Form.Label>
						        			<Form.Control as="textarea" rows={3} name="message_query" defaultValue={message_query} onChange={(e) => setMessage(e.target.value)} onKeyUp={removeError} />
						        		</div>
						        	</Col>
						        	<Col lg={12}>
						        		<div className="outer-form">
						        			<Button className="custom-btn orange-btn" type="submit">Submit </Button>
						        		</div>
						        	</Col>
						        </Row>
						      </Form.Group>
						    </Form>
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
