import React, { Fragment } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
	return {
		...state
	}
};

const mapDispatchToProps = (dispatch) => ({})

const Footer = (props) => {

	return (
      	<div className="auth-footer">
			<p className="text-center copyright-txt">Copyright 2022. All rights are reserved.</p>
      	</div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(Footer);