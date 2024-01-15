import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image,  } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';

import DataTable from 'react-data-table-component';

import Loader from "../../Loader";

import { useNavigate,Link } from "react-router-dom";

import moment from "moment";

import profile from "../../../assets/images/avtar.jpg";



import {
  	ADMIN_CLUB_FETCH,
  	FETCH_EVENTS_EARNINGS,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	eventEarningData: state.owner.eventEarningData,
  	errorMsg: state.owner.errorMsg,
  	clubData: state.common.clubData,
});

const mapDispatchToProps = (dispatch) => ({
	fetchEventEarnings: () => {
    	dispatch({ type: FETCH_EVENTS_EARNINGS, payload: agent.owner.fetchEventEarnings() });
  	},
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const renderStatus = (row)=> {

		switch (row.promotion.status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="orange-back bk-tag">Inactive</span>
		    	</Fragment>
		    )	
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back bk-tag">Active</span>
		    	</Fragment>
		    )
		    break;
		  case "2":
		    return (
		    	<Fragment>
		    	   <span className="pink-back bk-tag">Upcoming</span>
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
const OwnerEventEarnings = (props) => {

	const {promotionData,clubData,fetchEventEarnings,eventEarningData,errorMsg,clearMessage} = props;

	const [club_id,setClubId] = useState("");

	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");

  

	let navigate = useNavigate();


	let  a = 0;

	

	const columns = [
	    {
            id:"event",
	        name: 'Event',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
			        	<Link to={"#"}> 
                            <div className="d-flex menu-name-column">
							   <span className="text-white">{row.event.title}</span>
							</div>
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"booking_price",
	        name: 'Booking Price',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
                       <span className="text-white">€{row.booking.price}</span>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"date",
	        name: 'Date',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	    <div>{(row && row.booking.createdAt)? moment(row.booking.createdAt).format("DD,MMMM,YYYY"):''}</div>
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
		        	   <span>€{row.booking.total_price}</span>
					</Fragment>
		        )
		    },
	    },
	];


	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);


	const [EventEarnings,setEventEarnings] = useState([]);

	


	useEffect(() => { 

			fetchEventEarnings();
  		
  	}, []) 

  	useEffect(() => {  		
  		if(eventEarningData){
  			eventEarningData.forEach((earnings, index) => { earnings.serial = index + 1; });
  			setIsLoading(false);
  			setEventEarnings(eventEarningData);
  		}
  	}, [eventEarningData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setIsLoading(false);
        	clearMessage();
        	setEventEarnings([]);
        }
    }, [errorMsg]);


	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="order-earning-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn mb-3 mt-3">
				        		
                            </div>
                            <hr />
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={EventEarnings}
						            progressPending={pending}
						            pagination
						        />
						    </div>   
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerEventEarnings);