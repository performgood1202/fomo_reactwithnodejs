import React, { Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../agent";
import { Container, Row, Col, Image, Button, NavLink, Form } from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import profile from "../../assets/images/profile.png";

import AdminProfile from "../Admin/profile"

const mapStateToProps = (state) => ({
  	...state,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({});



const MainView = (props) => {

	const {currentUser} = props;
	return (
		<Fragment>
			<section className="profile-main-sec">
				<Container fluid>
				    {(currentUser && currentUser.roleId == "1")?
				       (<AdminProfile />)
				    : (
						<Row>
				        	<Col lg={12}>
				        		<div className="profile-edit-outer d-flex align-items-center justify-content-between">
				        			<div className="profile-edit">
				        				<div className="profile-circle">
					        				<Image src={profile} className="profile-img" /> 
										        <Form.Control type="file" />
										        <FiEdit />
									    </div>
				        				<h4>Shanahan Tyson1</h4>
				        			</div>
				        			<div className="right-profile-btn text-right">
				        				<Button className="orange-btn custom-btn">Edit</Button>
				        			</div>
				        		</div>
				        		<div className="darkblue-sec mt-5 mb-5">
					        		<h5>Details:</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form>
									      <Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row>
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>First name</Form.Label>
									        			<Form.Control type="text" />
									        		</div>
									        	</Col>
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>First name</Form.Label>
									        			<Form.Control type="text" />
									        		</div>
									        	</Col>
									        	<Col lg={6} className="mt-4">
									        		<div className="outer-form">
									        			<Form.Label>Email</Form.Label>
									        			<Form.Control type="email" />
									        		</div>
									        	</Col>
									        	<Col lg={6} className="mt-4">
									        		<div className="outer-form">
									        			<Form.Label>Phone</Form.Label>
									        			<Form.Control type="text" />
									        		</div>
									        	</Col>
									        </Row>
									      </Form.Group>
									    </Form>
					        		</div>
	                            </div>
				        	</Col>
				      	</Row>
				    )}
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);