import agent from "../agent";
import React, { Suspense, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  	APP_LOAD,
  	CLEAR_LOGOUT
} from "../constants/actionTypes";

import "./styles/style.scss";
import RouteList from './RouteList';

const mapStateToProps = (state) => {
	return {
		...state,
		appLoaded: state.common.appLoaded,
		appName: state.common.appName,
		redirectTo: state.common.redirectTo,
		currentUser: state.common.currentUser,
		logoutRedirectTo: state.common.logoutRedirectTo,
	}
};

const mapDispatchToProps = (dispatch) => ({
	onAppLoad: (payload, token) => dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
	onLogoutClear: () => { dispatch({ type: CLEAR_LOGOUT }) },
});

const AppComponent = (props) => {
	const { appLoaded, redirectTo, appName, currentUser, onAppLoad, logoutRedirectTo, onLogoutClear } = props;

	const routerProps = {
		currentUser, appName
	}
	let navigate = useNavigate();


	useEffect(() => {
	    if (currentUser && currentUser.roleId && redirectTo) {
	    	if(currentUser.roleId == "1"){
                navigate('/admin/dashboard');
	    	}else if(currentUser.roleId == "2"){
                navigate('/owner/dashboard');
	    	}else if(currentUser.roleId == "3"){
                navigate('/manager/orders');
	    	}else{
	    		navigate('/');
	    	}
	    }
  	}, [redirectTo]);

  	useEffect(() => {
	    if (logoutRedirectTo) {
	    	onLogoutClear();
	    	navigate('/login');
	    }
  	}, [logoutRedirectTo]);

	useEffect(() => {
		let token = null, _payload = null;

		if(localStorage.getItem('jwt')) {
			token = localStorage.getItem('jwt');
			agent.setToken(token);
	      	_payload = agent.Auth.current();
	    }

		onAppLoad(_payload, token);
	}, []);

	

	return (
    	<div className="main-body">
    		{appLoaded ? (
				<Suspense fallback={null}>
			    	<RouteList {...routerProps} />
	      		</Suspense>
    		) : (
    			<div className="spinner-border" />
    		)}
    	</div>
  	);
};


export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);