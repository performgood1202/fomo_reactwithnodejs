import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem,Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';

import DataTable from 'react-data-table-component';

import { useNavigate,Link, useParams } from "react-router-dom";

import moment from "moment";

import Loader from "../../Loader";

import DeleteClubModal from './DeleteClubModal';


import {
  	FEATCH_CLUB_REQUEST,
  	CLEAR_REQUEST_MESSAGE,
  	FEATCH_CLUB_BY_ID,
  	ADMIN_CLEAR_MESSAGES,
  	PAGE_ATTR,
  	PROMOTIONS_BY_CLUB,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.club.clubData,
  	successMsg: state.club.successMsg,
    errorMsg: state.club.errorMsg,
    successMsgDelete: state.club.successMsgDelete,
    errorMsgDelete: state.club.errorMsgDelete,
    promotionDataByClub: state.admin.promotionDataByClub,
});

const mapDispatchToProps = (dispatch) => ({
	getClubById: (id) => {
    	dispatch({ type: FEATCH_CLUB_BY_ID, payload: agent.club.fetchClubById(id) });
  	},
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    fetchPromotionByClub: (club_id) => {
        dispatch({ type: PROMOTIONS_BY_CLUB,  payload: agent.admin.fetchPromotionByClub(club_id) });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});
const getDate = (date)=> {
	
		return moment(date).format("DD, MMM, YYYY");
}
const renderStatus = (status)=> {
	
		switch (status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="yellow-back bk-tag">INACTIVE</span>
		    	</Fragment>
		    )	
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back bk-tag">ACTIVE</span>
		    	</Fragment>
		    )
		    break;
		  case "2":
		    return (
		    	<Fragment>
		    	   <span className="orange-back bk-tag">DECLINE</span>
		    	</Fragment>
		    )
		    break;  
		}
}
const renderPromotionStatus = (row)=> {

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
		    	   <span className="green-back bk-tag">Live</span>
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

const EditClub = (props) => {

	let {promotionDataByClub,getClubById,club_id,fetchPromotionByClub,clubData,successMsg,errorMsg,successMsgDelete,errorMsgDelete,clearMessage} = props;

	const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("View Club");
		}
  		
  	}, [pageheading]) 

	let [row,setRow] = useState({});

	const [isLoading, setIsLoading] = useState(false);



	let navigate = useNavigate();

	const params = useParams();

	if(params.id !== undefined){
		club_id = params.id;
	}

    const [club,setClubData] = useState("");
    const [clubPhone,setclubPhone] = useState("");


    useEffect(() => {  	
  	   if(club_id){
  	    	getClubById(club_id);
  	    	const roww = {_id:club_id};

  	    	setRow(roww);
  	   }	
  		
  	}, [club_id]) 

    useEffect(() => {  	
  	   if(clubData){
  	   	    
  	    	setClubData(clubData);
  	    	let coutry_code = "";

  	    	if(clubData.phone_country_code){

  	    		coutry_code = "+"+clubData.phone_country_code;
  	    	}


  	    	setclubPhone(coutry_code+clubData.phone);
  	   }	
  		
  	}, [clubData]) 

  	const [deleteclubmodalshow,setDeleteClubModalShow] = useState(false);


  	useEffect(() => {
        if (errorMsg) {
        	//debugger;
           setDeleteClubModalShow(false);

            setTimeout(function(){
                clearMessage();
            },4000);
        }
    }, [errorMsg]);

    useEffect(() => {
        if (errorMsgDelete) {
        	setIsLoading(false);
        	//debugger;
           setDeleteClubModalShow(false);

            setTimeout(function(){
                clearMessage();
            },4000);
        }
    }, [errorMsgDelete]);

    useEffect(() => {
        if (club_id) {
        	fetchPromotionByClub(club_id);
        }
    }, [club_id]);

    useEffect(() => {
        if (successMsgDelete) {
        	setIsLoading(false);
        	//debugger;
           setDeleteClubModalShow(false);
           

            setTimeout(function(){
            	clearMessage();
            	navigate("/admin/club")
                
            },2000);
        }
    }, [successMsgDelete]);

    

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        if (promotionDataByClub) {
        	promotionDataByClub.forEach((promotion, index) => { promotion.serial = index + 1; });
        	setPromotions(promotionDataByClub)
        }
    }, [promotionDataByClub]);

    const promotion_columns = [
        {
	    	id:"sno",
	        name: 'S.no',
	        cell: (row, index) => {
	        	return ('0' + row.serial ).slice(-2);
	        }
	    },
	    {
	    	id:"title",
	        name: 'Title',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<Link to={"/admin/promotion/"+row.promotion._id}>
							{row.promotion.title}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"startdate",
	        name: 'Start Date',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<div>{moment(row.promotion.promotionStartDate).utc().format("DD/MM/YYYY")}</div>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"enddate",
	        name: 'End Date',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<div>{moment(row.promotion.promotionEndDate).utc().format("DD/MM/YYYY")}</div>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"totaltime",
	        name: 'Total Time',
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
		        	    <div>{(row && row.promotion.status)? renderPromotionStatus(row) :''} </div>
					</Fragment>
		        )
		    }
	    },
	];




  



	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="plans-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn text-left mb-3 mt-3 d-flex align-items-center">
				        		<h3 className="mr-10px">{(club && club.name)?club.name:''}</h3>
				        		{(club && club.status)? renderStatus(club.status) :''}	
                            </div>
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Club Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row className="mb-4">
								            <Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Address</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="address"
			                                            value={(club && club.address)?club.address:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Phone</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="phone"
			                                            value={clubPhone}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-4">
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Email</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="email"
			                                            value={(club && club.email)?club.email:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={6}>
								        		<div className="outer-form">
								        			<Form.Label>Website</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            name="website"
			                                            value={(club && club.website)?club.website:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div>
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Subscriptions Details</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form>
								      <Form.Group className="mb-3" controlId="formBasicEmail">
								        <Row className="mb-4">
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscriptions</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.plan && club.plan.name)?club.plan.name:''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscriptions type</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.plan_type && club.plan_type == '0')?'Monthly':(club && club.plan_type && club.plan_type == '1')?'Yearly':''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Number of Months/Years</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value="1"
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								        <Row className="mb-4">
								        	
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscription start date</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.subscription && club.subscription.subscription_start_date)? getDate(club.subscription.subscription_start_date) :''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        	<Col lg={4}>
								        		<div className="outer-form">
								        			<Form.Label>Subscription end date</Form.Label>
								        			<Form.Control 
			                                            type="text" 
			                                            value={(club && club.subscription && club.subscription.subscription_recurring_date)? getDate(club.subscription.subscription_recurring_date) :''}
			                                            readOnly
			                                            required
			                                        />
								        		</div>
								        	</Col>
								        </Row>
								      </Form.Group>
								    </Form>
				        		</div>
                            </div> 
                            <div className="darkblue-sec mt-5 mb-5">
				        		<h5>Promotions</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        		    <div className="dataTable">
							        	<DataTable
								            columns={promotion_columns}
								            data={promotions}
								        />
								    </div>  
					        			
				        		</div>
                            </div> 
                            <div className="darkblue-sec mt-5 mb-5">
                                {(errorMsg || successMsg) ?
	                                <div className="add-row-btn text-center mb-3 mt-3">
						        		{errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
	                                    {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
		                            </div>
		                        :''}  
		                        {(errorMsgDelete || successMsgDelete) ?
	                                <div className="add-row-btn text-center mb-3 mt-3">
						        		{errorMsgDelete ? <Badge bg="danger">{errorMsgDelete}</Badge> : <Fragment /> }
	                                    {successMsgDelete ? <Badge bg="success">{successMsgDelete}</Badge> : <Fragment /> }
		                            </div>
		                        :''}    
	                            <div className="delete_sec">
	                                <Row className="w-100">
	                                   <Col>
	                                        <div className="add-row-btn text-left mb-3 mt-3">
								        		<h5>Delete club</h5>
				                            </div>

	                                   </Col>
	                                   <Col>
	                                        <div className="add-row-btn text-right mb-3 mt-3">
								        		<Button className="custom-btn orange-btn ml-1" type="button" onClick={() => setDeleteClubModalShow(true)}>Delete</Button>
								        		<DeleteClubModal row={row} setIsLoading={setIsLoading} deleteclubmodalshow={deleteclubmodalshow} setDeleteClubModalShow={setDeleteClubModalShow} /> 
				                            </div>
	                                   </Col>
	                                </Row>
					        
		                            
		                        </div>    
                            </div> 
						</div>
					</Col>
			      </Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditClub);