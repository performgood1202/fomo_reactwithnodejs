import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Image} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';

import DataTable from 'react-data-table-component';
import { prefix } from './../../../constants/prefix.js';

import eventimg1 from "../../../assets/images/club.png";
import noimage from "../../../assets/images/no-image.png";

import Loader from "../../Loader";

import { useNavigate,Link } from "react-router-dom";

import moment from "moment";



import {
  	ADMIN_CLUB_FETCH,
  	FETCH_MENU,
  	ADMIN_CLEAR_MESSAGES
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	menuData: state.owner.menuData,
  	clubData: state.common.clubData,
  	currentUser: state.common.currentUser,
  	errorMsg: state.owner.errorMsg,
});

const mapDispatchToProps = (dispatch) => ({
	fetchMenu: (formData,role) => {
		if(role == "2"){
            dispatch({ type: FETCH_MENU, payload: agent.owner.fetchMenu(formData) });
		}else{
			dispatch({ type: FETCH_MENU, payload: agent.manager.fetchMenu(formData) });
		}
    	
  	},
    clearMessage: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const renderStatus = (row)=> {
	
		switch (row.status) {
		  case "0":

		    return (
		    	<Fragment>
		    	   <span className="red-back bk-tag">Unvailable</span>
		    	</Fragment>
		    )	
		    break;
		  case "1":
		    return (
		    	<Fragment>
		    	   <span className="green-back bk-tag">Available</span>
		    	</Fragment>
		    )
		    break; 
		}
}

const submitFormSearch = (e) =>{
		e.preventDefault();
} 
const MainView = (props) => {

	const {currentUser,menuData,clubData,fetchMenu,errorMsg,clearMessage} = props;

	const [club_id,setClubId] = useState("");

  	useEffect(() => {
		if(clubData && clubData._id){
			setClubId(clubData._id)
		}
  	}, [clubData]);


	let navigate = useNavigate();


	let  a = 0;

	

	const columns = [
	    {
	    	id:"code",
	        name: 'Code',
	        width: '10%',
	        cell: (row, index) => {
	        	return (row.code)?row.code:'';
	        }
	    },
	    {
            id:"name",
	        name: 'Name',
	        cell: (row, index) => {

	        	let menu_image = noimage;

	        	if(row.menuImage && row.menuImage != "" && row.menuImage != null){
	        		menu_image = row.menuImage;
	        	}

	        	return (
		        	<Fragment>
			        	<Link to={"/"+prefix[currentUser.roleId]+"/menu/"+row._id}>
							<div className="d-flex menu-name-column">
							   <Image src={menu_image} />
							   <span>{row.name}</span>
							</div>
						</Link>
					</Fragment>
		        )
		    },
	    },
	    {
            id:"item_type",
	        name: 'Item Type',
	        width: '15%',
	        cell: (row, index) => {
	        	return (row.item_type)?row.item_type:'';
		    },
	    },
	    {
            id:"category",
	        name: 'Category',
	        cell: (row, index) => {
	        	return (row.category)?row.category:'-';
		    },
	    },
	    {
            id:"type",
	        name: 'Type',
	        cell: (row, index) => {
	        	return (row.item_type && row.item_type == "Food")?row.food_type:(row.item_type && row.item_type == "Drink")?row.drink_type:'';
		    },
	    },
	    {
	    	id:"status",
	        name: 'Status',
	        width: '15%',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	   <div>{(row && row.status)? renderStatus(row) :''} </div>
					</Fragment>
		        )
		    },
	    },
	    {
	    	id:"price",
	        name: 'Price',
	        width: '10%',
	        cell: (row, index) => {

	        	return (
		        	<Fragment>
		        	   <span>€{row.price}</span>
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

	let [cuisine, setCuisine] = useState('');
	let [food_type, setFoodType] = useState('');
	let [item_type, setItemType] = useState('');
	let [drink_type, setDrinkType] = useState('');
	let [category, setCategory] = useState("");

	const [menus,setMenus] = useState([]);

	const filterData = () => {

		//setIsLoading(true);
		clearMessage();

		if(club_id && club_id != ""){
			if(item_type == "Food"){

				var formData = {
					search:searchFilter,
					food_type: food_type,
					item_type: item_type,
					cuisine: cuisine,
					category: category,
					club_id : club_id,
				}

			}else{

				var formData = {
					search:searchFilter,
					item_type: item_type,
					drink_type: drink_type,
					club_id : club_id,
				}

			}
			

			if(currentUser && currentUser.roleId){
        		fetchMenu(formData,currentUser.roleId);
        	}
		}

	}
	const setFilterItemType = (value) => {

		setItemType(value)
		item_type = value;
        filterData();

	}
	const setFilterFoodType = (value) => {

		setFoodType(value)
		food_type = value;
        filterData();

	}
	const setFilterDrinkType = (value) => {

		setDrinkType(value)
		drink_type = value;
        filterData();

	}
	const setFilterCuisine = (value) => {

		setCuisine(value)
		cuisine = value;
        filterData();

	}
	const setFilterCategory = (value) => {

		setCategory(value)
		category = value;
        filterData();

	}
	


	useEffect(() => {  		
		if(club_id){
			var formData = {
				club_id:club_id
			}
			if(currentUser && currentUser.roleId){
        		fetchMenu(formData,currentUser.roleId);
        	}
		}
  		
  	}, [club_id]) 

  	useEffect(() => {  		
  		if(menuData){
  			setIsLoading(false);
  			setMenus(menuData);
  		}
  	}, [menuData]) 

  	useEffect(() => {
        if (errorMsg) {
        	setIsLoading(false);
        	clearMessage();
        	setMenus([]);
        }
    }, [errorMsg]);

  	const cuisine_types = ["Mexican","Swedish","Latvian","Italian","Spanish","American","Chinese","Indian","Russian"];
  	const foodtypes = ["Veg","Non-veg"];
  	const menucategories = ["Main Course","Breakfast","Lunch","Dinner"];
  	const itemtypes = ["Food","Drink"];
  	const drinktypes = ["Alcoholic","Non-alcoholic"];


	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="menu-sec">
				<Container fluid>
			      <Row>
			        <Col lg={12}>
				        <div className="plans-outer menu-outer">
				        	<div className="add-row-btn mb-3 mt-3">
				        		<Row>
							        <Col lg={(item_type && item_type == "Food")?3:5}>
								        <div className="search-box">
								        	<Form onSubmit={submitFormSearch}>
										      <Form.Group controlId="formBasicEmail">
									        	<div className="search-btn-outer">
									        		<Form.Control type="text" onChange={(e) => setSearchFilter(e.target.value)} onKeyUp={(e) => filterData()} placeholder="Search" />
									        		<AiOutlineSearch />
									        	</div>
										       </Form.Group>
										    </Form>
								        </div>
									</Col>
									<Col lg={(item_type && item_type == "Food")?9:7}>
										<div className="search-plan-outer text-right menu-filter">
										    <div class="select-arrow ml-10px">
											    <Form.Select onChange={ (e) => setFilterItemType(e.target.value) } value={item_type} >
											        <option value=''>Item Type</option>
	                                                { itemtypes.map((itemtype, index)=>{ 
	                                               		return (
	                                               			<option value={itemtype}>{itemtype}</option>
	                                               			)
	                                               		})
	                                               	}		
											    </Form.Select>
											    <FaAngleDown />
										    </div>
										    {(item_type && item_type == "Food")? 
									        	     (
									        	     <Fragment>
													    <div class="select-arrow ml-10px">
														    <Form.Select onChange={ (e) => setFilterFoodType(e.target.value) } value={food_type} >
														        <option value=''>Food Type</option>
				                                                { foodtypes.map((foodtype, index)=>{ 
				                                               		return (
				                                               			<option value={foodtype}>{foodtype}</option>
				                                               			)
				                                               		})
				                                               	}		
														    </Form.Select>
														    <FaAngleDown />
													    </div>
													    <div class="select-arrow ml-10px">
														    <Form.Select onChange={ (e) => setFilterCuisine(e.target.value) } aria-label="Default example">
														        <option value=''>Cuisine</option>
				                                                { cuisine_types.map((cuisine_type, index)=>{ 
				                                                	console.log(cuisine)
				                                               		return (
				                                               			<option value={cuisine_type} >{cuisine_type}</option>
				                                               			)
				                                               		})
				                                               	}		
														    </Form.Select>
														    <FaAngleDown />
													    </div>
													    <div class="select-arrow ml-10px">
														    <Form.Select onChange={ (e) => setFilterCategory(e.target.value) } value={category}>
														        <option value=''>Category</option>
				                                                { menucategories.map((menucategory, index)=>{ 
				                                               		return (
				                                               			<option value={menucategory}>{menucategory}</option>
				                                               			)
				                                               		})
				                                               	}		
														    </Form.Select>
														    <FaAngleDown />
													    </div>
													</Fragment>  
												)	  
										    :null}  
										    {(item_type && item_type == "Drink")? 
									        	     (
									        	     <Fragment>
													    <div class="select-arrow ml-10px">
														    <Form.Select onChange={ (e) => setFilterDrinkType(e.target.value) } value={drink_type} >
														        <option value=''>Drink Type</option>
				                                                { drinktypes.map((drinktype, index)=>{ 
				                                               		return (
				                                               			<option value={drinktype}>{drinktype}</option>
				                                               			)
				                                               		})
				                                               	}		
														    </Form.Select>
														    <FaAngleDown />
													    </div>
													</Fragment>  
												)	  
										    :null}  
											
											<div className="search-plan-outer text-right ml-10px">
												<Link to={"/"+prefix[currentUser.roleId]+"/menu/create"}><Button className="orange-btn">Add New</Button></Link>
								        	</div>
							        	</div>
									</Col>
							     </Row>
                            </div>
                            <hr />
				        	<div className="dataTable">
					        	<DataTable
						            columns={columns}
						            data={menus}
						            progressPending={pending}
						            pagination
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