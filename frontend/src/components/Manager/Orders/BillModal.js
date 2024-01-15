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
});

const mapDispatchToProps = (dispatch) => ({
});

const Popup = (props) => {

   
	const {currentUser,BillModalShow,setBillModalShow,onSubmit,event_id,booking_id,setIsLoading} = props;



    

    const formRef = useRef();

    let navigate = useNavigate();

    const billGenerateFunc =  (event_id,booking_id) => {
        navigate("/manager/order/bill/"+event_id+"/"+booking_id);
    }; 

   

   
	
	return (
		<React.Fragment>
            <Modal show={BillModalShow} onClose={() => setBillModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Generate Bill</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to generate the bill?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => billGenerateFunc(event_id,booking_id)}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setBillModalShow(false)}>No </Button>
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