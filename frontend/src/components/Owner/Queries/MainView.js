import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form,Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck} from 'react-icons/ai';

import DataTable from 'react-data-table-component';

import { useNavigate,Link } from "react-router-dom";




import {
  	CLEAR_MESSAGES,
  	FETCH_QUERIES,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	queryData: state.query.queryData,
  	currentUser: state.common.currentUser,
  	errMessage: state.query.errMessage,
});

const mapDispatchToProps = (dispatch) => ({
	fetchQueries: () => {
    	dispatch({ type: FETCH_QUERIES, payload: agent.owner.fetchQueries() });
  	},
    clearMessages: () => {
        dispatch({ type: CLEAR_MESSAGES });
    }
});
const redirectRow = (row,event,navigate) => {

	if(row._id != undefined){
        navigate('/admin/plan/'+row._id);
	}
}

const renderStatus = (row)=> {

		switch (row.status) {
		    case "0":
			    return (
			    	<Fragment>
			    	   <span className="orange-back bk-tag">Incomplete</span>
			    	</Fragment>
			    )	
			    break;
		    case "1":
			    return (
			    	<Fragment>
			    	   <span className="green-back bk-tag">Resolved</span>
			    	</Fragment>
			    )
			    break; 
		}
}
const MainView = (props) => {

	const {currentUser,queryData,fetchQueries,clearMessages,errMessage} = props;

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
			        	<Link to={"/owner/query/"+row._id}>
							{row.name}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"type",
	        name: 'Type',
	        selector: row => (row.query_type)?row.query_type:'',
	    },
	    {
	    	id:"user",
	        name: 'User',
	        selector: row => (row.user_type)?row.user_type:'',
	    },
	    {
	    	id:"status",
	    	width: "30%",
	        name: 'Status',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
		        	    <div>{(row && row.status)? renderStatus(row) :''} </div>
					</Fragment>
		        )
	        	
		    },
	    }
	];
	

	const [newmodalshow,setNewModalShow] = useState(false);
	const [queries,setQueries] = useState(false);


	useEffect(() => {  		
		if(currentUser && currentUser._id){
			clearMessages();
			fetchQueries();
		}
  		
  	}, [currentUser]) 
  	useEffect(() => {  	
  	   if(queryData){
  	    	setQueries(queryData);
  	   }	
  		
  	}, [queryData]) 

  



	return (
		<Fragment>
			<section className="setting-sec">
				<Container fluid>
				    {errMessage ? <Badge bg="danger">{errMessage}</Badge> : <Fragment /> }
			      <Row>
			        <Col lg={12}>
				        <div className="setting-outer mt-4">
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={queries}
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