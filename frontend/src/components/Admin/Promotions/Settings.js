import React, { useEffect, useState, Fragment } from 'react';
import { connect } from "react-redux";
import agent from "../../../agent";
import { Container, Row, Col, Button, Form, Nav, NavDropdown, NavItem,Badge} from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineSearch,AiOutlinePlusCircle } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import Loader from "../../Loader";

import DataTable from 'react-data-table-component';

import { useNavigate,Link, useParams } from "react-router-dom";

import moment from "moment";
import  "./style.scss";

import {
  	ADMIN_CLEAR_MESSAGES,
  	SAVE_PROMOTION_SETTING,
  	GET_PROMOTION_SETTING,
} from "../../../constants/actionTypes";



const mapStateToProps = (state) => ({
  	...state,
  	successMsg: state.admin.successMsg,
    errorMsg: state.admin.errorMsg,
    promotionSettings: state.admin.promotionSettings,
});

const mapDispatchToProps = (dispatch) => ({
	savePromotionSettings: (formData) => {
    	dispatch({ type: SAVE_PROMOTION_SETTING, payload: agent.admin.savePromotionSettings(formData) });
  	},
  	getPromotionSettings: () => {
    	dispatch({ type: GET_PROMOTION_SETTING, payload: agent.admin.getPromotionSettings() });
  	},
    clearMessages: () => {
        dispatch({ type: ADMIN_CLEAR_MESSAGES });
    }
});

const EditClub = (props) => {

	let {successMsg,errorMsg,promotionSettings,clearMessages,savePromotionSettings,getPromotionSettings} = props;

	let [row,setRow] = useState({});

	const [isLoading, setIsLoading] = useState(false);
	const [settings, setSettings] = useState(false);



	let navigate = useNavigate();

	

    const handleSubmit = async (e) => {
			setIsLoading(true);
			clearMessages();
			e.preventDefault();


			var settings = {};

        	
        	if(settingFields && settingFields.length > 1){
        		settingFields.forEach(function(value,index){
        			settings[index] = {position:value.position,time:value.time,price:value.price};
	        	})
	        	savePromotionSettings(settings);
        	}else if(settingFields && settingFields.length == 1){

        		if(settingFields[0].time != "" && settingFields[0].price != ""){
        			settingFields.forEach(function(value,index){
        				settings[index] = {position:value.position,time:value.time,price:value.price};
		        	})
		        	savePromotionSettings(settings);

        		}else{
        			setIsLoading(false);
        		}

        	}
    	

    	setTimeout(() => {
    		clearMessages();
    	}, 3000);
	}

  	const [settingFields, setsettingFields] = useState([{position:'',time:'',price:''}]);

	const addSetting = () => {
		setsettingFields([...settingFields, {position:'',time:'',price:''}]);
	};
	const deleteSetting = (index) => {
		const rows = [...settingFields];
        rows.splice(index, 1);
        setsettingFields(rows);
	};
	const handleSettingChange = (index, evnt)=>{

	    const { value,name } = evnt.target;
	    const list = [...settingFields];
	    list[index][name] = value;
	    setsettingFields(list);
	 
	}
	const onDatepickerRef = (el) =>{
		if (el && el.input) {
		   el.input.readOnly = true; 
		} 
	}
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
			getPromotionSettings();
			setIsLoading(false);
			setTimeout(() => {
	    		clearMessages();
	    	}, 3000);
		}
  	}, [successMsg]);

  	useEffect(() => {
		getPromotionSettings();
  	}, []);

  	useEffect(() => {
  		if(promotionSettings){

  			if(promotionSettings && promotionSettings.length > 0){

                setsettingFields(promotionSettings);
			}else{
				setsettingFields([[{position:'',time:'',price:''}]]);
			}
  		}
  	}, [promotionSettings]);

  	const positions = [1,2,3,4,5];


  



	return (
		<Fragment>
		    {isLoading && <Loader /> }
			<section className="plans-sec promotion-setting-sec">
			    {(errorMsg || successMsg) ?
                    <div className="add-row-btn text-center mb-3 mt-3">
		        		{errorMsg ? <Badge bg="danger">{errorMsg}</Badge> : <Fragment /> }
                        {successMsg ? <Badge bg="success">{successMsg}</Badge> : <Fragment /> }
                    </div>
                :''} 
				<Container fluid>
			      <Row>
			        <Col lg={12}>
			            <Form onSubmit={handleSubmit} >
				        <div className="plans-outer">

				            <Row>
				        		<Col lg={6}>
				        			<div className="add-row-btn text-left mb-3 mt-3">
							        	<h4>Promotion settings</h4>
		                            </div>
				        		</Col>
				        		<Col lg={6}>
					        		<div className="add-row-btn text-right mb-3 mt-3">
							        	<Button type="submit" className="custom-btn orange-btn">Save</Button>
		                            </div>
				        		</Col>
				        	</Row>
				        	<hr/>	
				        	<div className="darkblue-sec mt-5 mb-5">
				        		<h5>Settings</h5>
				        		<hr />
				        		<div className="outer-form-plan">
				        			<Form.Group className="mb-3" controlId="formBasicEmail">
								        	
							        	{
							        		(settingFields.length > 0)?

									        	settingFields.map((settingtData, index)=>{

                                                      const {position,time,price}= settingtData;

							                          return(

							                            <Row className="mb-3" key={index}>
							                                <Col lg={3}>
												        		<div className="outer-form">
												        			<Form.Label>Position</Form.Label>
												        			<Form.Select name="position" value={position} onChange={(evnt)=>handleSettingChange(index, evnt)} required>
												        			     <option value=''></option>
													        			{ positions.map((position_val, index)=>{ 
			                                                           		return (
			                                                           			<option value={position_val}>{position_val}</option>
			                                                           			)
			                                                           		})
			                                                           	}
		                                                           	</Form.Select>
												        		</div>
												        	</Col>
												        	<Col lg={3}>
												        		<div className="outer-form">
												        			<Form.Label>Time (hrs)</Form.Label>
												        			<Form.Control 
							                                            type="number" 
							                                            value={time}
							                                            name="time"
							                                            min={1}
							                                            onChange={(evnt)=>handleSettingChange(index, evnt)}
							                                            required
							                                        />
												        		</div>
												        	</Col>
												        	<Col lg={3}>
												        		<div className="outer-form">
												        			<Form.Label>Price (€)</Form.Label>
												        			<Form.Control 
							                                            type="number" 
							                                            value={price}
							                                            name="price"
							                                            min={1}
							                                            onChange={(evnt)=>handleSettingChange(index, evnt)}
							                                            required
							                                        />
												        		</div>
												        	</Col>
												        	<Col lg={2}>
												        		<div className="outer-form setting_main">
												        		    {(index == 0)? <AiOutlinePlusCircle className="plus_benefit" onClick={addSetting} /> :<BsTrash className="delete_benefit" onClick={()=>deleteSetting(index)} />}
												        		</div>
												        	</Col>
											        	</Row>	

							                          )
							                    })
							                :''
							            }        
								        
								        
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

export default connect(mapStateToProps, mapDispatchToProps)(EditClub);