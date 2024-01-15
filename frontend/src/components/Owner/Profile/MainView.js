import React, { Fragment,useState,useEffect } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, NavLink, Form,Badge  } from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import profile from "../../../assets/images/avtar.jpg";
import PhoneInput from 'react-phone-input-2';
import DataTable from 'react-data-table-component';
import { useNavigate,Link } from "react-router-dom";
import CancelSubModal from './CancelSubModal';
import MessagePopup from '../../Popup/MessagePopup';

import GooglePlacesAutocomplete,{geocodeByAddress,getLatLng} from 'react-google-places-autocomplete';

import Loader from "../../Loader";

import moment from "moment";

import {
  	OWNER_PROFILE_UPDATE,
  	ADMIN_CLEAR_MESSAGES,
  	GET_SUBSCRIPTION,
  	PLAN_FETCH
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	currentUser: state.common.currentUser,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	successMsgCancel: state.owner.successMsgCancel,
  	errorMsgCancel: state.owner.errorMsgCancel,
  	subscriptionData: state.owner.subscriptionData,
  	plans: state.plan.plans,
});

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (formData) => {
    	dispatch({ type: OWNER_PROFILE_UPDATE, payload: agent.owner.updateProfile(formData) });
  	},
    fetchPlans: () => {
    	dispatch({ type: PLAN_FETCH, payload: agent.Plans.fetch() });
  	},
    clearAdminMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
  	getSubscription: () => {
  		dispatch({ type: GET_SUBSCRIPTION, payload: agent.owner.getSubscription() });
  	}
});

const getDate = (date)=> {
	
		return moment(date).format("DD, MMM, YYYY");
}

const MainView = (props) => {
	

	const {fetchPlans,plans,getSubscription,subscriptionData,clubData,currentUser,onSubmit,successMsg,errorMsg,errorMsgCancel,successMsgCancel,clearAdminMessages} = props;


	const [msgerror, setMessageError] = useState(false);
	const [messagetext, setMessageText] = useState("");

	const [fName, setFName] = useState("");
	const [lName, setLName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [phone_country_code, setPhoneCountryCode] = useState('');
	const [phoneValue, setphoneValue] = useState('');
	const [profileImage, setProfileImage] = useState(null);
	const [show_image, setShowImage] = useState(profile);
	const [subscription_name, setSubscriptionName] = useState("");
	const [plan_type, setPlanType] = useState("");
	const [subscription_price, setSubscriptionPrice] = useState("");
	const [subscription_date, setSubscriptionDate] = useState("");
	const [subscription_rec, setSubscriptionRec] = useState("profile");


	const [club_name, setClubName] = useState("");
	const [club_address, setClubAddress] = useState("");
	const [club_phone, setClubPhone] = useState("");
	const [clubPhoneValue, setClubPhoneValue] = useState("");
	const [club_phone_country_code, setClubPhoneCountryCode] = useState("");
	const [club_website, setClubWebsite] = useState("");
	const [lat, setLat] = useState('');
	const [long, setLong] = useState('');

	const [isLoading, setIsLoading] = useState(false);


	const [cancelsubshow, setCancelSubShow] = useState(false);
	const [popupshow, setPopupShow] = useState(false);

	const [planslist,setPlanList] = useState([]);



	const submitBtn =  (e) => {
		clearAdminMessages();
		setIsLoading(true);
	     e.preventDefault();
	    if(club_address == ""){

	    	setIsLoading(false);

	    	setPopupShow(true);
	    	setMessageError(true);

            setMessageText("Address required!")

        }else if(fName == ""){

	    	setIsLoading(false);

	    	setPopupShow(true);

	    	setMessageError(true)

            setMessageText("First name required!")

        }else if(phone == "" || phone_country_code == ""){

	    	setIsLoading(false);

	    	setPopupShow(true);

	    	setMessageError(true)

            setMessageText("Phone number required!")

        }else if(club_phone_country_code == "" || club_phone == ""){

	    	setIsLoading(false);

	    	setPopupShow(true);

	    	setMessageError(true)

            setMessageText("Club Phone number required!")

        }else{
		     const formData = new FormData();
	         formData.append("profileImage", profileImage);
	         formData.append("_id", currentUser._id);
	         formData.append("fName", fName);
	         formData.append("lName", lName);
	         formData.append("phone", phone);
	         formData.append("phone_country_code", phone_country_code);
	         formData.append("club_name", club_name);
	         formData.append("club_address", club_address);
	         formData.append("club_phone", club_phone);
	         formData.append("club_phone_country_code", club_phone_country_code);
	         formData.append("club_website", club_website);
	         formData.append("lat", lat);
	         formData.append("long", long);
		     onSubmit(formData);
		}     
	    /* const data = {
	     	fName: fName,
	     	lName: lName,
	     	phone: phone,
	     	profileImage: profileImage,
	     }
	     onSubmit(data);*/
	}; 

	
	
	useEffect(() => {
        if (currentUser) {
           setFName(currentUser.fName);
           setLName(currentUser.lName);
           setEmail(currentUser.email);
            let coutry_code = "";

  	    	if(currentUser.phone_country_code){

  	    		coutry_code = currentUser.phone_country_code;
  	    		setPhoneCountryCode(currentUser.phone_country_code);
  	    	}


           if(currentUser.phone){
           	  setPhone(currentUser.phone);
           	  setphoneValue(coutry_code+currentUser.phone);
           }else{
           	  setPhone("");
           	  setphoneValue("");
           }
           if(currentUser.profileImage){
           	  setShowImage(currentUser.profileImage);
           }
           
        }
    }, [currentUser]);

    useEffect(() => {       
        if(successMsg){
        	setIsLoading(false);

        	setPopupShow(true);

        	setMessageError(false);


            setMessageText(successMsg)

            clearAdminMessages();
            
        }
    }, [successMsg]) 

    useEffect(() => {       
        if(errorMsg){
        	setIsLoading(false);

        	setPopupShow(true);

        	setMessageError(true);


            setMessageText(errorMsg)


            clearAdminMessages();
            
        }
    }, [errorMsg])

    useEffect(() => {       
        if(successMsgCancel){

        	getSubscription();

            setCancelSubShow(false)

            setIsLoading(false)

            setMessageError(false)

            setPopupShow(true);

            setMessageText(successMsgCancel)

            clearAdminMessages();

            
        }
    }, [successMsgCancel])


    useEffect(() => {       
        if(errorMsgCancel){

        	setIsLoading(false)

        	setCancelSubShow(false);

        	setMessageError(true);

        	setPopupShow(true);

            setMessageText(errorMsgCancel)

            clearAdminMessages();

            
        }
    }, [errorMsgCancel])

    useEffect(() => {       
        getSubscription();
        fetchPlans();
    }, []) 

    useEffect(() => {       
        if(plans){
        	setPlanList(plans)
        }
    }, [plans]) 
    useEffect(() => {       
        if(subscriptionData){
        	if(subscriptionData.plan && subscriptionData.plan.name){
        		setSubscriptionName(subscriptionData.plan.name)
        	}else{
        		setSubscriptionName('');
        	}

        	if(clubData && clubData.plan_type && clubData.plan_type == "0" && subscriptionData.plan){
        		setPlanType("Monthly"); 
        		setSubscriptionPrice(subscriptionData.plan.month_price); 
        	}else if(clubData && clubData.plan_type && clubData.plan_type == "1" && subscriptionData.plan ){
        		setPlanType("Yearly")
        		setSubscriptionPrice(subscriptionData.plan.year_price); 
        	}else{
        		setPlanType("")
        		setSubscriptionPrice(''); 
        	}

        	if(subscriptionData.subscription && subscriptionData.subscription.subscription_start_date){
        		setSubscriptionDate(getDate(subscriptionData.subscription.subscription_start_date))
        	}else{
        		setSubscriptionDate('');
        	}

        	if(subscriptionData.subscription && subscriptionData.subscription.subscription_recurring_date){
        		setSubscriptionRec(getDate(subscriptionData.subscription.subscription_recurring_date))
        	}else{
        		setSubscriptionRec('');
        	}

        }

        if(clubData){
        	setClubName(clubData.name);
        	setClubAddress(clubData.address);
        	let coutry_code = "";

  	    	if(clubData.phone_country_code){

  	    		coutry_code = clubData.phone_country_code;
  	    		setClubPhoneCountryCode(clubData.phone_country_code);
  	    	}


           if(clubData.phone){
           	  setClubPhone(clubData.phone);
           	  setClubPhoneValue(coutry_code+clubData.phone);
           }else{
           	  setPhone("");
           	  setphoneValue("");
           }
        	
        	setClubWebsite(clubData.website);

        }
    }, [subscriptionData,clubData]) 

    const columnsSubscription = [
	    {
            id:"plan",
	        name: 'Plan',
	        cell: (row, index) => {

	        	if(subscriptionData && subscriptionData.subscription && subscriptionData.subscription.plan_id == row._id){
	        		if(clubData && clubData.plan_type == "0"){

	        		}
	        	}
	        	return (
		        	<Fragment>
			        	<span>
							{row.name}
						</span>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"month_price",
	        name: 'Monthly Price',
	        cell: (row, index) => {

	        	let activated = "";

	        	if(subscriptionData && subscriptionData.subscription && subscriptionData.subscription.plan_id == row._id){
	        		if(clubData && clubData.plan_type == "0"){
	        			activated = "(Activated)";
	        		}
	        	}
	        	return (
		        	<Fragment>
			        	<span>
							{"€"+row.month_price+' '+activated}
						</span>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"year_price",
	        name: 'Yearly Price',
	        cell: (row, index) => {

	        	let activated = "";

	        	if(subscriptionData && subscriptionData.subscription && subscriptionData.subscription.plan_id == row._id){
	        		if(clubData && clubData.plan_type == "1"){
	        			activated = "(Activated)";
	        		}
	        	}
	        	return (
		        	<Fragment>
			        	<span>
							{"€"+row.year_price+' '+activated}
						</span>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"action",
	        name: '',
	        cell: (row, index) => {
	        	return (
	        		<Link to={"/owner/plan/"+row._id}>
	        		  <Button className="orange-btn custom-btn" type="button">Update Subscription</Button>
	        		</Link>
		        )
		    },
	    },
	];
	const setAddressFunc = (e) => {
    	setClubAddress(e.label);
    	geocodeByAddress(e.label)
    	      .then(results => getLatLng(results[0]))
			  .then(({ lat, lng }) => {
			  	 setLat(lat);
			     setLong(lng);

			  });
    }

    const setPhoneFunc = (value, country, e, formattedValue) => {
    	if(country.dialCode){

    		setPhoneCountryCode(country.dialCode);

    		let phoneNumber = value.replace(country.dialCode,"");
    		setPhone(phoneNumber);
    		setphoneValue(value)

    	}
    }
    const setClubPhoneFunc = (value, country, e, formattedValue) => {
    	if(country.dialCode){

    		setClubPhoneCountryCode(country.dialCode);

    		let phoneNumber = value.replace(country.dialCode,"");
    		setClubPhone(phoneNumber);
    		setClubPhoneValue(value)

    	}
    }

	return (
		<Fragment>
		    {isLoading && <Loader /> }
		    <MessagePopup popupshow={popupshow} setPopupShow={setPopupShow} messagetext={messagetext} msgerror={msgerror} setIsLoading={setIsLoading} /> 
			<section className="profile-main-sec">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        		<div className="profile-edit-outer d-flex align-items-center justify-content-between">
			        			<div className="profile-edit">
			        				<div className="profile-circle">
				        				<Image src={show_image} className="profile-img" /> 
									        <Form.Control 
									            type="file"
									            onChange={(event) => {
										          setProfileImage(event.target.files[0]);
										          setShowImage(URL.createObjectURL(event.target.files[0]));

										        }}
									         />
									        <FiEdit />
								    </div>
			        				<h4>{fName} {lName}</h4>
			        			</div>
			        			<div className="right-profile-btn text-right">
			        				<Button className="orange-btn custom-btn" onClick={submitBtn}>Save</Button>
			        			</div>
			        		</div>
			        		<div className="darkblue-sec mt-5 mb-5">
				        		<h5>Owner Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>First name</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={fName}
								        			    onChange={(e) => setFName(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Last name</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={lName}
								        			    onChange={(e) => setLName(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6} className="mt-4">
								        		<div className="outer-form">
								        			<Form.Label>Email</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={email}
								        			    readOnly
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6} className="mt-4">
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<PhoneInput country={'fi'} value={phoneValue} onChange={(value, country, e, formattedValue) => setPhoneFunc(value, country, e, formattedValue)} />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>
                        {/*club details*/}

                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Club Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Club name1</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={club_name}
								        			    onChange={(e) => setClubName(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Address</Form.Label>
								        			{club_address?
								        			<GooglePlacesAutocomplete
								        			    className="form-control"
								        			    apiKey="AIzaSyCJw0QfJXXleECtFD5031OMG75lZMiC6dY"
								        			    selectProps={
								        			    	{
                                                                defaultInputValue: club_address,
															    onChange: setAddressFunc,
															    placeholder:club_address,
															    styles: {
															      input: (provided) => ({
															        ...provided,
															        color:"#fff"
															      }),
															      option: (provided) => ({
															        ...provided,
															        color:'black'
															      }),
															      singleValue: (provided) => ({
															        ...provided,
															        color:"#fff"
															      }),
															    }
															}
														}
													    
													/>
													:''}
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Email</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={(clubData && clubData.email)?clubData.email:''}
								        			    readOnly={true}
								        			/>
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<PhoneInput country={'fi'} value={clubPhoneValue} onChange={(value, country, e, formattedValue) => setClubPhoneFunc(value, country, e, formattedValue)} />
								        			
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Website</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={club_website}
								        			    onChange={(e) => setClubWebsite(e.target.value)}
								        			/>
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>

                        {/* end Club detail*/}
                        {/*Current subscription*/}

                            <div className="darkblue-sec mt-5 mb-5">
	                            <div className="profile-edit-outer d-flex align-items-center justify-content-between">
				        			<div className="profile-edit">
				        				<h5>Current Subscription</h5>
				        			</div>
				        			{(subscriptionData && subscriptionData.subscription && subscriptionData.subscription.status == "1")?

				        			    <Fragment>
						        			<div className="right-profile-btn text-right">
						        				<Button className="orange-btn custom-btn" type="button" onClick={() => setCancelSubShow(true)}>Cancel Subscription</Button>
						        			</div>
						        			<CancelSubModal cancelsubshow={cancelsubshow} setCancelSubShow={setCancelSubShow} setIsLoading={setIsLoading} /> 
					        			</Fragment>
					        		:''}	
				        		</div>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col>
								        		<div className="outer-form">
								        			<Form.Label>Subscription name</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={subscription_name}
								        			    readOnly={true}
								        			/>
								        		</div>
								        	</Col>
								        	<Col>
								        		<div className="outer-form">
								        			<Form.Label>Plan</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={plan_type}
								        			    readOnly={true}
								        			/>
								        		</div>
								        	</Col>
								        	<Col>
								        		<div className="outer-form">
								        			<Form.Label>Price (€)</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={subscription_price}
								        			    readOnly={true}
								        			/>
								        		</div>
								        	</Col>
								        	<Col>
								        		<div className="outer-form">
								        			<Form.Label>Date</Form.Label>
								        			<Form.Control 
								        			    type="text"
								        			    value={subscription_date}
								        			    readOnly={true}
								        			/>
								        		</div>
								        	</Col>
								        	<Col>
								        		<div className="outer-form">
								        		    {(subscriptionData && subscriptionData.subscription && subscriptionData.subscription.status == "1")?
								        			    <Form.Label>Billing Cycle</Form.Label>
								        			:
								        			    <Form.Label>Cancel date</Form.Label>
								        			}   
								        			<Form.Control 
								        			    type="text"
								        			    value={subscription_rec}
								        			    readOnly={true}
								        			/>
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>

                        {/* end Current subscription*/}
                        {/*Other subscription*/}

                            <div className="darkblue-sec mt-5 mb-5">
	                            <div className="profile-edit-outer d-flex align-items-center justify-content-between">
				        			<div className="profile-edit">
				        				<h5>Other Subscriptions</h5>
				        			</div>
				        		</div>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<div className="dataTable">
							        	<DataTable
								            columns={columnsSubscription}
								            data={planslist}
								        />
								    </div> 
				        		</div>
                            </div>

                        {/* end Other subscription*/}
			        	</Col>
			      	</Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);