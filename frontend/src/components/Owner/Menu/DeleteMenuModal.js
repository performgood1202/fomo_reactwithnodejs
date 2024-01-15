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
    DELETE_MENU,
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
            dispatch({ type: DELETE_MENU, payload: agent.owner.deleteMenu(formData) });
        }else{
            dispatch({ type: DELETE_MENU, payload: agent.manager.deleteMenu(formData) });
        }  
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {currentUser,deletemenumodalshow,setDeleteMenuModalShow,onSubmit,successMsgDelete,errorMsgDelete,clearMessage,menu_id,club_id,setIsLoading} = props;



    

    const formRef = useRef();

    let navigate = useNavigate();

    const deleteMenuItem =  (club_id,menu_id) => {
        setIsLoading(true);
        clearMessage();
        const formData =  {
            menu_id:menu_id,
            club_id:club_id,
        };
        if(currentUser && currentUser.roleId){
            onSubmit(formData,currentUser.roleId);
        }
    };  


    useEffect(() => {
        if (errorMsgDelete) {
            setIsLoading(false);
            setDeleteMenuModalShow(false);
            setTimeout(function(){
                clearMessage();
            },2000);
        }
    }, [errorMsgDelete]);
    useEffect(() => {
        if (successMsgDelete) {
            setIsLoading(false);
            setDeleteMenuModalShow(false);
            setTimeout(function(){
                clearMessage();
            },2000);
            navigate("/"+prefix[currentUser.roleId]+"/menu");
        }
    }, [successMsgDelete]);

   
	
	return (
		<React.Fragment>
            <Modal show={deletemenumodalshow} onClose={() => setDeleteMenuModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Delete Item</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to delete the item?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => deleteMenuItem(club_id,menu_id)}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setDeleteMenuModalShow(false)}>No </Button>
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