import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert } from 'react-bootstrap';
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
import { AFTER_STAFF_SAVE, SAVE_STAFF,PAGE_ATTR } from "../../../constants/actionTypes";
import { prefix } from './../../../constants/prefix.js';

import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	currentUser: state.common.currentUser,
  	saveError: state.staff.saveError,
  	saveSuccess: state.staff.saveSuccess,
});

const mapDispatchToProps = (dispatch) => ({
	saveStaffDetail: (formData,role) => {
		if(role == "2"){
			dispatch({ type: SAVE_STAFF, payload: agent.managerStaff.staffSave(formData,"owner") });
		}else{
			dispatch({ type: SAVE_STAFF, payload: agent.managerStaff.staffSave(formData,"manager") });
		}
    	
  	},clearMessages: () => {
        dispatch({ type: AFTER_STAFF_SAVE });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const CreateStaff = (props) => {	
	const {saveStaffDetail, clearMessages, saveSuccess, saveError,clubData,currentUser } = props;

	const {setPageHeading,pageheading} = props;

	const [customError, setcustomError] = useState("");

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Create staff");
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
	const [position, setPosition] = useState('');
	const [hiring_date, setHiring] = useState('');
	const [salary, setSalary] = useState('');
	const [show, setShow] = useState(true);
	const [showAlert, setAlert] = useState(false);
	const [resClass, setResClass] = useState('');
	const [alertMsg, setAlertMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [club_id,setClubId] = useState("");

	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

	let navigate = useNavigate();

	

  	useEffect(() => {
		if(saveError){
			setResClass('danger');
  			setAlert(true);
  			setAlertMsg(saveError);
  			setIsLoading(false);
  			setTimeout(() => {
  				setAlert(false);
  				clearMessages();
  				setAlertMsg('');
  				setResClass('');
	    	}, 4000);
		}
  	}, [saveError]);
  	useEffect(() => {
		if(saveSuccess){
			    setResClass('success');
	  			formRef.current.reset();
	  			setAlert(true);
	  			setAlertMsg(saveSuccess);
	  			setIsLoading(false);
	  			setTimeout(() => {
		    		setAlert(false);
		    		setAlertMsg('');
		    		setResClass('');
		    		navigate('/'+prefix[currentUser.roleId]+'/staff');
		    		clearMessages();
		    	}, 4000);
		}
  	}, [saveSuccess]);

	const handleSubmit = (e) => {
		setAlert(false);
		clearMessages();
		setAlertMsg('');
		setResClass('');
		setcustomError("");
		setIsLoading(true);
		e.preventDefault();
		let hdate = '';
		let shiftData = '';
		let positionData = '';
		if(hiring_date != ''){
			hdate = moment(hiring_date).format("YYYY-MM-DD HH:mm:ss");
		}
		if(shift == ''){
			shiftData = 'Morning';
		}else{
			shiftData = shift;
		}
		if(position == ''){
			positionData = "Head server";
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
	        formData.append("phone", phone);
	        formData.append("phone_country_code", phone_country_code);
	        formData.append("shift", shiftData);
	        formData.append("position", positionData);
	        formData.append("salary", salary);
	        formData.append("emp_code", emp_code);
	        formData.append("hiring_date", hdate);
	        formData.append("profileImage", profileImage);
	        formData.append("idProof", idProof);

	        if(club_id && club_id != ""){
	        	formData.append("club_id", club_id);
	        	
	        	if(hiring_input_date == ""){

	        		setcustomError("Hiring date required!");
	        		setIsLoading(false);


	        	}else{
	        		if(currentUser && currentUser.roleId){
		        		saveStaffDetail(formData,currentUser.roleId);
		        	}
	        	}
	        }
	    }    
	}
	const [idProof, setIdProof] = useState(null);

	const [profileImage, setProfileImage] = useState(null);
	const handleChangeProfile = (file) => {
	   setProfileImage(file);
	};

	const [hiring_input_date, setHiringInput] = useState('');

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
			<section className="staff-sec">
			    {showAlert && 
					<Alert variant={resClass}>
				        <p className="m-0">{alertMsg}</p>
				   	</Alert>
			   	}
			   	{customError && 
					<Alert variant={"danger"}>
				        <p className="m-0">{customError}</p>
				   	</Alert>
			   	}
				<Container fluid>
			      <Row>
			        <Col lg={12}>
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
								        	<Col lg={4}>
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
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<PhoneInput country={'fi'} value={phoneValue} onChange={(value, country, e, formattedValue) => setPhoneFunc(value, country, e, formattedValue)} />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
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
								        			<Form.Select name="shift" value={shift} onChange={ (e) => setShift(e.target.value) }>
												      	<option value="morning">Morning</option>
												      	<option value="evening">Evening</option>
												    </Form.Select>
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Position</Form.Label>								        			
			                                        <Form.Select name="position" value={position} onChange={ (e) => setPosition(e.target.value) }>
												      	<option value="Head server">Head Server</option>
												      	<option value="Server">Server</option>
												      	<option value="Head chef">Head Chef</option>
												      	<option value="Chef">Chef</option>
												    </Form.Select>
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
			                                            name="hiring_date"
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