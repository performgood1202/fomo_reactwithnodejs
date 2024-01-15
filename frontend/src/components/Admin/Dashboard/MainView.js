import React, { useEffect,useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, NavLink, Form } from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import hth from "../../../assets/images/hth.png";
import event from "../../../assets/images/event.png";
import money from "../../../assets/images/money.png";
import switch1 from "../../../assets/images/switch.png";
import revenue from "../../../assets/images/revenue.png";
import eventimg1 from "../../../assets/images/eventimg1.png";

import moment from "moment";


import { Link } from "react-router-dom";


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
  ArcElement
} from 'chart.js';
import { Line,Doughnut } from 'react-chartjs-2';


import {
  	ADMIN_DASHBOARD_DATA,
  	RECENT_CLUB_REQUEST
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	dashboarddata:state.admin.dashboarddata,
  	recentclubrequests:state.club.recentclubrequests,
});

const mapDispatchToProps = (dispatch) => ({
	fetchDashboardData: (formData) => {
    	dispatch({ type: ADMIN_DASHBOARD_DATA, payload: agent.admin.dashboardData(formData) });
  	},recentClubRequestsFunction: () => {
    	dispatch({ type: RECENT_CLUB_REQUEST, payload: agent.admin.recentClubRequest() });
  	}
});
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
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

	const {fetchDashboardData,dashboarddata,recentClubRequestsFunction,recentclubrequests} = props;

	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");
   
	useEffect(() => {  	
	    let formData = {
	    	cr_date : cr_date
	    }	
  		fetchDashboardData(formData);
  		recentClubRequestsFunction();
  	}, []) 
  	const [recentclubs,setRecentClubs] = useState([]);
  	const [yearDataEarning,setyearDataEarning] = useState([]);
  	let [totalAds,settotalAds] = useState(0);
  	let [upcommingAds,setupcommingAds] = useState(0);
  	let [ongoingAds,setongoingAds] = useState(0);


  	
  	useEffect(() => {  		
  		if(recentclubrequests){
  			setRecentClubs(recentclubrequests)
  		}
  	}, [recentclubrequests]) 

  	useEffect(() => {  		
  		if(dashboarddata){
  			if(dashboarddata && dashboarddata.yearDataEarning && dashboarddata.yearDataEarning.length > 0){

  				setyearDataEarning(dashboarddata.yearDataEarning);

  			}else{
  				setyearDataEarning([]);
  			}
  			if(dashboarddata && dashboarddata.totalAds){
  				totalAds = dashboarddata.totalAds;

  				settotalAds(dashboarddata.totalAds);
  				setupcommingAds(dashboarddata.upcommingAds);
  				setongoingAds(dashboarddata.ongoingAds);

  			}else{
  				settotalAds(0);
  				setupcommingAds(0);
  				setongoingAds(0);
  			}

  		}
  	}, [dashboarddata]) 




  	const data = {
	  labels,
	  datasets: [
	    {
	      label: '',
	      data: yearDataEarning,
	      borderColor: 'rgb(205, 175, 255)',
	      backgroundColor: 'rgba(205, 175, 255, 0.2)',
	      fill: true,
	    }
	  ],
	};

	const datee = new Date();

	const current_year = datee.getFullYear();

	const plugins2 = [{
     beforeDraw: function(chart) {
      var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
          ctx.restore();
          var fontSize = (height / 160).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.fillStyle = "#fff";
          ctx.textBaseline = "top";
          var text = totalAds +" Ads",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = (height / 2) - 10;
          ctx.fillText(text, textX, textY);
          ctx.save();
     } 
   }]



	const data2 = {
		  labels: ['Ongoing' , 'Upcoming'],
		  datasets: [
		    {
		      label: 'Total Ads',
		      data: [ongoingAds,upcommingAds],
		      backgroundColor: [
		        'rgb(240, 129, 15)',
		        'rgb(0, 153, 255)',
		      ],
		      borderWidth: 0,
		    },
		  ],
		};

	  const options2 = {
	    tooltips: {
	      callbacks: {
	        label: function(tooltipItem, data) {
	          var dataset = data.datasets[tooltipItem.datasetIndex];
	          var index = tooltipItem.index;
	          return dataset.labels[index] + ': ' + dataset.data[index];
	        },
	      }
	    },
	    responsive: true,
		plugins: {
		    legend: {
		        display: false
		    },
		},
	    tooltips: {
	        callbacks: {
	           label: function(tooltipItem) {
	                  return tooltipItem.yLabel;
	           }
	        }
	    }

	}



	return (
		<Fragment>
			<section className="dashobard-main-sec">
				<Container fluid>
					<Row>
			        	<Col>
			        	    <Link className="text-white" to="/admin/club">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="orange-back icons-back"><Image src={hth} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata)?dashboarddata.totalClub:0}</h4>
				        				<p>Total Clubs</p>
				        			</div>
				        		</div>
			        		</Link>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/admin/club">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="skyblue-back icons-back"><Image src={switch1} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata)?dashboarddata.activeClub:0}</h4>
				        				<p>Active Clubs</p>
				        			</div>
				        		</div>
				        	</Link>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/admin/club">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="pink-back icons-back"><Image src={switch1} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata)?dashboarddata.inactiveClub:0}</h4>
				        				<p>Inactive Clubs</p>
				        			</div>
				        		</div>
				        	</Link>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/admin/club">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="green-back icons-back"><Image src={switch1} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>{(dashboarddata)?dashboarddata.declineClub:0}</h4>
				        				<p>Decline Clubs</p>
				        			</div>
				        		</div>
				        	</Link>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/admin/earnings">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="purple-back icons-back"><Image src={money} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>€{(dashboarddata)?dashboarddata.total_earnings.toLocaleString():0}</h4>
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
					    
			        	<Col lg={9}>
			        		<div className="revenue-outer">
			        		    <Row>

								    <Col lg={6} className="d-flex">
						        		<div className="upcoming-event-outer left-side-graph d-flex">
						        			<h5 className="d-flex align-items-lef justify-content-between mb-0 ">Revenue</h5>
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
						        		    <Line options={options} data={data} />
						        		</div>
						        	</Col>
						        	
						      	</Row>
			        		</div>
			        	</Col>
			        	<Col lg={3}>
			        		<div className="revenue-outer">
			        		    <Row>

								    <Col lg={12} className="d-flex">
						        		<div className="upcoming-event-outer left-side-graph d-flex">
						        			<h5 className="d-flex align-items-lef justify-content-between mb-0 ">Promotions</h5>
						        		</div>
						        		
						        	</Col>
						      	</Row>
						      	<hr />
						      	{(totalAds != '')?
						      	    <Fragment>
								      	<Row className="mt-5 mb-5">

										    <Col lg={12} className="d-flex">
					        			      <Doughnut data={data2} options={options2} plugins={plugins2}  />
					        			    </Col>
								      	</Row>   
								      	<Row>

										    <Col lg={6} className="d-flex">
								        		<div className="upcoming-event-outer left-side-graph d-flex">
								        			<p className="ml-30px mt-1"><span className="rev-box ads-color"></span> Upcoming</p>
								        			<p className="ml-10px mt-1"><span className="rev-box sub-color"></span> Ongoing</p>
								        			
								        		</div>
								        		
								        	</Col>
								      	</Row>  
							      	</Fragment>
						      	:'No Promotions Exist!'}     
			        		</div>
			        	</Col>
			        	
			      	</Row>
			    </Container>
			</section>

			<section className="upcoming-event-sec recentclub darkblue-sec">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        		<div className="upcoming-event-outer">
			        			<h5 className="d-flex align-items-center justify-content-between mb-0">Recent Requests <Link to="/admin/request">View All</Link></h5>
			        			<hr />
			        		</div>
			        	</Col>
			        	{ (recentclubs.length > 0 )?
								    recentclubs.map(function(recentclub,j){
											return(
									        	<Col lg={6} key={j}>
									        	    <Link to={"/admin/request/"+recentclub._id}>
										        		<div className="upcoming-event-boxes">
										        			<div className="img-club-outer">
										        				<Image src={eventimg1} />
										        			</div>
										        			<div className="upcoming-inner-boxes">
											        			<h5>{recentclub.name}</h5>
											        			<p>{recentclub.address}</p>
											        		</div>
										        		</div>
									        		</Link>
									        	</Col>
									        )
									})
						: '' }	        	
			        	
			      	</Row>
			    </Container>
			</section>
		</Fragment>
	);
    
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);