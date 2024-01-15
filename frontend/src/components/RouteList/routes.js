// Unauthenticated Routes Components.
import Login from '../Login';
import ForgotPassword from '../Login/ForgotPassword';
import ResetPassword from '../Login/ResetPassword';

// Frontend Routes Components.
import Home from '../Home';
import About from "../views/About";
import Contact from "../views/Contact";
import Features from "../views/Features";
import Prices from "../views/Prices";
import Subscribe from "../views/Subscribe";

// Authenticated Routes Components.
import Dashboard from "../Dashboard";
import AdminDashboard from "../Admin/Dashboard";
import OwnerDashboard from "../Owner/Dashboard";
import Profile from "../Profile";
//import OwnerProfile from "../Profile";
import AdminPlan from "../Admin/Plan";
import AdminClub from "../Admin/Club";
import EditClub from "../Admin/Club/EditClub";
import EditPlan from "../Admin/Plan/EditPlan";
import Feature from "../Admin/Feature";
import Setting from "../Admin/Setting";
import Request from "../Admin/Request";
import EditRequest from "../Admin/Request/EditRequest";


// Admin Routes
import AdminPromotions from "../Admin/Promotions";
import AdminPromotionHistory from "../Admin/Promotions/history";
import ViewAdminPromotion from "../Admin/Promotions/View";
import AdminPromotionSettings from "../Admin/Promotions/Settings";
import AdminQueries from "../Admin/Queries";
import ViewQuery from "../Admin/Queries/View";
import AdminEarnings from "../Admin/Earnings";
import AdminPayments from "../Admin/Payments";
import AdminViewPayment from "../Admin/Payments/ViewPayment";

// Manager Routes
import Orders from "../Manager/Orders";
import Staff from "../Manager/Staff";
import CreateStaff from "../Manager/Staff/CreateStaff";
import EditStaff from "../Manager/Staff/EditStaff";
import ManagerProfile from "../Manager/Profile";
import ManagerSetting from "../Manager/Setting";
import OrderBill from "../Manager/Orders/OrderBill";

// Owner Routes
import Manager from "../Owner/Manager";
import CreateManager from "../Owner/Manager/CreateManager";
import EditManager from "../Owner/Manager/EditManager";
import OwnerSetting from "../Owner/Setting";
import OwnerPlan from "../Owner/Plan";
import SubscribePlan from "../Owner/Plan/Subscribe";
import OwnerProfile from "../Owner/Profile";
import OwnerEarnings from "../Owner/Earnings";
import OwnerOrderEarnings from "../Owner/Earnings/Orders";
import OwnerEventEarnings from "../Owner/Earnings/Events";
import OwnerQueries from "../Owner/Queries";
import OwnerViewQuery from "../Owner/Queries/View"

/*Permottion*/
import Promotions from "../Owner/Promotions";
import CreatePromotion from "../Owner/Promotions/Create";
import ViewPromotion from "../Owner/Promotions/View";

/*Events*/
import Events from "../Owner/Events";
import CreateEvent from "../Owner/Events/Create";
import ViewEvent from "../Owner/Events/View";
import EditEvent from "../Owner/Events/Edit"

/*Bookings*/
import Bookings from "../Owner/Bookings";

/*Menu*/
import Menu from "../Owner/Menu";
import CreateMenu from "../Owner/Menu/Create";
import EditMenu from "../Owner/Menu/Edit";

/*Contact by owener */
import OwnerContact from "../Owner/Contact";



export const baseRoutes = [
	{
		name: 'Home',
		path: '/',
		component: <Home />
	},
	{
		name: 'About',
		path: '/about',
		component: <About />
	},
	{
		name: 'Home',
		path: '/contact-us',
		component: <Contact />
	},
	{
		name: 'Home',
		path: '/features',
		component: <Features />
	},
	{
		name: 'Home',
		path: '/prices',
		component: <Prices />
	},
	{
		name: 'Subscribe',
		path: '/subscribe/:id',
		component: <Subscribe pageheading="Subscribe"/>
	}
];

export const unAuthRoutes = [
	{
		name: 'Login',
		path: '/login',
		component: <Login pageheading="Login"/>
	},
	{
		name: 'ForgotPassword',
		path: '/forgot-password',
		component: <ForgotPassword pageheading="Forgot Password"/>
	},
	{
		name: 'ResetPassword',
		path: '/reset-password/:user_id/:token',
		component: <ResetPassword pageheading="Reset Password"/>
	}
];

export const authRoutes = [
	{
		name: 'Dashboard',
		path: '/dashboard',
		component: <Dashboard pageheading="Dashboard"/>
	}
];

export const authAdminRoutes = [
	{
		name: 'Dashboard',
		prefix: '/admin',
		path: '/dashboard',
		component: <AdminDashboard pageheading="Dashboard"/>
	},
	{
		name: 'Earnings',
		prefix: '/admin',
		path: '/earnings',
		component: <AdminEarnings pageheading="Earnings"/>
	},
	{
		name: 'Payments',
		prefix: '/admin',
		path: '/payments',
		component: <AdminPayments pageheading="Payments"/>
	},
	{
		name: 'Payment details',
		prefix: '/admin',
		path: '/payment/:id',
		component: <AdminViewPayment pageheading="Payment details"/>
	},
	{
		name: 'Plan',
		prefix: '/admin',
		path: '/plan',
		component: <AdminPlan pageheading="Plans"/>
	},
	{
		name: 'Club',
		prefix: '/admin',
		path: '/club',
		component: <AdminClub pageheading="Clubs"/>
	},
	{
		name: 'Edit Club',
		prefix: '/admin',
		path: '/club/:id',
		component: <EditClub pageheading="Edit Club"/>
	},
	{
		name: 'Edit Plan',
		prefix: '/admin',
		path: '/plan/:id',
		component: <EditPlan pageheading="Edit Plan"/>
	},
	{
		name: 'Feature',
		prefix: '/admin',
		path: '/feature',
		component: <Feature pageheading="Features"/>
	},
	{
		name: 'Setting',
		prefix: '/admin',
		path: '/setting',
		component: <Setting pageheading="Settings"/>
	},
	{
		name: 'Request',
		prefix: '/admin',
		path: '/request',
		component: <Request pageheading="Requests"/>
	},
	{
		name: 'Edit Request',
		prefix: '/admin',
		path: '/request/:id',
		component: <EditRequest pageheading="Edit Request"/>
	},
	{
		name: 'Profile',
		prefix: '/admin',
		path: '/profile',
		component: <Profile pageheading="Profile"/>
	},
	{
		name: 'Promotions',
		prefix: '/admin',
		path: '/promotions',
		component: <AdminPromotions pageheading="Promotions"/>
	},
	{
		name: 'Promotions History',
		prefix: '/admin',
		path: '/promotions-history',
		component: <AdminPromotionHistory pageheading="Promotions History"/>
	},
	{
		name: 'Promotion View',
		prefix: '/admin',
		path: '/promotion/:id',
		component: <ViewAdminPromotion pageheading="View Promotion"/>
	},
	{
		name: 'Promotion Settings',
		prefix: '/admin',
		path: '/promotion/settings',
		component: <AdminPromotionSettings pageheading="Promotion Settings"/>
	},
	{
		name: 'Queries',
		prefix: '/admin',
		path: '/queries',
		component: <AdminQueries pageheading="Queries"/>
	},
	{
		name: 'Queries',
		prefix: '/admin',
		path: '/query/:id',
		component: <ViewQuery pageheading="Queries"/>
	}
];

export const authManagerRoutes = [
	{
		name: 'Orders',
		prefix: '/manager',
		path: '/orders',
		component: <Orders pageheading="Orders"/>
	},
	{
		name: 'Orders',
		prefix: '/manager',
		path: '/orders/:booking_id/:order_id',
		component: <Orders pageheading="Orders"/>
	},
	{
		name: 'Order Details',
		prefix: '/manager',
		path: '/order/bill/:event_id/:booking_id',
		component: <OrderBill pageheading="Order Details"/>
	},
	{
		name: 'Staff',
		prefix: '/manager',
		path: '/staff',
		component: <Staff pageheading="Staff"/>
	},
	{
		name: 'CreateStaff',
		prefix: '/manager',
		path: '/staff/create',
		component: <CreateStaff pageheading="Create Staff"/>
	},
	{
		name: 'EditStaff',
		prefix: '/manager',
		path: '/staff/:id',
		component: <EditStaff pageheading="Edit Staff"/>
	},
	{
		name: 'Bookings',
		prefix: '/manager',
		path: '/bookings/:event_id',
		component: <Bookings pageheading="Bookings"/>
	},
	{
		name: 'Events',
		prefix: '/manager',
		path: '/events',
		component: <Events pageheading="Events"/>
	},
	/*{
		name: 'Create Event',
		prefix: '/manager',
		path: '/event/create',
		component: <CreateEvent pageheading="Create Event"/>
	},*/
	{
		name: 'View Event',
		prefix: '/manager',
		path: '/event/view/:id',
		component: <ViewEvent pageheading="View Event"/>
	},
	/*{
		name: 'Edit Event',
		prefix: '/manager',
		path: '/event/edit/:id',
		component: <EditEvent pageheading="Edit Event"/>
	},*/
	{
		name: 'Menu',
		prefix: '/manager',
		path: '/menu',
		component: <Menu pageheading="Menus"/>
	},
	{
		name: 'Create Menu',
		prefix: '/manager',
		path: '/menu/create',
		component: <CreateMenu pageheading="Create Menu" />
	},
	{
		name: 'Edit Menu',
		prefix: '/manager',
		path: '/menu/:id',
		component: <EditMenu pageheading="Edit Menu"/>
	},
	{
		name: 'Profile',
		prefix: '/manager',
		path: '/profile',
		component: <ManagerProfile pageheading="Profile"/>
	},
	{
		name: 'Setting',
		prefix: '/manager',
		path: '/setting',
		component: <ManagerSetting pageheading="Settings"/>
	}
];

export const authOwnerRoutes = [
	{
		name: 'Dashboard',
		prefix: '/owner',
		path: '/dashboard',
		component: <OwnerDashboard pageheading="Dashboard" />
	},
	{
		name: 'Earnings',
		prefix: '/owner',
		path: '/earnings',
		component: <OwnerEarnings pageheading="Earnings"/>
	},
	{
		name: 'Orders Earnings',
		prefix: '/owner',
		path: '/earnings/order',
		component: <OwnerOrderEarnings pageheading="Orders Earnings"/>
	},
	{
		name: 'Events Earnings',
		prefix: '/owner',
		path: '/earnings/event',
		component: <OwnerEventEarnings pageheading="Events Earnings"/>
	},
	{
		name: 'Staff',
		prefix: '/owner',
		path: '/staff',
		component: <Staff pageheading="Staff"/>
	},
	{
		name: 'CreateStaff',
		prefix: '/owner',
		path: '/staff/create',
		component: <CreateStaff pageheading="Create Staff"/>
	},
	{
		name: 'EditStaff',
		prefix: '/owner',
		path: '/staff/:id',
		component: <EditStaff pageheading="Edit Staff"/>
	},
	{
		name: 'Manager',
		prefix: '/owner',
		path: '/manager',
		component: <Manager pageheading="Manager" />
	},
	{
		name: 'Manager',
		prefix: '/owner',
		path: '/manager/create',
		component: <CreateManager pageheading="Create Manager"/>
	},
	{
		name: 'Manager Edit',
		prefix: '/owner',
		path: '/manager/:id',
		component: <EditManager pageheading="Edit Manager" />
	},
	{
		name: 'Promotions',
		prefix: '/owner',
		path: '/promotions',
		component: <Promotions pageheading="Promotions"/>
	},
	{
		name: 'View Promotion',
		prefix: '/owner',
		path: '/promotion/:id',
		component: <ViewPromotion pageheading="View Promotion"/>
	},
	{
		name: 'Create Promotion',
		prefix: '/owner',
		path: '/promotion/create',
		component: <CreatePromotion pageheading="Create Promotion"/>
	},
	{
		name: 'Profile',
		prefix: '/owner',
		path: '/profile',
		component: <OwnerProfile pageheading="Profile"/>
	},
	{
		name: 'Bookings',
		prefix: '/owner',
		path: '/bookings/:event_id',
		component: <Bookings pageheading="Bookings"/>
	},
	{
		name: 'Events',
		prefix: '/owner',
		path: '/events',
		component: <Events pageheading="Events"/>
	},
	{
		name: 'Create Event',
		prefix: '/owner',
		path: '/event/create',
		component: <CreateEvent pageheading="Create Event"/>
	},
	{
		name: 'View Event',
		prefix: '/owner',
		path: '/event/view/:id',
		component: <ViewEvent pageheading="View Event"/>
	},
	{
		name: 'Edit Event',
		prefix: '/owner',
		path: '/event/edit/:id',
		component: <EditEvent pageheading="Edit Event"/>
	},
	{
		name: 'Menu',
		prefix: '/owner',
		path: '/menu',
		component: <Menu pageheading="Menus" />
	},
	{
		name: 'Create Menu',
		prefix: '/owner',
		path: '/menu/create',
		component: <CreateMenu pageheading="Create Menu" />
	},
	{
		name: 'Edit Menu',
		prefix: '/owner',
		path: '/menu/:id',
		component: <EditMenu pageheading="Edit Menu"/>
	},
	{
		name: 'Contact FOMO',
		prefix: '/owner',
		path: '/contact/',
		component: <OwnerContact pageheading="Contact"/>
	},
	{
		name: 'Setting',
		prefix: '/owner',
		path: '/setting',
		component: <OwnerSetting pageheading="Settings"/>
	},
	{
		name: 'Plans',
		prefix: '/owner',
		path: '/plans',
		component: <OwnerPlan pageheading="Plans"/>
	},
	{
		name: 'Subscribe Plan',
		prefix: '/owner',
		path: '/plan/:id',
		component: <SubscribePlan pageheading="Subscribe Plan"/>
	},
	{
		name: 'Order Details',
		prefix: '/owner',
		path: '/order/bill/:event_id/:booking_id',
		component: <OrderBill pageheading="Order Details"/>
	},
	{
		name: 'Queries',
		prefix: '/owner',
		path: '/queries',
		component: <OwnerQueries pageheading="Queries"/>
	},
	{
		name: 'Queries',
		prefix: '/owner',
		path: '/query/:id',
		component: <OwnerViewQuery pageheading="Queries"/>
	}
];

