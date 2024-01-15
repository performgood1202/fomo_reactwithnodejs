import React, { useEffect,useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, NavLink,Form } from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import hth from "../../../assets/images/hth.png";
import event from "../../../assets/images/event.png";
import money from "../../../assets/images/money.png";
import switch1 from "../../../assets/images/switch.png";
import revenue from "../../../assets/images/revenue.png";
import eventimg1 from "../../../assets/images/eventimg1.png";
import { prefix } from '../../../constants/prefix.js';

import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


import { Link } from "react-router-dom";



import {
  	OWNER_DASHBOARD_DATA,
  	RECENT_CLUB_REQUEST
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	dashboarddata:state.owner.dashboarddata,
  	currentUser:state.common.currentUser,
  	clubData: state.common.clubData,
});

const mapDispatchToProps = (dispatch) => ({
	fetchDashboardData: (formData) => {
    	dispatch({ type: OWNER_DASHBOARD_DATA, payload: agent.owner.dashboardData(formData) });
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);
export const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
    },
    legend: {
        display: false
    },
  },
  scales: {
    y: {
       type: 'linear',
       display: true,
       position: 'left',
       beginAtZero: true,
       ticks: {
       	  min: 0,
       	  max:100,
          callback: function(label) {
             return "€"+label
          }
        }
    }
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];

const MainView = (props) => {

	const {fetchDashboardData,dashboarddata,recentclubrequests,currentUser,clubData} = props;

	const [club_id,setClubId] = useState("");
	const [eventGraphData,seteventGraphData] = useState([]);
	const [orderGraphData,setorderGraphData] = useState([]);

	const datee = new Date();

	const current_year = datee.getFullYear();

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);
   
	useEffect(() => {  	
	   if(club_id && club_id != ""){
	   	    let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");
			var formData = {
				club_id : club_id,
				cr_date : cr_date,
			}
			fetchDashboardData(formData);
		}	
  		
  	}, [club_id]) 
  	const [recentclubs,setRecentClubs] = useState([]);

  	useEffect(() => {  		
  		if(dashboarddata){


  			if(dashboarddata && dashboarddata.yearEventData && dashboarddata.yearEventData.length > 0){

  				seteventGraphData(dashboarddata.yearEventData);

  			}else{
  				seteventGraphData([]);
  			}

  			if(dashboarddata && dashboarddata.yearOrderData && dashboarddata.yearOrderData.length > 0){

  				setorderGraphData(dashboarddata.yearOrderData);

  			}else{
  				setorderGraphData([]);
  			}

  		}
  	}, [dashboarddata]) 


  	
  	useEffect(() => {  		
  		if(recentclubrequests){
  			setRecentClubs(recentclubrequests)
  		}
  	}, [recentclubrequests]) 

  	const data = {
	  labels,
	  datasets: [
	    {
	      label: 'Events',
	      data: eventGraphData,
	      borderColor: 'rgb(240, 129, 15)',
	      backgroundColor: 'rgba(240, 129, 15, 0.2)',
	      yAxisID: 'y',
	      fill: true,
	    },
	    {
	      label: 'Orders',
	      data: orderGraphData,
	      borderColor: 'rgb(0, 225, 240)',
	      backgroundColor: 'rgba(0, 225, 240, 0.2)',
	      yAxisID: 'y',
	      fill: true,
	    },
	  ],
	};


	return (
		<Fragment>
			<section className="dashobard-main-sec">
				<Container fluid>
					<Row>
			        	<Col>
			        	   
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="orange-back icons-back"><Image src={hth} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata && dashboarddata.totalSeats)?dashboarddata.totalSeats:0}</h4>
				        				<p>Total Seats</p>
				        			</div>
				        		</div>
			        		
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/owner/events">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="skyblue-back icons-back"><Image src={event} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata && dashboarddata.totalUpcomingEvent)?dashboarddata.totalUpcomingEvent:0}</h4>
				        				<p>Upcomming Events</p>
				        			</div>
				        		</div>
			        		</Link>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/owner/promotions">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="pink-back icons-back"><Image src={switch1} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata && dashboarddata.totalPromotion)?dashboarddata.totalPromotion:0}</h4>
				        				<p>Promotions</p>
				        			</div>
				        		</div>
			        		</Link>
			        	</Col>
			        	
			        	<Col>
			        	    <Link className="text-white" to="/owner/earnings">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="purple-back icons-back"><Image src={money} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>€{(dashboarddata && dashboarddata.totalEarning)?dashboarddata.totalEarning:0}</h4>
				        				<p>Total Earnings</p>
				        			</div>
				        		</div>
			        		</Link>
			        	</Col>
			      	</Row>
			    </Container>
			</section>

			<section className="dashobard-revenue-sec">
				<Container fluid>
					<Row>

					    <Col lg={6} className="d-flex">
			        		<div className="upcoming-event-outer left-side-graph d-flex">
			        			<h5 className="d-flex align-items-lef justify-content-between mb-0 ">Revenue</h5>
			        			<p className="ml-30px mt-1"><span className="rev-box ads-color"></span> Events</p>
			        			<p className="ml-10px mt-1"><span className="rev-box sub-color"></span> Orders</p>
			        			
			        		</div>
			        		
			        	</Col>
			        	<Col lg={6}>
			        		<div className="upcoming-event-outer1 right-side-graph d-flex justify-content-end">
			        			<div className="select-arrow1 g-type ml-10px">
								    <Form.Select >

								        <option value=''>Year</option>
                                       	
								    </Form.Select>
								    <FaAngleDown />
							    </div>
							    <div className="select-arrow1 year-type ml-10px">
								    <Form.Select >
								        <option value=''>{current_year}</option>
								    </Form.Select>
								    <FaAngleDown />
							    </div>
			        		</div>
			        	</Col>
			        	
			      	</Row>
			      	<hr />
			      	<Row>
					    
			        	<Col lg={12}>
			        		<div className="revenue-outer">
			        		    <Line options={options} data={data} width="900" height="300"  />
			        		</div>
			        	</Col>
			        	
			      	</Row>
			    </Container>
			</section>

			<section className="upcoming-event-sec recentclub ">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        		<div className="upcoming-event-outer">
			        			<h5 className="d-flex align-items-center justify-content-between mb-0">Upcoming Events <Link to="/owner/events">View All</Link></h5>
			        			<hr />
			        		</div>
			        	</Col>
			        	{ (dashboarddata && dashboarddata.upcommingEventData && dashboarddata.upcommingEventData.length > 0 )?
								    dashboarddata.upcommingEventData.map(function(eventdata,index){

								    	    var event_image = eventimg1;

								    	    console.log(eventdata)

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
						        	<span>No  upcoming events found!</span>
							    </div>   
							</Col> 
						}	        	
			        	
			      	</Row>
			    </Container>
			</section>
		</Fragment>
	);
    
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);