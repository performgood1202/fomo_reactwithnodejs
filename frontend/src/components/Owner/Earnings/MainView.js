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
import DataTable from 'react-data-table-component';
import profile from "../../../assets/images/avtar.jpg";


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
  	OWNER_EARNING_DATA,
} from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	earningData:state.owner.earningData,
});

const mapDispatchToProps = (dispatch) => ({
	fetchEarningData: () => {
    	dispatch({ type: OWNER_EARNING_DATA, payload: agent.owner.fetchEarningData() });
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


	const [eventGraphData,seteventGraphData] = useState([]);
	const [orderGraphData,setorderGraphData] = useState([]);

	const [orderData,setorderData] = useState([]);
	const [pending, setPending] = useState(false);
   
	useEffect(() => {  		
  		fetchEarningData();
  	}, []) 

  	useEffect(() => {  		
  		if(earningData){


  			if(earningData && earningData.yearEventData && earningData.yearEventData.length > 0){

  				seteventGraphData(earningData.yearEventData);

  			}else{
  				seteventGraphData([]);
  			}

  			if(earningData && earningData.yearOrderData && earningData.yearOrderData.length > 0){

  				setorderGraphData(earningData.yearOrderData);

  			}else{
  				setorderGraphData([]);
  			}

  			if(earningData.orderEarningData){
  				let orderEarningData = earningData.orderEarningData;
  				orderEarningData.forEach((orders, index) => { orders.serial = index + 1; });
  				setorderData(orderEarningData)
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

	const datee = new Date();

	const current_year = datee.getFullYear();

	const columns = [
	    {
	    	id:"sno",
	        name: 'S.no',
	        width: '10%',
	        cell: (row, index) => {
	        	return ('0' + row.serial ).slice(-2);
	        }
	    },
	    {
            id:"name",
	        name: 'Name',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
			        	<Link to={"/owner/order/bill/"+row.event_id+"/"+row.booking._id}> 
                            <div className="d-flex menu-name-column">
							   <Image src={(row.customer.profileImage)?row.customer.profileImage:profile} />
							   <span className="text-white">{row.customer.fName} {row.customer.lName}</span>
							</div>
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"order_no",
	        name: 'Order no.',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	    { (row.orderData && row.orderData.orders && row.orderData.orders.length > 0)? row.orderData.orders.map((orderD, indexInner)=>{

				                	    let activeOrderClass = "";


				                	    return (
				                	    	<Fragment key={indexInner}>
				                	    	   <Link to={"/owner/order/bill/"+row.event_id+"/"+row.booking._id}> 
				                	    	      <span className="orderno">#{orderD.order_id}</span>
				                	    	   </Link>
				                	    	</Fragment>
				                	   	)

									})

				                   :''
		                    }
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"table_no",
	        name: 'Table no.',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	    <div>{(row && row.booking.table_no)? row.booking.table_no :''}</div>
					</Fragment>
		        )
		    }
	    },
	    {
	    	id:"bill",
	        name: 'Bill',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	   <span>€{row.orderData.order_total_price}</span>
					</Fragment>
		        )
		    },
	    },
	];



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
			        				<h4>€{(earningData)?earningData.totalEarning.toLocaleString():0}</h4>
			        				<p>Total Earnings</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/owner/earnings/event">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">
				        			<div className="left-icons-outer">
				        				<span className="skyblue-back icons-back"><Image src={switch1} /></span>
				        			</div>
				        			<div className="right-content-outer">
				        				<h4>€{(earningData)?earningData.eventEarning.toLocaleString():0}</h4>
				        				<p>From Events</p>
				        			</div>
				        		</div>
			        		</Link>
			        	</Col>
			        	<Col>
			        	    <Link className="text-white" to="/owner/earnings/order">
				        		<div className="blue-back icons-dash-back d-flex align-items-center">

					        			<div className="left-icons-outer">
					        				<span className="pink-back icons-back"><Image src={switch1} /></span>
					        			</div>
					        			
					        			<div className="right-content-outer">
					        			    
						        				<h4>€{(earningData)?earningData.orderEarning.toLocaleString():0}</h4>
						        				<p>From Orders</p>
					        				
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
			        		    <Line options={options} data={data} width="900" height="300" />
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
			        			<h5 className="d-flex align-items-center justify-content-between mb-0 ">Order Payments <Link to="/owner/earnings/order">Show All</Link></h5>
			        			<hr />
			        		</div>
			        	</Col>
			        	<Col lg={12}>
			        		<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={orderData}
						            progressPending={pending}
						        />
						    </div> 
			        	</Col>
			      	</Row>
			    </Container>
			</section>
		</Fragment>
	);
    
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);