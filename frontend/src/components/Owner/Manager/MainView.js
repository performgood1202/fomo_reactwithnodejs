import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image,Badge } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { useNavigate,Link } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import {ADMIN_CLEAR_MESSAGES, GET_MANAGERS } from "../../../constants/actionTypes";

const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	staff_members: state.staff.staff_members,
  	successMsg: state.owner.successMsg,
  	managerData: state.owner.managerData,
  	errorMsg: state.owner.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({ 
	fetchManagers: (formData) => {
    	dispatch({ type: GET_MANAGERS, payload: agent.owner.fetchManagers(formData) });
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const MainView = (props) => {
	const {fetchManagers,managerData,successMsg,clearMessages,clubData,errorMsg} = props;
	const [managers,setManagers] = useState([]);

	useEffect(() => {
		if(clubData && clubData._id){
			let formData =  {
				clubId:clubData._id,
				search:''
			}
			fetchManagers(formData);
		}
  	}, [clubData]);


  	useEffect (() => {
  		if(managerData){
  			setManagers(managerData);
  		}
  	}, [managerData]);

  	const getHiringDate = (date) =>{
  		return moment(date).format("DD MMM YYYY");
  	}
  	useEffect(() => {
		if(successMsg){
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [successMsg]);

  	const [searchFilter, setSearchFilter] = useState("");

  	const filterData = () => {

		var formData = {
			search: searchFilter,
			clubId:clubData._id,
		}
		clearMessages();

		fetchManagers(formData);

	}
	useEffect(() => {
        if (errorMsg) {
        	clearMessages();
        	setManagers([]);
        }
    }, [errorMsg]);

	return (
		<Fragment>
			<section className="manager-sec">
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
											<div className="search-plan-outer text-right">
												<Link to="/owner/manager/create"><Button className="orange-btn">Add New</Button></Link>
								        	</div>
										</Col>
								     </Row>
	                            </div>
	                            <hr />
	                            {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
							</div>
						</Col>
			      	</Row>
			      	<Row>
			      	{managers.length > 0
			      		?
			      			managers.map(function(manager, index) {
			      				return(
			      				<Col lg={3} key={index}>
							        <div className="dataTable">
							            <Link to={'/owner/manager/'+manager.user._id}>
								        	<div className="darkblue-sec text-center">
								        		<Image src={(manager.user.profileImage)?manager.user.profileImage:step3} />
								        		<h4 class="text-capitalize">{manager.user.fName} {manager.user.lName}</h4>
								        		<p class="text-capitalize">{manager.info.position}</p>
								        		<div className="team-detials">
								        			<div className="team-detials-inner">
								        				<div className="team-desc text-left">
								        					<p>Shift</p>
								        					<p className="yellow-text text-capitalize">{manager.info.shift}</p>
								        				</div>
								        				<div className="team-desc text-right">
								        					<p>Hiring Date</p>
								        					<p className="yellow-text">{getHiringDate(manager.info.hiring_date)}</p>
								        				</div>
								        			</div>
								        			<div className="team-phone-details">
								        			<p><BsTelephone /> {(manager.user.phone_country_code)?"+"+manager.user.phone_country_code:''}{manager.user.phone}</p>
								        			<p><AiOutlineMail /> {manager.user.email}</p>
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