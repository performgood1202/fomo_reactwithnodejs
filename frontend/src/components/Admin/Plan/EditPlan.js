import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck, AiOutlineClose} from 'react-icons/ai';

import DataTable from 'react-data-table-component';
import NewPlanModal from './NewPlanModal';
import ActionFeature from './ActionFeature';

import { useNavigate,Link,useParams } from "react-router-dom";

import {
  	ADMIN_PLAN_DETAIL,
  	ADMIN_FEATURE_FETCH,
  	ADMIN_EDIT_PLAN,
  	ADMIN_PLAN_FEATURE_FETCH,
  	CLEAR_PLAN_MESSAGE,
  	CLEAR_PLAN_DATA,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	adminPlanDetail: state.plan.adminPlanDetail,
  	adminfeature: state.plan.adminfeature,
  	adminplanfeature: state.plan.adminplanfeature,
  	successMessagePlanFeature:  state.plan.successMessagePlanFeature,
  	errorMessagePlanFeature:  state.plan.errorMessagePlanFeature,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAdminPlanDetail: (id) => {
    	dispatch({ type: ADMIN_PLAN_DETAIL, payload: agent.adminPlan.singlefetch(id) });
  	},
  	fetchAdminFeature: () => {
    	dispatch({ type: ADMIN_FEATURE_FETCH, payload: agent.adminFeature.fetch() });
  	},fetchAdminPlanFeature: (planId) => {
    	dispatch({ type: ADMIN_PLAN_FEATURE_FETCH, payload: agent.adminFeature.fetchPlanFeature(planId) });
  	},onSubmit: (formData) => {
    	dispatch({ type: ADMIN_EDIT_PLAN, payload: agent.adminPlan.edit(formData) });
  	},clearPlanMessage: () => {
        dispatch({ type: CLEAR_PLAN_MESSAGE });
    },clearPlanData: () => {
        dispatch({ type: CLEAR_PLAN_DATA });
    }
});

const removeA =  (arr, item) => {
    return arr.filter(f => f !== item)
}


const EditPlan = (props) => {

	let { detail, plan_id, fetchAdminPlanDetail,adminPlanDetail,fetchAdminFeature,adminfeature,adminplanfeature,fetchAdminPlanFeature,onSubmit,successMessagePlanFeature,errorMessagePlanFeature,clearPlanMessage,clearPlanData} = props;

	let navigate = useNavigate();

	const params = useParams();

	const [plan, setPlanDetail] = useState("");
	const [name, setName] = useState("");
	const [month_price, setMonthPrice] = useState("");
	const [year_price, setYearPrice] = useState("");
	const [description, setDescription] = useState("");
	let [plan_feature, setPlanFeature] = useState([]);
	const [featurelist,setFeatureList] = useState([]);
	let [checked,setChecked] = useState(false);

	const [save,setSave] = useState(false);

	if(params.id !== undefined){
		plan_id = params.id;
	}

	const submitBtn =  (e) => {
	     e.preventDefault();
	     const data = {
	     	name: name,
	     	month_price: month_price,
	     	year_price: year_price,
	     	features: plan_feature,
	     	id:plan_id,
	     	description:description
	     }
	     onSubmit(data);
	}; 





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
		        	<ActionFeature setPlanFeature={setPlanFeature} checked={checked} setChecked={setChecked} row={row} save={save} plan_feature={plan_feature}  />
		        )
		    },
	    }
	];




	useEffect(() => {  

		clearPlanData();
  		fetchAdminPlanDetail(plan_id);
  		fetchAdminFeature();
  		fetchAdminPlanFeature(plan_id);
  	}, []) 

  	useEffect(() => {  		
  		if(adminPlanDetail){
  			setName(adminPlanDetail.name);
  			setMonthPrice(adminPlanDetail.month_price);
  			setYearPrice(adminPlanDetail.year_price);
  			setDescription(adminPlanDetail.description);
  			setPlanDetail(adminPlanDetail);
  		}
  	}, [adminPlanDetail]) 

  	useEffect(() => {  		
  		if(adminfeature){
  			setFeatureList(adminfeature);
  		}
  	}, [adminfeature]) 
  	useEffect(() => {  		
  		if(adminplanfeature){
  			var planfeaturess = [];

  			if(adminplanfeature.length > 0){
  				adminplanfeature.forEach(function(value,index){

	  				planfeaturess.push(value.featureId);

	  			});

  			}
  			setPlanFeature(planfeaturess);
  		}else{
  		   setPlanFeature([]);
  		}
  		setChecked(false);
  	}, [adminplanfeature]) 

  	useEffect(() => {
        if (successMessagePlanFeature) {
        	setSave(false)
            setTimeout(function(){
                clearPlanMessage();
            },2000);
        }
    }, [successMessagePlanFeature]);

    useEffect(() => {
        if (errorMessagePlanFeature) {
            setTimeout(function(){
                clearPlanMessage();
            },4000);
        }
    }, [errorMessagePlanFeature]);



	return (
		<Fragment>
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn text-right mb-3 mt-3">
				        	    { (save) ?
				        		   <Button className="custom-btn orange-btn" onClick={submitBtn}>Save</Button>
				        		   :
				        		   <Button className="custom-btn orange-btn" onClick={() => setSave(true)}>Edit</Button>
				        	    }
                            </div>
                            {errorMessagePlanFeature ? <Badge bg="danger">{errorMessagePlanFeature}</Badge> : <Fragment /> }
                            {successMessagePlanFeature ? <Badge bg="success">{successMessagePlanFeature}</Badge> : <Fragment /> }
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Plan Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Plan name</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="name"
			                                            value={name}
			                                            onChange={(e) => setName(e.target.value)}
			                                            readOnly={(save)?false:true}
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Monthly price</Form.Label>
								        			<Form.Control 
			                                            type="number" 
			                                            name="month_price"
			                                            value={month_price}
			                                            onChange={(e) => setMonthPrice(e.target.value)}
			                                            readOnly={(save)?false:true}
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Yearly price</Form.Label>
								        			<Form.Control 
			                                            type="number" 
			                                            name="year_price"
			                                            value={year_price}
			                                            onChange={(e) => setYearPrice(e.target.value)}
			                                            readOnly={(save)?false:true}
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row>
								        	<Col lg={12}>
								        		<div className="outer-form">
								        			<Form.Label>Description</Form.Label>
								        			<Form.Control as="textarea"
			                                            name="description"
			                                            value={description}
			                                            onChange={(e) => setDescription(e.target.value)}
			                                            readOnly={(save)?false:true}
			                                            rows={6}
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>
				        	<div className="dataTable">
					        	<DataTable
					        	    key={plan_id}
						            columns={columns}
						            data={featurelist}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPlan);