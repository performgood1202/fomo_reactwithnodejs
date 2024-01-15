import React, { Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, Carousel } from 'react-bootstrap';
import step1 from "../../../assets/images/step-1.png";
import step2 from "../../../assets/images/step-2.png";
import step3 from "../../../assets/images/step-3.png";
import desktop from "../../../assets/images/dashboard-img.png";
import lady from "../../../assets/images/lady.png";

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const MainView = (props) => {
	return (
		<Fragment>
			<section className="banner-section about-banner-section">
				<Container>
			      <Row>
			        <Col lg={12}>
				        <div className="banner-content text-center">
							<h2>Cheers To A More <span className="blue-text">Profitable Business</span></h2>
							<h6 className=" mb-5">Our software puts your nightclub at the heart of its features, each one designed to make nightlife simpler, manageable, and more lucrative.</h6>							
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>

			<section className="about2-section">
				<Container>
			      <Row>
			        <Col lg={5}>
				        <div className="about-left-content">
							<h4>What Inspired Blank?</h4>
							<h6>User-friendly on the surface, complexity in depth</h6>
							
						</div>
					</Col>
					<Col lg={7}>
				        <div className="about-right-content">
							<p>With the emergence of management software that has sprung up like mushrooms in recent years. These " jack-of-all-trades " business solutions left a lot to be desired. They didn't offer niche-specific benefits and had features that often weren't geared towards nightclub owners.
							As true fans of the nightlife and its thrills, we understand - and have witnessed - the challenges that nightclub owners and operators face every day. From management difficulties to profit leakage.
							That's why we decided to zoom in and create a targeted, niche-specific management software that helps nightclub operators streamline their daily operations.</p>							
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>

			<section className="about3-section">
				<Container>
					<h4 className="text-center fomo-about-title mb-5 pb-3">Blank Mission</h4>
			      <Row className="">
			        <Col lg={4}>
				        <div className="about-icons-outer">
							<h5 className="d-flex"><Image src={step1} /> Effortless Management</h5>
							<p>Have all your nightclub's operational and financial statistics in a single, easy-to-use dashboard.</p>							
						</div>
					</Col>
					<Col lg={4}>
				        <div className="about-icons-outer">
							<h5 className="d-flex"><Image src={step2} /> Unbeatable Prices</h5>
							<p>Enjoy all Blank benefits at a cost-effective rate, with no hidden fees or upgrades.</p>							
						</div>
					</Col>
					<Col lg={4}>
				        <div className="about-icons-outer">
							<h5 className="d-flex"><Image src={step3} /> Dedicated Support</h5>
							<p>Our customer service is available 24/7 to answer all your questions and resolve any issues you encounter.</p>							
						</div>
					</Col>
					<Col lg={4}>
				        <div className="about-icons-outer">
							<h5><Image src={step1} /> Simple Reservations</h5>
							<p>Avoid long lines and attract a younger crowd by digitizing your booking system.</p>							
						</div>
					</Col>
					<Col lg={4}>
				        <div className="about-icons-outer">
							<h5 className="d-flex"><Image src={step2} /> Traceability & Accountability</h5>
							<p>Get up-to-date order history, and daily sales and receipts to help you review and improve your bottom line.</p>							
						</div>
					</Col>
					<Col lg={4}>
				        <div className="about-icons-outer">
							<h5 className="d-flex"><Image src={step3} /> Real Time Performance</h5>
							<p>Get your nightclub ticket sales, reservations, and ad campaign results in real-time without any delay.</p>							
						</div>
					</Col>
			      </Row>

			      <Row className="">
			        <Col lg={12}>
				        <div className="about-icons-outer">
							<h4 className="text-center fomo-about-title mb-3 mt-5 pt-5">Witness Blank In Action</h4>
							<p className="text-center">Discover the range of benefits and features that Blank brings to your table by watching this quick video tutorial.</p>
							<div className="blue-btn-outer text-center">
								<Button className="custom-btn blue-btn">Watch Video</Button>
							</div>
						</div>
					</Col>
					
			      </Row>
			    </Container>
			</section>

			<section className="about-last-sec">
				<Container>
					<Row className="">
				        <Col lg={12}>
					        <div className="about-desktop-outer">
								<Image src={desktop} />
							</div>
						</Col>
					</Row>
				</Container>
			</section>

			<section className="about-testimonial-sec">
				<Container>
					<h4 className="text-center fomo-about-title mb-5">What Are Clients Says</h4>
					<Row className="">
				        <Col lg={12}>
					        <div className="about-desktop-outer">
								<Carousel show={2}>
							      <Carousel.Item interval={1000}>
							        <Carousel.Caption>
							          <div className="outer-slider-carousal">
								          <Row>
								          	<Col lg={6}>
								          		<div className="inner-slider-carousal">
								          			<h5><Image src={lady} /> Sporer Rodrigo </h5>
								          			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Llentesque semper, est eget commodo mattis, risus velit laoreet nibh, id vehicula ipsum diam vel nisi. Suspendisse facilisis nunc sed massa vestibulum.</p>
								          		</div>
								          	</Col>
								          	<Col lg={6}>
								          		<div className="inner-slider-carousal">
								          			<h5><Image src={lady} /> Sporer Rodrigo </h5>
								          			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Llentesque semper, est eget commodo mattis, risus velit laoreet nibh, id vehicula ipsum diam vel nisi. Suspendisse facilisis nunc sed massa vestibulum.</p>
								          		</div>
								          	</Col>
								          </Row>
							          </div>
							        </Carousel.Caption>
							      </Carousel.Item>
							      <Carousel.Item interval={500}>
							        <Carousel.Caption>
							          <div className="outer-slider-carousal">
								          <Row>
								          	<Col lg={6}>
								          		<div className="inner-slider-carousal">
								          			<h5><Image src={lady} /> Sporer Rodrigo </h5>
								          			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Llentesque semper, est eget commodo mattis, risus velit laoreet nibh, id vehicula ipsum diam vel nisi. Suspendisse facilisis nunc sed massa vestibulum.</p>
								          		</div>
								          	</Col>
								          	<Col lg={6}>
								          		<div className="inner-slider-carousal">
								          			<h5><Image src={lady} /> Sporer Rodrigo </h5>
								          			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Llentesque semper, est eget commodo mattis, risus velit laoreet nibh, id vehicula ipsum diam vel nisi. Suspendisse facilisis nunc sed massa vestibulum.</p>
								          		</div>
								          	</Col>
								          </Row>
							          </div>
							        </Carousel.Caption>
							      </Carousel.Item>
							      <Carousel.Item>
							        <Carousel.Caption>
							          <div className="outer-slider-carousal">
								          <Row>
								          	<Col lg={6}>
								          		<div className="inner-slider-carousal">
								          			<h5><Image src={lady} /> Sporer Rodrigo </h5>
								          			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Llentesque semper, est eget commodo mattis, risus velit laoreet nibh, id vehicula ipsum diam vel nisi. Suspendisse facilisis nunc sed massa vestibulum.</p>
								          		</div>
								          	</Col>
								          	<Col lg={6}>
								          		<div className="inner-slider-carousal">
								          			<h5><Image src={lady} /> Sporer Rodrigo </h5>
								          			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Llentesque semper, est eget commodo mattis, risus velit laoreet nibh, id vehicula ipsum diam vel nisi. Suspendisse facilisis nunc sed massa vestibulum.</p>
								          		</div>
								          	</Col>
								          </Row>
							          </div>
							        </Carousel.Caption>
							      </Carousel.Item>
							    </Carousel>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);