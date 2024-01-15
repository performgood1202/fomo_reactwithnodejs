import React, { useEffect, useState, useRef, Fragment } from 'react';
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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ADMIN_CLEAR_MESSAGES, ADD_MANAGER,PAGE_ATTR} from "../../../constants/actionTypes";

import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];


const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
	saveManagerDetail: (formData) => {
    	dispatch({ type: ADD_MANAGER, payload: agent.owner.addManager(formData) });
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const CreateStaff = (props) => {	
	const {saveManagerDetail, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg} = props;

	const {setPageHeading,pageheading} = props;

	const [customError, setcustomError] = useState("");

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Create Manager");
		}
  		
  	}, [pageheading]) 
	const formRef = useRef();
	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [emp_code, setEmpCode] = useState('');
	const [phone, setPhone] = useState('');
	const [phone_country_code, setPhoneCountryCode] = useState('');
	const [phoneValue, setphoneValue] = useState('');
	const [email, setEmail] = useState('');
	const [shift, setShift] = useState('');
	const [position, setPosition] = useState('Manager');
	const [hiring_date, setHiring] = useState('');
	const [salary, setSalary] = useState('');
	const [show, setShow] = useState(true);
	const [showAlert, setAlert] = useState(false);
	const [resClass, setResClass] = useState('');
	const [alertMsg, setAlertMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [user_email, setUserEmail] = useState("");
	const [password, setPassword] = useState("");

	let navigate = useNavigate();

	const [hiring_input_date, setHiringInput] = useState('');

  	

	const handleSubmit = (e) => {
		setIsLoading(true);
		setcustomError("");
		clearMessages();
		e.preventDefault();
		let hdate = '';
		let shiftData = '';
		let positionData = '';
		if(hiring_date != ''){
			hdate = new Date(hiring_date);
		}
		if(shift == ''){
			shiftData = 'morning';
		}else{
			shiftData = shift;
		}
		if(position == ''){
			positionData = "head server";
		}else{
			positionData = position;
		}

		if(phone_country_code == "" || phone == ""){

			setcustomError("Phone number required!");
	        setIsLoading(false);

		}else{
			const formData = new FormData();
	        formData.append("first_name", first_name);
	        formData.append("last_name", last_name);
	        formData.append("email", email);
	        formData.append("password", password);
	        formData.append("phone", phone);
	        formData.append("phone_country_code", phone_country_code);
	        formData.append("shift", shiftData);
	        formData.append("position", positionData);
	        formData.append("salary", salary);
	        formData.append("emp_code", emp_code);
	        formData.append("hiring_date", hiring_date);
	        formData.append("profileImage", profileImage);
	        formData.append("idProof", idProof);

	        if(club_id && club_id != ""){
	        	if(hiring_input_date == ""){

	        		setcustomError("Hiring date required!");
	        		setIsLoading(false);


	        	}else{
	        		formData.append("club_id", club_id);
	        	    saveManagerDetail(formData);
	        	}
	        	
	        }
		}

		
		
    	
    	setTimeout(() => {
    		clearMessages();
    	}, 3000);
	}

	const [profileImage, setProfileImage] = useState(null);
	const handleChangeProfile = (file) => {
	   setProfileImage(file);
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
	    		navigate("/owner/manager");
	    	}, 3000);
			
		}
  	}, [successMsg]);

  

  	const [isOpen, setIsOpen] = useState(false);
	const handleChangeDate = (e) => {
		setIsOpen(!isOpen);
		setHiring(e);
		setHiringInput(moment(e).format("DD MMMM YYYY"));
	};
	const handleClickDate = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	const setPhoneFunc = (value, country, e, formattedValue) => {
    	if(country.dialCode){

    		setPhoneCountryCode(country.dialCode);

    		let phoneNumber = value.replace(country.dialCode,"");
    		setPhone(phoneNumber);
    		setphoneValue(value)

    	}
    }
	

	return (
		<Fragment>
			{isLoading && <Loader /> }
			<section className="manager-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
			            {(errorMsg || successMsg || customError) ?
                            <div className="add-row-btn text-center mb-3 mt-3">
				        		{errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
				        		{customError ? <Badge bg="danger">{customError}</Badge> : <Fragment /> }
                                {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
                            </div>
                        :''}  
				        <Form onSubmit={handleSubmit} ref={formRef}>
				        <div className="plans-outer">
				        	<Row>
				        		<Col lg={6}>
				        			<div className="add-row-btn text-left mb-3 mt-3">
							        	<h4>Employee Details</h4>
		                            </div>
				        		</Col>
				        		<Col lg={6}>
					        		<div className="add-row-btn text-right mb-3 mt-3">
							        	<Button type="submit" className="custom-btn orange-btn">Save</Button>
		                            </div>
				        		</Col>
				        	</Row>
				        	<hr/>	
				        	<Row>
				        	    <Col lg={12} className="text-center">
				        	       <FileUploader handleChange={handleChangeProfile} name="profileImage"  types={fileTypes} />
				        	    </Col>
				        	</Row>			        	
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Employee Details</h5>
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
								        			<Form.Label>First name</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="first_name"
			                                            maxLength={30}
			                                            defaultValue={first_name}
			                                            onChange={ (e) => setFirstName(e.target.value) }
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Last Name</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="last_name"
			                                            maxLength={30}
			                                            defaultValue={last_name}
			                                            onChange={ (e) => setLastName(e.target.value) }
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-3">
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Employee Code</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="emp_code"
			                                            maxLength={30}
			                                            defaultValue={emp_code}
			                                            onChange={ (e) => setEmpCode(e.target.value) }
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<PhoneInput country={'fi'} value={phoneValue} onChange={(value, country, e, formattedValue) => setPhoneFunc(value, country, e, formattedValue)} />
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-3">
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>ID Proof</Form.Label>
								        			<Form.Control 
			                                            type="file" 
			                                            name="idProof"
			                                            onChange={(event) => {
												          setIdProof(event.target.files[0]);
												        }}
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	
								        </Row>
								    </Form.Group>
				        		</div>
                            </div>  
                        	{/*Job Detail section*/}
                        	<div className="darkblue-sec mt-5 mb-5">
				        		<h5>Job Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
								    <Form.Group className="mb-3" controlId="formBasicJob">
								        <Row className="mb-3">
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Shift</Form.Label>
								        			<Form.Select name="shift" onChange={ (e) => setShift(e.target.value) }>
												      	<option value="morning">Morning</option>
												      	<option value="evening">Evening</option>
												    </Form.Select>
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Position</Form.Label>	
								        			<Form.Control 
			                                            type="text" 
			                                            name="position"
			                                            value={position}
			                                            onChange={ (e) => setPosition(e.target.value) }
			                                            required
			                                            readOnly={true}
			                                        />		
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-3">
								        	<Col lg={4}>
								        		<div className="outer-form date_div">
								        			<Form.Label>Hiring Date</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            readOnly={true}
			                                            defaultValue={hiring_input_date}
			                                            onClick={handleClickDate}
			                                            required
			                                        />
			                                        {isOpen && (
												        <DatePicker minDate={new Date()} selected={hiring_date} onChange={handleChangeDate} inline />
												    )}
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Salary</Form.Label>
								        			<Form.Control 
			                                            type="number" 
			                                            name="salary"
			                                            min={1}
			                                            defaultValue={salary}
			                                            onChange={ (e) => setSalary(e.target.value) }
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								    </Form.Group>
				        		</div>
                            </div>
                            {/*Panel Detail section*/}
                        	<div className="darkblue-sec mt-5 mb-5">
				        		<h5>Panel Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
								    <Form.Group className="mb-3" controlId="formBasicJob">
								        <Row className="mb-3">
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Email</Form.Label>
								        			<Form.Control 
			                                            type="email" 
			                                            name="email"
			                                            onChange={ (e) => setEmail(e.target.value) }
			                                            required
			                                        />
								        		</div>
								        	</Col>	
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Password</Form.Label>
								        			<Form.Control 
			                                            type="password" 
			                                            name="password"
			                                            onChange={ (e) => setPassword(e.target.value) }
			                                            required
			                                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateStaff);