import React, { useState, Fragment } from "react";
import { NavLink,Link} from 'react-router-dom';
import { prefix } from './../../../constants/prefix.js';


const SidebarChild = (props) => {

	const { menu, childMenu, roleId ,pathname,setPageHeading,linkk,activeLink } = props;
	const [show, setShow] = useState(false);
	const { currentUser } = props;


	const showDropper = () => {
		setShow(!show);
	}
	const handleToggleMainNav = (title) => {
		setPageHeading(title)
	}

	return (
		<Fragment>
			{(menu.hasChild) ? (

				<li className={'link dropdown-link '+((menu.activeLink == pathname)?'active':'')} onClick={showDropper}>
					{menu.icon ? menu.icon : <div className={`icon${(menu.iconClass)?' '+menu.iconClass:''}`} /> }
					{menu.name}
					<ul className={`child-dropdown ${(show || (menu.activeLink == pathname)) ?' toogle':' collapse'}`}>
						{childMenu.map((child, j) => {
							child.activeLink = false;

							let showChildMenu = false;
							let childAcc = child.accessor;

							let child_link = child.link;

							if(child.prefix){
								if(roleId) {
									if(!child_link.includes("/"+prefix[roleId])){
			                            child_link = "/"+prefix[roleId]+child_link;
			                        }
									
								}
							}
							if(child_link == pathname){
								menu.activeLink = child_link;
								child.activeLink = true;
							}

							if(child.parent == menu.id) {
								if(childAcc == 'all') {
									showChildMenu = true;
								} else if(typeof childAcc == 'object') {
									if(roleId && childAcc.indexOf(roleId) !== -1) {
										showChildMenu = true;
									}
								}
							};

							return (
								<Fragment key={j}>
									{(showChildMenu) ? (
										<li className={'sub-link '+((child.activeLink == true)?'active':'')}>
											<NavLink className={'a-links '+((child.activeLink == true)?'active':'')} to={child_link}>
												{child.icon ? 
													child.icon 
													: <div className={`icon${(child.iconClass)?' '+child.iconClass:''}`} /> 
												}
												{child.name}
											</NavLink>
										</li>
									) : (
										<Fragment />
									)}
								</Fragment>
							)
						})}
					</ul>
				</li>
			) : (
				<li className={'link '+((activeLink == true)?'active':'')}>
					<Link className={'a-links '+((activeLink == true)?'active':'')} to={linkk}>
						{menu.icon ? menu.icon : <div className={`icon${(menu.iconClass)?' '+menu.iconClass:''}`} /> }
						{menu.name}
					</Link>
				</li>
			)}
		</Fragment>
	);
}


export default SidebarChild;