import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";

import {
    DELETE_CLUB,
    ADMIN_CLEAR_MESSAGES,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsgDelete: state.club.successMsgDelete,
    errorMsgDelete: state.club.errorMsgDelete,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => {
        dispatch({ type: DELETE_CLUB, payload: agent.club.delete(formData) });
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {deleteclubmodalshow,setDeleteClubModalShow,onSubmit,successMsgDelete,errorMsgDelete,clearMessage,row,setIsLoading} = props;

    

    const formRef = useRef();

    const submitForm =  (e) => {
        setIsLoading(true);
        e.preventDefault();
        clearMessage();
        const formdata =  {
            _id:row._id,
        };
        onSubmit(formdata);
    };  


   /* useEffect(() => {
        if (successMessageFeature) {
            fetchAdminFeature();
            formRef.current.reset();
            setDeleteClubModalShow(false);
            setTimeout(function(){
                clearMessage();
            },2000);
        }
    }, [successMessageFeature]);
*/
   
	
	return (
		<React.Fragment>
            <Modal show={deleteclubmodalshow} onClose={() => setDeleteClubModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Delete Club</h4>
                    <div className="form-modal">
                        <Form onSubmit={submitForm} ref={formRef}>
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to delete the club?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="submit">Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setDeleteClubModalShow(false)}>No </Button>
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