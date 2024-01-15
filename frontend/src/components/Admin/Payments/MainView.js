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
  	ADMIN_PAYMENTS_FETCH,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	paymentsData: state.admin.paymentsData,
  	errorMsg: state.club.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
	fetchPayments: (formData) => {
    	dispatch({ type: ADMIN_PAYMENTS_FETCH, payload: agent.admin.payments(formData) });
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

	const {paymentsData,fetchPayments,successMsg,errorMsg,clearMessage} = props;


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
			        	<Link to={"/admin/payment/"+row.payment._id}>
							{row.club.name}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"payment_type",
	        name: 'Payment Type',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
							<span> 
							   {(row && row.payment.payment_type && row.payment.payment_type == 'subscription')?"Subscription":(row && row.payment.payment_type && row.payment.payment_type == 'promotion')?"Promotion":''}
							</span>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"amount",
	        name: 'Amount',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	    <div>
		        	        €{(row && row.payment.price)? row.payment.price :''}	
						</div>
					</Fragment>
		        )
		    },
	    }
	];
	  

	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);

	const [searchFilter, setSearchFilter] = useState("");
	let [activeFilter, setActiveFilter] = useState(false);
	let [inactiveFilter, setInActiveFilter] = useState(false);
	let [paymentFilter, setPaymentFilter] = useState("");

	const [payments,setPayments] = useState([]);

	const filterData = () => {

		setIsLoading(true);

		var formData = {
			search:searchFilter,
			payment_type:paymentFilter
		}
		clearMessage();

		fetchPayments(formData);

	}
	
	const selectBox = (e) => {

		var value = e.target.value;

		paymentFilter = value;

		setPaymentFilter(value);

        filterData();

	}


	useEffect(() => {  		
		fetchPayments([]);
  	}, []) 

  	useEffect(() => {  		
  		if(paymentsData){
  			paymentsData.forEach((payment, index) => { payment.serial = index + 1; });
  			setIsLoading(false);
  			setPayments(paymentsData);
  		}
  	}, [paymentsData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setPayments([]);
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
											
											<div className="select-arrow">
												<Form.Select aria-label="Default select example" onChange={(e) => selectBox(e)}>
											      <option value="">Payment Type</option>
											      <option value="subscription">Subscription</option>
											      <option value="promotion">Promotion</option>
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
						            data={payments}
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