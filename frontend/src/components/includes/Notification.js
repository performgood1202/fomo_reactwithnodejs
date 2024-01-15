import React, { useState, Fragment, useEffect, createRef } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { BsBellFill } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import agent from "../../agent";

import { TOP_HEADER, RIGHT_HEADER } from './../../constants/header.js';
import { READ_NOTIFICATION } from "../../constants/actionTypes";
import logo from '../../assets/images/logo.svg';
import ProfileViewerAdmin from './includes/ProfileViewerAdmin';

import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
	return {
		...state,
		currentUser: state.common.currentUser,
		pageheading: state.common.pageheading,
		readNotificationData: state.common.readNotificationData,
	}
};

const mapDispatchToProps = (dispatch) => ({
	readNotification: (notification_id) => {
    	dispatch({ type: READ_NOTIFICATION, payload: agent.common.readNotification(notification_id) });
  	},
});

const Notification = (props) => {
	const { currentUser, showNoti,setShowNoti,notificationData,readNotification} = props;

	const setHideNotiFunc = (notification_id) => {
		readNotification(notification_id);
        setShowNoti("");
	}

	return (
		<Fragment>
	      	<div className={"notification-sec "+showNoti}>
				<div className="title-with-cross d-flex justify-content-between align-items-center">
					<h3 className="">Notifications</h3>
					<AiOutlineCloseCircle onClick={(e)=>setHideNotiFunc(e)} />
				</div>
				{(notificationData && notificationData.length > 0)?
					notificationData.map((notification, index)=>{ 
						let linkk = "#";
						if(notification.notification_link && notification.notification_link != ""){
                            linkk = notification.notification_link;
						}
						return (
						    <Fragment key={index}>
								<div className="notification-inner">

							        <Link className="text-white" to={linkk} onClick={(e)=>setHideNotiFunc(notification._id)}>
							            {(notification.notification_type == "Query")?
										   <span className="orange-back noti-alert">Query</span>
										:(notification.notification_type == "Subscription")?
										  <span className="yellow-back noti-alert">New Subscription</span> 
										:(notification.notification_type == "Promotion")?
										  <span className="skyblue-back noti-alert">Promotion</span> 
										:(notification.notification_type == "Booking")?
										  <span className="yellow-back noti-alert">Event Booking</span> 
										:(notification.notification_type == "Order")?
										  <span className="skyblue-back noti-alert">New Order</span> 
										:''}
										<div dangerouslySetInnerHTML={{
					                      __html: notification.message
					                    }} />
					                </Link>    
					                   
					                    
								</div>
								<hr />
							</Fragment>
						)
					})
				:
				   <p className="">There are no notifications.</p>
			    }	
				
			</div>
		</Fragment>	
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);