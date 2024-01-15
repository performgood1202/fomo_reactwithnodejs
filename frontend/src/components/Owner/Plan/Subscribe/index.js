import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import agent from "../../../../agent";
import { useParams } from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import MainView from './MainView';
import './style.scss';
import {
  	PLAN_DETAIL,
} from "../../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state
});

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const mapDispatchToProps = (dispatch) => ({
	fetchPlanDetail: (plan_id) => {
  		dispatch({ type: PLAN_DETAIL, payload: agent.Plans.detail(plan_id) });
  	}
});

const SubscribePlan = (props) => {
	let mainProps = {}
	let { detail, plan_id, fetchPlanDetail } = props;
	const params = useParams();
	if(params.id !== undefined){
		plan_id = params.id;
	}

	useEffect(() => {
  		window.scrollTo(0, 0);
  		if(plan_id != ''){
  			fetchPlanDetail(plan_id);
  		}
	}, []);

	return (
		<div className="owner-subscribe-page">
			<Elements stripe={stripePromise}>
				<MainView plan_id={plan_id} {...mainProps} />
			</Elements>
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribePlan);