import React, { Fragment,useState,useEffect } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, NavLink, Form,Badge  } from 'react-bootstrap';
import { AiOutlinePlusCircle, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import profile from "../../../assets/images/avtar.jpg";
import { Link } from "react-router-dom";
import {
  	MANGER_PROFILE_UPDATE,
  	ADMIN_CLEAR_MESSAGES,
  	PLAN_FETCH,
  	PLAN_FEATURES,
  	GET_SUBSCRIPTION
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	currentUser: state.common.currentUser,
  	clubData: state.common.clubData,
  	successMsg: state.manager.successMsg,
  	errorMsg: state.manager.errorMsg,
  	plans: state.plan.plans,
  	plan_features: state.plan.plan_features,
  	features: state.plan.features,
  	subscriptionData: state.owner.subscriptionData,
});

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (formData) => {
    	dispatch({ type: MANGER_PROFILE_UPDATE, payload: agent.manager.updateProfile(formData) });
  	},
    clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    fetchPlans: () => {
    	dispatch({ type: PLAN_FETCH, payload: agent.Plans.fetch() });
  	},
  	fetchFeatures: () => {
  		dispatch({ type: PLAN_FEATURES, payload: agent.Plans.features() });
  	},
  	getSubscription: () => {
  		dispatch({ type: GET_SUBSCRIPTION, payload: agent.owner.getSubscription() });
  	}
});

const MainView = (props) => {
	

	const {clubData,currentUser,onSubmit,successMsg,errorMsg,clearAdminMessages,features, plans, plan_features, fetchPlans, fetchFeatures,getSubscription,subscriptionData} = props;

	const [fName, setFName] = useState("");
	const [lName, setLName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [show_image, setShowImage] = useState(profile);

	const [current_plan,setCurrentPlan] = useState([]);



	const submitBtn =  (e) => {
	     e.preventDefault();
	     const formData = new FormData();
         formData.append("profileImage", profileImage);
         formData.append("_id", currentUser._id);
         formData.append("fName", fName);
         formData.append("lName", lName);
         formData.append("phone", phone);
	     onSubmit(formData);
	    /* const data = {
	     	fName: fName,
	     	lName: lName,
	     	phone: phone,
	     	profileImage: profileImage,
	     }
	     onSubmit(data);*/
	}; 

	useEffect(() => {  		
  		fetchPlans();
  		fetchFeatures();
  		getSubscription();
  	}, []) 

  	useEffect(() => {  		
  		if(subscriptionData){
  			if(subscriptionData && subscriptionData.plan){
  				setCurrentPlan(subscriptionData.plan);
  			}

  		}
  	}, [subscriptionData]) 


	
	
	useEffect(() => {
        if (currentUser) {
           setFName(currentUser.fName);
           setLName(currentUser.lName);
           setEmail(currentUser.email);
           setPhone(currentUser.phone);
           if(currentUser.profileImage){
           	  setShowImage(currentUser.profileImage);
           }
           
        }
    }, [currentUser]);

    useEffect(() => {       
        if(successMsg){

            setTimeout(function(){
                clearAdminMessages();
            },6000);
            
        }
    }, [successMsg]) 

    useEffect(() => {       
        if(errorMsg){


            setTimeout(function(){
                clearAdminMessages();
            },6000);
            
        }
    }, [errorMsg]) 

	return (
		<Fragment>
			<section className="header-section">
				<Container>
			      <Row>
			        <Col lg={12}>
					</Col>
			      </Row>
			    </Container>
			</section>
			<section className="price-section">
				<Container>
					<Row>
					{(plans && plans.length > 0) ?
							plans.map(function(plan,key){
								return(
									<Col lg={4} key={key}>
								        <div className="price-box">
											<h3>{plan.name}</h3>
											<h2 className="orange-text">€{plan.month_price} <span>/Month</span></h2>
											<p>{plan.description}</p>
											<ul>
												{(features && features.length > 0) ?
														features.map(function(feature,j){

                                                            var tick = false;
															
															if(plan_features && plan_features[plan._id] != undefined){

																if(plan_features[plan._id].includes(feature._id)){
																	tick = true;
																}

															}
															return(
															    <Fragment key={j}>
															    {(tick)?
															       <li className="green-icon" ><AiOutlineCheck /> {feature.name}</li>
															    :
															       <li className="red-icon"><AiOutlineClose /> {feature.name}</li>
															    }
															    </Fragment>
															)														
														})
												:''}
											</ul>
											<div className="price-btn text-center">
												    <Link to={"/owner/plan/"+plan._id}>
													    {(current_plan && current_plan._id && current_plan._id == plan._id)?
														   <Button type="button" className="custom-btn orange-btn" >Renew</Button>
														: 
														   <Button type="button" className="custom-btn orange-btn">Upgrade</Button>
													    }
												    </Link>
											</div>
										</div>
									</Col>
								);
							})
						:
							''
					}
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);