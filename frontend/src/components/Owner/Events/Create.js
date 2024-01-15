import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";import  "./style.scss";
import CreateMain from './CreateMain';

import {
   PAGE_ATTR
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state
});

const mapDispatchToProps = (dispatch) => ({
	setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const CreateEvent = (props) => {	

	const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Create event");
		}
  		
  	}, [pageheading]) 

	return (
		<Fragment>
		        <CreateMain />
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);