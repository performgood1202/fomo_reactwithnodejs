import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail,AiOutlinePlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate,Link } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import Loader from "../../Loader";
import  "./style.scss";
import avtarPic from '../../../assets/images/user.png';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { prefix } from './../../../constants/prefix.js';

import { FileUploader } from "react-drag-drop-files";
import { 
	ADMIN_CLEAR_MESSAGES, 
	ADD_MANAGER,
	ADD_EVENT,
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	addEvent: (formData,role) => {
		if(role == "2"){
            dispatch({ type: ADD_EVENT, payload: agent.owner.addEvent(formData) });
		}else{
			dispatch({ type: ADD_EVENT, payload: agent.manager.addEvent(formData) });
		}
    	
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const CreateMain = (props) => {	
	const {currentUser,addEvent, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg, createPromotion} = props;


	const formRef = useRef();
	const [title, setTitle] = useState('');
	const [eventTime, setEventTime] = useState('');
	const [hours, setHours] = useState('');
	const [price, setPrice] = useState('');
	const [seats, setSeats] = useState('');
	const [guest_seats, setGuestSeats] = useState('');
	const [performerName, setPerformerName] = useState('');
	const [performerDescription, setPerformerDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [disableSubmit, setSubmit] = useState(false);
	const [errMsg, setErr] = useState('');

	const [eventDate, seteventDate] = useState("");
	const [eventInputDate, seteventInputDate] = useState("");

	const [showPerformerImage, setshowPerformerImage] = useState(avtarPic);
	const [performerImage, setPerformerImage] = useState(null);

	let navigate = useNavigate();

  	

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();



        if(club_id && club_id != ""){

        	
        	const formData = new FormData();
        	benefitsFields.forEach(function(value,index){
        		formData.append("benefits[]", value.benefit);
        	})
        	if(eventImage && eventImage.length != undefined){
        		for(let i= 0;i < eventImage.length;i++){
	        		formData.append("eventImages[]", eventImage[i]);
	        	}
        	}

        	if(eventDate == ""){
        		setIsLoading(false);

        		setErr("Event date required!");

        	}else if(eventTime == ""){
        		setIsLoading(false);

        		setErr("Event time required!");

        	}else{
        		formData.append("title", title);
		        formData.append("eventDate", moment(eventDate).format("YYYY-MM-DD"));
		        formData.append("eventTime", eventTime);
		        formData.append("hours", hours);
		        formData.append("seats", seats);
		        formData.append("guest_seats", guest_seats);
		        formData.append("price", price);
		        formData.append("performerName", performerName);
		        formData.append("performerDescription", performerDescription);
		        formData.append("performerImage", performerImage);
	        	formData.append("club_id", club_id);
	        	if(currentUser && currentUser.roleId){
	        		addEvent(formData,currentUser.roleId);
	        	}

        	}

        	setTimeout(function(){
               setErr("");
        	},4000)
        	
	        
        	
        }
		
    	
    	setTimeout(() => {
    		clearMessages();
    	}, 3000);
	}

	const [eventImage, seteventImage] = useState(null);
	const handleChangeEventImage = (file) => {
	   seteventImage(file);
	}
	const getMinTime = () => {
		if(eventDate && eventDate != ""){
             if(moment(eventDate).format("DD-MMMM-YYYY") == moment(new Date()).format("DD-MMMM-YYYY")){
                
                var event_date1 = moment(eventDate).format("YYYY-MM-DD");
                var event_time1 = moment(new Date()).format("HH:mm")+":00";

             	return moment(event_date1+" "+event_time1).toDate()
             }else{
                return moment().startOf('day').toDate()
             }
           
		}else{
			return moment().startOf('day').toDate()
		}
		

	}

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	useEffect(() => {
		if(errorMsg){
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [errorMsg]);

  	useEffect(() => {
		if(successMsg){
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    		navigate("/"+prefix[currentUser.roleId]+"/events");
	    	}, 3000);
			
		}
  	}, [successMsg]);


	const [isOpen, setIsOpen] = useState(false);
	const handleChangeDate = (e) => {
		setIsOpen(!isOpen);
		seteventDate(e);
		seteventInputDate(moment(e).format("DD MMMM YYYY"));
	};
	const handleClickDate = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};
	const [timeDiv, setTimeDiv] = useState('');
	const setTimeFunc = (value) => {
		setTimeDiv(value)
		setEventTime(moment(value).format("HH:mm"));

	};
	const [benefitsFields, setBenefitsFields] = useState([{benefit:''}]);

	const addBenefit = () => {
		setBenefitsFields([...benefitsFields, {benefit:''}]);
	};
	const deleteBenefit = (index) => {
		const rows = [...benefitsFields];
        rows.splice(index, 1);
        setBenefitsFields(rows);
	};
	const handleBenefitChange = (index, evnt)=>{

	    const { value } = evnt.target;
	    const list = [...benefitsFields];
	    list[index]["benefit"] = value;
	    setBenefitsFields(list);
	 
	}
	const onDatepickerRef = (el) =>{
		if (el && el.input) {
		   el.input.readOnly = true; 
		} 
	}
	const setSeatsFunc = (seats) =>{ 
		setSeats(seats)
		setGuestSeats("")

	}
	const setGuestSeatsFunc = (guest_seats) =>{
		if (parseInt(guest_seats) <= parseInt(seats)) {
		   setGuestSeats(guest_seats)
		}else{
		   setGuestSeats("")
		} 
	}

	const hoursArray = [1,2,3,4,5];

    


	

	return (
		<Fragment>
				{isLoading && <Loader /> }
				<section className="create-events-sec">
					<Container fluid>
				      <Row>
				        <Col lg={12}>

				            {(errorMsg || successMsg) ?
	                            <div className="add-row-btn text-center mb-3 mt-3">
					        		{errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
	                                {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
	                            </div>
	                        :''}  
	                        {(errMsg) ?
	                            <div className="add-row-btn text-center mb-3 mt-3">
					        		{errMsg ? <Badge bg="danger">{errMsg}</Badge> : <Fragment /> }
	                            </div>
	                        :''} 
				           
					        <Form onSubmit={handleSubmit} ref={formRef}>
					        <div className="plans-outer">
					        	<Row>
					        		<Col lg={6}>
					        			<div className="add-row-btn text-left mb-3 mt-3">
								        	<h4>Add event</h4>
			                            </div>
					        		</Col>
					        		<Col lg={6}>
						        		<div className="add-row-btn text-right mb-3 mt-3">
								        	<Button type="submit" className="custom-btn orange-btn">Save</Button>
			                            </div>
					        		</Col>
					        	</Row>
					        	<hr/>	
					        	<Row>
					        	    <Col lg={12} className="text-center">
					        	       <FileUploader handleChange={handleChangeEventImage} name="eventImage" multiple={true} types={fileTypes} />
					        	    </Col>
					        	</Row>			        	
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Event Details</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Event Title</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            name="title"
				                                            onChange={ (e) => setTitle(e.target.value) }
				                                            required
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Date</Form.Label>
									        			<div className="date_div">
										        			<Form.Control 
					                                            type="text" 
					                                            value={eventInputDate}
					                                            readOnly={true}
					                                            onClick={handleClickDate}
					                                            required
					                                        />
										        			{isOpen && (
														        <DatePicker minDate={new Date()} selected={eventDate} onChange={handleChangeDate} inline />
														    )}
													    </div>
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Time</Form.Label>
									        			<DatePicker
														    selected={timeDiv}
														    value={eventTime}
														    onChange={setTimeFunc}
														    ref={ (el) => onDatepickerRef(el) }
														    showTimeSelect
														    showTimeSelectOnly
														    timeIntervals={15}
														    timeCaption="Time"
														    timeFormat="HH:mm"
														    dateFormat="LLL"
														    minTime={getMinTime()}
														    maxTime={moment().endOf('day').toDate()}
														/>
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Hours</Form.Label>
									        			<Form.Select name="hours" defaultValue={hours} onChange={(e)=>setHours(e.target.value)} required>
									        			    <option value=''></option>
										        			{ hoursArray.map((hours_val, index)=>{ 
                                                           		return (
                                                           			<option key={index} value={hours_val}>{hours_val}</option>
                                                           			)
                                                           		})
                                                           	}

                                                       	</Form.Select>
									        		</div>
									        	</Col>
									        	
									        	
									        </Row>
									        <Row>
									            <Col lg={4}>
									        		<div className="outer-form">
									        			<Form.Label>Available Seats</Form.Label>
									        			<Form.Control 
				                                            type="number" 
				                                            onChange={ (e) => setSeatsFunc(e.target.value) }
				                                            value={seats}
				                                            step="any"
				                                            max="500"
				                                            min="1"
				                                            required
				                                        />
									        		</div>
									        	</Col>
									            {(seats && seats != "")?
									        	    <Col lg={4}>
									        	        <div className="outer-form">
										        			<Form.Label>Guest Seats</Form.Label>
										        			<Form.Control 
					                                            type="number" 
					                                            onChange={ (e) => setGuestSeatsFunc(e.target.value) }
					                                            value={guest_seats}
					                                            step="any"
					                                            max="500"
					                                            min="1"
					                                            required
					                                        />
										        		</div>
									        	    </Col>
								        	    :''}
								        	    <Col lg={4}>
								        	        <div className="outer-form">
									        	        <Form.Label>Booking Price</Form.Label>
										        			<Form.Control 
					                                            type="number" 
					                                            min={1}
					                                            onChange={ (e) => setPrice(e.target.value) }
					                                            required
					                                        />
					                                </div>
								        	    </Col>
								        	</Row>	
									        
									        
									    </Form.Group>
					        		</div>
	                            </div>  
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Post benefits</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        	
								        	{
								        		(benefitsFields.length > 0)?

										        	benefitsFields.map((benefitData, index)=>{

                                                          const {benefit}= benefitData;

								                          return(

								                            <Row className="mb-3" key={index}>
													        	<Col lg={10}>
													        		<div className="outer-form">
													        			<Form.Label>Benefit {index + 1}</Form.Label>
													        			<Form.Control 
								                                            type="text" 
								                                            value={benefit}
								                                            onChange={(evnt)=>handleBenefitChange(index, evnt)}
								                                        />
													        		</div>
													        	</Col>
													        	<Col lg={2}>
													        		<div className="outer-form benefit_main">
													        		    {(index == 0)? <AiOutlinePlusCircle className="plus_benefit" onClick={addBenefit} /> :<BsTrash className="delete_benefit" onClick={()=>deleteBenefit(index)} />}
													        		</div>
													        	</Col>
												        	</Row>	

								                          )
								                    })
								                :''
								            }        
									        
									        
									    </Form.Group>
					        		</div>
	                            </div>  

	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Performance Details</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
					        			    <Row className="mb-3">
									        	<Col lg={1}>
									        		<div className="outer-form img-performer">
									        			<Image src={showPerformerImage} alt="profile-pic" height={30} />
									        		</div>
									        	</Col>
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>Upload image</Form.Label>
									        			<Form.Control 
				                                            type="file" 
				                                            accept=".png,.jpg,.jpeg,.webp,.gif"
				                                            onChange={(event) => {
													          setPerformerImage(event.target.files[0]);
													          setshowPerformerImage(URL.createObjectURL(event.target.files[0]));

													        }}
				                                        />
									        		</div>
									        	</Col>
									        </Row>
									        <Row className="mb-3">
									        	<Col lg={12}>
									        		<div className="outer-form">
									        			<Form.Label>Performer name</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            onChange={ (e) => setPerformerName(e.target.value) }
				                                        />
									        		</div>
									        	</Col>
									        </Row>
									        <Row className="mb-3">
									        	<Col lg={12}>
									        		<div className="outer-form">
									        			<Form.Label>Description</Form.Label>
									        			<Form.Control 
				                                            as="textarea" 
				                                            onChange={ (e) => setPerformerDescription(e.target.value) }
				                                            rows={6}
				                                        />
									        		</div>
									        	</Col>
									        </Row>
									        
									        
									    </Form.Group>
					        		</div>
	                            </div>  
	                        	
							</div>
							</Form>
						</Col>
				      </Row>
				    </Container>
				</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMain);