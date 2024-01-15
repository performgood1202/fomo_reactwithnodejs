import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail,AiOutlinePlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate,Link } from "react-router-dom";
import moment from "moment";
import Loader from "../../Loader";
import  "./style.scss";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { prefix } from './../../../constants/prefix.js';

import { 
	ADMIN_CLEAR_MESSAGES, 
	ADD_MENU,
	CONTACT_BY_OWNER
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	contactByOwner: (formData) => {

		 dispatch({ type: CONTACT_BY_OWNER, payload: agent.owner.contactByOwner(formData) });
    	
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const MainView = (props) => {	
	const {currentUser,contactByOwner, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg} = props;
  

	const formRef = useRef();
	const [query_type, setQueryType] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErr] = useState('');


	let navigate = useNavigate();

  	

	const handleSubmit = async (e) => {
		setErr("");
		clearMessages();
		setIsLoading(true);
		e.preventDefault();



         if(clubData && clubData.name && clubData.name != ""){

         	if(phone == ""){
         		setErr("Phone field required!");
        	    setIsLoading(false);
         	}else if(email == ""){
         		setErr("Email field required!");
        	    setIsLoading(false);
         	}else if(message == ""){
         		setErr("Description field required!");
        	    setIsLoading(false);
         	}else{

         		const formData = {};
         		formData["name"] = clubData.name;
         		formData["email"] = email;
         		formData["phone"] = phone;
         		formData["message"] = message;
         		formData["user_type"] = "Club";
         		formData["query_type"] = query_type;
	        	contactByOwner(formData);

         	}

        	
        	
        }else{
        	setErr("Club Not exist");
        	setIsLoading(false);
        }
		
	}

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	useEffect(() => {
		if(errorMsg){
			setErr(errorMsg);
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [errorMsg]);

  	useEffect(() => {
		if(successMsg){

			formRef.current.reset();

			setEmail("");
			setPhone("");
			setMessage("");

			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [successMsg]);


  	const query_types = ["Payment","Bookings","Order"];



	

	return (
		<Fragment>
				{isLoading && <Loader /> }
				<section className="create-menu-sec">
					<Container fluid>
				      <Row>
				        <Col lg={12}>

				            {(errorMsg || successMsg) ?
	                            <div className="add-row-btn text-center mb-3 mt-3">
	                                {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
	                            </div>
	                        :''}  
	                        {(errMsg) ?
	                            <div className="add-row-btn text-center mb-3 mt-3">
					        		{errMsg ? <Badge bg="danger">{errMsg}</Badge> : <Fragment /> }
	                            </div>
	                        :''} 
				           
					        <Form onSubmit={handleSubmit} ref={formRef}>
					        <div className="plans-outer">
					        			        	
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Contact Information</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									        	<Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Query Type</Form.Label>
									        			<Form.Select onChange={ (e) => setQueryType(e.target.value) } required>
													        <option value=''></option>
                                                            { query_types.map((type, index)=>{ 
                                                           		return (
                                                           			<option key={index} value={type}>{type}</option>
                                                           			)
                                                           		})
                                                           	}		
													    </Form.Select>
									        		</div>
									        	</Col>
									        	<Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Email</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            value={email}
				                                            onChange={ (e) => setEmail(e.target.value) }
				                                            required
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Phone</Form.Label>
									        			<PhoneInput country={'fi'} value={phone} onChange={(value) => setPhone(value)} />
									        		</div>
									        	</Col>
									        	
									        </Row>
									        <Row>
								        	    <Col lg={12}>
									        		<div className="outer-form">
									        			<Form.Label>Description</Form.Label>
									        			<Form.Control 
				                                            as="textarea" 
				                                            value={message}
				                                            onChange={ (e) => setMessage(e.target.value) }
				                                            rows={6}
				                                            required
				                                        />
									        		</div>
									        	</Col>
								        	</Row>	
								        	<Row>
								        		<Col lg={12}>
									        		<div className="add-row-btn text-left mt-4">
											        	<Button type="submit" className="custom-btn orange-btn">Submit</Button>
						                            </div>
								        		</Col>
								        	</Row>
													        
									        
									    </Form.Group>
					        		</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainView);