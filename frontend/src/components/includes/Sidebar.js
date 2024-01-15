import React, { Fragment,useEffect,useState} from "react";
import { connect } from "react-redux";
import { Image } from 'react-bootstrap';

import { useLocation, NavLink } from "react-router-dom";

// import agent from "../../agent";

import { PRIMARY_MENU, CHILD_MENU } from './../../constants/sideBar.js';
import { prefix } from './../../constants/prefix.js';
import SidebarChild from './includes/SidebarChild';
import logo from '../../assets/images/logo.svg';

import PaymentPopup from '../Owner/Setting/PaymentPopup';
import PlanPopup from '../Owner/Plan/PlanPopup';

import {
   PAGE_ATTR
} from "../../constants/actionTypes";

const mapStateToProps = (state) => {
	return {
		...state,
		currentUser: state.common.currentUser,
		clubData: state.common.clubData,
		authError: state.common.authError,
		accountVarify: state.owner.accountVarify,
	}
};

const mapDispatchToProps = (dispatch) => ({
	setPageHeading: (title) => {
        dispatch({ type: PAGE_ATTR, pageheading: title });
    }
});

const Header = (props) => {
	const {clubData, currentUser,setPageHeading,authError,accountVarify } = props;
	let { roleId } = currentUser;



	const [planPopupshow, setplanPopupshow] = useState(false);

	const [paymentPopupshow, setpaymentPopupshow] = useState(false);
	const  [account_status, setAccountStatus] = useState(false);

	const  [menu_data, setMenuData] = useState([]);
	// let roleId = 1;

	//assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;
     
    useEffect(() => {
	    if (authError) {
	    	window.location.reload();
	    }
  	}, [authError]);

  	useEffect(() => {
	    if (currentUser && currentUser.roleId == "2") {


	    	if(clubData && clubData.stripe_account_status == "1"){
	    		 setAccountStatus(true);
	    	}else{
	    		setpaymentPopupshow(true);
	    	}

	    	if(clubData && clubData.status == "0"){
	    		if(pathname.includes("/plans") == true || pathname.includes("/plan") == true){
	    		     setplanPopupshow(false);
	    		}else{
	    			 setplanPopupshow(true);
	    		}
	    	}
	    	
	    }
  	}, [currentUser,clubData,pathname]);


	useEffect(() => {
		if(pathname){
			const section = document.querySelector( '.dashboard-bar-column' );
			section.scrollTo(0, 0);
		}
	    
	}, [pathname]);


	 useEffect(() => {       
        if(accountVarify){
            setpaymentPopupshow(false);
            setAccountStatus(true);
        }
    }, [accountVarify,pathname])




	return (
      	<div className="sidebar-main">
			<div className="top-logo">
				<NavLink to="/"><Image src={logo} alt="" /></NavLink>
			</div>

			<div className="route-links">
				<ul className="links-list">
					{

						PRIMARY_MENU.map((menu, i) => {

							let activeLink = false;

							let linkk = menu.link;

							if(menu.prefix){
								if(roleId) {
									if(!linkk.includes("/"+prefix[roleId])){
			                            linkk = "/"+prefix[roleId]+linkk;
			                        }
									
								}
							}

							if(linkk == pathname){
								activeLink = true;
							}
							
							let acessor = menu.accessor;
							let showMenu = false;
							if(acessor == 'all') {
								showMenu = true;
							} else if(typeof acessor == 'object') {
								if(roleId && acessor.indexOf(roleId) !== -1) {
									showMenu = true;
								}
							}

							return (
								<Fragment key={menu.id}>
									{showMenu ? (
										<SidebarChild menu={menu} linkk={linkk} activeLink={activeLink} setPageHeading={setPageHeading} pathname={pathname} childMenu={(menu.childMenus)?menu.childMenus:[]} roleId={roleId} />	
									) : (
										<Fragment />
									)}
								</Fragment>
							)
						})
					}
				</ul>
			</div>
			{(!account_status && currentUser && currentUser.roleId == "2")?
				<div>
				    <PaymentPopup paymentPopupshow={paymentPopupshow} setpaymentPopupshow={setpaymentPopupshow} /> 
				</div>
			:''}	
			{(clubData && clubData.status == "0")?
				<div>
				    <PlanPopup planPopupshow={planPopupshow} setplanPopupshow={setplanPopupshow} /> 
				</div>
			:''}
      	</div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(Header);