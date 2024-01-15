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
  	FETCH_ORDERS_EARNINGS,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	orderEarningData: state.owner.orderEarningData,
  	errorMsg: state.owner.errorMsg,
  	clubData: state.common.clubData,
});

const mapDispatchToProps = (dispatch) => ({
	fetchOrderEarnings: () => {
    	dispatch({ type: FETCH_ORDERS_EARNINGS, payload: agent.owner.fetchOrderEarnings() });
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
const OwnerOrderEarnings = (props) => {

	const {promotionData,clubData,fetchOrderEarnings,orderEarningData,errorMsg,clearMessage} = props;

	const [club_id,setClubId] = useState("");

	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");

  

	let navigate = useNavigate();


	let  a = 0;

	

	const columns = [
	    {
            id:"customer",
	        name: 'Customer',
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


	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);


	const [OrderEarnings,setOrderEarnings] = useState([]);

	


	useEffect(() => { 

			fetchOrderEarnings();
  		
  	}, []) 

  	useEffect(() => {  		
  		if(orderEarningData){
  			orderEarningData.forEach((earnings, index) => { earnings.serial = index + 1; });
  			setIsLoading(false);
  			setOrderEarnings(orderEarningData);
  		}
  	}, [orderEarningData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setIsLoading(false);
        	clearMessage();
        	setOrderEarnings([]);
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
						            data={OrderEarnings}
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

export default connect(mapStateToProps, mapDispatchToProps)(OwnerOrderEarnings);