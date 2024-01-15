import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table } from 'react-bootstrap';
import { AiFillPlusCircle,AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './styles.scss';


const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

const Popup = (props) => {

	const {modalStyle, children, show, onClose } = props;
	const modalRef = useRef(null);
    useEffect(() => {
            if (show) {
                modalRef.current.classList.add("visible");
            }
            else {
                modalRef.current.classList.remove("visible");
            }
     },[show]);

	return (
		<React.Fragment>
            <div ref={modalRef} className="modal__wrap">
                
                <div style={modalStyle} className="modal">
                    <Button
                        onClick={onClose}
                        className="closeModal"
                    >
                    <AiOutlineCloseCircle />
                    </Button>
                    {children}
                </div>
            </div>
        </React.Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);