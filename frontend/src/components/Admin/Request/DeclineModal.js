import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import Modal from '../../Popup';
import agent from "../../../agent";
import Loader from "../../Loader";
import ListErrors from "../../ListErrors";

import {
    FEATCH_CLUB_REQUEST,
    ACCEPT_CLUB_REQUEST,
    CLEAR_REQUEST_MESSAGE,
    DECLINE_CLUB_REQUEST,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.club,
    successMessageClubRequest: state.club.successMessageClubRequest,
    errorMessageClubRequest: state.club.errorMessageClubRequest,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => {
        dispatch({ type: DECLINE_CLUB_REQUEST, payload: agent.club.declineClubRequest(formData) });
    },
    fetchClubRequests: () => {
        dispatch({ type: FEATCH_CLUB_REQUEST, payload: agent.club.fetchClubRequests() });
    },
    clearRequestMessage: () => {
        dispatch({ type: CLEAR_REQUEST_MESSAGE });
    }
    
});

const Popup = (props) => {


	const {declinemodalshow,setDeclineModalShow,onSubmit,row,clearRequestMessage,successMessageClubRequest,errorMessageClubRequest,
    fetchClubRequests} = props;
    

    const formRef = useRef();

    const [isLoading, setIsLoading] = useState(false);

    const submitForm =  (e) => {
        setIsLoading(true);
        clearRequestMessage();
        e.preventDefault();
        const formdata =  {
            id:row._id,
        };
        onSubmit(formdata);
    };  

    useEffect(() => {       
        if(successMessageClubRequest){
            setIsLoading(false);

            fetchClubRequests();

            setDeclineModalShow(false);

            setTimeout(function(){
                clearRequestMessage();
            },6000);

            
        }
    }, [successMessageClubRequest]) 

    useEffect(() => {       
        if(errorMessageClubRequest){
            setIsLoading(false);

            fetchClubRequests();

            setDeclineModalShow(false);

            setTimeout(function(){
                clearRequestMessage();
            },6000);
            
        }
    }, [errorMessageClubRequest]) 

    


    
	
	return (
		<React.Fragment>
            {isLoading && <Loader /> }
            <Modal show={declinemodalshow} onClose={() => setDeclineModalShow(false)} >
                <div className="content">
                <h4 className="modal-title text-center">Decline Request</h4>
                    <div className="form-modal">
                        <Form onSubmit={submitForm} ref={formRef}>
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-5 mt-5 text-center">
                                   <span>Are you sure you want to decline the request?</span>
                                </Col>
                                <Col lg={12}>
                                    <div className="outer-form btn-group-modal text-center">
                                        <Button className="custom-btn orange-btn" type="submit">Yes </Button>
                                        <Button className="custom-btn purple-btn" type="button" onClick={() => setDeclineModalShow(false)}>No </Button>
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