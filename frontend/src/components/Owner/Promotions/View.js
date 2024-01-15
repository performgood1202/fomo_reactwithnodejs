import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Form,  Image, Alert} from 'react-bootstrap';
import { useNavigate,useParams} from "react-router-dom";
import moment from "moment";
import Loader from "../../Loader";
import  "./style.scss";


import { 
	ADMIN_CLEAR_MESSAGES, 
	FETCH_PROMOTION_DETAIL,
	PAGE_ATTR
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];






const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	promotionDetail: state.owner.promotionDetail,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	fetchPromotionDetail: (formData) => {
    	dispatch({ type: FETCH_PROMOTION_DETAIL, payload: agent.owner.fetchPromotionDetail(formData) });
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const CreateMain = (props) => {	
	const {setPageHeading,pageheading,currentUser,fetchPromotionDetail,promotionDetail, clearMessages, clubData, successMsg, errorMsg, createPromotion} = props;
 

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("View Promotion");
		}
  		
  	}, [pageheading]) 

	let promotion_id;

	const params = useParams();

	if(params.id !== undefined){
		promotion_id = params.id;
	}


	const formRef = useRef();
	const [title, setTitle] = useState('');
	const [hours, setHours] = useState('');
	const [price, setPrice] = useState('');
	const [position, setPosition] = useState('');
	const [showAlert, setAlert] = useState(false);
	const [resClass, setResClass] = useState('');
	const [alertMsg, setAlertMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [disableSubmit, setSubmit] = useState(false);
	const [errMsg, setErr] = useState('');

	const [promotionDate, setpromotionDate] = useState("");
	const [promotionInputDate, setpromotionInputDate] = useState("");

	let navigate = useNavigate();

	

	const [promotionImage, setpromotionImage] = useState(null);
	

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	useEffect(() => {  		
		if(club_id && promotion_id){

			var formData = {
				club_id:club_id,
				promotion_id:promotion_id,

			}
			fetchPromotionDetail(formData);
		}
  		
  	}, [club_id,promotion_id])

  	const handleChangeDate = (e) => {

		setpromotionDate(e);
		setpromotionInputDate(moment(e).format("DD MMMM YYYY"));
	};
	
	

	useEffect(() => {
		if(promotionDetail){
			setTitle(promotionDetail.title);
			setHours(promotionDetail.hours);
			setPrice(promotionDetail.price);
			setPosition(promotionDetail.position);
			setpromotionInputDate(moment(promotionDetail.promotionStartDate).utc().format("DD MMMM YYYY"));
		}
  	}, [promotionDetail]);


  	
	

	return (
		<Fragment>
				{isLoading && <Loader /> }
				<section className="create-promotion-sec">
					<Container fluid>
				      <Row>
				        <Col lg={12}>
				           
					        <Form>
					        <div className="plans-outer">
					        	<Row>
					        		<Col lg={6}>
					        			<div className="add-row-btn text-left mb-3 mt-3">
								        	<h4>Promotion Detail</h4>
			                            </div>
					        		</Col>
					        		<Col lg={6}>
						        		
					        		</Col>
					        	</Row>
					        	<hr/>
					        	{(promotionDetail && promotionDetail.promotionImage && promotionDetail.promotionImage != null && promotionDetail.promotionImage != "")?
						        	<Row>
						        	    <Col lg={12}>
						        	       <div className="darkblue-sec mt-5">
							        		<h5>Promotion Image</h5>
							        		<hr />
							        		<div className="outer-form-plan">
							        			<Row>
							        			    <Col lg={3} className="mb-3">
										                  <div className="edit-image-sec">
										                      <Image src={promotionDetail.promotionImage} />
										                  </div>
										            </Col>
	                                            </Row>
							        		</div>
			                            </div>  
						        	    </Col>
						        	</Row>	
					        	:'' }		

	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Promotion Details</h5>
					        		<hr />
					        		{showAlert && 
										<Alert variant={resClass}>
									        <p className="m-0">{alertMsg}</p>
									   	</Alert>
								   	}
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Promotion Title</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            name="title"
				                                            defaultValue={title}
				                                            onChange={ (e) => setTitle(e.target.value) }
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Hours</Form.Label>
									        			<Form.Control 
				                                            type="number" 
				                                            defaultValue={hours}
				                                            onChange={ (e) => setHours(e.target.value) }
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Date</Form.Label>
									        			<div className="date_div">
										        			<Form.Control 
					                                            type="text" 
					                                            value={promotionInputDate}
					                                            readOnly={true}
					                                            required
					                                            readOnly
					                                        />
													    </div>
									        		</div>
									        	</Col>
									        	<Col lg={2}>
									        		<div className="outer-form">
									        			<Form.Label>Position</Form.Label>
									        			<Form.Control 
				                                            type="number" 
				                                            defaultValue={position}
				                                            onChange={ (e) => setPosition(e.target.value) }
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        </Row>
										        <Row>
									        	    <Col lg={4}>
									        	       <Form.Label>Amount paid</Form.Label>
										        			<Form.Control 
					                                            type="text" 
					                                            value={price}
					                                            readOnly={true}
					                                        />
									        	    </Col>
									        	</Row>	
									        
									    </Form.Group>
					        		</div>
	                            </div>  
	                        	
	                        	
							</div>
							</Form>
						</Col>
				      </Row>
				    </Container>
				</section>
		</Fragment>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMain);