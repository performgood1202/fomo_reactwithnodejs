import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown,Image, NavItem } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineSetting} from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { BsCalendarRangeFill } from 'react-icons/bs';

import DataTable from 'react-data-table-component';

import Loader from "../../Loader";
import event from "../../../assets/images/event.png";
import money from "../../../assets/images/money.png";
import switch1 from "../../../assets/images/switch.png";

import { useNavigate,Link } from "react-router-dom";

import moment from "moment";



import {
  	ADMIN_CLUB_FETCH,
  	FETCH_ADMIN_PROMOTIONS
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	promotionData: state.admin.promotionData,
  	clubData: state.common.clubData,
});

const mapDispatchToProps = (dispatch) => ({
	fetchPromotions: (formData) => {
    	dispatch({ type: FETCH_ADMIN_PROMOTIONS, payload: agent.admin.fetchAdminPromotionsDash(formData) });
  	}
});

const renderEndTime = (promotionDate,hours)=> {

    var promotionDate = new Date(promotionDate);

    promotionDate.setHours(0,0,0,0);

	var promotionTillDate = new Date(promotionDate);

    promotionTillDate.setHours(promotionTillDate.getHours() + hours);

    return moment(promotionTillDate).format("DD/MM/YYYY HH:mm");
}

const submitFormSearch = (e) =>{
		e.preventDefault();
} 
const MainView = (props) => {

	const {promotionData,clubData,fetchPromotions} = props;


	let navigate = useNavigate();


	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");


	let  a = 0;

	

	const columns = [
	    {
	    	id:"clubname",
	        name: 'Club name',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<Link to={"/admin/promotion/"+row.promotion._id}>
							{row.club.name}
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"startdate",
	        name: 'Start Time',
	        cell: (row, index) => {
	        	console.log(row.promotion)
	        	return (
		        	<Fragment>
			        	<div>{moment(row.promotion.promotionStartDate).utc().format("DD/MM/YYYY HH:mm")}</div>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"enddate",
	        name: 'End Time',
	        cell: (row, index) => {
	        	return (
		        	<Fragment>
			        	<div>{moment(row.promotion.promotionEndDate).utc().format("DD/MM/YYYY HH:mm")}</div>
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
	];

	const [isLoading, setIsLoading] = useState(false);
	
	const [newmodalshow,setNewModalShow] = useState(false);

	const [pending, setPending] = useState(false);

	const [searchFilter, setSearchFilter] = useState("");
	let [activeFilter, setActiveFilter] = useState(false);
	let [inactiveFilter, setInActiveFilter] = useState(false);
	let [planFilter, setPlanFilter] = useState("");


	const [activeAds, setactiveAds] = useState(0);
	const [inactiveAds, setinactiveAds] = useState(0);
	const [totalAds, settotalAds] = useState(0);
	const [upcommingAds, setupcommingAds] = useState(0);
	const [upcommingPromotion, setupcommingPromotion] = useState([]);
	const [activePromotion, setactivePromotion] = useState([]);

	

	useEffect(() => {  	

		let formData = {
			cr_date : cr_date
		}

		fetchPromotions(formData);
  		
  	}, []) 

  	useEffect(() => {  		
  		if(promotionData){
  			setIsLoading(false);
  			if(promotionData.upcommingPromotion){
  				setupcommingPromotion(promotionData.upcommingPromotion);
  			}else{
  				setupcommingPromotion([]);
  			}
  			setactiveAds(promotionData.activeAds);
  			setinactiveAds(promotionData.inactiveAds);
  			settotalAds(promotionData.totalAds);
  			setupcommingAds(promotionData.upcommingAds);
  			if(promotionData.activePromotion){
  				setactivePromotion(promotionData.activePromotion);
  			}else{
  				setactivePromotion([]);
  			}

  		}
  	}, [promotionData]) 


	return (
		<Fragment>
		    {isLoading && <Loader /> }
		    <section className="promotion-main-sec mt-3">
				<Container fluid>
					<Row>
			        	<Col>
			        		<div className="icons-dash-back d-flex align-items-center skyblue-back">
			        			<div className="left-icons-outer">
			        				<span className="orange-back icons-back"><Image src={event} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>{totalAds}</h4>
			        				<p>Total Ads</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="orange-back icons-back"><Image src={switch1} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>{activeAds}</h4>
			        				<p>Live Ads</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="skyblue-back icons-back"><Image src={switch1} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>{upcommingAds}</h4>
			        				<p>Upcoming Ads</p>
			        			</div>
			        		</div>
			        	</Col>
			        	<Col>
			        		<div className="blue-back icons-dash-back d-flex align-items-center">
			        			<div className="left-icons-outer">
			        				<span className="pink-back icons-back"><Image src={switch1} /></span>
			        			</div>
			        			<div className="right-content-outer">
			        				<h4>{inactiveAds}</h4>
			        				<p>Inactive Ads</p>
			        			</div>
			        		</div>
			        	</Col>
			        	
			      	</Row>
			    </Container>
			</section>
			<section className="admin-promotions-sec2 mt-4">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer">
				        	<div className="add-row-btn mb-3 mt-3">
				        		<Row>
							        <Col lg={6}>
								        <div className="search-box">
								        	<h5>Live Ads</h5>
								        </div>
									</Col>
									<Col lg={6}>
										<div className="search-plan-outer text-right">
											<div className="search-plan-outer text-right">
												<Link to="/admin/promotion/settings"><Button className="orange-btn"><AiOutlineSetting /> Settings</Button></Link>
								        	</div>
							        	</div>
									</Col>
							     </Row>
                            </div>
                            <hr />
                            <Row className="ads-live-main">
                                {activePromotion.map((activePromo, index)=>{
					        		return(
                                        <Col>
                                            <Link to={"/admin/promotion/"+activePromo.promotion._id}>
										        <div className="darkblue-sec ads-live">
								        			<div className="icon"><BsCalendarRangeFill /></div>
								        			<div className="title">{(activePromo.club && activePromo.club.name)?activePromo.club.name:''}</div>
								        			<div className="desc">{(activePromo.promotion && activePromo.promotion.title)?activePromo.promotion.title:''}</div>
								        			<div className="time"><BiTime /> {activePromo.promotion.hours}hrs</div>
								        		</div>
								        	</Link>	
										</Col>
                                    )
				                })}
								
						    </Row>
						    <div className="darkblue-sec promotion-all mt-5">
			        			<Row>
							        <Col lg={6}>
								        <div className="search-box">
								        	<h5>Upcomming Promotions</h5>
								        </div>
									</Col>
									<Col lg={6}>
										<div className="search-plan-outer text-right">
											<div className="search-plan-outer text-right">
												<Link to="/admin/promotions-history"><Button className="orange-btn">Show All</Button></Link>
								        	</div>
							        	</div>
									</Col>
							    </Row>
							    <hr />
							    <div className="dataTable">
						        	<DataTable
							            columns={columns}
							            data={upcommingPromotion}
							            progressPending={pending}
							        />
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

export default connect(mapStateToProps, mapDispatchToProps)(MainView);