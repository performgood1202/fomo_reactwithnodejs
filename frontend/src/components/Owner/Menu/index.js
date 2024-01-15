import React, {useEffect} from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";

import MainView from './MainView';
import './style.scss';

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

const Menu = (props) => {
	let mainProps = {}

	const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Menu");
		}
  		
  	}, [pageheading]) 

	return (
		<div className="menu-page">
			<MainView {...mainProps} />
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);