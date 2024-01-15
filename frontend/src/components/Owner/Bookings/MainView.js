import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem,  Image, NavLink  } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import { prefix } from './../../../constants/prefix.js';

import eventimg1 from "../../../assets/images/club.png";
import userimg from "../../../assets/images/user.png";

import DataTable from 'react-data-table-component';

import Loader from "../../Loader";

import { useNavigate,Link,useParams } from "react-router-dom";

import moment from "moment";

import AssignModule from './AssignModule';



import {
  	ADMIN_CLUB_FETCH,
  	GET_BOOKINGS,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	eventData: state.owner.eventData,
  	clubData: state.common.clubData,
  	currentUser: state.common.currentUser,
  	errorMsg: state.owner.errorMsg,
  	eventBookingData: state.owner.eventBookingData,
});

const mapDispatchToProps = (dispatch) => ({
	getBookings: (formData,role) => {
		if(role == "2"){
           dispatch({ type: GET_BOOKINGS, payload: agent.owner.getBookings(formData) });
		}else{
			dispatch({ type: GET_BOOKINGS, payload: agent.manager.getBookings(formData) });
		}
    	
  	},
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const renderStatus = (status)=> {
	
		switch (status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="red-back">Unavailable</span>
		    	</Fragment>
		    )
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back">Available</span>
		    	</Fragment>
		    )
		    break;
		  case "2":
		    return (
		    	<Fragment>
		    	   <span className="red-back">Booking</span>
		    	</Fragment>
		    )
		    break;  
		}
}
const getBillingDate = (date)=> {
	
		return moment(date).format("DD, MMM, YYYY");
}


const submitFormSearch = (e) =>{
		e.preventDefault();
} 
const MainView = (props) => {

	const {eventData,clubData,fetchEvents,getBookings,eventBookingData,currentUser,errorMsg,clearMessage} = props;

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	let event_id;

	const params = useParams();

	if(params.event_id !== undefined){
		event_id = params.event_id;
	}


	let navigate = useNavigate();


	let  a = 0;

	
	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);

	const [searchFilter, setSearchFilter] = useState("");
	let [TicketsFilter, setTicketsFilter] = useState(false);
	let [GuestListFilter, setGuestListFilter] = useState(false);

	const [events,setEvents] = useState([]);

	const filterData = () => {
		clearMessage();


		if(event_id && clubData){
			var formData = {
				search:searchFilter,
				tickets: TicketsFilter,
				guest_list: GuestListFilter,
				event_id:event_id,
				club_id:clubData._id
			}
			if(currentUser && currentUser.roleId){
        		getBookings(formData,currentUser.roleId);
        	}

			
		}

	}
	const ticketsFunc = () => {

		if(TicketsFilter){
			TicketsFilter = false;
           setTicketsFilter(false); 
		}else{
			TicketsFilter = true;
            setTicketsFilter(true); 
		}
        filterData();

	}
	const guestListFunc = () => {

		if(GuestListFilter){
			GuestListFilter = false;
           setGuestListFilter(false); 
		}else{
			GuestListFilter = true;
           setGuestListFilter(true); 
		}
        filterData();

	}


	useEffect(() => {  	

		if(event_id && clubData){
			var formData = {
				event_id:event_id,
				club_id:clubData._id
			}
			if(currentUser && currentUser.roleId){
        		getBookings(formData,currentUser.roleId);
        	}
		}
  		
  	}, [event_id,clubData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setIsLoading(false);
        	clearMessage();
        	setEvents([]);
        }
    }, [errorMsg]);

   


    let [bookings, setBookings] = useState([]);

     useEffect(() => {
        if (eventBookingData) {
        	setBookings(eventBookingData);
        }
    }, [eventBookingData]);

    const columns = [
	    {
	    	id:"guest_name",
	        name: 'Guest name',
	        cell: (row, index) => {
	        	let cust_name = "";
	        	let profileImage = userimg;
	        	if(row.customer && row.customer.fName){
	        		cust_name = row.customer.fName+" "+row.customer.lName;
	        	}
	        	if(row.customer && row.customer.profileImage){
	        		profileImage = row.customer.profileImage;
	        	}
	        	return (
	        		<AssignModule getBookings={getBookings} event_id={event_id} row={row} >
	        		    <div className="booking-image-boxes pointer_div">
		        			<Image src={profileImage}/>
		        			<div className="booking-inner-boxes">
			        			<span>{cust_name}</span>
			        		</div>
			        		
		        		</div>
	        		</AssignModule>
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
	        		<AssignModule  getBookings={getBookings} event_id={event_id} row={row} >
	        		  <span className="pointer_div">{seats}</span>
	        		</AssignModule>
	        	)
	        },
	    },
	    {
            id:"phone",
	        name: 'Phone',
	        cell: (row, index) => {
	        	let phone = "";
	        	let phone_country_code = "";
	        	if(row.customer && row.customer.phone_country_code){
	        		phone_country_code = "+"+row.customer.phone_country_code;
	        	}
	        	if(row.customer && row.customer.phone){
	        		phone = phone_country_code+row.customer.phone;
	        	}
	        	return (
	        		<AssignModule  getBookings={getBookings} event_id={event_id} row={row} >
	        		  <span className="pointer_div">{phone}</span>
	        		</AssignModule>
	        	)
	        },
	    },
	    {
            id:"tableno",
	        name: 'Table No.',
	        cell: (row, index) => {
	        	let table_no = "NA";
	        	if(row.booking && row.booking.table_no){
	        		table_no = row.booking.table_no;
	        	}
	        	return (
	        		<AssignModule  getBookings={getBookings} event_id={event_id} row={row} >
	        		  <span className="pointer_div">{table_no}</span>
	        		</AssignModule>
	        	)
	        },
	    }
	];


	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="events-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn mb-3 mt-3">
				        		<Row>
							        <Col lg={6}>
								        <div className="search-box">
								        	<Form onSubmit={submitFormSearch}>
										      <Form.Group controlId="formBasicEmail">
									        	<div className="search-btn-outer">
									        		<Form.Control type="text" onChange={(e) => setSearchFilter(e.target.value)} onKeyUp={(e) => filterData()} placeholder="Search" />
									        		<AiOutlineSearch />
									        	</div>
										       </Form.Group>
										    </Form>
								        </div>
									</Col>
									<Col lg={6}>
										<div className="search-plan-outer text-right">
											<Button type="submit" className={(GuestListFilter)?"active":""} onClick={(e) => guestListFunc()}>Guest List</Button>
											<Button type="submit" className={(TicketsFilter)?"active":""} onClick={(e) => ticketsFunc()}>Tickets</Button>
							        	</div>
									</Col>
							     </Row>
                            </div>
                            <hr />
				        	<section className="upcoming-event-sec">
								<div className="dataTable">
						        	<DataTable
							            columns={columns}
							            data={bookings}
							            pagination
							            noDataComponent={<span className='p-3'>There are no booking data to display</span>} 
							        />
							    </div>
							</section>   
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);