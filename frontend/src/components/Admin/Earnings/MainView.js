import React, { useEffect,useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Image, Button, NavLink, Form} from 'react-bootstrap';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import hth from "../../../assets/images/hth.png";
import event from "../../../assets/images/event.png";
import money from "../../../assets/images/money.png";
import switch1 from "../../../assets/images/switch.png";
import revenue from "../../../assets/images/revenue.png";
import eventimg1 from "../../../assets/images/eventimg1.png";


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
} from 'chart.js';
import { Line } from 'react-chartjs-2';



import {
  	ADMIN_EARNING_DATA,
  	RECENT_CLUB_REQUEST
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	earningData:state.admin.earningData,
  	recentclubrequests:state.club.recentclubrequests,
});

const mapDispatchToProps = (dispatch) => ({
	fetchEarningData: () => {
    	dispatch({ type: ADMIN_EARNING_DATA, payload: agent.admin.fetchEarningData() });
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

	const {fetchEarningData,earningData,recentClubRequestsFunction,recentclubrequests} = props;


	const [subGraphData,setsubGraphData] = useState([]);
	const [promotionGraphData,setpromotionGraphData] = useState([]);
   
	useEffect(() => {  		
  		fetchEarningData();
  	}, []) 

  	useEffect(() => {  		
  		if(earningData){


  			if(earningData && earningData.yearDataSub && earningData.yearDataSub.length > 0){

  				setsubGraphData(earningData.yearDataSub);

  			}else{
  				setsubGraphData([]);
  			}

  			if(earningData && earningData.yearDataPromotion && earningData.yearDataPromotion.length > 0){

  				setpromotionGraphData(earningData.yearDataPromotion);

  			}else{
  				setpromotionGraphData([]);
  			}

  		}
  	}, [earningData]) 
  	const [recentclubs,setRecentClubs] = useState([]);


  	useEffect(() => {  		
  		if(recentclubrequests){
  			setRecentClubs(recentclubrequests)
  		}
  	}, [recentclubrequests]) 


  	const data = {
	  labels,
	  datasets: [
	    {
	      label: 'Ads',
	      data: promotionGraphData,
	      borderColor: 'rgb(240, 129, 15)',
	      backgroundColor: 'rgba(240, 129, 15, 0.2)',
	      yAxisID: 'y',
	      fill: true,
	    },
	    {
	      label: 'Subscriptions',
	      data: subGraphData,
	      borderColor: 'rgb(0, 225, 240)',
	      backgroundColor: 'rgba(0, 225, 240, 0.2)',
	      yAxisID: 'y',
	      fill: true,
	    },
	  ],
	};

	const datee = new Date();

	const current_year = datee.getFullYear();



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
			        				<h4>€{(earningData)?earningData.total_earnings.toLocaleString():0}</h4>
			        				<p>Total Earnings</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="skyblue-back icons-back"><Image src={switch1} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>€{(earningData)?earningData.total_promotion_earning.toLocaleString():0}</h4>
			        				<p>From ads</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="pink-back icons-back"><Image src={switch1} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>€{(earningData)?earningData.total_subscription_earning.toLocaleString():0}</h4>
			        				<p>From subscriptions</p>
			        			</div>
			        		</div>
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
			        			<p className="ml-30px mt-1"><span className="rev-box ads-color"></span> Ads</p>
			        			<p className="ml-10px mt-1"><span className="rev-box sub-color"></span> Subscriptions</p>
			        			
			        		</div>
			        		
			        	</Col>
			        	<Col lg={6}>
			        		<div className="upcoming-event-outer1 right-side-graph d-flex justify-content-end">
			        			<div class="select-arrow1 g-type ml-10px">
								    <Form.Select >
								        <option value=''>Year</option>
                                       	
								    </Form.Select>
								    <FaAngleDown />
							    </div>
							    <div class="select-arrow1 year-type ml-10px">
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
			    </Container>
			</section>

			<section className="upcoming-event-sec recentclub darkblue-sec">
				<Container fluid>
					<Row>
			        	<Col lg={12}>
			        		<div className="upcoming-event-outer">
			        			<h5 className="d-flex align-items-center justify-content-between mb-0 ">Recent Payments <Link to="/admin/payments">Show All</Link></h5>
			        			<hr />
			        		</div>
			        	</Col>
			        	{ (earningData && earningData.recent_payments && earningData.recent_payments.length > 0 )?
								    earningData.recent_payments.map(function(recent_payment,j){

								    	
											return(
												<Fragment key={j}>
													{(recent_payment.club && recent_payment.club._id)?
											        	<Col lg={6} >
											        	    
											        	    <Link to={"/admin/club/"+recent_payment.club._id}>
												        		<div className="upcoming-event-boxes">
												        			<div className="img-club-outer">
												        				<Image src={eventimg1} />
												        			</div>
												        			<div className="upcoming-inner-boxes">
													        			<h5>{recent_payment.club.name}</h5>
													        			<p>
													        			 {(recent_payment.club && recent_payment.payment.payment_type == "subscription")? 'Subscription':(recent_payment.club && recent_payment.payment.payment_type == "promotion")?'Ads':''}
													        			</p>
													        			<h5 className="payment_price">€{recent_payment.payment.price}</h5>
													        		</div>
												        		</div>
											        		</Link>
											        	</Col>
										        	:''}
									        	</Fragment>
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