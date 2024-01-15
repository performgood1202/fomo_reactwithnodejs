import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail,AiOutlinePlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate,Link,useParams } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import Loader from "../../Loader";
import  "./style.scss";
import avtarPic from '../../../assets/images/user.png';
import clubimage from "../../../assets/images/club.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { prefix } from './../../../constants/prefix.js';

import { FileUploader } from "react-drag-drop-files";

import DataTable from 'react-data-table-component';
import DeleteEventModal from './DeleteEventModal';

import { 
	ADMIN_CLEAR_MESSAGES, 
	ADD_MANAGER,
	ADD_EVENT,
	FETCH_EVENT_DETAIL,
	PAGE_ATTR
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	currentUser: state.common.currentUser,
  	eventDetail: state.owner.eventDetail,
  	bookingData: state.owner.bookingData,

});

const mapDispatchToProps = (dispatch) => ({
	addEvent: (formData,role) => {
		if(role == "2"){
            dispatch({ type: ADD_EVENT, payload: agent.owner.addEvent(formData) });
		}else{
			dispatch({ type: ADD_EVENT, payload: agent.manager.addEvent(formData) });
		}
    	
  	},fetchEventDetail: (formData,role) => {
		if(role == "2"){
            dispatch({ type: FETCH_EVENT_DETAIL, payload: agent.owner.getEventDetail(formData) });
		}else{
			dispatch({ type: FETCH_EVENT_DETAIL, payload: agent.manager.getEventDetail(formData) });
		}
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const renderStatus = (status)=> {
	
		switch (status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="red-back bk-tag">Unavailable</span>
		    	</Fragment>
		    )
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back bk-tag">Available</span>
		    	</Fragment>
		    )
		    break;
		  case "2":
		    return (
		    	<Fragment>
		    	   <span className="red-back bk-tag">Booking</span>
		    	</Fragment>
		    )
		    break;  
		}
}
const ViewEvent = (props) => {	
	const {setPageHeading,pageheading,currentUser,bookingData,addEvent,fetchEventDetail,eventDetail, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg, createPromotion} = props;
	const [deleteeventmodalshow,setDeleteEventModalShow] = useState(false);

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("View event");
		}
  		
  	}, [pageheading]) 

  	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");


	const formRef = useRef();
	
	const [title, setTitle] = useState('');
	const [eventTime, setEventTime] = useState('');
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

	const [eventData, setEventData] = useState(null);

	let navigate = useNavigate();

	let event_id;

	const params = useParams();

	if(params.id !== undefined){
		event_id = params.id;
	}


	const [eventImage, seteventImage] = useState(null);
	const handleChangeEventImage = (file) => {
	   seteventImage(file);
	};

	const [club_id,setClubId] = useState("");

	useEffect(() => {  		
		if(club_id && event_id){

			var formData = {
				club_id:club_id,
				event_id:event_id,
				cr_date: cr_date

			}
			
			if(currentUser && currentUser.roleId){
        		fetchEventDetail(formData,currentUser.roleId);
        	}
		}
  		
  	}, [club_id,event_id]) 

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	

  	useEffect(() => {
		if(eventDetail){
			setEventData(eventDetail)
		}
  	}, [eventDetail]);

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


	var event_image = clubimage;

	if(eventData && eventData.images && eventData.images.length > 0){
        event_image = eventData.images[0].image;
	}
	let [bookings, setBookings] = useState([]);

	//bookings = [{name:''}];

	//setBookings(data_booking)

	const columns = [
	    {
	    	id:"guest_name",
	        name: 'Guest name',
	        cell: (row, index) => {
	        	let cust_name = "";
	        	if(row.customer && row.customer.fName){
	        		cust_name = row.customer.fName+" "+row.customer.lName;
	        	}
	        	return (
        		    <Link to={"/"+prefix[currentUser.roleId]+"/bookings/"+event_id}>
        		       <span>{cust_name}</span>
        		    </Link>
	        	)
	        },
	    },
	    {
            id:"seats",
	        name: 'Seats',
	        cell: (row, index) => {
	        	let seats = "";
	        	if(row.booking && row.booking.quantity){
	        		seats = row.booking.quantity;
	        	}
	        	return (
	        		<Fragment key={index}>
	        		  <span>{seats}</span>
	        		</Fragment>
	        	)
	        },
	    },
	    {
            id:"phone",
	        name: 'Phone',
	        cell: (row, index) => {
	        	let phone = "";
	        	if(row.customer && row.customer.phone){
	        		phone = row.customer.phone;
	        	}
	        	return (
	        		<Fragment key={index}>
	        		  <span>+{phone}</span>
	        		</Fragment>
	        	)
	        },
	    }
	];

	useEffect(() => {
		if(bookingData){
			setBookings(bookingData)
		}
  	}, [bookingData]);




	return (
		<Fragment>
				{isLoading && <Loader /> }
				<section className="view-events-sec">
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
				           
					        <div className="plans-outer">
					        	<Row>
					        		<Col lg={6}>
					        			<div className="add-row-btn text-left mb-3 mt-3 d-flex align-items-center">
								        	<h4>{(eventData && eventData.event && eventData.event.title)?eventData.event.title:''}</h4>
								        	<div className="ml-10px">{(eventData && eventData.event && eventData.event.status)?renderStatus(eventData.event.status):''}</div>
			                            </div>
					        		</Col>
					        		<Col lg={6}>
					        		    {(currentUser && currentUser.roleId == "2")?
								        		<div className="add-row-btn text-right mb-3 mt-3">
								        		    {(eventData && eventData.event_booked < 1)?
								        		    	<div>
									        		        <Button type="button" className="custom-btn red-back mr-10px" onClick={() => setDeleteEventModalShow(true)}>Delete</Button>
									        		      
										        		    <Link to={"/"+prefix[currentUser.roleId]+"/event/edit/"+event_id}>
												        	  <Button type="button" className="custom-btn orange-btn">Edit</Button>
												        	</Link>  
											        	</div>
										        	 :''} 
										        	<DeleteEventModal setIsLoading={setIsLoading} event_id={event_id} club_id={club_id} deleteeventmodalshow={deleteeventmodalshow} setDeleteEventModalShow={setDeleteEventModalShow} /> 
					                            </div>
				                        :''}    
					        		</Col>
					        	</Row>
					        	<hr/>	
					        	<Row>
					        	    <Col lg={4}>
					        			<div className="view-left-content">

								        	<div className="view-image"><Image src={event_image} /></div>

								        	{(eventData && eventData.event && eventData.event.performerName)?
									        	<div className="darkblue-sec mt-5 mb-5">
						        		           <h5>Description</h5>
						        		           <hr />
						        		           <div className="view-desc">

						        		              <p>Performance By:</p>
						        		              <h4 className="view-pr d-flex align-items-center"><Image src={(eventData && eventData.event && eventData.event.performerImage)?eventData.event.performerImage:avtarPic} />{eventData.event.performerName}</h4>
						        		              <p>
						        		                {(eventData && eventData.event && eventData.event.performerDescription)?eventData.event.performerDescription:''}
						        		              </p>

						        		           </div>
						        		        </div> 
					        		        :''}  
			                            </div>

					        		</Col>
					        		<Col lg={8}>
					        			<div className="view-right-content">

					        			    <div className="darkblue-sec mb-5">
                                               <Row>
                                                 <Col>
                                                      <div className="view-detail-sec text-center">
                                                         <h4>Date/Time</h4>
                                                         <p>{(eventData && eventData.event && eventData.event.event_date)?moment(eventData.event.event_date).utc().format("DD MMMM, YYYY"):''} <br/> {(eventData && eventData.event && eventData.event.event_time)?eventData.event.event_time:''}</p>
                                                      </div>
                                                 </Col>
                                                 <Col>
                                                      <div className="view-detail-sec text-center">
                                                         <h4>Booked</h4>
                                                         <p> {(eventData && eventData.event_booked)?eventData.event_booked:0}</p>
                                                      </div>
                                                 </Col>
                                                 <Col>
                                                      <div className="view-detail-sec text-center">
                                                         <h4>Available Seats</h4>
                                                         <p>{(eventData && eventData.event && eventData.event.avail_seats)?eventData.event.avail_seats:0}</p>
                                                      </div>
                                                 </Col>
                                                 <Col>
                                                      <div className="view-detail-sec text-center">
                                                         <h4>Available Guest Seats</h4>
                                                         <p>{(eventData && eventData.event && eventData.event.avail_guest_seats)?eventData.event.avail_guest_seats:0}</p>
                                                      </div>
                                                 </Col>
                                                 <Col>
                                                      <div className="view-detail-sec text-center">
                                                         <h4>Booking Price</h4>
                                                         <p>€{(eventData && eventData.event && eventData.event.booking_price)?eventData.event.booking_price:''}</p>
                                                      </div>
                                                 </Col>
                                               </Row>
					        			    </div>
					        			    <div className="add-row-btn text-right mb-3 mt-3">
								        	    <Link to={"/"+prefix[currentUser.roleId]+"/bookings/"+event_id}>
								        	      <Button type="submit" className="custom-btn orange-btn">View All</Button>
								        	    </Link> 
			                                </div>
			                                <div className="dataTable">
									        	<DataTable
										            columns={columns}
										            data={bookings}
										            noDataComponent={<span className='p-3'>There are no booking data to display</span>} 
										        />
										    </div> 
								        	
			                            </div>
					        		</Col>
					        	</Row>			        	
	                             
							</div>
						</Col>
				      </Row>
				    </Container>
				</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvent);