import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { Container, Nav, Navbar, NavDropdown, NavItem, Image, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import agent from "../../agent";
import ProfileViewer from './includes/ProfileViewer';

import { TOP_HEADER, RIGHT_HEADER } from './../../constants/header.js';
import { LOGOUT } from "../../constants/actionTypes";
import logo from '../../assets/images/logo.svg';

const mapStateToProps = (state) => {
	return {
		...state,
		appName: state.common.appName,
		currentUser: state.common.currentUser
	}
};

const mapDispatchToProps = (dispatch) => ({
	onSignOut: () => { dispatch({ type: LOGOUT }) },
	// onSignOut: () => { dispatch({ type: LOGOUT, payload: agent.Auth.logout() }) },
});

const Header = (props) => {
	const { appName, currentUser, onSignOut } = props;
	// const { roleId } = currentUser;

	const [roleId, setRoleID] = useState('');

	if(currentUser){
		const { roleId } = currentUser;
	}else{
		const roleId = null;
	}
	

	let valProps = {
		currentUser,
		onSignOut
	}

	return (
      	<div className="header-main">
			<Navbar bg="light" expand="lg">
				<Container>
					<Row className="align-items-center">	
						<Col lg={3} sm={12} className="header-mobile">
							<Nav.Link as={NavLink} to="/" exact="true">
								{(logo) ? (
									<Image src={logo} alt='logo' className="logo-img" />
								) : (
									<p>{appName}</p>
								)}
							</Nav.Link>
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
						</Col>
						<Col lg={6} sm={4}>
							<Navbar.Collapse id="basic-navbar-nav">
								<Nav className="me-auto">
									{
										TOP_HEADER.map((menu, i) => {
											let acessor = menu.accessor;
											let showMenu = false;
											if(acessor == 'all') {
												showMenu = true;
											}else if(acessor == 'front' && !currentUser) {
												showMenu = true;
											}else if(typeof acessor == 'object') {
												if(roleId && acessor.indexOf(roleId) !== -1) {
													showMenu = true;
												}
											}

											return (
												<Fragment key={i}>
													{showMenu ? (
														<Nav.Link as={NavLink} to={menu.link}>{menu.name}</Nav.Link>
													) : (
														<Fragment />
													)}
												</Fragment>
											)
										})
									}									
								</Nav>
							</Navbar.Collapse>
						</Col>
						<Col lg={3} sm={4} className="tab-display-none">
							<div className="right-header-location">
								{
									RIGHT_HEADER.map((menu, i) => {
										return (
											<Fragment key={i}>
												<Nav.Link activeclassname="active" className="contact-btn" as={NavLink} to={menu.link}>{menu.name}</Nav.Link>
											</Fragment>
										)
									})
								}

								<ProfileViewer {...valProps} />
							</div>
						</Col>
					</Row>
				</Container>
			</Navbar>
      		
      	</div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(Header);