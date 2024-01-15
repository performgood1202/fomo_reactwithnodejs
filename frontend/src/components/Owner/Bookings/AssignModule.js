import React, { useEffect, useState, useRef, Fragment } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { AiFillPlusCircle, AiOutlineCheck, AiOutlineClose,AiFillDelete } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import { FiEdit } from 'react-icons/fi';
import agent from "../../../agent";
import ListErrors from "../../ListErrors";

import AssignTableModal from './AssignTableModal';

import moment from "moment";

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

const AssignModule = (props) => {
	    let { save, setPlanFeature, row,event_id, plan_feature,checked,setChecked,children,getBookings } = props;

	    const [AssignTableModalshow,setAssignTableModalshow] = useState(false);

	    let show_modal = true;

	    if(row.event.event_date){

	    	let cr_date  = moment().format("YYYY-MM-DD HH:mm:ss");

	    	let event_e_date =  moment(row.event.event_end_date).utc().format("YYYY-MM-DD HH:mm:ss");

	    	cr_date = new Date(cr_date);
	    	event_e_date = new Date(event_e_date);


	    	if(cr_date >= event_e_date){
	    		show_modal = false;
	    	}

	    }

        return (
                <Fragment>
	                <div>
	                    <div  onClick={() => setAssignTableModalshow(true)}>
	                            {children}
		        	</div> 
	        	{(show_modal)?
	        		<AssignTableModal getBookings={getBookings} event_id={event_id} row={row} AssignTableModalshow={AssignTableModalshow} setAssignTableModalshow={setAssignTableModalshow} /> 
			
			:''}
			</div>
		</Fragment>
		)			
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignModule);