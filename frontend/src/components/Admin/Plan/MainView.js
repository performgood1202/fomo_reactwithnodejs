import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';

import DataTable from 'react-data-table-component';
import NewPlanModal from './NewPlanModal';

import { useNavigate,Link } from "react-router-dom";

import {
  	ADMIN_PLAN_FETCH,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	adminplans: state.plan.adminplans,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAdminPlans: () => {
    	dispatch({ type: ADMIN_PLAN_FETCH, payload: agent.adminPlan.fetch() });
  	}
});
const redirectRow = (row,event,navigate) => {

	if(row._id != undefined){
        navigate('/admin/plan/'+row._id);
	}
}

const MainView = (props) => {

	let navigate = useNavigate();


	let  a = 0;

	const columns = [
	    {
	    	id:"sno",
	        name: 'S.no',
	        cell: (row, index) => index + 1,
	    },
	    {
            id:"name",
	        name: 'Name',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<Link to={"/admin/plan/"+row._id}>
							{row.name}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"month_price",
	        name: 'Monthly Price',
	        selector: row => "€"+row.month_price,
	    },
	    {
	    	id:"year_price",
	        name: 'Yearly Price',
	        selector: row => "€"+row.year_price,
	    },
	];
	const {fetchAdminPlans,adminplans} = props;

	const [newmodalshow,setNewModalShow] = useState(false);

	const [planslist,setPlanList] = useState([]);


	useEffect(() => {  		
  		fetchAdminPlans();
  	}, []) 

  	useEffect(() => {  		
  		if(adminplans){
  			setPlanList(adminplans);
  		}
  	}, [adminplans]) 


	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn text-right mb-3 mt-3">
				        		<Button className="custom-btn orange-btn" onClick={() => setNewModalShow(true)}><AiFillPlusCircle /> Add New</Button>
                            </div>
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={planslist}
						        />
						    </div>  
						    <NewPlanModal newmodalshow={newmodalshow} setNewModalShow={setNewModalShow} />  
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);