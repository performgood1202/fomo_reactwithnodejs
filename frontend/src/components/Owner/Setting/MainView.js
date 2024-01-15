import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form,Badge,Image } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsBank2 } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import Loader from "../../Loader";

import DataTable from 'react-data-table-component';

import { useNavigate,Link } from "react-router-dom";

import {
  	CHANGE_PASSWORD,
  	ADMIN_CLEAR_MESSAGES,
  	ADMIN_SAVE_SETTINGS,
  	ADMIN_GET_NOTIFICATION_STATUS,
  	SAVE_STRIPE_ACCOUNT,
  	CHECK_STRIPE_ACCOUNT,
  	LOGIN_STRIPE,
  	SETUP_STRIPE,
  	FETCH_STRIPE_BANK_DETAILS,
  	EDIT_STRIPE_BANK_DETAILS,
  	CLEAR_MESSAGES,
  	GET_SETTINGS,
  	SAVE_SETTINGS
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	currentUser: state.common.currentUser,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.successSettingMsg,
  	successSettingMsg: state.common.successSettingMsg,
  	errorSettingMsg: state.common.errorSettingMsg,
  	loginUrl: state.owner.loginUrl,
  	setupData: state.owner.setupData,
  	bankDetails: state.owner.bankDetails,
  	accountVarify: state.owner.accountVarify,
  	loginStripeData: state.owner.loginStripeData,
  	notificationStatus: state.admin.notificationStatus,
  	settingsData: state.common.settingsData,
});

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (formData) => {
    	dispatch({ type: CHANGE_PASSWORD, payload: agent.owner.changePassword(formData) });
  	},
  	onSubmitConfig: (formData) => {
    	dispatch({ type: SAVE_SETTINGS, payload: agent.common.saveSetting(formData) });
  	},
  	onSaveStripeAccount: (formData) => {
    	dispatch({ type: SAVE_STRIPE_ACCOUNT, payload: agent.owner.saveStripeAccount(formData) });
  	},
  	checkStripeAccountStatus: (stripe_account_id) => {
    	dispatch({ type: CHECK_STRIPE_ACCOUNT, payload: agent.owner.checkStripeAccountStatus(stripe_account_id) });
  	},
  	fetchBankDetails: (stripe_account_id) => {
    	dispatch({ type: FETCH_STRIPE_BANK_DETAILS, payload: agent.owner.fetchBankDetails(stripe_account_id) });
  	},
  	editBankDetails: (stripe_account_id,bank_account_id) => {
    	dispatch({ type: EDIT_STRIPE_BANK_DETAILS, payload: agent.owner.editBankDetails(stripe_account_id,bank_account_id) });
  	},
  	loginStripe: (stripe_account_id) => {
    	dispatch({ type: LOGIN_STRIPE, payload: agent.owner.loginStripe(stripe_account_id) });
  	},
  	setupStripe: (stripe_account_id) => {
    	dispatch({ type: SETUP_STRIPE, payload: agent.owner.setupStripe(stripe_account_id) });
  	},
  	saveSetting: (formData) => {
    	dispatch({ type: ADMIN_SAVE_SETTINGS, payload: agent.admin.saveSettings(formData) });
  	},
  	getNotificationStatus: (formData) => {
    	dispatch({ type: ADMIN_GET_NOTIFICATION_STATUS, payload: agent.admin.getNotificationStatus(formData) });
  	},
  	getSettings: () => {
    	dispatch({ type: GET_SETTINGS, payload: agent.common.getSettings() });
  	},
  	clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
  	clearMessages: () => {
        dispatch({ type: CLEAR_MESSAGES });
    }
});

const MainView = (props) => {

	const {bankDetails,onSubmitConfig,editBankDetails,loginStripeData,checkStripeAccountStatus,accountVarify,loginStripe,setupStripe,loginUrl,setupData,clubData,onSubmit,fetchBankDetails,onSaveStripeAccount,successMsg,errorMsg,currentUser,clearAdminMessages,saveSetting,getNotificationStatus,notificationStatus,successSettingMsg,errorSettingMsg,clearMessages,getSettings,settingsData} = props;

	let navigate = useNavigate();

	let [isLoading, setIsLoading] = useState(false);


	const [current_password, setCurrentPassword ] = useState("");
	const [new_password, setNewPassword] = useState("");
	let [notification_status, setNotificationStatus] = useState(false);
	const [account_number, setAccountNumber] = useState("");
	const [account_holder_name, setAccountHolderName] = useState("");
	const [routing_number, setRoutingNumber] = useState("");
	const [country, setCountry] = useState("");
	const [stripe_account_id, setStripeAccountId] = useState("");
	let [account_status, setAccountStatus] = useState(false);

	let [tax, setTax] = useState("");

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
	const submitConfig =  (e) => {
		 clearMessages();
	        let formData = {};
	    	let setting_data = {};

	    	if(tax != ""){
	            setting_data["tax"] = tax;
	    	}else{
	    		setting_data["tax"] = "";
	    	}

	    	if(notification_status){
	            setting_data["notification_status"] = "1";
	    	}else{
	    		setting_data["notification_status"] = "0";
	    	}

	    	
	    	formData["settings"] = setting_data;

	    	onSubmitConfig(formData);
         
	};  
	const loginStripeFunc =  (e) => {
		 setIsLoading(true);
		 clearAdminMessages();
	     e.preventDefault();

	    if(clubData){

        	if(clubData.stripe_account_id && clubData.stripe_account_id != ""){
        		loginStripe(clubData.stripe_account_id);
        	}
            
        }  
         
	}; 
	const editBankDetailsFunc =  (stripe_account_id,bank_account_id) => {
		 setIsLoading(true);
		 clearAdminMessages();
        	if(stripe_account_id && stripe_account_id != "" && bank_account_id && bank_account_id != ""){
        		editBankDetails(stripe_account_id,bank_account_id);
        	}
         
	}; 

	useEffect(() => {       
        if(clubData){
        	if(clubData.stripe_account_id && clubData.stripe_account_id != ""){
        		setStripeAccountId(clubData.stripe_account_id);
        		if(clubData.stripe_account_status == "1"){
        			account_status = true;
        			setAccountStatus(true);
        			fetchBankDetails(clubData.stripe_account_id)
        		}

        		if(!account_status){
        			checkStripeAccountStatus(clubData.stripe_account_id);
        		}
        		
        	}
            
        }
    }, [clubData])

    useEffect(() => {       
        if(accountVarify){
            setAccountStatus(true);
            if(stripe_account_id){
            	fetchBankDetails(clubData.stripe_account_id)
            }
        }
    }, [accountVarify,stripe_account_id])


    useEffect(() => {       
        if(loginUrl){

        	window.open(loginUrl);

        	setIsLoading(false);
        	clearAdminMessages();
            
        }
    }, [loginUrl]) 


    useEffect(() => {       
        if(successMsg){
        	setIsLoading(false);
        	setCurrentPassword("");
        	setNewPassword("");

            setTimeout(function(){
                clearAdminMessages();
            },6000);
            window.location.reload()
            
        }
    }, [successMsg]) 

    useEffect(() => {       
        if(errorMsg){
        	setIsLoading(false);
            setTimeout(function(){
                clearAdminMessages();
            },6000);
            
        }
    }, [errorMsg]) 

    useEffect(() => {    
        getSettings()
    }, [])

    useEffect(() => {   
        if(settingsData){
        	if(settingsData.notification_status && settingsData.notification_status == "1"){
        		setNotificationStatus(true);
        	}else{
        		setNotificationStatus(false);
        	}

        	if(settingsData.tax){
        		debugger;
        		setTax(settingsData.tax);
        	}else{
        		setTax("");
        	}
        	
        }  
    }, [settingsData])

    const saveNotificationStatus = (status) =>{

    	setNotificationStatus(status);
    	notification_status = status

    	setTimeout(function(){
            submitConfig();
    	},200)

    	
    }
    
    const euro_contries = {
		// -- EU countries using the euro
		'AT' : { name: 'Austria' },
		'BE' : { name: 'Belgium' },
		'BG' : { name: 'Bulgaria' },
		'HR' : { name: 'Croatia' },
		'CY' : { name: 'Cyprus' },
		'CZ' : { name: 'Czech Republic' },
		'DK' : { name: 'Denmark' },
		'EE' : { name: 'Estonia' },
		'FI' : { name: 'Finland' },
		'FR' : { name: 'France' },
		'DE' : { name: 'Germany' },
		'GR' : { name: 'Greece' },
		'HU' : { name: 'Hungary' },
		'IE' : { name: 'Ireland' },
		'IT' : { name: 'Italy' },
		'LV' : { name: 'Latvia' },
		'LT' : { name: 'Lithuania' },
		'LU' : { name: 'Luxembourg' },
		'MT' : { name: 'Malta' },
		'NL' : { name: 'Netherlands' },
		'PL' : { name: 'Poland' },
		'PT' : { name: 'Portugal' },
		'RO' : { name: 'Romania' },
		'ES' : { name: 'Spain' },
		'SI' : { name: 'Slovenia' },
		'SK' : { name: 'Slovakia' },
		'MC' : { name: 'Monaco' },
		'SE' : { name: 'Sweden' },
	};


	return (
		<Fragment>
		    {isLoading && <Loader /> }
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

                            <div className="darkblue-sec mt-5 mb-5">
                                <Form>
				        		<div className="d-flex justify-content-between align-items-center">
					        		<h5>Payment</h5>
					        		<div className="switch-inner">
						        		{(account_status)?
                                           <Button className="orange-btn custom-btn" type="button" onClick={loginStripeFunc}>Check transactions</Button>
                                        :''}  
					        		</div>
					        	</div>
				        		<hr />
				        		<div className="outer-form-plan">

				        		    {(stripe_account_id && stripe_account_id != "")?
                                        <Fragment> 
                                            {(account_status)?
                                                <Fragment> 
                                                  <div className="varifycl mb-3"><MdVerified /> Verified </div>
                                                   <Row>
                                                        { (bankDetails && bankDetails.length > 0) ?

                                                        	bankDetails.map((bank,index)=>{ 
                                                       		    return (
                                                       			    <Fragment key={index}>
	                                                       			    <Col lg={3}>
															        		<div className="blue-back icons-dash-back d-flex align-items-center">
															        			<div className="left-icons-outer">
															        				<span className="orange-back icons-back"><BsBank2 /></span>
															        			</div>
															        			<div className="right-content-outer">
															        				<h4></h4>
															        				<p>{bank.bank_name}</p>
															        				<p>{bank.last4}</p>
															        				<p><BiEdit onClick={(e)=>editBankDetailsFunc(bank.account,bank.id)} /></p>
															        			</div>
															        		</div>
															        	</Col>
                                                       			    </Fragment>
                                                       			)
                                                       		})
                                                       	:''}
											      	</Row>
                                                </Fragment> 

                                            :''}
				        		        </Fragment>  
				        		       

				        		    :''}  
								    
				        		</div>
				        		<div className="text-center">
					        	    {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
	                                {errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
					        	</div>
				        		</Form>
                            </div>

                            <div className="darkblue-sec mt-5 mb-5">
						        
				        		<h5>Global configuration</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={5}>
								        		<div className="outer-form">
								        			<Form.Label>Tax(%)</Form.Label>
								        			<Form.Control 
								        			    type="number"
								        			    value={tax}
								        			    min={1}
								        			    onChange={(e) => setTax(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={2}>
								        		<div className="outer-form">
								        			<Form.Label className="opacity-0 d-block">button</Form.Label>
								        			<Button className="orange-btn custom-btn" onClick={submitConfig}>Update</Button>
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