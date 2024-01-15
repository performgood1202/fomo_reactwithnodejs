import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import { BsTelephone } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { useNavigate,Link } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import { GET_STAFF,AFTER_STAFF_SAVE } from "../../../constants/actionTypes";

import { prefix } from './../../../constants/prefix.js';

const mapStateToProps = (state) => ({
  	...state,
  	staff_members: state.staff.staff_members,
  	currentUser: state.common.currentUser,
  	clubData: state.common.clubData,
  	errorMsg: state.staff.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({ 
	fetchStaffData: (formData,role) => {
		if(role == "2"){
            dispatch({ type: GET_STAFF, payload: agent.managerStaff.staffData(formData,"owner") });
		}else{
			dispatch({ type: GET_STAFF, payload: agent.managerStaff.staffData(formData,"manager") });
		}
    	
  	},clearMessage: () => {
        dispatch({ type: AFTER_STAFF_SAVE });
    }
});

const MainView = (props) => {
	const {fetchStaffData,staff_members,clubData,currentUser,errorMsg,clearMessage} = props;
	const [staffData,setStaffData] = useState([]);

	const [club_id,setClubId] = useState("");

	const [searchFilter, setSearchFilter] = useState("");

	const filterData = () => {

		var formData = {
			search: searchFilter,
			shift: shift,
			position: position,
			club_id:clubData._id,
		}
		if(currentUser && currentUser.roleId){
    		fetchStaffData(formData,currentUser.roleId);
    	}
	

		//fetchManagers(formData);

	}

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

	useEffect(() => {  	
	   if(club_id){
			var formData = {
				club_id:club_id
			}
			if(currentUser && currentUser.roleId){
        		fetchStaffData(formData,currentUser.roleId);
        	}
		}	
  	}, [club_id]);

  	useEffect (() => {
  		if(staff_members){
  			setStaffData(staff_members);
  		}
  	}, [staff_members]);

  	const getHiringDate = (date) =>{
  		return moment(date).format("DD MMM YYYY");
  	}

  	let [shift, setShift] = useState('');
	let [position, setPosition] = useState('');

  	const setFilterPosition = (value) => {

		setPosition(value)
		position = value;
        filterData();

	}
	const setFilterShift = (value) => {

		setShift(value)
		shift = value;
        filterData();

	}

	useEffect(() => {
        if (errorMsg) {
        	clearMessage();
        	setStaffData([]);
        }
    }, [errorMsg]);


  	const shifts = ["morning","evening"];
  	const positions = ["Head server","Server","Head chef","Chef"];

	return (
		<Fragment>
			<section className="staff-sec">
				<Container fluid>
			      	<Row>
				        <Col lg={12}>
					        <div className="plans-outer">
					        	<div className="add-row-btn mb-3 mt-3">
					        		<Row>
								        <Col lg={6}>
									        <div className="search-box">
									        	<Form>
											      <Form.Group controlId="formBasicEmail">
										        	<div className="search-btn-outer">
										        		<Form.Control type="text"  onChange={(e) => setSearchFilter(e.target.value)} onKeyUp={(e) => filterData()} placeholder="Search" />
										        		<AiOutlineSearch />
										        	</div>
											       </Form.Group>
											    </Form>
									        </div>
										</Col>
										<Col lg={6}>
											<div className="search-plan-outer text-right staff-filter">
												<div className="select-arrow ml-10px">
												    <Form.Select onChange={ (e) => setFilterPosition(e.target.value) } >
												        <option value=''>Position</option>
		                                                { positions.map((position, index)=>{ 
		                                               		return (
		                                               			<option value={position} key={index}>{position}</option>
		                                               			)
		                                               		})
		                                               	}		
												    </Form.Select>
												    <FaAngleDown />
											    </div>
											    <div className="select-arrow ml-10px">
												    <Form.Select onChange={ (e) => setFilterShift(e.target.value) } >
												        <option value=''>Shift</option>
		                                                { shifts.map((shift, index)=>{ 
		                                               		return (
		                                               			<option value={shift} key={index}>{shift}</option>
		                                               			)
		                                               		})
		                                               	}		
												    </Form.Select>
												    <FaAngleDown />
											    </div>
											    <div className="search-plan-outer text-right ml-10px">
											        <Link to={'/'+prefix[currentUser.roleId]+'/staff/create'}>
														<Button className="custom-btn orange-btn">
														    Add New
														</Button>
													</Link>
													
									        	</div>
												    
								        	</div>
										</Col>
								     </Row>
	                            </div>
	                            <hr />
					        	
							</div>
						</Col>
			      	</Row>
			      	<Row>
			      	{staffData.length > 0
			      		?
			      			staffData.map(function(staff, index) {
			      				return(
			      				<Col lg={3} key={index}>
							        <div className="dataTable">
							            <Link to={"/"+prefix[currentUser.roleId]+"/staff/"+staff._id}>
								        	<div className="darkblue-sec text-center">
								        		<Image src={(staff.image)?staff.image:step3} />
								        		<h4 className="text-capitalize">{staff.first_name} {staff.last_name}</h4>
								        		<p className="text-capitalize">{staff.position}</p>
								        		<div className="team-detials">
								        			<div className="team-detials-inner">
								        				<div className="team-desc text-left">
								        					<p>Shift</p>
								        					<p className="yellow-text text-capitalize">{staff.shift}</p>
								        				</div>
								        				<div className="team-desc text-right">
								        					<p>Hiring Date</p>
								        					<p className="yellow-text">{getHiringDate(staff.hiring_date)}</p>
								        				</div>
								        			</div>
								        			<div className="team-phone-details">
								        			<p><BsTelephone /> {(staff.phone_country_code)?"+"+staff.phone_country_code:''}{staff.phone}</p>
								        			<p><AiOutlineMail /> {staff.email}</p>
								        			</div>
								        		</div>
											</div>
										</Link>	
								    </div>	 
								</Col>
								)
			      			})
			      		:
			      			<Col lg={12}>
						        <div className="dataTable">
						        	<h3>No Data found!</h3>
							    </div>   
							</Col>
			      	}
				  	</Row>
			    </Container>
			</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);