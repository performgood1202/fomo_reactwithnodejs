import React, { Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../includes/AuthHeader';
import Footer from '../includes/AuthFooter';
import Sidebar from '../includes/Sidebar';

const AuthLayout = ({ children }) => (
	<Container fluid className="dashboard-view">
		<Row>
        	<Col lg={3} className="side-bar-column">
        		<Sidebar />
        	</Col>
        	<Col lg={9} className="dashboard-bar-column">
        		<Header />
        		{children}
        	</Col>
      	</Row>
    </Container>
);

export default AuthLayout;