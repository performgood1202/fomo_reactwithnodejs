import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem,  Image, NavLink  } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import { prefix } from './../../../constants/prefix.js';

import eventimg1 from "../../../assets/images/eventimg1.png";

import DataTable from 'react-data-table-component';

import Loader from "../../Loader";

import { useNavigate,Link } from "react-router-dom";

import moment from "moment";



import {
  	ADMIN_CLUB_FETCH,
  	FETCH_EVENTS,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	eventData: state.owner.eventData,
  	clubData: state.common.clubData,
  	currentUser: state.common.currentUser,
  	errorMsg: state.owner.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
	fetchEvents: (formData,role) => {
		if(role == "2"){
           dispatch({ type: FETCH_EVENTS, payload: agent.owner.fetchEvents(formData) });
		}else{
			dispatch({ type: FETCH_EVENTS, payload: agent.manager.fetchEvents(formData) });
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

	const {eventData,clubData,fetchEvents,currentUser,errorMsg,clearMessage} = props;

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

    let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");


	let navigate = useNavigate();


	let  a = 0;

	
	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);

	const [searchFilter, setSearchFilter] = useState("");
	let [upComingFilter, setupComingFilter] = useState(false);
	let [pastFilter, setpastFilter] = useState(false);
	let [planFilter, setPlanFilter] = useState("");

	const [events,setEvents] = useState([]);

	const filterData = () => {
		clearMessage();

		setIsLoading(true);

		if(club_id && club_id != ""){
			var formData = {
				search:searchFilter,
				upcomming: upComingFilter,
				past: pastFilter,
				club_id : club_id,
				cr_date : cr_date,
			}
			if(currentUser && currentUser.roleId){
        		fetchEvents(formData,currentUser.roleId);
        	}

			
		}

	}
	const upComingBtn = () => {

		if(upComingFilter){
			upComingFilter = false;
           setupComingFilter(false); 
		}else{
			upComingFilter = true;
           setupComingFilter(true); 
		}
        filterData();

	}
	const pastBtn = () => {

		if(pastFilter){
			pastFilter = false;
           setpastFilter(false); 
		}else{
			pastFilter = true;
           setpastFilter(true); 
		}
        filterData();

	}
	const selectBox = (e) => {

		var value = e.target.value;

		planFilter = value;

		setPlanFilter(value);
		console.log(planFilter)
		
        filterData();

	}


	useEffect(() => {  		
		if(club_id){
			var formData = {
				club_id:club_id,
				cr_date : cr_date
			}
			if(currentUser && currentUser.roleId){
        		fetchEvents(formData,currentUser.roleId);
        	}
		}
  		
  	}, [club_id]) 

  	useEffect(() => {  		
  		if(eventData){
  			setIsLoading(false);
  			setEvents(eventData);
  		}
  	}, [eventData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setIsLoading(false);
        	clearMessage();
        	setEvents([]);
        }
    }, [errorMsg]);


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
											<Button type="submit" className={(upComingFilter)?"active":""} onClick={(e) => upComingBtn()}>Upcoming</Button>
											<Button type="submit" className={(pastFilter)?"active":""} onClick={(e) => pastBtn()}>Past</Button>

											{(currentUser && currentUser.roleId != 3)?
											
												<div className="search-plan-outer text-right">
													<Link to={"/"+prefix[currentUser.roleId]+"/event/create"}><Button className="orange-btn">Add New</Button></Link>
									        	</div>

								        	:''}
							        	</div>
									</Col>
							     </Row>
                            </div>
                            <hr />
				        	<section className="upcoming-event-sec">
								<Container fluid>
									<Row className="mt-4">

									    {(events.length > 0)?

									        	events.map((eventdata, index)=>{

									        		var event_image = eventimg1;

									        		if(eventdata && eventdata.images && eventdata.images.length > 0){
                                                        event_image = eventdata.images[0].image;
									        		}

									        		return(

											        	<Col lg={3} className="mb-4" key={index}>
											        	    <Link to={"/"+prefix[currentUser.roleId]+"/event/view/"+eventdata.event._id}>
												        		<div className="upcoming-event-boxes">
												        			<Image src={event_image} className="w-100"/>
												        			<div className="upcoming-inner-boxes">
													        			<h5>{eventdata.event.title}</h5>
													        			<p>{moment(eventdata.event.event_date).utc().format("DD MMMM YYYY")}  |  {eventdata.event.event_time}</p>
													        			{/*<span className="yellow-back">Booked</span>*/}
													        			<div>{(eventdata.event && eventdata.event.status)?renderStatus(eventdata.event.status):''}</div>
													        		</div>
												        		</div>
											        		</Link>
											        	</Col>
											         )
								                })
								            :
								            <Col lg={12}>
										        <div className="dataTable">
										        	<h3>No Active and upcoming events found!</h3>
											    </div>   
											</Col>
								         }        
							        	
							      	</Row>
							    </Container>
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