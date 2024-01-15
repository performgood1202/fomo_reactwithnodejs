import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import { prefix } from './../../../constants/prefix.js';

import {
    DELETE_MANAGER,
    ADMIN_CLEAR_MESSAGES,
    CANCEL_SUBSCRIPTION
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsgDelete: state.owner.successMsgDelete,
    errorMsgDelete: state.owner.errorMsgDelete,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData,role) => {
         dispatch({ type: CANCEL_SUBSCRIPTION, payload: agent.owner.cancelSubscription(formData) }); 
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {currentUser,cancelsubshow,setCancelSubShow,onSubmit,successMsgDelete,errorMsgDelete,clearMessage,setIsLoading} = props;



    

    const formRef = useRef();

    let navigate = useNavigate();

    const cancelSubscription=  () => {
        setIsLoading(true);
        clearMessage();
        const formData =  {};
        onSubmit(formData);
    };  


    useEffect(() => {
        if (errorMsgDelete) {
            setIsLoading(false);
            setCancelSubShow(false);
            setTimeout(function(){
                clearMessage();
            },2000);
        }
    }, [errorMsgDelete]);
    useEffect(() => {
        if (successMsgDelete) {
            setIsLoading(false);
            setCancelSubShow(false);
            setTimeout(function(){
                clearMessage();
                navigate("/owner/manager");
            },2000);
            
        }
    }, [successMsgDelete]);

   
	
	return (
		<React.Fragment>
            <Modal show={cancelsubshow} onClose={() => setCancelSubShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Cancel Subscription</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to cancel the subscription?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => cancelSubscription()}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setCancelSubShow(false)}>No </Button>
                                    </div>
                                </Col>
                            </Row>
                          </Form.Group>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);