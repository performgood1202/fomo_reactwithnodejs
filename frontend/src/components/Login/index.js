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
} from "../../constants/actionTypes";

// import {ReactComponent as Logo} from "../../assets/logo.svg";

const mapStateToProps = (state) => ({
  	...state.auth,
  	loginSuccess: state.common.loginSuccess,
  	loginError: state.common.loginError,
  	currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  	onSubmit: (values) => {
    	dispatch({ type: LOGIN, payload: agent.Auth.login(values) });
  	}
});

const Login = (props) => {
	
	const { currentUser,errors, loginSuccess, loginError, onSubmit, inProgress } = props;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassowrd, setShowPassword] = useState(false);
	const [loginErr, setLoginErr] = useState('');

	let navigate = useNavigate();

	useEffect(() => {
	    if (currentUser && currentUser.roleId) {
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
  	}, [currentUser]);


  	const submitForm = (e) => {
	    e.preventDefault();
	    onSubmit({ email, password });
  	};  	

  	useEffect(() => {
  		if(loginError) {
  			setLoginErr(loginError);
  		}
  	}, [loginError])


	return (
		<section className="login-page">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-sm-6">

						<div className="login-form">
							<Image src={logo} />
							<h6 className="mb-4">Login</h6>
							<ListErrors errors={errors} />
							{loginErr ? <Badge bg="danger">{loginErr}</Badge> : <Fragment /> }
							<form onSubmit={submitForm}>
				              	<fieldset>
					                <fieldset className="form-group mb-4">
					                	<label>Username</label>
					                  	<input
						                    className="form-control form-control-md"
						                    type="email"
						                    value={email}
						                    onChange={(e) => setEmail(e.target.value)}
						                    required
					                  	/>
					                </fieldset>

					                <fieldset className="form-group position-relative">
					                	
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

					                <div className="forgot-pass text-right mb-4">
					                	<Link to="/forgot-password" className="orange-text">Forget password?</Link>
					                </div>

					                <button
					                  	className="login-button btn btn-md btn-primary custom-button orange-btn w-100"
					                  	type="submit"
					                  	disabled={inProgress}
					                >
					                  	Login
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);