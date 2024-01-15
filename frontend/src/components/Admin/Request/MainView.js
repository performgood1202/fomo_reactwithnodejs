import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck} from 'react-icons/ai';

import DataTable from 'react-data-table-component';

import { useNavigate,Link } from "react-router-dom";

import ActionRequest from "./ActionRequest";



import {
  	FEATCH_CLUB_REQUEST,
  	CLEAR_REQUEST_MESSAGE,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	clubsData: state.club.clubrequests,
  	successMessageClubRequest: state.club.successMessageClubRequest,
    errorMessageClubRequest: state.club.errorMessageClubRequest,
});

const mapDispatchToProps = (dispatch) => ({
	fetchClubRequests: () => {
    	dispatch({ type: FEATCH_CLUB_REQUEST, payload: agent.club.fetchClubRequests() });
  	},
    clearRequestMessage: () => {
        dispatch({ type: CLEAR_REQUEST_MESSAGE });
    }
});
const redirectRow = (row,event,navigate) => {

	if(row._id != undefined){
        navigate('/admin/plan/'+row._id);
	}
}

const MainView = (props) => {

	const {fetchAdminPlans,adminplans,fetchClubRequests,clubsData,successMessageClubRequest,errorMessageClubRequest} = props;

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
			        	<Link to={"/admin/request/"+row._id}>
							{row.name}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"plan",
	        name: 'Plan',
	        selector: row => (row.plan && row.plan.name)?row.plan.name:'',
	    },
	    {
	    	id:"plan_type_month",
	        name: 'Monthly',
	        cell: (row, index) => {

	        	return (
	        		<Fragment>
	        		   <span>
	        		      {(row && row.plan_type && row.plan_type == "0")?<AiOutlineCheck />:''}
	        		   </span>
	        		</Fragment>
	        	)

	        },
	    },
	    {
	    	id:"plan_type_year",
	        name: 'Yearly',
	        cell: (row, index) => {

	        	return (
	        		<Fragment>
	        		   <span>
	        		      {(row && row.plan_type && row.plan_type == "1")?<AiOutlineCheck />:''}
	        		   </span>
	        		</Fragment>
	        	)

	        },
	    },
	    {
	    	id:"action",
	    	width: "30%",
	        name: '',
	        cell: (row, index) => {
	        	return (
	        		<ActionRequest row={row} />
		        )
		    },
	    }
	];
	

	const [newmodalshow,setNewModalShow] = useState(false);
	const [clubs,setclubs] = useState(false);


	useEffect(() => {  		
  		fetchClubRequests();
  	}, []) 
  	useEffect(() => {  	
  	   if(clubsData){
  	    	setclubs(clubsData);
  	   }	
  		
  	}, [clubsData]) 

  



	return (
		<Fragment>
			<section className="setting-sec">
				<Container fluid>
				    {errorMessageClubRequest ? <Badge bg="danger">{errorMessageClubRequest}</Badge> : <Fragment /> }
                    {successMessageClubRequest ? <Badge bg="success">{successMessageClubRequest}</Badge> : <Fragment /> }
			      <Row>
			        <Col lg={12}>
				        <div className="setting-outer mt-4">
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={clubs}
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