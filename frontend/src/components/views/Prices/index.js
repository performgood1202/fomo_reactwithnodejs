import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import {
  	PLAN_FETCH,
  	PLAN_FEATURES,
} from "../../../constants/actionTypes";

import MainView from './MainView';
import './style.scss';


const mapStateToProps = (state) => ({
  	...state,
  	plans: state.plan.plans,
  	plan_features: state.plan.plan_features,
  	features: state.plan.features,
});

const mapDispatchToProps = (dispatch) => ({
	fetchPlans: () => {
    	dispatch({ type: PLAN_FETCH, payload: agent.Plans.fetch() });
  	},
  	fetchFeatures: () => {
  		dispatch({ type: PLAN_FEATURES, payload: agent.Plans.features() });
  	}
});

const Prices = (props) => {
	let mainProps = {}
	const { features, plans, plan_features, fetchPlans, fetchFeatures } = props;
	useEffect(() => {  		
  		fetchPlans();
  		fetchFeatures();
  	}, []) 

	return (
		<div className="prices-page">
			<MainView {...mainProps} />
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Prices);