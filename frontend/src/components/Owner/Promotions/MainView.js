import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';

import DataTable from 'react-data-table-component';

import Loader from "../../Loader";

import { useNavigate,Link } from "react-router-dom";

import moment from "moment";



import {
  	ADMIN_CLUB_FETCH,
  	FETCH_PROMOTIONS,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	promotionData: state.owner.promotionData,
  	errorMsg: state.owner.errorMsg,
  	clubData: state.common.clubData,
});

const mapDispatchToProps = (dispatch) => ({
	fetchPromotions: (formData) => {
    	dispatch({ type: FETCH_PROMOTIONS, payload: agent.owner.fetchPromotions(formData) });
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
const MainView = (props) => {

	const {promotionData,clubData,fetchPromotions,errorMsg,clearMessage} = props;

	const [club_id,setClubId] = useState("");

	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);


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
	        name: 'Name',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<Link to={"/owner/promotion/"+row.promotion._id}>
							{row.promotion.title}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"time",
	        name: 'Time',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<span>{row.promotion.hours}hrs</span>
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
		        	    <div>{(row && row.promotion.status)? renderStatus(row) :''} </div>
					</Fragment>
		        )
		    }/*,
		    sortFunction: (rowA, rowB) => {
		    	const a = rowA.sort;
			    const b = rowB.sort;

			    if (a > b) {
			        return 1;
			    }

			    if (b > a) {
			        return -1;
			    }

			    return 0;
		    },*/
	    },
	    {
	    	id:"price",
	        name: 'Price',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	   <span>€{row.promotion.price}</span>
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

	const [promotions,setPromotions] = useState([]);

	const filterData = () => {
		clearMessage();

		setIsLoading(true);

		if(club_id && club_id != ""){
			var formData = {
				search:searchFilter,
				active: activeFilter,
				inactive: inactiveFilter,
				club_id : club_id,
				cr_date : cr_date,
			}

			fetchPromotions(formData);
		}

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
		if(club_id){
			var formData = {
				club_id:club_id,
				cr_date : cr_date,
			}
			fetchPromotions(formData);
		}
  		
  	}, [club_id]) 

  	useEffect(() => {  		
  		if(promotionData){
  			promotionData.forEach((promotion, index) => { promotion.serial = index + 1; });
  			setIsLoading(false);
  			setPromotions(promotionData);
  		}
  	}, [promotionData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setIsLoading(false);
        	clearMessage();
        	setPromotions([]);
        }
    }, [errorMsg]);


	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="promotions-sec">
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
											
											<div className="search-plan-outer text-right">
												<Link to="/owner/promotion/create"><Button className="orange-btn">Add New</Button></Link>
								        	</div>
							        	</div>
									</Col>
							     </Row>
                            </div>
                            <hr />
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={promotions}
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