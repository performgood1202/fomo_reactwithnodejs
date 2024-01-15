import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import Modal from '../../Popup';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import Loader from "../../Loader";

import {
    ASSIGN_TABLE,
    ADMIN_CLEAR_MESSAGES,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state,
    clubData: state.common.clubData,
    successMsg: state.owner.successMsg,
    errorMsg: state.owner.errorMsg,
    currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData,role) => {
        if(role == "2"){
           dispatch({ type: ASSIGN_TABLE, payload: agent.owner.assignTable(formData) });
        }else{
            dispatch({ type: ASSIGN_TABLE, payload: agent.manager.assignTable(formData) });
        }
        
        
    },
    clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
    
});

const Popup = (props) => {

   
	const {row,clubData,currentUser,AssignTableModalshow,setAssignTableModalshow,errorMsg,successMsg,onSubmit,event_id,getBookings,clearMessages} = props;

    const [table_no,setTableNo] = useState("");
    const [error,setError] = useState("");

    useEffect(() => {
        if (row && row.booking && row.booking.table_no) {
            setTableNo(row.booking.table_no);
        }else{
            setTableNo(""); 
        }
    }, [row]);

    useEffect(() => {
        setError("");
    }, [AssignTableModalshow]);
    useEffect(() => {
        if (successMsg) {
            clearMessages()
            if(event_id && clubData){
                var formData = {
                    event_id:event_id,
                    club_id:clubData._id
                }
                if(currentUser && currentUser.roleId){
                    getBookings(formData,currentUser.roleId);
                }
            }
            setAssignTableModalshow(false)
        }
        setIsLoading(false);
    }, [successMsg]);

    useEffect(() => {
        if (errorMsg && errorMsg != "") {
            clearMessages()
            setError(errorMsg);
        }
        setIsLoading(false);
    }, [errorMsg]);



    

    const formRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const submitForm =  (e) => {
        clearMessages()
        setError("");
        setIsLoading(true);
        e.preventDefault();
        if(row && row.booking && row.booking._id && table_no && table_no != ""){
            const formdata =  {
                booking_id:row.booking._id,
                table_no:table_no,
                event_id:event_id,
            };
            if(currentUser && currentUser.roleId){
                onSubmit(formdata,currentUser.roleId);
            }
        }else{
            setIsLoading(false);
        }   
    };  

    let tabless = [];

    for (let i = 1; i <= 100; i++) {
        tabless.push(i);
    }




	
	return (
		<React.Fragment>
            {isLoading && <Loader /> }
            <Modal show={AssignTableModalshow} onClose={() => setAssignTableModalshow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Assign Table</h4>
                    <div className="form-modal">
                        {error ? <Badge bg="danger">{error}</Badge> : <Fragment /> }
                        <Form onSubmit={submitForm} ref={formRef}>
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12}>
                                    <div className="outer-form">
                                        <Form.Label>Please select table no.</Form.Label>
                                        <Form.Select value={table_no} onChange={ (e) => setTableNo(e.target.value) } required>
                                            <option value=''></option>
                                            { tabless.map((tableno, index)=>{ 
                                                return (
                                                    <option key={index} value={tableno}>{tableno}</option>
                                                    )
                                                })
                                            }       
                                        </Form.Select>
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="submit">Save </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setAssignTableModalshow(false)}>Cancel </Button>
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