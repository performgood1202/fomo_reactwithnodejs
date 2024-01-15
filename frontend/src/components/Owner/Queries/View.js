import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail,AiOutlinePlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate,Link,useParams } from "react-router-dom";
import moment from "moment";
import Loader from "../../Loader";
import  "./style.scss";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { prefix } from './../../../constants/prefix.js';
import QueryModal from './QueryModal.js';

import { 
	CLEAR_MESSAGES, 
	FETCH_QUERY,
	CONTACT_BY_OWNER
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];



const mapStateToProps = (state) => ({
  	...state,
  	queryDetailData: state.query.queryDetailData,
  	clubData: state.common.clubData,
  	successMsg: state.query.successMsg,
  	errorMsg: state.query.errorMsg,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	fetchQuery: (query_id) => {

		 dispatch({ type: FETCH_QUERY, payload: agent.owner.fetchQuery(query_id) });
    	
  	},clearMessages: () => {
        dispatch({ type: CLEAR_MESSAGES });
    }
});
const renderStatus = (status)=> {

		switch (status) {
		    case "0":
			    return (
			    	<Fragment>
			    	   <span className="orange-back bk-tag">Incomplete</span>
			    	</Fragment>
			    )	
			    break;
		    case "1":
			    return (
			    	<Fragment>
			    	   <span className="green-back bk-tag">Resolved</span>
			    	</Fragment>
			    )
			    break; 
		}
}

const View = (props) => {	
	const {currentUser,contactByOwner, clearMessages, saveSuccess, saveError,fetchQuery,queryDetailData,clubData, successMsg, errorMsg} = props;
  

	const formRef = useRef();
	const [query_type, setQueryType] = useState('');
	const [user_type, setUserType] = useState('');
	const [date, setDate] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErr] = useState('');


	let navigate = useNavigate();

	const params = useParams();
	let query_id;

	if(params.id !== undefined){
		query_id = params.id;
	}

  	

	useEffect(() => {  		
		if(currentUser && currentUser._id && query_id && query_id != ""){
			clearMessages();
			fetchQuery(query_id);
		}
  		
  	}, [currentUser,query_id]) 

  	useEffect(() => {  		
		if(queryDetailData){
			setName(queryDetailData.name);
			setEmail(queryDetailData.email);
			setPhone(queryDetailData.phone);
			setMessage(queryDetailData.message);
			setUserType(queryDetailData.user_type);
			setQueryType(queryDetailData.query_type);
			setDate(moment(queryDetailData.createdAt).utc().format("DD MMMM, YYYY"))
		}
  		
  	}, [queryDetailData]) 

  	useEffect(() => {
		if(errorMsg){
			setErr(errorMsg);
			setQueryModalShow(false);
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    		setErr("");
	    	}, 3000);
		}
  	}, [errorMsg]);

  	useEffect(() => {
		if(successMsg){
            setQueryModalShow(false);
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
	    	if(currentUser && currentUser._id && query_id && query_id != ""){
				fetchQuery(query_id);
			}
		}
  	}, [successMsg]);


  	const query_types = ["Payment","Bookings","Order"];
    
    const [querymodalshow,setQueryModalShow] = useState(false);


	

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
				           
					        <Form>
					        <div className="plans-outer mt-5">

					            <div className="profile-edit-outer d-flex align-items-center justify-content-between">
				        			<div className="profile-edit">
				        				{(queryDetailData && queryDetailData.status)? renderStatus(queryDetailData.status) :''}	
				        			</div>
				        			<div className="right-profile-btn text-right">
				        				<Button className="orange-btn custom-btn" type="button" onClick={() =>setQueryModalShow(true)}>Resolve Query</Button>
				        				<QueryModal query_id={query_id} clearMessages={clearMessages} setIsLoading={setIsLoading} querymodalshow={querymodalshow} setQueryModalShow={setQueryModalShow} /> 
				        			</div>
				        		</div>	
					        			        	
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Query Details</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									            <Col>
									        		<div className="outer-form">
									        			<Form.Label>Name</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={name}
				                                            readOnly={true}
				                                        />
									        		</div>
									        	</Col>
									        	<Col>
									        		<div className="outer-form">
									        			<Form.Label>User Type</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            value={user_type}
				                                            readOnly={true}
				                                        />
									        		</div>
									        	</Col>
									        	<Col>
									        		<div className="outer-form">
									        			<Form.Label>Query Type</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={query_type}
				                                            readOnly={true}
				                                        />
									        		</div>
									        	</Col>
									        	<Col>
									        		<div className="outer-form">
									        			<Form.Label>Date</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={date}
				                                            readOnly={true}
				                                        />
									        		</div>
									        	</Col>
									        </Row>
									        <Row>
								        	    <Col lg={12}>
									        		<div className="outer-form">
									        			<Form.Label>Description</Form.Label>
									        			<Form.Control 
				                                            as="textarea" 
				                                            defaultValue={message}
				                                            rows={6}
				                                            readOnly={true}
				                                        />
									        		</div>
									        	</Col>
								        	</Row>	
													        
									        
									    </Form.Group>
					        		</div>
	                            </div>  
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Contact Details</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									            <Col>
									        		<div className="outer-form">
									        			<Form.Label>Email</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={email}
				                                            readOnly={true}
				                                        />
									        		</div>
									        	</Col>
									        	
									        	<Col>
									        		<div className="outer-form">
									        			<Form.Label>Phone</Form.Label>
									        			<PhoneInput country={'fi'} value={phone} disabled={true} />
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

export default connect(mapStateToProps, mapDispatchToProps)(View);