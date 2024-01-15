import React from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";

import MainView from './MainView';
import './style.scss';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const Setting = (props) => {
	let mainProps = {}

	return (
		<div className="plan-page">
			<MainView {...mainProps} />
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);