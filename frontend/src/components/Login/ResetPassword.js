import React, { useEffect, useState, Fragment } from "react";
import { Badge } from 'react-bootstrap';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import agent from "../../agent";
import { AiOutlineEye, AiOutlineEyeInvisible   } from 'react-icons/ai';
import ListErrors from "../ListErrors";
import { connect } from "react-redux";
import './login.scss';
import logo from "../../assets/images/logo.svg";
import { useNavigate, Link, useParams } from "react-router-dom";

import {
  	UPDATE_FIELD_AUTH,
  	LOGIN,
  	LOGIN_PAGE_UNLOADED,
  	FORGOT_PASSWORD,
  	CLEAR_MESSAGES,
  	RESET_PASSWORD
} from "../../constants/actionTypes";

// import {ReactComponent as Logo} from "../../assets/logo.svg";

const mapStateToProps = (state) => ({
  	...state.auth,
  	resetPasswordSuccessMsg: state.common.resetPasswordSuccessMsg,
  	resetPasswordErrorMsg: state.common.resetPasswordErrorMsg,
  	currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  	onSubmit: (formData) => {
    	dispatch({ type: RESET_PASSWORD, payload: agent.Auth.ResetPassword(formData) });
  	},
  	clearMessages: () => {
        dispatch({ type: CLEAR_MESSAGES });
    }
});

const ResetPassword = (props) => {
	
	const { currentUser,errors, resetPasswordSuccessMsg, resetPasswordErrorMsg, onSubmit, inProgress,clearMessages } = props;

	const [email, setEmail] = useState('');
	const [Err, setErr] = useState('');
	const [sucessmsg, setSuccess] = useState('');
	const [password, setPassword] = useState('');
	const [confirm_password, setConfirmPassword] = useState('');
	const [showPassowrd, setShowPassword] = useState(false);
	const [showConfirmPassowrd, setShowConfirmPassowrd] = useState(false);

	let navigate = useNavigate();

	const params = useParams();
	let user_id;
	let token;

	if(params.user_id !== undefined && params.token !== undefined){
		user_id = params.user_id;
		token = params.token;
	}



  	const submitForm = (e) => {
	    e.preventDefault();
	    setErr("");
	    setSuccess("");
	    clearMessages();

	    if(password != "" && password == confirm_password){
		    if(user_id && token){
	            onSubmit({ password,user_id,token });
		    }else{
                setErr("Something went wrong!");
		    }
		}else{
			setErr("Password not match!");
		}    
	    

  	};  	

  	useEffect(() => {
  		if(resetPasswordErrorMsg) {
  			setErr(resetPasswordErrorMsg);
  			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
  		}
  	}, [resetPasswordErrorMsg])

  	useEffect(() => {
  		if(resetPasswordSuccessMsg) {
  			setSuccess(resetPasswordSuccessMsg);

  			setTimeout(() => {
	    		clearMessages();
	    		navigate("/login");
	    	}, 2000);
  		}
  	}, [resetPasswordSuccessMsg])


	return (
		<section className="forgot-pass-page">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-sm-6">

						<div className="password-form">
							<Image src={logo} />
							<h6 className="mb-4">Reset Password</h6>
							<ListErrors errors={errors} />
							{Err ? <Badge bg="danger">{Err}</Badge> : <Fragment /> }
							{sucessmsg ? <Badge bg="success">{sucessmsg}</Badge> : <Fragment /> }
							<form onSubmit={submitForm}>
				              	<fieldset>
					                <fieldset className="form-group position-relative mb-3">
					                	
					                		<label>Password</label>
					                		<div className="password-eye">
						                  	<input
							                    className="form-control form-control-md"
							                    type={showPassowrd ? "text" : "password"}
							                    value={password}
							                    onChange={(e) => setPassword(e.target.value)}
							                    required
						                  	/>
						                  	<span onClick={(e) => setShowPassword(!showPassowrd)}>{(showPassowrd)?<AiOutlineEye className="hide-pass" />: <AiOutlineEyeInvisible className="show-pass" />}</span>
					                	</div>
					                  	<span
					                    	className={`password-icon ${showPassowrd}`}
					                    	
					                  	></span>
					                </fieldset>
					                <fieldset className="form-group position-relative">
					                	
					                		<label>Confirm Password</label>
					                		<div className="password-eye">
						                  	<input
							                    className="form-control form-control-md"
							                    type={showConfirmPassowrd ? "text" : "password"}
							                    value={confirm_password}
							                    onChange={(e) => setConfirmPassword(e.target.value)}
							                    required
						                  	/>
						                  	<span onClick={(e) => setShowConfirmPassowrd(!showConfirmPassowrd)}>{(showConfirmPassowrd)?<AiOutlineEye className="hide-pass" />: <AiOutlineEyeInvisible className="show-pass" />}</span>
					                	</div>
					                  	<span
					                    	className={`password-icon ${showConfirmPassowrd}`}
					                    	
					                  	></span>
					                </fieldset>


					                <div className="forgot-pass text-right mb-2">
					                	<Link to="/login" className="orange-text"></Link>
					                </div>

					                <button
					                  	className="login-button btn btn-md btn-primary custom-button orange-btn w-100"
					                  	type="submit"
					                  	disabled={inProgress}
					                >
					                  	Reset Password
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);