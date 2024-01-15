import React from 'react';
import { connect } from "react-redux";

import MainView from './MainView';
import './style.scss';

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({});

const NoAccess = (props) => {

	const {club_status} = props;
	let mainProps = {
		club_status : club_status,
	}

	return (
		<div className="error-404-page">
			<MainView {...mainProps} />
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoAccess);