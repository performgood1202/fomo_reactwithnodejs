import React from 'react';
import { connect } from "react-redux";

import MainView from './MainView';
import './style.scss';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const Error404 = (props) => {
	let mainProps = {}

	return (
		<div className="error-404-page">
			<MainView {...mainProps} />
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Error404);