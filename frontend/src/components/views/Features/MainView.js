import React, { Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Tabs, Tab, Button } from 'react-bootstrap';
import features1 from "../../../assets/images/features1.png";
import { NavLink } from 'react-router-dom';
import { TiTick } from 'react-icons/ti';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const MainView = (props) => {
	return (
		<Fragment>
			<section className="banner-section features-banner-section">
				<Container>
			      <Row>
			        <Col lg={7}>
				        <div className="banner-content ">
							<h2>Get Down To Business <br />With Advanced <br />Features</h2>
							<h6>Explore the many features of our software and see how they can help your business thrive.</h6>
							
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>

			<section className=" features-tabs-section">
				<Container>
			      <Row>
			        <Col lg={12}>
			        	<h4 className="text-center fomo-about-title mb-5 pb-3">Our Core Features</h4>
				        <div className="tab-outer">
							<Tabs
						      defaultActiveKey="profile"
						      id="uncontrolled-tab-example"
						      className="mb-3"
						    >
						      <Tab eventKey="home" title="Streamline orders & reservations">
							     <Row className="align-items-center">
							        <Col lg={6}>
								        <div className="tab-content ">
											<h4 className="mb-2"><TiTick />Remote Order</h4>
											<p>Make table ordering a breeze with self-ordering to boost your bottle sales. </p>
											
											<h4 className="mb-2"><TiTick />Table Upgrades</h4>
											<p>Increase your sales by leaps and bounds by offering online table reservations and add-ons such as premium liquor packages and VIP tables.</p>
										</div>
									</Col>
									<Col lg={6}>
								        <div className="tab-img ">
											<Image src={features1} />
											
										</div>
									</Col>
							      </Row>
						      </Tab>
						      <Tab eventKey="profile" title="Management Menu">
							      <Row className="align-items-center">
							        <Col lg={6}>
								        <div className="tab-content ">
											<h4 className="mb-2"><TiTick />Guestlist Management </h4>
											<p>Optimize door operations and help staff identify VIPs at a glance.</p>

											<h4 className="mb-2"><TiTick />Revenue Monitoring</h4>
											<p>Keep tabs on your daily revenue with an advanced dashboard that charts your sales. </p>											
										</div>
									</Col>
									<Col lg={6}>
								        <div className="tab-img ">
											<Image src={features1} />
											
										</div>
									</Col>
							      </Row>
						      </Tab>
						      <Tab eventKey="contact" title="Marketing & promotion">
							      <Row className="align-items-center">
							        <Col lg={6}>
								        <div className="tab-content ">
											<h4 className="mb-2"><TiTick />Integrated Advertising Tools</h4>
											<p>Promote your events to sell more tickets by pushing notifications to your subscriber list with Blank's promotional tools.</p>
											
											<h4 className="mb-2"><TiTick />Social Media Sharing</h4>
											<p>Allow your most loyal guests to promote your hottest events using built-in sharing funnels that connect to all social media platforms.  </p>
										</div>
									</Col>
									<Col lg={6}>
								        <div className="tab-img ">
											<Image src={features1} />
											
										</div>
									</Col>
							      </Row>
						      </Tab>
						    </Tabs>
							
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>

			<section className="features-fomo-section">
				<Container>
					<h4 className="text-center fomo-about-title mb-5 pb-3">What Blank Brings To Your Table</h4>
			      <Row className="align-items-center">
				     <Col lg={6}>
				        <div className="features-fomo-img ">
							<Image src={features1} />
					    </div>
					 </Col>
			        <Col lg={6}>
				        <div className="features-fomo-content ">
							<h4>All Your Operations, One Tool</h4>
							<p>Blank centralizes all your communications and club operations in one place. It saves you countless phone calls and serves up all the data you need on a silver platter with a single click.</p>
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>

			<section className="features-fomo-section">
				<Container>
			      <Row className="align-items-center">
				       <Col lg={6}>
					        <div className="features-fomo-content ">
								<h4>Accessible From Any Device</h4>
								<p>Whether you're at your desk, sitting at your club table or at home. From a tablet, desktop computer, or phone, you can access all of your club's real-time records from any device, anywhere.</p>
							</div>
						</Col>
						<Col lg={6}>
					        <div className="features-fomo-img ">
								<Image src={features1} />
							</div>
					  	</Col>
			      </Row>
			    </Container>
			</section>

			<section className="features-fomo-section">
				<Container>
			      <Row className="align-items-center">
				     <Col lg={6}>
				        <div className="features-fomo-img ">
							<Image src={features1} />
					    </div>
					 </Col>
			        <Col lg={6}>
				        <div className="features-fomo-content ">
							<h4>Integrated CRM Database</h4>
							<p>Blank has a membership database that contains all your guests' valuable information. It helps you deliver a personalized experience to your clients using their insights, and tags such as birthday dates, favorite drinks, and VIP status.</p>
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>

			<section className="features-subscribe-section">
				<Container>
			      <Row className="align-items-center">
				     <Col lg={8}>
				        <div className="subscribe-fomo-content">
							<h4>Ready To Take Your Nightclub Experience To New Heights?</h4>
							<p>Give it a try by signing up now</p>
					    </div>
					 </Col>
			        <Col lg={4}>
				        <div className="features-fomo-btn text-right">
							<NavLink to="/prices" className="btn btn-primary custom-btn black-btn">See The Price Plan</NavLink>
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);