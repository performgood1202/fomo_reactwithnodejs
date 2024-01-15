import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import { prefix } from './../../../constants/prefix.js';

import {
    DELETE_EVENT_IMAGE,
    ADMIN_CLEAR_MESSAGES,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.plan,
    successMsg: state.owner.successMsg,
    errorMsg: state.owner.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData,role) => {
        if(role == "2"){
            dispatch({ type: DELETE_EVENT_IMAGE, payload: agent.owner.deleteEventImage(formData) });
        }else{
            dispatch({ type: DELETE_EVENT_IMAGE, payload: agent.manager.deleteEventImage(formData) });
        }
    },
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const EventImage = (props) => {



   
	const {onSubmit,successMsg,errorMsg,clearMessage,row,eventImage,currentUser,setIsLoading,eventData} = props;



    const [deleteEventImageModalShow,setdeleteEventImageModalShow] = useState(false);

    const formRef = useRef();

    const deleteEventImg =  (id) => {
        setIsLoading(true);
        clearMessage();
        const formdata =  {
            _id:id,
        };
        if(currentUser && currentUser.roleId){
            onSubmit(formdata,currentUser.roleId);
        }
        
    };

    useEffect(() => {
        if(errorMsg){
            setIsLoading(false);
            setdeleteEventImageModalShow(false)
            setTimeout(() => {
                clearMessage();
            }, 3000);
        }
    }, [errorMsg]);

    useEffect(() => {
        if(successMsg){

            setIsLoading(false);
            setdeleteEventImageModalShow(false)
            setTimeout(() => {
                clearMessage();
            }, 3000);
        }
    }, [successMsg]); 

	return (
		<React.Fragment>
            <Col lg={3} className="mb-3">
                  <div className="edit-image-sec">
                      <Image src={eventImage.image} />
                      {(eventData && eventData.event_booked < 1)?
                        <BsTrash className="red-btn" onClick={() => setdeleteEventImageModalShow(true)} />
                      :""}
                      
                  </div>
            </Col>
            <Modal show={deleteEventImageModalShow} onClose={() => setdeleteEventImageModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Delete Event image</h4>
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to delete the Event image?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="button" onClick={() => deleteEventImg(eventImage._id)}>Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setdeleteEventImageModalShow(false)}>No </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EventImage);