import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { AiFillPlusCircle, AiFillDelete } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import { FiEdit } from 'react-icons/fi';

import DataTable from 'react-data-table-component';
import NewFeatureModal from './NewFeatureModal';

import EditFeature from "./EditFeature";

import { useNavigate,Link } from "react-router-dom";

import {
  	ADMIN_FEATURE_FETCH,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	adminplans: state.plan.adminplans,
  	adminfeature: state.plan.adminfeature,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAdminFeature: () => {
    	dispatch({ type: ADMIN_FEATURE_FETCH, payload: agent.adminFeature.fetch() });
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
	        name: 'Feature',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<span>
							{row.name}
						</span>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"action",
	        name: '',
	        cell: (row, index) => {
	        	return (
	        		<EditFeature row={row} />
		        )
		    },
	    }
	];
	const {fetchAdminFeature,adminfeature} = props;

	const [newfeaturemodalshow,setNewFeatureModalShow] = useState(false);

	const [featurelist,setFeatureList] = useState([]);


	useEffect(() => {  		
  		fetchAdminFeature();
  	}, []) 

  	useEffect(() => {  		
  		if(adminfeature){
  			setFeatureList(adminfeature);
  		}
  	}, [adminfeature]) 


	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn text-right mb-3 mt-3">
				        		<Button className="custom-btn orange-btn" onClick={() => setNewFeatureModalShow(true)}><AiFillPlusCircle /> Add New</Button>
                            </div>
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={featurelist}
						        />
						    </div>  
						    <NewFeatureModal newfeaturemodalshow={newfeaturemodalshow} setNewFeatureModalShow={setNewFeatureModalShow} />  
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);