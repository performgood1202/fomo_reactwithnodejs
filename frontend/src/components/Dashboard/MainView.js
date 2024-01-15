import React, { Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../agent";
import { Container, Row, Col, Image, Button, NavLink } from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import hth from "../../assets/images/hth.png";
import event from "../../assets/images/event.png";
import money from "../../assets/images/money.png";
import switch1 from "../../assets/images/switch.png";
import revenue from "../../assets/images/revenue.png";
import eventimg1 from "../../assets/images/eventimg1.png";

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});


const MainView = (props) => {
	return (
		<Fragment>
			<section className="dashobard-main-sec">
				<Container fluid>
					<Row>
			        	<Col lg={3}>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="orange-back icons-back"><Image src={hth} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>50</h4>
			        				<p>Total Seats</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="skyblue-back icons-back"><Image src={event} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>10</h4>
			        				<p>Upcoming Events</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="pink-back icons-back"><Image src={switch1} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>02</h4>
			        				<p>Promotions</p>
			        			</div>
			        			<div className="plus-outer">
			        				<AiOutlinePlusCircle />
			        			</div>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="purple-back icons-back"><Image src={money} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>€15,000</h4>
			        				<p>Total Earnings</p>
			        			</div>
			        		</div>
			        	</Col>
			      	</Row>
			    </Container>
			</section>

			<section className="dashobard-revenue-sec">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        		<div className="revenue-outer">
			        			<Image src={revenue} className="w-100"/>
			        		</div>
			        	</Col>
			        	
			      	</Row>
			    </Container>
			</section>

			<section className="upcoming-event-sec">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        		<div className="upcoming-event-outer">
			        			<h5 className="d-flex align-items-center justify-content-between">Upcoming Events <NavLink>View All</NavLink></h5>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="upcoming-event-boxes">
			        			<Image src={eventimg1} className="w-100"/>
			        			<div className="upcoming-inner-boxes">
				        			<h5>Lorem ipsum dolor sit amet</h5>
				        			<p>20,July,2022  |  05:00</p>
				        			<span className="yellow-back">Booked</span>
				        		</div>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="upcoming-event-boxes">
			        			<Image src={eventimg1} className="w-100"/>
			        			<div className="upcoming-inner-boxes">
				        			<h5>Lorem ipsum dolor sit amet</h5>
				        			<p>20,July,2022  |  05:00</p>
				        			<span className="green-back">Available</span>
				        		</div>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="upcoming-event-boxes">
			        			<Image src={eventimg1} className="w-100"/>
			        			<div className="upcoming-inner-boxes">
				        			<h5>Lorem ipsum dolor sit amet</h5>
				        			<p>20,July,2022  |  05:00</p>
				        			<span className="green-back">Available</span>
				        		</div>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="upcoming-event-boxes">
			        			<Image src={eventimg1} className="w-100"/>
			        			<div className="upcoming-inner-boxes">
				        			<h5>Lorem ipsum dolor sit amet</h5>
				        			<p>20,July,2022  |  05:00</p>
				        			<span className="green-back">Available</span>
				        		</div>
			        		</div>
			        	</Col>
			      	</Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);