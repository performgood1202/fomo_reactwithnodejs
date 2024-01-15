import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const MainView = (props) => {
	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="noaccess-outer text-center mt-10">

				            <h2>404</h2>
				            <h4>Page not found!</h4>
                            <hr />
                            <NavLink className="btn a-links" to="/">Home</NavLink>
				        	 
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);