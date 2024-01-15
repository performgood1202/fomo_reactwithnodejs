import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";

import {
    ADD_PLAN,
    ADMIN_PLAN_FETCH,
    CLEAR_PLAN_MESSAGE
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMessagePlan: state.plan.successMessagePlan,
    errorMessagePlan: state.plan.errorMessagePlan,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => {
        dispatch({ type: ADD_PLAN, payload: agent.adminPlan.add(formData) });
    },
    fetchAdminPlans: () => {
        dispatch({ type: ADMIN_PLAN_FETCH, payload: agent.adminPlan.fetch() });
    },
    clearPlanMessage: () => {
        dispatch({ type: CLEAR_PLAN_MESSAGE });
    }
});

const Popup = (props) => {


	const {newmodalshow,setNewModalShow,onSubmit,successMessagePlan,fetchAdminPlans,errorMessagePlan,clearPlanMessage} = props;

    const formRef = useRef();

    const submitForm =  (e) => {
        e.preventDefault();
        clearPlanMessage();
        const formdata =  {
            name:e.target.name.value,
            month_price: parseInt(e.target.month_price.value),
            year_price: parseInt(e.target.year_price.value),
        };
        onSubmit(formdata);

        
    };  


    useEffect(() => {
        if (successMessagePlan) {
            fetchAdminPlans();
            formRef.current.reset();
            setNewModalShow(false);
            setTimeout(function(){
                clearPlanMessage();
            },2000);
        }
    }, [successMessagePlan]);

    useEffect(() => {
        if (errorMessagePlan) {
            setTimeout(function(){
                clearPlanMessage();
            },4000);
        }
    }, [errorMessagePlan]);

    
	
	return (
		<React.Fragment>
            <Modal show={newmodalshow} onClose={() => setNewModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Add Subscription</h4>
                    <div className="form-modal">
                        {errorMessagePlan ? <Badge bg="danger">{errorMessagePlan}</Badge> : <Fragment /> }
                        {successMessagePlan ? <Badge bg="success">{successMessagePlan}</Badge> : <Fragment /> }
                        <Form onSubmit={submitForm} ref={formRef}>
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12}>
                                    <div className="outer-form">
                                        <Form.Label>Subscption name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="name"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="outer-form">
                                        <Form.Label>Price(monthly)</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="month_price"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="outer-form">
                                        <Form.Label>Price(yearly)</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="year_price"
                                            required
                                        />
                                    </div>
                                </Col>
                                
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="submit">Save </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setNewModalShow(false)}>Cancel </Button>
                                    </div>
                                </Col>
                            </Row>
                          </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);