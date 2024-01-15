import React, { useEffect, useState, useRef, Fragment,useMemo } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem, Image, Alert, Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch, AiOutlineMail,AiOutlinePlusCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate,Link,useParams } from "react-router-dom";
import moment from "moment";
import step3 from "../../../assets/images/step-3.png";
import Loader from "../../Loader";
import  "./style.scss";
import avtarPic from '../../../assets/images/user.png';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { prefix } from './../../../constants/prefix.js';
import DeleteMenuModal from './DeleteMenuModal';

import { FileUploader } from "react-drag-drop-files";
import { 
	ADMIN_CLEAR_MESSAGES, 
	UPDATE_MENU,
	GET_MENU_DETAIL,
	PAGE_ATTR
} from "../../../constants/actionTypes";

const fileTypes = ["JPG", "PNG", "GIF"];



const mapStateToProps = (state) => ({
  	...state,
  	clubData: state.common.clubData,
  	menuDetail: state.owner.menuDetail,
  	successMsg: state.owner.successMsg,
  	errorMsg: state.owner.errorMsg,
  	successMsgDelete: state.owner.successMsgDelete,
  	errorMsgDelete: state.owner.errorMsgDelete,
  	currentUser: state.common.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	fetchMenuDetail: (formData,role) => {
		if(role == "2"){
            dispatch({ type: GET_MENU_DETAIL, payload: agent.owner.getMenuDetail(formData) });
		}else{
			dispatch({ type: GET_MENU_DETAIL, payload: agent.manager.getMenuDetail(formData) });
		}
    	
  	},updateMenu: (formData,role) => {
		if(role == "2"){
            dispatch({ type: UPDATE_MENU, payload: agent.owner.updateMenu(formData) });
		}else{
			dispatch({ type: UPDATE_MENU, payload: agent.manager.updateMenu(formData) });
		}
    	
  	},clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    },
    setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const EditMenu = (props) => {	
	const {currentUser,updateMenu,fetchMenuDetail,menuDetail, clearMessages, saveSuccess, saveError,clubData, successMsg, errorMsg, createPromotion, successMsgDelete, errorMsgDelete} = props;

	const [deletemenumodalshow,setDeleteMenuModalShow] = useState(false);


	 const {setPageHeading,pageheading} = props;

	useEffect(() => {  		
		if(pageheading){
            setPageHeading(pageheading);
		}else{
			setPageHeading("Edit Menu");
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
	let [status, setStatus] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErr] = useState('');




	let navigate = useNavigate();

	let menu_id;

	const params = useParams();

	if(params.id !== undefined){
		menu_id = params.id;
	}

	useEffect(() => {
		if(menuDetail){

			setName(menuDetail.name);
			setCode(menuDetail.code);
			setPrice(menuDetail.price);
			setCuisine(menuDetail.cuisine);
			setFoodType(menuDetail.food_type);
			setItemType(menuDetail.item_type);
			setDrinkType(menuDetail.drink_type);
			setCategory(menuDetail.category);

			if(menuDetail.status == "1"){
                setStatus(true);
			}else{
				setStatus(false);
			}
			

			if(menuDetail.menuImage && menuDetail.menuImage != "" && menuDetail.menuImage != null){
			    setmenuShowImage(menuDetail.menuImage)
			}else{
				 setmenuShowImage(null)
			}
		}
  	}, [menuDetail]);

  	

	const handleSubmit = async (e) => {
		clearMessages();
		setIsLoading(true);
		e.preventDefault();



        if(club_id && club_id != "" && menu_id && menu_id != ""){

        	
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
        	formData.append("menu_id", menu_id);
        	if(status == true){
                formData.append("status", "1");
        	}else{
        		formData.append("status", "0");
        	}
        	
        	if(currentUser && currentUser.roleId){
        		updateMenu(formData,currentUser.roleId);
        	}
	        
        	
        }else{
        	setIsLoading(false);
        }
		
    	
    	setTimeout(() => {
    		clearMessages();
    	}, 3000);
	}

	const [menuImage, setmenuImage] = useState(null);
	const [menuShowImage, setmenuShowImage] = useState(null);
	const handleChangeMenuImage = (file) => {
	   setmenuImage(file);
	   setmenuShowImage(URL.createObjectURL(file));

	};
	const setStatusFunc = (e) => {
		if(e.target.checked){
			status = true;
			setStatus(true);
		}else{
			status = false;
			setStatus(false);
		}
		setIsLoading(true);
		setTimeout(function(){
             handleSubmit(e);
		},1000);
		

	};

	const [club_id,setClubId] = useState("");

	useEffect(() => {  		
		if(club_id && menu_id){

			var formData = {
				club_id:club_id,
				menu_id:menu_id,

			}
			
			if(currentUser && currentUser.roleId){
        		fetchMenuDetail(formData,currentUser.roleId);
        	}
		}
  		
  	}, [club_id,menu_id])

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
			//navigate("/"+prefix[currentUser.roleId]+"/menu");
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
								        	<h4>Menu details</h4>
			                            </div>
					        		</Col>
					        		<Col lg={6}>
						        		<div className="switch-outer menu-switch add-row-btn text-right mb-3 mt-3">
							        		<div className="d-flex align-items-center justify-content-end">
							        		    <div className={((status)?"av-status":"unav-status")+" switch-inner mr-30px"}>
												       <Form.Check type="switch" label={(status)?"Available":"Unavailable"} checked={status} onChange={ (e) => setStatusFunc(e) } />
								        		</div>
									        	<Button type="submit" className="custom-btn orange-btn">Save</Button>
									        </div>	
			                            </div>
					        		</Col>
					        	</Row>
					        	<hr/>	
					        	<Row>
					        	    <Col lg={12} className="text-center">
					        	       <FileUploader handleChange={handleChangeMenuImage} name="eventImage"  types={fileTypes} />
					        	    </Col>
					        	</Row>	
					        	{(menuShowImage && menuShowImage != null)?
						        	<Row>
						        	    <Col lg={12}>
						        	       <div className="darkblue-sec mt-5">
							        		<h5>Menu Image</h5>
							        		<hr />
							        		<div className="outer-form-plan">
							        			<Row>
							        			    <Col lg={3} className="mb-3">
										                  <div className="edit-image-sec">
										                      <Image src={menuShowImage} />
										                  </div>
										            </Col>
	                                            </Row>
							        		</div>
			                            </div>  
						        	    </Col>
						        	</Row>	
					        	:'' }			        	
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
									        			<Form.Select value={item_type} onChange={ (e) => setItemType(e.target.value) } aria-label="Default example" required>
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
												        			<Form.Select value={cuisine} onChange={ (e) => setCuisine(e.target.value) } aria-label="Default example" required>
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
												        			<Form.Select value={food_type} onChange={ (e) => setFoodType(e.target.value) } aria-label="Default example" required>
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
												        			<Form.Select value={category} onChange={ (e) => setCategory(e.target.value) } required>
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
												        			<Form.Select value={drink_type} onChange={ (e) => setDrinkType(e.target.value) } required>
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
	                            <div className="darkblue-sec mt-5 mb-5">
	                                {(errorMsgDelete || successMsgDelete) ?
		                                <div className="add-row-btn text-center mb-3 mt-3">
							        		{errorMsgDelete ? <Badge bg="danger">{errorMsgDelete}</Badge> : <Fragment /> }
		                                    {successMsgDelete ? <Badge bg="success">{successMsgDelete}</Badge> : <Fragment /> }
			                            </div>
			                        :''}    
		                            <div className="delete_sec">
						        		<div className="add-row-btn text-left mb-3 mt-3">
							        		<h5>Delete Item</h5>
			                            </div>
			                            <div className="add-row-btn text-right mb-3 mt-3">
							        		<Button className="custom-btn orange-btn ml-1" type="button" onClick={() => setDeleteMenuModalShow(true)}>Delete</Button>
			                            </div>
			                            <DeleteMenuModal setIsLoading={setIsLoading} menu_id={menu_id} club_id={club_id} deletemenumodalshow={deletemenumodalshow} setDeleteMenuModalShow={setDeleteMenuModalShow} /> 
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

export default connect(mapStateToProps, mapDispatchToProps)(EditMenu);