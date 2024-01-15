import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import agent from "../../agent";

import MainView from './MainView';
import './style.scss';

import {
  	PLAN_FETCH,
  	PLAN_FEATURES,
} from "../../constants/actionTypes";

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

const Home = (props) => {
	const [list, setList] = useState('');
	const { features, plans, plan_features, fetchPlans, fetchFeatures } = props;
	let mainProps = {};

  	useEffect(() => {  		
  		fetchPlans();
  		fetchFeatures();
  	}, []) 
 
  	

	return (
		<div className="home-page">
			<MainView {...mainProps} />
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);