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
    DELETE_STAFF,
    ADMIN_CLEAR_MESSAGES,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsgStaffDelete: state.staff.successMsgStaffDelete,
    errorMsgStaffDelete: state.staff.errorMsgStaffDelete,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData,role) => {
        if(role == "2"){
            dispatch({ type: DELETE_STAFF, payload: agent.managerStaff.deleteStaff(formData,'owner') });
        }else{
            dispatch({ type: DELETE_STAFF, payload: agent.managerStaff.deleteStaff(formData,'manager') });
        } 
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {currentUser,deletestaffmodalshow,setDeleteStaffModalShow,onSubmit,successMsgStaffDelete,errorMsgStaffDelete,clearMessage,staff_id,club_id,setIsLoading} = props;



    

    const formRef = useRef();

    let navigate = useNavigate();

    const deleteStaff=  (staff_id,club_id) => {
        setIsLoading(true);
        clearMessage();
        const formData =  {
            staff_id:staff_id,
            club_id:club_id,
        };
        if(currentUser && currentUser.roleId){
           onSubmit(formData,currentUser.roleId);
        }
        
    };  



   
	
	return (
		<React.Fragment>
            <Modal show={deletestaffmodalshow} onClose={() => setDeleteStaffModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Delete Staff Member</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to delete the staff member?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => deleteStaff(staff_id,club_id)}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setDeleteStaffModalShow(false)}>No </Button>
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