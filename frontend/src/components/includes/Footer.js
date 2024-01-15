import React from "react";
import { connect } from "react-redux";
import { Container, Image, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { FOOTER_LINKS, FOOTER_ICONS } from './../../constants/footer.js';
import logo from '../../assets/images/logo.svg';

const mapStateToProps = (state) => {
	return {
		...state,
		appName: state.common.appName,
		currentUser: state.common.currentUser
	}
};

const mapDispatchToProps = (dispatch) => ({})

const Footer = (props) => {
	const { appName } = props;

	return (
      	<footer className="footer">
      		<Container>
				<Row className="align-items-center">
					<Col lg={3}>
						<NavLink to="/">
							{(logo) ? (
								<Image src={logo} alt='footer-logo' className="logo-img" />
							) : (
								<p>{appName}</p>
							)}
						</NavLink>
					</Col>
					<Col lg={6}>
						<div className="links">
							{
								FOOTER_LINKS.map((menu, i) => {
									return (
										<NavLink className="a-links" key={i} to={menu.link}>{menu.name}</NavLink>
									)
								})
							}
						</div>
					</Col>
					<Col lg={3}>
						<div className="icons">
							{
								FOOTER_ICONS.map((menu, i) => {
									return (
										<a key={i} className={menu.class} href={menu.link} target="_blank" rel="noreferrer">{menu.icon}</a>
									)
								})
							}
						</div>
					</Col>
				</Row>
				<p className="text-center copyright-txt">Copyright 2022 P&H Creative Oy. All rights are reserved.</p>
			</Container>
      	</footer>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(Footer);