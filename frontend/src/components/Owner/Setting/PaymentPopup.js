import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import { prefix } from './../../../constants/prefix.js';
import Loader from "../../Loader";

import {
    DELETE_MANAGER,
    ADMIN_CLEAR_MESSAGES,
    SAVE_STRIPE_ACCOUNT,
    CHECK_STRIPE_ACCOUNT,
    LOGIN_STRIPE,
    SETUP_STRIPE,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsgDelete: state.owner.successMsgDelete,
    errorMsgDelete: state.owner.errorMsgDelete,
    currentUser: state.common.currentUser,
    clubData: state.common.clubData,
    successMsg: state.owner.successMsg,
    errorMsg: state.owner.errorMsg,
    loginUrl: state.owner.loginUrl,
    setupData: state.owner.setupData,
    bankDetails: state.owner.bankDetails,
    accountVarify: state.owner.accountVarify,
    loginStripeData: state.owner.loginStripeData,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData,role) => {
         dispatch({ type: DELETE_MANAGER, payload: agent.owner.deleteManager(formData) }); 
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    onSaveStripeAccount: (formData) => {
        dispatch({ type: SAVE_STRIPE_ACCOUNT, payload: agent.owner.saveStripeAccount(formData) });
    },
    checkStripeAccountStatus: (stripe_account_id) => {
        dispatch({ type: CHECK_STRIPE_ACCOUNT, payload: agent.owner.checkStripeAccountStatus(stripe_account_id) });
    },
    clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setupStripe: (stripe_account_id) => {
        dispatch({ type: SETUP_STRIPE, payload: agent.owner.setupStripe(stripe_account_id) });
    },
    loginStripe: (stripe_account_id) => {
        dispatch({ type: LOGIN_STRIPE, payload: agent.owner.loginStripe(stripe_account_id) });
    },
    
});

const PaymentPopup = (props) => {

   
	const {clubData,currentUser,paymentPopupshow,setpaymentPopupshow,onSubmit,successMsgDelete,errorMsg,errorMsgDelete,clearMessage,user_id,club_id,clearAdminMessages,onSaveStripeAccount,checkStripeAccountStatus,loginStripe,setupStripe,setupData,accountVarify} = props;
    
    const [stripe_account_id, setStripeAccountId] = useState("");
    let  [account_status, setAccountStatus] = useState(false);
    const [country, setCountry] = useState("");

    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {       
        if(clubData){
            if(clubData.stripe_account_id && clubData.stripe_account_id != ""){
                setStripeAccountId(clubData.stripe_account_id);
                if(clubData.stripe_account_status == "1"){
                    account_status = true;
                    setAccountStatus(true);
                    //fetchBankDetails(clubData.stripe_account_id)
                }

                if(!account_status){
                    checkStripeAccountStatus(clubData.stripe_account_id);
                }
                
            }
            
        }
    }, [clubData]);

    useEffect(() => {       
        if(setupData && setupData.setupUrl){

            setStripeAccountId(setupData.stripe_account_id);
            window.location.href = setupData.setupUrl;

            setIsLoading(false);
            clearAdminMessages();
            
        }
    }, [setupData]) 
    useEffect(() => {       
        if(errorMsg){

            setIsLoading(false);
            setTimeout(function(){
                 clearAdminMessages();
            },6000)
            
        }
    }, [errorMsg]) 

   

    const saveStripeAccount =  (e) => {
         setIsLoading(true);
         clearAdminMessages();
         e.preventDefault();
         
         if(country != ""){

            const formData = {};
            formData["country"] = country;

            onSaveStripeAccount(formData);

         }else{
            setIsLoading(false);
         }
         
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
    const setupStripeFunc =  (stripe_account_id) => {
         setIsLoading(true);
         clearAdminMessages();
            if(stripe_account_id && stripe_account_id != ""){
                setupStripe(stripe_account_id);
            }
         
    }; 

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
		<React.Fragment>
            {isLoading && <Loader /> }
            <Modal show={paymentPopupshow} onClose={() => setpaymentPopupshow(false)} >
                <div className="content">
                
                <h4 className="modal-title text-center">Setup Payment</h4>
                    <div className="form-modal">
                                <div className="outer-form-plan">

                                    {(stripe_account_id && stripe_account_id != "")?
                                        <Fragment> 
                                            {(!account_status)?
                                                <div className="outer-form text-center mt-5">
                                                   <Button className="orange-btn custom-btn" type="button" onClick={(e)=>setupStripeFunc(stripe_account_id)}>Continoue Setup account</Button>
                                                </div>  
                                            :''}
                                        </Fragment>  
                                       

                                    :
                                    
                                      <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Row className="mb-3">
                                            <Col lg={12}>
                                                <div className="outer-form">
                                                    <Form.Label>Country</Form.Label>
                                                    <Form.Select onChange={ (e) => setCountry(e.target.value) } aria-label="Default example" required>
                                                            <option value=''>Select</option>
                                                        { Object.keys(euro_contries).map((key)=>{ 
                                                            const cont = euro_contries[key];
                                                            return (
                                                                  <Fragment key={key}>
                                                                     <option  value={key}>{cont.name}</option>
                                                                  </Fragment>
                                                                )
                                                            })
                                                        }       
                                                    </Form.Select>
                                                </div>
                                            </Col>
                                            <Col lg={12}>
                                                <div className="outer-form submit_payment_btn_outer">
                                                    <Button className="orange-btn custom-btn" type="button" onClick={saveStripeAccount}>Submit</Button>
                                                </div>
                                                <div>
                                                  {errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
                                                </div>
                                            </Col>
                                        </Row>
                                       
                                      </Form.Group>
                                    }  
                                    
                                </div>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPopup);