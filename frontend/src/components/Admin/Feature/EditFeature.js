import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck, AiOutlineClose,AiFillDelete } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import { FiEdit } from 'react-icons/fi';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";
import EditFeatureModal from './EditFeatureModal';
import DeleteFeatureModal from './DeleteFeatureModal';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const EditFeature = (props) => {
	    let { save, setPlanFeature, row, plan_feature,checked,setChecked } = props;

	    const [editfeaturemodalshow,setEditFeatureModalShow] = useState(false);
	    const [deletefeaturemodalshow,setDeleteFeatureModalShow] = useState(false);

        return (
                <Fragment>
		        	<div className="dropdown-custom">
		        		<Dropdown className="skyblue-dropdown">
					      <Dropdown.Toggle>
					        <HiDotsVertical />
					      </Dropdown.Toggle>

					      <Dropdown.Menu>
					        <Dropdown.Item  onClick={() => setEditFeatureModalShow(true)}>Edit <FiEdit /></Dropdown.Item>
					        <Dropdown.Item onClick={() => setDeleteFeatureModalShow(true)} >Delete <AiFillDelete /></Dropdown.Item>
					      </Dropdown.Menu>
					    </Dropdown>
		        	</div>
		        	<EditFeatureModal row={row} editfeaturemodalshow={editfeaturemodalshow} setEditFeatureModalShow={setEditFeatureModalShow} />  
		        	<DeleteFeatureModal row={row} deletefeaturemodalshow={deletefeaturemodalshow} setDeleteFeatureModalShow={setDeleteFeatureModalShow} /> 
				</Fragment>
		)			
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFeature);