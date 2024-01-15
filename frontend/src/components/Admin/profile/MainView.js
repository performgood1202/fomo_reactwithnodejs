import React, { Fragment,useState,useEffect } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, NavLink, Form,Badge  } from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import { FiEdit } from 'react-icons/fi';
import profile from "../../../assets/images/avtar.jpg";

import {
  	ADMIN_PROFILE_UPDATE,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	currentUser: state.common.currentUser,
  	successMsg: state.admin.successMsg,
  	errorMsg: state.admin.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (formData) => {
    	dispatch({ type: ADMIN_PROFILE_UPDATE, payload: agent.admin.updateProfile(formData) });
  	},
    clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const MainView = (props) => {
	

	const {currentUser,onSubmit,successMsg,errorMsg,clearAdminMessages} = props;

	const [fName, setFName] = useState("");
	const [lName, setLName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [phone_country_code, setPhoneCountryCode] = useState('');
	const [phoneValue, setphoneValue] = useState('');
	const [profileImage, setProfileImage] = useState(null);
	const [show_image, setShowImage] = useState(profile);



	const submitBtn =  (e) => {
	     e.preventDefault();

	     

	     const formData = new FormData();
         formData.append("profileImage", profileImage);
         formData.append("_id", currentUser._id);
         formData.append("fName", fName);
         formData.append("lName", lName);
         formData.append("phone", phone);
         formData.append("phone_country_code", phone_country_code);
	     onSubmit(formData);
	    /* const data = {
	     	fName: fName,
	     	lName: lName,
	     	phone: phone,
	     	profileImage: profileImage,
	     }
	     onSubmit(data);*/
	}; 

	
	
	useEffect(() => {
        if (currentUser) {

           setFName(currentUser.fName);
           setLName(currentUser.lName);
           setEmail(currentUser.email);

            let coutry_code = "";

  	    	if(currentUser.phone_country_code){

  	    		coutry_code = "+"+currentUser.phone_country_code;
  	    		setPhoneCountryCode(currentUser.phone_country_code);
  	    	}


           if(currentUser.phone){
           	  setPhone(currentUser.phone);
           	  setphoneValue(coutry_code+currentUser.phone);
           }else{
           	  setPhone("");
           	  setphoneValue("");
           }
           
           if(currentUser.profileImage){
           	  setShowImage(currentUser.profileImage);
           }else{
              setShowImage(profile);
           }
           
        }
    }, [currentUser]);

    useEffect(() => {       
        if(successMsg){

            setTimeout(function(){
                clearAdminMessages();
            },6000);
            
        }
    }, [successMsg]) 

    useEffect(() => {       
        if(errorMsg){


            setTimeout(function(){
                clearAdminMessages();
            },6000);
            
        }
    }, [errorMsg]) 

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
			<section className="profile-main-sec">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        	      {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
                              {errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
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
			        				<h4>{fName} {lName}</h4>
			        			</div>
			        			<div className="right-profile-btn text-right">
			        				<Button className="orange-btn custom-btn" onClick={submitBtn}>Save</Button>
			        			</div>
			        		</div>
			        		<div className="darkblue-sec mt-5 mb-5">
				        		<h5>Admin Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>First name</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={fName}
								        			    onChange={(e) => setFName(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Last name</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={lName}
								        			    onChange={(e) => setLName(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6} className="mt-4">
								        		<div className="outer-form">
								        			<Form.Label>Email</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={email}
								        			    readOnly
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6} className="mt-4">
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<PhoneInput country={'fi'} value={phoneValue} onChange={(value, country, e, formattedValue) => setPhoneFunc(value, country, e, formattedValue)} />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>
			        	</Col>
			      	</Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);