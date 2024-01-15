import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';

import DataTable from 'react-data-table-component';

import { useNavigate,Link } from "react-router-dom";

import {
  	MANGER_CHANGE_PASSWORD,
  	ADMIN_CLEAR_MESSAGES,
  	ADMIN_SAVE_SETTINGS,
  	ADMIN_GET_NOTIFICATION_STATUS
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	currentUser: state.common.currentUser,
  	successMsg: state.manager.successMsg,
  	errorMsg: state.manager.errorMsg,
  	notificationStatus: state.admin.notificationStatus,
});

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (formData) => {
    	dispatch({ type: MANGER_CHANGE_PASSWORD, payload: agent.manager.changePassword(formData) });
  	},
  	saveSetting: (formData) => {
    	dispatch({ type: ADMIN_SAVE_SETTINGS, payload: agent.admin.saveSettings(formData) });
  	},
  	getNotificationStatus: (formData) => {
    	dispatch({ type: ADMIN_GET_NOTIFICATION_STATUS, payload: agent.admin.getNotificationStatus(formData) });
  	},
  	clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});
const redirectRow = (row,event,navigate) => {

	if(row._id != undefined){
        navigate('/admin/plan/'+row._id);
	}
}

const MainView = (props) => {

	const {onSubmit,successMsg,errorMsg,currentUser,clearAdminMessages,saveSetting,getNotificationStatus,notificationStatus} = props;

	let navigate = useNavigate();


	const [current_password, setCurrentPassword ] = useState("");
	const [new_password, setNewPassword] = useState("");
	const [notification_status, setNotificationStatus] = useState(false);

	const submitBtn =  (e) => {
		 clearAdminMessages();
	     e.preventDefault();
	     
	     if(current_password != "" && new_password != "" && currentUser && currentUser._id){

	     	const formData = {};
	     	formData["current_password"] = current_password;
	        formData["new_password"] = new_password;
	        formData["user_id"] = currentUser._id;
		    onSubmit(formData);

	     }
         
	}; 

	useEffect(() => {       
        if(successMsg){
        	setCurrentPassword("");
        	setNewPassword("");

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

    useEffect(() => {       
        getNotificationStatus();
    }, [])

    useEffect(() => {   
        if(notificationStatus && notificationStatus == "1"){
        	setNotificationStatus(true);
        }else{
        	setNotificationStatus(false);
        }   
    }, [notificationStatus])

    const saveNotificationStatus = (status) =>{
    	setNotificationStatus(status);
    	let formData = {};
    	let setting_data = {};

    	if(status){
            setting_data["notification_status"] = "1";
    	}else{
    		setting_data["notification_status"] = "0";
    	}

    	
    	formData["settings"] = setting_data;

    	saveSetting(formData);
    }



	return (
		<Fragment>
			<section className="setting-sec">
			   
				<Container fluid>
			      <Row>
			        <Col lg={12} className="mt-4">
				        <div className="setting-outer">
				        	<div className="switch-outer d-flex justify-content-between align-items-center">
				        		<h5>Dashboard notification</h5>
				        		<div className="switch-inner">
					        		<Form>
								      <Form.Check type="switch" checked={notification_status} onChange={(e)=>saveNotificationStatus(!notification_status)} />
								    </Form>
				        		</div>
				        	</div>
				        	<hr/>
				        	<div className="text-center">
				        	    {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
                                {errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
				        	</div>
						</div>
						
						<div className="darkblue-sec mt-5 mb-5">
						        
				        		<h5>Change password</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={5}>
								        		<div className="outer-form">
								        			<Form.Label>Current password</Form.Label>
								        			<Form.Control 
								        			    type="password"
								        			    value={current_password}
								        			    onChange={(e) => setCurrentPassword(e.target.value)}
								        			    required
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={5}>
								        		<div className="outer-form">
								        			<Form.Label>New password</Form.Label>
								        			<Form.Control 
								        			    type="password"
								        			    value={new_password}
								        			    onChange={(e) => setNewPassword(e.target.value)}
								        			    required
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={2}>
								        		<div className="outer-form">
								        			<Form.Label className="opacity-0 d-block">button</Form.Label>
								        			<Button className="orange-btn custom-btn" onClick={submitBtn}>Update</Button>
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