import React, { Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../agent";
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Image1 from "../../assets/images/img1.png";
import Image2 from "../../assets/images/img2.png";
import Image3 from "../../assets/images/img3.png";
import step1 from "../../assets/images/step-1.png";
import step2 from "../../assets/images/step-2.png";
import step3 from "../../assets/images/step-3.png";
import features1 from "../../assets/images/features1.png";
import { TiTick } from 'react-icons/ti';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const MainView = (props) => {
	let plansList = [];
	let plansFeatureList = [];
	let featuresList = [];
	if(props.plan !== undefined){
		if(props.plan.plans !== undefined && Array.isArray(props.plan.plans)){
			if(props.plan.plans.length > 0){
				const plansData = props.plan.plans;
				plansList = plansData.slice(0, 2);
			}
		}

		if(props.plan.plan_features !== undefined && typeof(props.plan.plan_features) === 'object'){
			const plansFeatureData = props.plan.plan_features;
			if(plansFeatureData !== null){
				Object.entries(plansFeatureData).map((plan_feature,i)=>{
					plansFeatureList[plan_feature[0]] = plan_feature[1];
				});
			}
		}
		if(props.plan.features !== undefined && Array.isArray(props.plan.features)){
			if(props.plan.features.length > 0){
				featuresList = props.plan.features;
			}
		}
	}

	return (
		<Fragment>
		<section className="banner-section">
			<Container>
		      <Row>
		        <Col lg={12}>
			        <div className="banner-content text-center">
						<h2>Increase Profit <span className="blue-text">While Elevating Members’ Experience</span></h2>
						<h6 className=" mb-5">Blank creates customized nightlife experiences that keep customers coming back and profits growing.</h6>
						<Image src={Image1} className="mt-5" />
					</div>
				</Col>
		      </Row>
		    </Container>
		</section>

		<section className="counter-section">
			<Container>
		      <Row>
		        <Col lg={3} sm={3} className="col-6">
			        <div className="counter-content text-center">
						<h2>50+</h2>
						<h6>Clubs</h6>
					</div>
				</Col>
				<Col lg={3} sm={3} className="col-6">
			        <div className="counter-content text-center">
						<h2>10K+</h2>
						<h6>Users</h6>
					</div>
				</Col>
				<Col lg={3} sm={3} className="col-6">
			        <div className="counter-content text-center">
						<h2>5K++</h2>
						<h6>Positive Reviews</h6>
					</div>
				</Col>
				<Col lg={3} sm={3} className="col-6">
			        <div className="counter-content text-center">
						<h2>5+</h2>
						<h6>Awards</h6>
					</div>
				</Col>
		      </Row>
		    </Container>
		</section>

		<section className="home-sec-3">
			<Container>
		      <Row className="align-items-center">
		        <Col lg={6}>
			        <div className="one-pace-img">
						<Image src={features1} className="" />
					</div>
				</Col>
				<Col lg={6}>
			        <div className="one-pace-content">
						<h4 className="mb-4">All The Tools You Need To Succeed</h4>
						<p className="mb-0">You can't stick to the good old ways to manage your club and expect to grow your profits. Things have changed and so has your target audience. 
							<br/><br/>
							Blank allows you to evaluate and manage all of your club's departments in a single dashboard. 
						</p>
						<br/>
						<p><TiTick/ > It helps you connect with your customers to better serve them.<br/>
						<TiTick/ > Collect client data for more powerful marketing campaigns.<br/>
						<TiTick/ > Keep track of your sales and revenue.<br/>
						<TiTick/ > Manage your staff and assign tasks.</p>
					</div>
				</Col>
		      </Row>
		    </Container>
		</section>

		<section className="home-sec-4">
			<Container>
		      <Row className="align-items-center row-reverse">
			      <Col lg={6}>
				        <div className="one-pace-content">
							<h4 className="mb-4">Streamline Your Operations & Boost Revenue</h4>
							<p className="mb-0">Tired of sharing your revenues with third parties? Blank helps you centralize all your marketing efforts. Everything from advertising, order management, menu posting, ticket sales, and more.</p>
							<br/>
						<p><TiTick/ > Digital ticket sales, guest lists and VIP reservations.<br/>
						<TiTick/ > Online event announcement and booking.<br/>
						<TiTick/ > Food and drinks ordering from the table to reduce long waiting lines.<br/>
						<TiTick/ > Promotional notification and social media advertising.</p>
						</div>
					</Col>
		        <Col lg={6}>
			        <div className="one-pace-img">
						<Image src={features1} className="" />
					</div>
				</Col>
			  </Row>

			  <div className="how-work-sec">
			  	<Row>
			  		<Col lg={12}>
			  			<div className="how-content text-center">
			  				<h4>Your Vision, Empowered By Data</h4>
			  				<p className="mb-5"></p>
			  				{/*<p className="mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>*/}
			  			</div>
			  		</Col>
			  		<Col lg={4}>
			  			<div className="step-outer">
			  				<h5><Image src={step1} /> Collect Member Data</h5>
			  				<p>Blank designed to retain member details. This data helps clubs offer their members value-added services such as online ordering, reservations, and networking.</p>
			  			</div>
			  		</Col>
			  		<Col lg={4}>
			  			<div className="step-outer">
			  				<h5><Image src={step2} /> Redesign Your Services</h5>
			  				<p>Owners can encourage members to promote the club by offering discounts, rewards, and promotions to their loyal members.</p>
			  			</div>
			  		</Col>
			  		<Col lg={4}>
			  			<div className="step-outer">
			  				<h5><Image src={step3} /> Increase Revenue</h5>
			  				<p>Digitizing your sales and marketing strategy makes your cross-selling and up-selling more effective and your customer-business interactions faster and easier.</p>
			  			</div>
			  		</Col>
			  	</Row>
			  </div>
		    </Container>
		</section>

		<section className="price-section">
			<Container>
		      <Row>
		        <Col lg={4}>
			        <div className="price-content">
						<h4>Small Investment, <br />Big Results </h4>
						<p className="mt-4 mb-4">Tools and features to take your club to the next level at a minimal cost.</p>
						<NavLink to="/prices" className="btn btn-primary custom-btn orange-btn">View all plans</NavLink>
					</div>
				</Col>
				{plansList.length > 0 ?
						plansList.map(function(plan,key){
							return(
								<Col lg={4} key={key}>
							        <div className="price-box">
										<h3>{plan.name}</h3>
										<h2 className="orange-text">€{plan.month_price} <span>/Month</span></h2>
										<p>{plan.description}</p>
										<ul>
											{ (typeof(plansFeatureList) === 'object' && Object.keys(plansFeatureList).length != 0 && (plansFeatureList[plan._id] !== undefined) )
												?
													featuresList.length > 0 &&
													featuresList.map(function(feature,j){
														return(
															(Object.values(plansFeatureList[plan._id]).indexOf(feature._id) > -1)
															?
																<li className="green-icon" key={j}><AiOutlineCheck /> {feature.name}</li>
															:
																<li className="red-icon" key={j}><AiOutlineClose /> {feature.name}</li>
														)														
													})
												:
													featuresList.length > 0 &&
													featuresList.map(function(feature,j){
														return(
															<li className="red-icon" key={j}><AiOutlineClose /> {feature.name}</li>
														)														
													})
											}
										</ul>
										<div className="price-btn text-center">
											<NavLink to={"/subscribe/"+plan._id} className="btn btn-primary custom-btn orange-btn">
												Subscribe
											</NavLink>
										</div>
									</div>
								</Col>
							);
						})
					:
						''
				}
				{/*<Col lg={4}>
			        <div className="price-box">
						<h3>Basic Plan</h3>
						<h2 className="orange-text">€100 <span>/Month</span></h2>
						<p>Lorem ipsum dolor sit amet, conse tetur adipiscing elit. Pellentesque  semper, est eget commodo.</p>
						<ul>
							<li className="green-icon"><AiOutlineCheck /> Adding own events</li>
							<li className="green-icon"><AiOutlineCheck /> Guest list automation</li>
							<li className="green-icon"><AiOutlineCheck /> Table reservations</li>
							<li className="green-icon"><AiOutlineCheck /> User advertising</li>
							<li className="red-icon"><AiOutlineClose /> Drink package selling</li>
						</ul>
						<div className="price-btn text-center">
							<NavLink to="/subscribe" className="btn btn-primary custom-btn orange-btn">
								Subscribe
							</NavLink>
						</div>
					</div>
				</Col>
				<Col lg={4}>
			        <div className="price-box price-lightblue">
						<h3>Booster Plan</h3>
						<h2 className="orange-text">€200 <span>/Month</span></h2>
						<p>Lorem ipsum dolor sit amet, conse tetur adipiscing elit. Pellentesque  semper, est eget commodo.</p>
						<ul>
							<li className="green-icon"><AiOutlineCheck /> Adding own events</li>
							<li className="green-icon"><AiOutlineCheck /> Guest list automation</li>
							<li className="green-icon"><AiOutlineCheck /> Table reservations</li>
							<li className="green-icon"><AiOutlineCheck /> User advertising</li>
							<li className="green-icon"><AiOutlineCheck /> Drink package selling</li>
						</ul>
						<div className="price-btn text-center">
							<NavLink to="/subscribe" className="btn btn-primary custom-btn orange-btn">
								Subscribe
							</NavLink>
						</div>
					</div>
				</Col>*/}
		      </Row>
		    </Container>
		</section>

		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);