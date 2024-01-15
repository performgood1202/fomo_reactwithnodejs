import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { BsTelephone } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { useNavigate,Link,useParams } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import profile from "../../../assets/images/avtar.jpg";
import Loader from "../../Loader";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from "react-datepicker";
import { AFTER_STAFF_SAVE, SAVE_STAFF,STAFF_DETAIL,STAFF_UPDATE } from "../../../constants/actionTypes";
import { prefix } from './../../../constants/prefix.js';

import MessagePopup from '../../Popup/MessagePopup';

import { FileUploader } from "react-drag-drop-files";

import DeleteStaffModal from "./DeleteStaffModal";

const fileTypes = ["JPG", "PNG", "GIF"];

const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	currentUser: state.common.currentUser,
  	saveError: state.staff.saveError,
  	saveSuccess: state.staff.saveSuccess,
  	staff_detail: state.staff.staff_detail,
  	successMsgStaffDelete: state.staff.successMsgStaffDelete,
    errorMsgStaffDelete: state.staff.errorMsgStaffDelete,
});

const mapDispatchToProps = (dispatch) => ({
	fetchStaffDetail: (formData,role) => {
		if(role == "2"){
			dispatch({ type: STAFF_DETAIL, payload: agent.managerStaff.staffDetail(formData,"owner") });
		}else{
			dispatch({ type: STAFF_DETAIL, payload: agent.managerStaff.staffDetail(formData,"manager") });
		}
    	
  	},staffUpdate: (formData,role) => {
		if(role == "2"){
			dispatch({ type: STAFF_UPDATE, payload: agent.managerStaff.staffUpdate(formData,"owner") });
		}else{
			dispatch({ type: STAFF_UPDATE, payload: agent.managerStaff.staffUpdate(formData,"manager") });
		}
    	
  	},clearMessages: () => {
        dispatch({ type: AFTER_STAFF_SAVE });
    },
});

const EditStaff = (props) => {	
	const {staff_detail,fetchStaffDetail,staffUpdate, clearMessages, saveSuccess, saveError,clubData,currentUser,successMsgStaffDelete,errorMsgStaffDelete } = props;
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
	const [deletestaffmodalshow, setDeleteStaffModalShow] = useState(false);

	const [club_id,setClubId] = useState("");

	const [msgerror, setMessageError] = useState(false);
	const [messagetext, setMessageText] = useState("");
	const [popupshow, setPopupShow] = useState(false);

	let staff_id;

	const params = useParams();

	if(params.id !== undefined){
		staff_id = params.id;
	}

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
		clearMessages();
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

        if(club_id && club_id != "" && staff_id && staff_id != ""){
        	formData.append("club_id", club_id);
        	formData.append("staff_id", staff_id);
        	if(currentUser && currentUser.roleId){
        		staffUpdate(formData,currentUser.roleId);
        	}
        }
	}


	useEffect(() => {
		if(clubData && clubData._id && staff_id){
			setClubId(clubData._id);
			let formData =  {
				club_id:clubData._id,
				staff_id:staff_id
			}
			if(currentUser && currentUser.roleId){
        		fetchStaffDetail(formData,currentUser.roleId);
        	}
		}
  	}, [clubData,staff_id]);

	const [show_image, setShowImage] = useState(profile);
	const [idProof, setIdProof] = useState(null);
	const [idProofLink, setidProofLink] = useState("/");

	const [profileImage, setProfileImage] = useState(null);
	const handleChangeProfile = (file) => {
	   setProfileImage(file);
	};

	const idProofLinkFunc = (idProofLink) => {
  		window.open(idProofLink)
  	}

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


    useEffect(() => {
        if (errorMsgStaffDelete) {
            setIsLoading(false);
            setDeleteStaffModalShow(false);

            setMessageError(true);

        	setPopupShow(true);

            setMessageText(errorMsgStaffDelete)

            clearMessages();
            
        }
    }, [errorMsgStaffDelete]);
    useEffect(() => {
        if (successMsgStaffDelete) {
            setIsLoading(false);
            setDeleteStaffModalShow(false);

            setMessageError(false);

        	setPopupShow(true);

            setMessageText(successMsgStaffDelete)

            setTimeout(function(){
            	if(currentUser && currentUser.roleId == "2"){
                    navigate("/owner/staff");
            	}else{
                    navigate("/manager/staff");
            	}
            	
            },2000)

             //

            clearMessages();
            
        }
    }, [successMsgStaffDelete]);


	useEffect(() => {
		if(staff_detail){

			if(staff_detail.image){
				setShowImage(staff_detail.image);
			}else{
				setShowImage(profile);
			}
			/*if(managerDetail.id_pro){
				setShowImage(managerDetail.profileImage);
			}else{
				setShowImage(profile);
			}*/
			setFirstName(staff_detail.first_name);
			setLastName(staff_detail.last_name);
			setEmail(staff_detail.email);
			let coutry_code = "";

  	    	if(staff_detail.phone_country_code){

  	    		coutry_code = staff_detail.phone_country_code;
  	    		setPhoneCountryCode(staff_detail.phone_country_code);
  	    	}


            if(staff_detail.phone){
           	  setPhone(staff_detail.phone);
           	  setphoneValue(coutry_code+staff_detail.phone);
            }else{
           	  setPhone("");
           	  setphoneValue("");
            }

			setShift(staff_detail.shift);
			setPosition(staff_detail.position);
			setSalary(staff_detail.salary);
			setEmpCode(staff_detail.emp_code);

			
			if(staff_detail.hiring_date){

				let datee = new Date(staff_detail.hiring_date);

				setHiring(datee);
		        setHiringInput(moment(datee).format("DD MMMM YYYY"));
			}else{
		        setHiringInput('');
				setHiring("");
			}
			
			if(staff_detail.id_proof){
				setidProofLink(staff_detail.id_proof);

			}else{
				setidProofLink("");
			}
		}
  	}, [staff_detail]);

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
			<MessagePopup popupshow={popupshow} setPopupShow={setPopupShow} messagetext={messagetext} msgerror={msgerror} setIsLoading={setIsLoading} /> 
			<section className="staff-sec">
			    {showAlert && 
					<Alert variant={resClass}>
				        <p className="m-0">{alertMsg}</p>
				   	</Alert>
			   	}
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <Form onSubmit={handleSubmit} ref={formRef}>
				        <div className="plans-outer">
				        	<div className="profile-edit-outer d-flex align-items-center justify-content-between">
			        			<div className="profile-edit">
			        				<div className="profile-circle">
				        				<Image src={show_image} className="profile-img" /> 
									        <Form.Control 
									            type="file"
									            onChange={(event) => {
										          setProfileImage(event.target.files[0]);
										          setShowImage(URL.createObjectURL(event.target.files[0]));

										        }}
									         />
									        <FiEdit />
								    </div>
			        				<h4>{first_name} {last_name}</h4>
			        			</div>
			        			<div className="right-profile-btn text-right">
			        				<Button className="orange-btn custom-btn" type="submit">Save</Button>
			        			</div>
			        		</div>					        	
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
			                                            defaultValue={email}
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
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        	    <Form.Label className="hidden_visibility">View</Form.Label>
								        		<div className="right-profile-btn text-left">
								        		    
							        				<Button className="orange-btn custom-btn" onClick={() => idProofLinkFunc(idProofLink)}>View</Button>
								        		   
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
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								    </Form.Group>
				        		</div>
                            </div> 

                            <div className="darkblue-sec mt-5 mb-5">    
	                            <div className="delete_sec">
					        		<div className="add-row-btn text-left mb-3 mt-3">
						        		<h5>Delete Staff Member</h5>
		                            </div>
		                            <div className="add-row-btn text-right mb-3 mt-3">
						        		<Button className="custom-btn orange-btn ml-1" type="button" onClick={() => setDeleteStaffModalShow(true)}>Delete</Button>
		                            </div>
		                            <DeleteStaffModal setIsLoading={setIsLoading} staff_id={staff_id} club_id={club_id} deletestaffmodalshow={deletestaffmodalshow} setDeleteStaffModalShow={setDeleteStaffModalShow} /> 
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

export default connect(mapStateToProps, mapDispatchToProps)(EditStaff);