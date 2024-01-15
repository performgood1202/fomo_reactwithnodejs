import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { useNavigate,Link,useParams} from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import Loader from "../../Loader";
import  "./style.scss";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FileUploader } from "react-drag-drop-files";
import { 
	ADMIN_CLEAR_MESSAGES, 
	FETCH_PROMOTION_DETAIL,
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
    	dispatch({ type: FETCH_PROMOTION_DETAIL, payload: agent.admin.fetchPromotionDetail(formData) });
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const CreateMain = (props) => {	
	const {currentUser,fetchPromotionDetail,promotionDetail, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg, createPromotion} = props;

	let promotion_id;

	const params = useParams();

	if(params.id !== undefined){
		promotion_id = params.id;
	}


	const formRef = useRef();
	const [club_name, setClubName] = useState('');
	const [title, setTitle] = useState('');
	const [start_date, setStartDate] = useState('');
	const [end_date, setEndDate] = useState('');
	const [start_time, setStartTime] = useState('');
	const [end_time, setEndTime] = useState('');
	const [hours, setHours] = useState('');
	const [price, setPrice] = useState('');
	const [position, setPosition] = useState('');
	const [show, setShow] = useState(true);
	const [showAlert, setAlert] = useState(false);
	const [resClass, setResClass] = useState('');
	const [alertMsg, setAlertMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [cardNumber, setCardNo] = useState('');
	const [cardExpiry, setCardExpiry] = useState('');
	const [cardCvv, setCvv] = useState('');
	const [cardName, setCname] = useState('');
	const [disableSubmit, setSubmit] = useState(false);
	const [errMsg, setErr] = useState('');

	const [promotionDate, setpromotionDate] = useState("");
	const [promotionInputDate, setpromotionInputDate] = useState("");

	let navigate = useNavigate();

	

	const [promotionImage, setpromotionImage] = useState(null);
	


  	useEffect(() => {  		
		if(promotion_id){

			var formData = {
				promotion_id:promotion_id,
			}
			fetchPromotionDetail(formData);
		}
  		
  	}, [promotion_id])

  	const handleChangeDate = (e) => {

		setpromotionDate(e);
		setpromotionInputDate(moment(e).format("DD MMMM YYYY"));
	};
	
	

	useEffect(() => {
		if(promotionDetail){
			if(promotionDetail.promotion.title){
				setTitle(promotionDetail.promotion.title);
			}else{
				setTitle("");
			}
			if(promotionDetail.club.name){
				setClubName(promotionDetail.club.name);
			}else{
				setClubName("");
			}
			if(promotionDetail.promotion.promotionStartDate){
				setStartDate(moment(promotionDetail.promotion.promotionStartDate).utc().format("DD MMMM YYYY"));
			}else{
				setStartDate("");
			}
			if(promotionDetail.promotion.promotionEndDate){
				setEndDate(moment(promotionDetail.promotion.promotionEndDate).utc().format("DD MMMM YYYY"));
			}else{
				setEndDate("");
			}
			if(promotionDetail.promotion.promotionStartDate){
				setStartTime(moment(promotionDetail.promotion.promotionStartDate).utc().format("HH:mm"));
			}else{
				setStartTime("");
			}
			if(promotionDetail.promotion.promotionEndDate){
				setEndTime(moment(promotionDetail.promotion.promotionEndDate).utc().format("HH:mm"));
			}else{
				setEndTime("");
			}
			
			setHours(promotionDetail.promotion.hours + "hrs");
			setPrice("€"+promotionDetail.promotion.price);
			setPosition(promotionDetail.promotion.position);
			setpromotionInputDate(moment(promotionDetail.promotion.promotionDate).format("DD MMMM YYYY"));
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
									        			<Form.Label>Club name</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            name="title"
				                                            defaultValue={club_name}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Promotion Title</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            name="title"
				                                            defaultValue={title}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        </Row>	
									        <Row className="mb-3">
									        	
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>Start date</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={start_date}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>Start time</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={start_time}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>End date</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={end_date}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>End time</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={end_time}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
									        		
									        </Row>
									        <Row>
									            <Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>Total time</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            defaultValue={hours}
				                                            required
				                                            readOnly
				                                        />
									        		</div>
									        	</Col>
								        	    <Col lg={3}>
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