import React, { useEffect, useState, Fragment } from "react";
import { Badge } from 'react-bootstrap';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import agent from "../../agent";
import { AiOutlineEye, AiOutlineEyeInvisible   } from 'react-icons/ai';
import ListErrors from "../ListErrors";
import { connect } from "react-redux";
import './login.scss';
import logo from "../../assets/images/logo.svg";
import { useNavigate, Link } from "react-router-dom";

import {
  	UPDATE_FIELD_AUTH,
  	LOGIN,
  	LOGIN_PAGE_UNLOADED,
  	FORGOT_PASSWORD,
  	CLEAR_MESSAGES
} from "../../constants/actionTypes";

// import {ReactComponent as Logo} from "../../assets/logo.svg";

const mapStateToProps = (state) => ({
  	...state.auth,
  	forgotPasswordSuccessMsg: state.common.forgotPasswordSuccessMsg,
  	forgotPasswordErrorMsg: state.common.forgotPasswordErrorMsg,
  	currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  	onSubmit: (formData) => {
    	dispatch({ type: FORGOT_PASSWORD, payload: agent.Auth.ForgotPassword(formData) });
  	},
  	clearMessages: () => {
        dispatch({ type: CLEAR_MESSAGES });
    }
});

const ForgotPassword = (props) => {
	
	const { currentUser,errors, forgotPasswordSuccessMsg, forgotPasswordErrorMsg, onSubmit, inProgress,clearMessages } = props;

	const [email, setEmail] = useState('');
	const [Err, setErr] = useState('');
	const [sucessmsg, setSuccess] = useState('');

	let navigate = useNavigate();



  	const submitForm = (e) => {
	    e.preventDefault();
	    setErr("");
	    setSuccess("");
	    clearMessages();
	    onSubmit({ email });

  	};  	

  	useEffect(() => {
  		if(forgotPasswordErrorMsg) {
  			setErr(forgotPasswordErrorMsg);
  			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
  		}
  	}, [forgotPasswordErrorMsg])

  	useEffect(() => {
  		if(forgotPasswordSuccessMsg) {
  			setSuccess(forgotPasswordSuccessMsg);

  			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
  		}
  	}, [forgotPasswordSuccessMsg])


	return (
		<section className="forgot-pass-page">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-sm-6">

						<div className="password-form">
							<Image src={logo} />
							<h6 className="mb-4">Forgot Password</h6>
							<ListErrors errors={errors} />
							{Err ? <Badge bg="danger">{Err}</Badge> : <Fragment /> }
							{sucessmsg ? <Badge bg="success">{sucessmsg}</Badge> : <Fragment /> }
							<form onSubmit={submitForm}>
				              	<fieldset>
					                <fieldset className="form-group mb-2">
					                	<label>Email</label>
					                  	<input
						                    className="form-control form-control-md"
						                    type="email"
						                    value={email}
						                    onChange={(e) => setEmail(e.target.value)}
						                    required
					                  	/>
					                </fieldset>


					                <div className="forgot-pass text-right mb-1">
					                	<Link to="/login" className="orange-text"></Link>
					                </div>

					                <button
					                  	className="login-button btn btn-md btn-primary custom-button orange-btn w-100"
					                  	type="submit"
					                  	disabled={inProgress}
					                >
					                  	Forgot Password
					                </button>
				              	</fieldset>
				            </form>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);