import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useNavigate, Link} from "react-router-dom";
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import { prefix } from './../../../constants/prefix.js';
import Loader from "../../Loader";

import {
    ADMIN_CLEAR_MESSAGES,
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
         //dispatch({ type: DELETE_MANAGER, payload: agent.owner.deleteManager(formData) }); 
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const PaymentPopup = (props) => {

   
	const {clubData,currentUser,planPopupshow,setplanPopupshow,onSubmit} = props;
    

    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {       
        if(clubData){
            
            
        }
    }, [clubData]);
	
	return (
		<React.Fragment>
            {isLoading && <Loader /> }
            <Modal show={planPopupshow} onClose={() => setplanPopupshow(false)} >
                <div className="content">
                <h6 className="modal-title text-center">Your subscription plan has been expired. Please upgrade your plan.</h6>
                    <div className="form-modal">
                                <div className="outer-form-plan">
                                        <Row className="mb-1">

                                            <Col lg={12} className="mt-5">
                                                <div className="outer-form submit_payment_btn_outer text-center">
                                                    <Link to="/owner/plans"><Button className="orange-btn custom-btn" type="button">Upgrade Plan</Button></Link>
                                                </div>
                                            </Col>
                                        </Row>
                                    
                                </div>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPopup);