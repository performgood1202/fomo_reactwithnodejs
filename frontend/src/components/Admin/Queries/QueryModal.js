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
    RESOLVE_QUERY
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsg: state.query.successMsg,
    errorMsg: state.query.errorMsg,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => {
         dispatch({ type: RESOLVE_QUERY, payload: agent.admin.resolveQuery(formData) }); 
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {currentUser,querymodalshow,setQueryModalShow,onSubmit,successMsg,errorMsg,clearMessage,query_id,setIsLoading,clearMessages} = props;



    

    const formRef = useRef();

    let navigate = useNavigate();

    const resolveQuery=  (query_id) => {
        clearMessages()
        setIsLoading(true);
        clearMessage();
        const formData =  {
            query_id:query_id,
        };
        onSubmit(formData);
    };  


   
	
	return (
		<React.Fragment>
            <Modal show={querymodalshow} onClose={() => setQueryModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Resolve Query</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to resolve the query?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => resolveQuery(query_id)}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setQueryModalShow(false)}>No </Button>
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