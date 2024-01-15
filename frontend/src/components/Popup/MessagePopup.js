import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle,AiOutlineCheckCircle } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import Modal from './index';


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({});

const Popup = (props) => {

   
	const {currentUser,popupshow,setPopupShow,onSubmit,messagetext,setIsLoading,msgerror} = props;

	
	return (
		<React.Fragment>
            <Modal show={popupshow} onClose={() => setPopupShow(false)} >
                <div className="content">
                    <div className="form-modal">
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Row>
                                <Col lg={12} className="mb-2 mt-2 text-center">
                                  {(msgerror)?
                                    <BiError className="error-icon" />
                                    :
                                    <AiOutlineCheckCircle className="success-icon" />
                                  }
                                </Col>
                                <Col lg={12} className="text-center">
                                   <span>{messagetext}</span>
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