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
    DELETE_EVENT,
    ADMIN_CLEAR_MESSAGES,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsgDelete: state.owner.successMsgDelete,
    errorMsgDelete: state.owner.errorMsgDelete,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData,role) => {
        if(role == "2"){
            dispatch({ type: DELETE_EVENT, payload: agent.owner.deleteEvent(formData) });
        }else{
            dispatch({ type: DELETE_EVENT, payload: agent.manager.deleteEvent(formData) });
        }  
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {currentUser,deleteeventmodalshow,setDeleteEventModalShow,onSubmit,successMsgDelete,errorMsgDelete,clearMessage,event_id,club_id,setIsLoading} = props;



    

    const formRef = useRef();

    let navigate = useNavigate();

    const deleteEvent =  (club_id,event_id) => {
        setIsLoading(true);
        clearMessage();
        const formData =  {
            event_id:event_id,
            club_id:club_id,
        };
        if(currentUser && currentUser.roleId){
            onSubmit(formData,currentUser.roleId);
        }
    };  


    useEffect(() => {
        if (errorMsgDelete) {
            setIsLoading(false);
            setDeleteEventModalShow(false);
            setTimeout(function(){
                clearMessage();
            },2000);
        }
    }, [errorMsgDelete]);
    useEffect(() => {
        if (successMsgDelete) {
            setIsLoading(false);
            setDeleteEventModalShow(false);
            setTimeout(function(){
                clearMessage();
                navigate("/"+prefix[currentUser.roleId]+"/events");
            },2000);
            
        }
    }, [successMsgDelete]);

   
	
	return (
		<React.Fragment>
            <Modal show={deleteeventmodalshow} onClose={() => setDeleteEventModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Delete Event</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to delete the event?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => deleteEvent(club_id,event_id)}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setDeleteEventModalShow(false)}>No </Button>
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