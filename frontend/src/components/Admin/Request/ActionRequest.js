import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import AcceptModal from "./AcceptModal";
import DeclineModal from "./DeclineModal";


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});
const removeA =  (arr, item) => {
    return arr.filter(f => f !== item)
}


const ActionRequest = (props) => {
	    let { row } = props;

	    const [acceptmodalshow,setAcceptModalShow] = useState(false);
        const [declinemodalshow,setDeclineModalShow] = useState(false);
	   
        return (
                <Fragment>
	        	    <div className="outer-form btn-group-modal d-flex justify-content-center w-100 text-center">
                        <Button className="custom-btn orange-btn ml-1 mr-30px" type="submit" onClick={() => setAcceptModalShow(true)}>Accept</Button>
                        <Button className="custom-btn purple-btn ml-1" type="button" onClick={() => setDeclineModalShow(true)}>Decline </Button>
                    </div>
                    <div>
                      <AcceptModal acceptmodalshow={acceptmodalshow} setAcceptModalShow={setAcceptModalShow} row={row} /> 
                      <DeclineModal declinemodalshow={declinemodalshow} setDeclineModalShow={setDeclineModalShow} row={row} /> 
                    </div>
				</Fragment>
		)			
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionRequest);