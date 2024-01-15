import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";import  "./style.scss";
import PhoneInput from 'react-phone-input-2';
import {CardElement,Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CreateMain from './CreateMain';

import {
   PAGE_ATTR
} from "../../../constants/actionTypes";


const mapStateToProps = (state) => ({
  	...state
});

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const mapDispatchToProps = (dispatch) => ({
	setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const CreatePromotion = (props) => {	


	const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Create Promotion");
		}
  		
  	}, [pageheading]) 


	return (
		<Fragment>
		    <Elements stripe={stripePromise}>
		        <CreateMain />
			</Elements>	
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePromotion);