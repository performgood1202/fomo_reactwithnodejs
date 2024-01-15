import React, { useEffect, useState, Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../includes/Header';
import Footer from '../includes/Footer';
import App from '../App';
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
const history = createBrowserHistory({ basename: "/admin",window });



const mapStateToProps = (state) => {
	return {
		...state,
		appLoaded: state.common.appLoaded,
		appName: state.common.appName,
		redirectTo: state.common.redirectTo,
		currentUser: state.common.currentUser,
	}
};

const mapDispatchToProps = (dispatch) => ({
  	
});

const LayoutRouter = (props) => {

	const { currentUser } = props;

	const [basename, setBasename] = useState('');
	useEffect(() => {
		if (currentUser && currentUser.roleId) {
			if(currentUser.roleId == "1"){
		        setBasename('/admin');
			}
		}
	}, [currentUser]);

	console.log(basename)
    
    return (
		<Router basename={basename} history={history}>
		        <App />
	    </Router>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutRouter);