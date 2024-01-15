import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const MainView = (props) => {
	const {club_status} = props;
	console.log(club_status)
	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="noaccess-outer text-center mt-10">

				            {
				            	(club_status && club_status == "0")? <h3>Your subscription plan has been expired!</h3> : (club_status && club_status == "2")? <h3>Club has been declined!</h3> : <h3>Club not exist!</h3>
				            }
                            <hr />
				        	 
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);