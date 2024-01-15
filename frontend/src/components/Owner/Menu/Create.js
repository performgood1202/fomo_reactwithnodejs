import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail,AiOutlinePlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate,Link } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import Loader from "../../Loader";
import  "./style.scss";
import avtarPic from '../../../assets/images/user.png';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { prefix } from './../../../constants/prefix.js';

import { FileUploader } from "react-drag-drop-files";
import { 
	ADMIN_CLEAR_MESSAGES, 
	ADD_MENU,
	PAGE_ATTR
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	addMenu: (formData,role) => {
		if(role == "2"){
            dispatch({ type: ADD_MENU, payload: agent.owner.addMenu(formData) });
		}else{
			dispatch({ type: ADD_MENU, payload: agent.manager.addMenu(formData) });
		}
    	
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const CreateMenu = (props) => {	
	const {currentUser,addMenu, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg, createPromotion} = props;
    
    const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Create Menu");
		}
  		
  	}, [pageheading]) 

	const formRef = useRef();
	let [name, setName] = useState('');
	let [code, setCode] = useState('');
	let [price, setPrice] = useState('');
	let [cuisine, setCuisine] = useState('');
	let [food_type, setFoodType] = useState('');
	let [item_type, setItemType] = useState('');
	let [drink_type, setDrinkType] = useState('');
	let [category, setCategory] = useState("");
	let [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErr] = useState('');


	let navigate = useNavigate();

  	

	const handleSubmit = async (e) => {
		setIsLoading(true);
		e.preventDefault();



        if(club_id && club_id != ""){

        	
        	const formData = new FormData();

        	if(item_type == "Drink"){

        		cuisine = '';
        		food_type = '';
        		category = '';
        		
        	}else{
        		drink_type = '';
        	}
        	
    		formData.append("name", name);
	        formData.append("code", code);
	        formData.append("price", price);
	        formData.append("cuisine", cuisine);
	        formData.append("food_type", food_type);
	        formData.append("item_type", item_type);
	        formData.append("drink_type", drink_type);
	        formData.append("category", category);
	        formData.append("menuImage", menuImage);
        	formData.append("club_id", club_id);
        	if(currentUser && currentUser.roleId){
        		addMenu(formData,currentUser.roleId);
        	}
	        
        	
        }
		
    	
    	setTimeout(() => {
    		clearMessages();
    	}, 3000);
	}

	const [menuImage, setmenuImage] = useState(null);
	const handleChangeMenuImage = (file) => {
	   setmenuImage(file);
	};

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);

  	useEffect(() => {
		if(errorMsg){
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [errorMsg]);

  	useEffect(() => {
		if(successMsg){
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
			navigate("/"+prefix[currentUser.roleId]+"/menu");
		}
  	}, [successMsg]);


  	const cuisine_types = ["Mexican","Swedish","Latvian","Italian","Spanish","American","Chinese","Indian","Russian"];
  	const foodtypes = ["Veg","Non-veg"];
  	const menucategories = ["Main Course","Breakfast","Lunch","Dinner"];
  	const itemtypes = ["Food","Drink"];
  	const drinktypes = ["Alcoholic","Non-alcoholic"];



	

	return (
		<Fragment>
				{isLoading && <Loader /> }
				<section className="create-menu-sec">
					<Container fluid>
				      <Row>
				        <Col lg={12}>

				            {(errorMsg || successMsg) ?
	                            <div className="add-row-btn text-center mb-3 mt-3">
					        		{errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
	                                {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
	                            </div>
	                        :''}  
	                        {(errMsg) ?
	                            <div className="add-row-btn text-center mb-3 mt-3">
					        		{errMsg ? <Badge bg="danger">{errMsg}</Badge> : <Fragment /> }
	                            </div>
	                        :''} 
				           
					        <Form onSubmit={handleSubmit} ref={formRef}>
					        <div className="plans-outer">
					        	<Row>
					        		<Col lg={6}>
					        			<div className="add-row-btn text-left mb-3 mt-3">
								        	<h4>New menu details</h4>
			                            </div>
					        		</Col>
					        		<Col lg={6}>
						        		<div className="add-row-btn text-right mb-3 mt-3">
								        	<Button type="submit" className="custom-btn orange-btn">Save</Button>
			                            </div>
					        		</Col>
					        	</Row>
					        	<hr/>	
					        	<Row>
					        	    <Col lg={12} className="text-center">
					        	       <FileUploader handleChange={handleChangeMenuImage} name="eventImage"  types={fileTypes} />
					        	    </Col>
					        	</Row>			        	
	                            <div className="darkblue-sec mt-5 mb-5">
					        		<h5>Item Details</h5>
					        		<hr />
					        		<div className="outer-form-plan">
					        			<Form.Group className="mb-3" controlId="formBasicEmail">
									        <Row className="mb-3">
									        	<Col lg={6}>
									        		<div className="outer-form">
									        			<Form.Label>Name</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            value={name}
				                                            onChange={ (e) => setName(e.target.value) }
				                                            required
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>Code</Form.Label>
									        			<Form.Control 
				                                            type="text" 
				                                            value={code}
				                                            onChange={ (e) => setCode(e.target.value) }
				                                            required
				                                        />
									        		</div>
									        	</Col>
									        	<Col lg={3}>
									        		<div className="outer-form">
									        			<Form.Label>Price</Form.Label>
									        			<Form.Control 
				                                            type="number" 
				                                            value={price}
				                                            min={1}
				                                            onChange={ (e) => setPrice(e.target.value) }
				                                            required
				                                        />
									        		</div>
									        	</Col>
									        	
									        	
									        </Row>
									        <Row>
									            <Col lg={3}>
									        		<div className="outer-form">
									        	        <Form.Label>Item Type</Form.Label>
									        			<Form.Select onChange={ (e) => setItemType(e.target.value) } aria-label="Default example" required>
													        <option value=''>Select</option>
                                                            { itemtypes.map((itemtype, index)=>{ 
                                                           		return (
                                                           			<option key={index} value={itemtype}>{itemtype}</option>
                                                           			)
                                                           		})
                                                           	}		
													    </Form.Select>
													</div>  
									        	</Col>
									        	{(item_type && item_type == "Food")? 
									        	     (
									        	     	<Fragment>
												            <Col lg={3}>
												        		<div className="outer-form">
												        	        <Form.Label>Cuisine Type</Form.Label>
												        			<Form.Select onChange={ (e) => setCuisine(e.target.value) } aria-label="Default example" required>
																        <option value=''>Select</option>
			                                                            { cuisine_types.map((cuisine_type, index)=>{ 
			                                                           		return (
			                                                           			<option key={index} value={cuisine_type}>{cuisine_type}</option>
			                                                           			)
			                                                           		})
			                                                           	}		
																    </Form.Select>
																</div>  
												        	</Col>
												        	
											        	    <Col lg={3}>
											        	        <div className="outer-form">
												        	        <Form.Label>Food Type</Form.Label>
												        			<Form.Select onChange={ (e) => setFoodType(e.target.value) } aria-label="Default example" required>
																        <option value=''>Select</option>
			                                                            { foodtypes.map((foodtype, index)=>{ 
			                                                           		return (
			                                                           			<option key={index} value={foodtype}>{foodtype}</option>
			                                                           			)
			                                                           		})
			                                                           	}		
																    </Form.Select>
																</div>    
											        	    </Col>
											        	    <Col lg={3}>
											        	        <div className="outer-form">
												        	        <Form.Label>Category</Form.Label>
												        			<Form.Select onChange={ (e) => setCategory(e.target.value) } required>
																        <option value=''>Select</option>
			                                                            { menucategories.map((menucategory, index)=>{ 
			                                                           		return (
			                                                           			<option key={index} value={menucategory}>{menucategory}</option>
			                                                           			)
			                                                           		})
			                                                           	}		
																    </Form.Select>
																</div>  
											        	    </Col>
											        	</Fragment>    
									        	    )
									        	 :null}    
									        	{(item_type && item_type =="Drink")?
									        	     (
									        	        <Fragment>
												            <Col lg={3}>
												        		<div className="outer-form">
												        	        <Form.Label>Drink Type</Form.Label>
												        			<Form.Select onChange={ (e) => setDrinkType(e.target.value) } required>
																        <option value=''>Select</option>
			                                                            { drinktypes.map((drinktype, index)=>{ 
			                                                           		return (
			                                                           			<option key={index} value={drinktype}>{drinktype}</option>
			                                                           			)
			                                                           		})
			                                                           	}		
																    </Form.Select>
																</div>  
												        	</Col>
											        	</Fragment>
										        	)
									        	:''} 
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateMenu);