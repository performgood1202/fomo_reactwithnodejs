import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Image, Button, NavLink, Table, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});
const removeA =  (arr, item) => {
    return arr.filter(f => f !== item)
}


const ActionFeature = (props) => {
	    let { save, setPlanFeature, row, plan_feature,checked,setChecked } = props;

	    const [checked_this,setcheckedThis] = useState(false);

	    useEffect(() => {  		
	  		if(checked){
	  			setcheckedThis(checked);
	  		}
	  	}, [checked]) 

	  	useEffect(() => {  		
	  		if(plan_feature && plan_feature.length > 0){
	  			setcheckedThis(false);
	  		
	  			plan_feature.map(function(feature){

	        		if(feature == row._id){
	        			setcheckedThis(true);
	        		}

	        	});
	  		}else{
	  			setcheckedThis(false);
	  		}
	  	}, [plan_feature]) 


	  	

	   
	    

	    const setPlanFeatureValue =  (e) => {
		    const target = e.target;
		    var value = target.value;

		    
		    if(target.checked){
		    	plan_feature.push(value);
		        setPlanFeature(plan_feature);
		        setcheckedThis(true);
		    	
		    }else{
		    	
		    	plan_feature = removeA(plan_feature, value);
		        setPlanFeature(plan_feature);
		        setcheckedThis(false);
		    	
		    }


		}

	   
        return (
                <Fragment>
	        	    { (save) ?
			        	<span>
							<input type="checkbox" name="planfeature[]"  checked={checked_this} onChange={(e) => setPlanFeatureValue(e)} value={row._id} />
						</span>
						: 

						<span>
						    {(checked_this)?<AiOutlineCheck />:<AiOutlineClose/> }
						</span>
				    }
				</Fragment>
		)			
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionFeature);