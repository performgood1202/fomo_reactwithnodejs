import React, { useState, Fragment, useEffect, createRef } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { BsBellFill } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import agent from "../../agent";

import { TOP_HEADER, RIGHT_HEADER } from './../../constants/header.js';
import { LOGOUT,GET_NOTIFICATION_COUNT,GET_NOTIFICATIONS } from "../../constants/actionTypes";
import logo from '../../assets/images/logo.svg';
import ProfileViewerAdmin from './includes/ProfileViewerAdmin';
import Notification from './Notification';
import moment from "moment";
import socketIOClient from "socket.io-client";

const mapStateToProps = (state) => {
	return {
		...state,
		currentUser: state.common.currentUser,
		pageheading: state.common.pageheading,
		notificationCount: state.common.notificationCount,
		notificationData: state.common.notificationData,
		errorMsg: state.common.errorMsg,
	}
};

const mapDispatchToProps = (dispatch) => ({
	getNotificationCount: () => {
    	dispatch({ type: GET_NOTIFICATION_COUNT, payload: agent.common.getNotificationCount() });
  	},
  	getNotifications: () => {
    	dispatch({ type: GET_NOTIFICATIONS, payload: agent.common.getNotifications() });
  	},
	onSignOut: () => { dispatch({ type: LOGOUT }) },
});

const Header = (props) => {
	const { currentUser, onSignOut,pageheading,getNotificationCount,getNotifications,notificationCount,notificationData} = props;


	const [showNoti,setShowNoti] = useState("");

	const [notiCount,setNotiCount] = useState(null);

	const setShowNotiFunc = (e) => {
		getNotifications();
        setShowNoti("notification-sec-show");
	}
	let socket;

	useEffect(() => {
  		const token = window.localStorage.getItem("jwt");
  		if(token){
		    socket = socketIOClient(`${process.env.REACT_APP_BACKEND}?query=${token}`, {
	           transports: ["websocket"],
	        });

	        socket.on("connect", () => {
	          console.log("connected to server", socket);
	        });
		    socket.on("newNotificationRecived", (data) => {
		       getNotificationCount();
		    });
		}else{
			if (socket) socket.close();
		}   
	}, []);



	useEffect(() => {  	

		getNotificationCount();
		

  	}, []) 
    useEffect(() => {  	

        if(notificationCount){
           setNotiCount(notificationCount)
        }else{
           setNotiCount(null);
        }
		

  	}, [notificationCount]) 


	let valProps = {
		currentUser,
		onSignOut
	}
	return (
      	<div className="auth-header-main">
				<Container fluid>
					<Row className="align-items-center justify-content-between">
						<Col lg={6}>
							<div className="dashboard-title">
								<h4>{pageheading}</h4>
							</div>
						</Col>
						<Col lg={6}>
							<div className="dashboard-profile-view">
								<div className="notification-outer">
									<h3 onClick={(e)=>setShowNotiFunc(e)}><BsBellFill />{(notiCount)?<span className="orange-back">{notiCount}</span>:''}</h3>
								</div>
								<ProfileViewerAdmin {...valProps} />
							</div>
						</Col>
					</Row>
				</Container>
				<Notification notificationData={notificationData} showNoti={showNoti} setShowNoti={setShowNoti}/>
      	</div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);