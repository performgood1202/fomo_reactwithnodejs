import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_BACKEND;

let token = null;
const tokenPlugin = (req) => {
  	if (token) {
    	req.set("Authorization", `Bearer ${token}`);
  	}
};

const responseBody = (res) => res.body;


const requests = {
	del: (url) =>
		superagent.del(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.then(responseBody),
	get: (url) =>	
		superagent.get(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.then(responseBody),
	put: (url, body) =>
		superagent
			.put(`${API_ROOT}${url}`, body)
			.use(tokenPlugin)
			.then(responseBody),
	post: (url, body) =>
		superagent
			.post(`${API_ROOT}${url}`, body)
			.use(tokenPlugin)
			.then(responseBody),
}

const Auth = {
	current: () => requests.get("/auth/info"),
	login: (formData) => requests.post("/auth/login", formData),
	ForgotPassword: (formData) => requests.post("/auth/ForgotPassword", formData),
	ResetPassword: (formData) => requests.post("/auth/ResetPassword", formData),
}

const Plans = {
	fetch: () => requests.get("/api/plans"),
	features: () => requests.get('/api/features'),
	detail: (id) => requests.get('/api/plan/'+id),
	subscribe: (formData) => requests.post("/subscription/create", formData),
}
const adminPlan = {
	fetch: () => requests.get("/admin/plans"),
	add: (formData) => requests.post("/admin/plan/create",formData),
	edit: (formData) => requests.post("/admin/plan/update",formData),
	singlefetch: (id) => requests.get('/admin/plan/'+id),
}
const adminFeature = {
	fetch: () => requests.get("/admin/features"),
	add: (formData) => requests.post("/admin/feature/create",formData),
	edit: (formData) => requests.post("/admin/feature/update",formData),
	delete: (formData) => requests.post("/admin/feature/remove",formData),
	fetchPlanFeature: (planId) => requests.get("/admin/planfeature/"+planId),
}
const Query = {
	sendQuery: (formData) => requests.post("/api/sendquery",formData),
}
const club = {
	fetch: (formData) => requests.post("/admin/clubs/",formData),
	fetchClubRequests: () => requests.get("/admin/club/clubrequests"),
	acceptClubRequest: (formData) => requests.post("/admin/club/acceptclubrequest",formData),
	declineClubRequest: (formData) => requests.post("/admin/club/declineclubrequest",formData),
	fetchClubById: (id) => requests.get("/admin/club/"+id),
	delete: (formData) => requests.post("/admin/club/remove",formData),
}
const admin = {
	dashboardData: (formData) => requests.post("/admin/dashboarddata",formData),
	fetchEarningData: () => requests.get("/admin/earningdata"),
	payments: (formData) => requests.post("/admin/payments",formData),
	fetchPaymentById: (id) => requests.get("/admin/payment/fetch/"+id),
	fetchQueries: () => requests.get("/admin/queries/fetch/"),
	fetchQuery: (query_id) => requests.get("/admin/query/detail/"+query_id),
	resolveQuery: (formData) => requests.post("/admin/query/resolve",formData),
	recentClubRequest: () => requests.get("/admin/club/recentclubrequests"),
	updateProfile: (formData) => requests.post("/admin/profile/update",formData),
	savePromotionSettings: (formData) => requests.post("/admin/promotion/setting/save",formData),
	getPromotionSettings: () => requests.get("/admin/promotion/settings/"),
	fetchAdminPromotionsDash: (formData) => requests.post("/admin/promotiondashboard/",formData),
	fetchPromotionDetail: (formData) => requests.post("/admin/promotion/detail",formData),
	fetchPromotions: (formData) => requests.post("/admin/promotion/history",formData),
	changePassword: (formData) => requests.post("/admin/password/change",formData),
	saveSettings: (formData) => requests.post("/admin/setting/save",formData),
	getNotificationStatus: () => requests.get("/admin/notification_status"),
	fetchPromotionByClub: (club_id) => requests.get("/admin/club/getpromotions/"+club_id),
}
const owner = {
	dashboardData: (formData) => requests.post("/owner/dashboarddata",formData),
	addManager: (formData) => requests.post("/owner/manager/create",formData),
	deleteManager: (formData) => requests.post("/owner/manager/delete",formData),
	fetchManagers: (formData) => requests.post("/owner/managers/",formData),
	getManagerDetail: (formData) => requests.post("/owner/manager/detail",formData),
	updateManager: (formData) => requests.post("/owner/manager/update",formData),
	createPromotion: (formData) => requests.post("/owner/promotion/create",formData),
	fetchPromotions: (formData) => requests.post("/owner/promotions/",formData),
	fetchPromotionDetail: (formData) => requests.post("/owner/promotion/detail",formData),
	addEvent: (formData) => requests.post("/owner/event/create",formData),
	updateEvent: (formData) => requests.post("/owner/event/update",formData),
	deleteEventImage: (formData) => requests.post("/owner/event/deleteimage",formData),
	fetchEvents: (formData) => requests.post("/owner/events/",formData),
	getEventDetail: (formData) => requests.post("/owner/event/fetch",formData),
	deleteEvent: (formData) => requests.post("/owner/event/delete",formData),
	addMenu: (formData) => requests.post("/owner/menu/create",formData),
	updateMenu: (formData) => requests.post("/owner/menu/update",formData),
	fetchMenu: (formData) => requests.post("/owner/menu/",formData),
	getMenuDetail: (formData) => requests.post("/owner/menu/detail",formData),
	deleteMenu: (formData) => requests.post("/owner/menu/remove",formData),
	contactByOwner: (formData) => requests.post("/owner/contact/add",formData),
	changePassword: (formData) => requests.post("/owner/password/change",formData),
	saveStripeAccount: (formData) => requests.post("/owner/saveStripeAccount",formData),
	editBankDetails: (stripe_account_id,bank_account_id,) => requests.get("/owner/editBankDetails/"+stripe_account_id+"/"+bank_account_id),
	loginStripe: (stripe_account_id) => requests.get("/owner/loginStripe/"+stripe_account_id),
	setupStripe: (stripe_account_id) => requests.get("/owner/setupStripe/"+stripe_account_id),
	fetchBankDetails: (stripe_account_id) => requests.get("/owner/fetchBankDetails/"+stripe_account_id),
	checkStripeAccountStatus: (stripe_account_id) => requests.get("/owner/checkStripeAccountStatus/"+stripe_account_id),
	getSubscription: () => requests.get("/owner/getSubscription/"),
	subscribePlan: (formData) => requests.post("/owner/subscribePlan/",formData),
	updateProfile: (formData) => requests.post("/owner/profile/update",formData),
	cancelSubscription: (formData) => requests.post("/owner/cancelSubscription",formData),
	getBookings: (formData) => requests.post("/owner/bookings/",formData),
	assignTable: (formData) => requests.post("/owner/booking/assignTable/",formData),
	fetchEarningData: () => requests.get("/owner/fetchEarningData/"),
	getOrderBill: (formData) => requests.post("/owner/getOrderBill/",formData),
	fetchOrderEarnings: () => requests.get("/owner/fetchOrderEarnings/"),
	fetchEventEarnings: () => requests.get("/owner/fetchEventEarnings/"),
	fetchQueries: () => requests.get("/owner/queries/fetch/"),
	fetchQuery: (query_id) => requests.get("/owner/query/detail/"+query_id),
	resolveQuery: (formData) => requests.post("/owner/query/resolve",formData),
}
const manager = {
	addEvent: (formData) => requests.post("/manager/event/create",formData),
	updateEvent: (formData) => requests.post("/manager/event/update",formData),
	deleteEventImage: (formData) => requests.post("/manager/event/deleteimage",formData),
	fetchEvents: (formData) => requests.post("/manager/events/",formData),
	getEventDetail: (formData) => requests.post("/manager/event/fetch",formData),
	deleteEvent: (formData) => requests.post("/manager/event/delete",formData),
	addMenu: (formData) => requests.post("/manager/menu/create",formData),
	updateMenu: (formData) => requests.post("/manager/menu/update",formData),
	fetchMenu: (formData) => requests.post("/manager/menu/",formData),
	getMenuDetail: (formData) => requests.post("/manager/menu/detail",formData),
	deleteMenu: (formData) => requests.post("/manager/menu/remove",formData),
	updateProfile: (formData) => requests.post("/manager/profile/update",formData),
	changePassword: (formData) => requests.post("/manager/password/change",formData),
	getBookings: (formData) => requests.post("/manager/bookings/",formData),
	assignTable: (formData) => requests.post("/manager/booking/assignTable/",formData),
	getCurrentOrders: (formData) => requests.post("/manager/getCurrentOrders/",formData),
	getOrderDetail: (booking_id,order_id) => requests.get("/manager/getOrderDetail/"+booking_id+"/"+order_id),
	setOrderStatus: (formData) => requests.post("/manager/setOrderStatus/",formData),
	getOrderBill: (formData) => requests.post("/manager/getOrderBill/",formData),
	generateOrderInvoice: (formData) => requests.post("/manager/generateOrderInvoice/",formData),
}

const managerStaff = {
	staffData: (formData,role) => requests.post('/'+role+'/staff/members',formData),
	staffSave: (formData,role) => requests.post("/"+role+"/staff/create",formData),
	staffUpdate: (formData,role) => requests.post("/"+role+"/staff/update",formData),
	staffDetail: (formData,role) => requests.post("/"+role+"/staff/detail",formData),
	deleteStaff: (formData,role) => requests.post("/"+role+"/staff/delete",formData),
}

const common = {
	saveSetting: (formData) => requests.post("/api/saveSetting",formData),
	getSettings: () => requests.get("/api/getSettings"),
	getNotificationCount: () => requests.get("/api/getNotificationCount"),
	getNotifications: () => requests.get("/api/getNotifications"),
	readNotification: (notification_id) => requests.get("/api/readNotification/"+notification_id),
}

export default {
	Auth,
	Plans,
	club,
	admin,
	adminPlan,
	adminFeature,
	Query,
	owner,
	manager,
	managerStaff,
	common,
	setToken: (_token) => {
    	token = _token;
  	},
};