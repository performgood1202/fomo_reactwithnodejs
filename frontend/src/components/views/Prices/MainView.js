import React, { Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

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
				plansList = plansData;
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
		<section className="banner-section price-banner-section">
			<Container>
		      <Row>
		        <Col lg={12}>
			        <div className="banner-content text-center">
						<h2>Low prices <br /><span className="blue-text">High results</span></h2>
						<h6 className=" mb-5">Our low pricing is giving you a 100% guaranteed profit from our services! Choose your plan now! Save up to 20% by choosing annual billing.</h6>
						
					</div>
				</Col>
		      </Row>
		    </Container>
		</section>
		<section className="price-section">
			<Container>
				<Row>
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
		      </Row>
		    </Container>
		</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
