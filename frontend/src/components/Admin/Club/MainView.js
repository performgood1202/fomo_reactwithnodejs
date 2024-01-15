import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';

import DataTable from 'react-data-table-component';

import Loader from "../../Loader";

import { useNavigate,Link,useLocation } from "react-router-dom";

import moment from "moment";



import {
  	ADMIN_CLUB_FETCH,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	adminclubs: state.club.adminclubs,
  	successMsg: state.club.successMsg,
  	errorMsg: state.club.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAdminClubs: (formData) => {
    	dispatch({ type: ADMIN_CLUB_FETCH, payload: agent.club.fetch(formData) });
  	},
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const renderStatus = (row)=> {
	
		switch (row.status) {
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
		    	   <span className="pink-back bk-tag">Decline</span>
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

	const {fetchAdminClubs,adminclubs,successMsg,errorMsg,clearMessage} = props;


	let navigate = useNavigate();


	let  a = 0;

	

	const columns = [
	    {
	    	id:"sno",
	        name: 'S.no',
	        cell: (row, index) => {
	        	return ('0' + row.serial ).slice(-2);
	        }
	    },
	    {
            id:"name",
	        name: 'Club name',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<Link to={"/admin/club/"+row._id}>
							{row.name}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"subscription",
	        name: 'Subscriptions',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
		        	    <div>
							<span> 
							  {(row && row.plan && row.plan.name)?row.plan.name:''}
							  <br />
							</span>
							<small> 
							  {(row && row.plan_type && row.plan_type == '0')?"Monthly":(row && row.plan_type && row.plan_type == '1')?"Yearly":''}
							</small>
						</div>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"status",
	        name: 'Status',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	    <div>
		        	        {(row && row.status)? renderStatus(row) :''}	
						</div>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"billing",
	        name: 'Billing cycle',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	    <div>
		        	        {(row && row.subscription && row.subscription.subscription_recurring_date)? getBillingDate(row.subscription.subscription_recurring_date) :''}	
						</div>
					</Fragment>
		        )
		    },
	    },
	];
	  

	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);

	const [searchFilter, setSearchFilter] = useState("");
	let [activeFilter, setActiveFilter] = useState(false);
	let [inactiveFilter, setInActiveFilter] = useState(false);
	let [planFilter, setPlanFilter] = useState("");

	const [clubslist,setClubList] = useState([]);

	const filterData = () => {

		setIsLoading(true);

		var formData = {
			name:searchFilter,
			active: activeFilter,
			inactive: inactiveFilter,
			plan_type:planFilter
		}
		clearMessage();

		fetchAdminClubs(formData);

	}
	const activeBtn = () => {

		if(activeFilter){
			activeFilter = false;
           setActiveFilter(false); 
		}else{
			activeFilter = true;
           setActiveFilter(true); 
		}
        filterData();

	}
	const inactiveBtn = () => {

		if(inactiveFilter){
			inactiveFilter = false;
           setInActiveFilter(false); 
		}else{
			inactiveFilter = true;
           setInActiveFilter(true); 
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
		setClubList([]);
  		fetchAdminClubs();
  	}, []) 

  	useEffect(() => {  		
  		if(adminclubs){
  			adminclubs.forEach((club, index) => { club.serial = index + 1; });
  			setIsLoading(false);
  			setClubList(adminclubs);
  		}
  	}, [adminclubs]) 

  	useEffect(() => {
        if (errorMsg) {
        	setClubList([]);
        	setIsLoading(false);
        	clearMessage();
        }
    }, [errorMsg]);



	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="plans-sec">
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
											<Button type="submit" className={(activeFilter)?"active":""} onClick={(e) => activeBtn()}>Active</Button>
											<Button type="submit" className={(inactiveFilter)?"active":""} onClick={(e) => inactiveBtn()}>Inactive</Button>
											
											<div className="select-arrow">
												<Form.Select aria-label="Default select example" onChange={(e) => selectBox(e)}>
											      <option value="">Subscription plan</option>
											      <option value="0">Monthly</option>
											      <option value="1">Yearly</option>
											    </Form.Select>
											    <FaAngleDown />
											</div>
							        	</div>
									</Col>
							     </Row>
                            </div>
                            <hr />
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={clubslist}
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

export default connect(mapStateToProps, mapDispatchToProps)(MainView);