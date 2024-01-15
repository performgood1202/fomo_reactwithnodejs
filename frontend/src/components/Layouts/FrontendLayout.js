import React, { Fragment } from 'react';
import Header from '../includes/Header';
import Footer from '../includes/Footer';

const FrontendLayout = ({ children }) => (
	<Fragment>
		<div className="header">
			<Header />
		</div>
    	{children}
    	<div className="footer">
			<Footer />
		</div>
    </Fragment>
);

export default FrontendLayout;