import {
  ADD_MANAGER,
  DELETE_MANAGER,
  ADMIN_CLEAR_MESSAGES,
  GET_MANAGERS,
  FETCH_MANAGER_DETAIL,
  UPDATE_MANAGER,
  CREATE_PROMOTION,
  FETCH_PROMOTIONS,
  FETCH_PROMOTION_DETAIL,
  ADD_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  DELETE_EVENT_IMAGE,
  FETCH_EVENTS,
  FETCH_EVENT_DETAIL,
  ADD_MENU,
  FETCH_MENU,
  GET_MENU_DETAIL,
  DELETE_MENU,
  UPDATE_MENU,
  OWNER_DASHBOARD_DATA,
  CONTACT_BY_OWNER,
  SAVE_STRIPE_ACCOUNT,
  CHANGE_PASSWORD,
  CHECK_STRIPE_ACCOUNT,
  LOGIN_STRIPE,
  SETUP_STRIPE,
  FETCH_STRIPE_BANK_DETAILS,
  EDIT_STRIPE_BANK_DETAILS,
  GET_SUBSCRIPTION,
  OWNER_SUBSCRIBE_PLAN,
  OWNER_PROFILE_UPDATE,
  CANCEL_SUBSCRIPTION,
  GET_BOOKINGS,
  ASSIGN_TABLE,
  OWNER_EARNING_DATA,
  FETCH_ORDERS_EARNINGS,
  FETCH_EVENTS_EARNINGS
} from "../constants/actionTypes";


const defaultState = {
    successMsg: null,
    errorMsg: null,
    successMsgDelete: null,
    errorMsgDelete: null,
};

export default (state = defaultState, action) => {

    switch (action.type) { 
        case OWNER_DASHBOARD_DATA:
            return {
                ...state,
                dashboarddata : action.payload   && action.payload.data && action.payload.data.dashboard ? action.payload.data.dashboard : null,
            }; 
        case ADD_MANAGER:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case DELETE_MANAGER:
            return {
                ...state,
                successMsgDelete : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsgDelete : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case UPDATE_MANAGER:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_MANAGERS:
            return {
                ...state,
                managerData : action.payload   && action.payload.data && action.payload.data.managerData ? action.payload.data.managerData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FETCH_MANAGER_DETAIL:
            return {
                ...state,
                managerDetail : action.payload   && action.payload.data && action.payload.data.managerDetail ? action.payload.data.managerDetail : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FETCH_PROMOTIONS:
            return {
                 ...state,
                promotionData : action.payload   && action.payload.data && action.payload.data.promotionData ? action.payload.data.promotionData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FETCH_PROMOTION_DETAIL:
            return {
                 ...state,
                promotionDetail : action.payload   && action.payload.data && action.payload.data.promotionDetail ? action.payload.data.promotionDetail : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case CREATE_PROMOTION:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FETCH_EVENTS:
            return {
                 ...state,
                eventData : action.payload   && action.payload.data && action.payload.data.eventData ? action.payload.data.eventData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FETCH_EVENT_DETAIL:
            return {
                 ...state,
                eventDetail : action.payload   && action.payload.data && action.payload.data.eventDetail ? action.payload.data.eventDetail : null,
                bookingData : action.payload   && action.payload.data && action.payload.data.bookingData ? action.payload.data.bookingData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case DELETE_EVENT:
            return {
                 ...state,
                successMsgDelete : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsgDelete : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADD_EVENT:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case UPDATE_EVENT:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case DELETE_EVENT_IMAGE:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADD_MENU:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case UPDATE_MENU:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case DELETE_MENU:
            return {
                 ...state,
                successMsgDelete : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsgDelete : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FETCH_MENU:
            return {
                 ...state,
                menuData : action.payload   && action.payload.data && action.payload.data.menuData ? action.payload.data.menuData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_MENU_DETAIL:
            return {
                 ...state,
                menuDetail : action.payload   && action.payload.data && action.payload.data.menuDetail ? action.payload.data.menuDetail : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case CONTACT_BY_OWNER:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case CHANGE_PASSWORD:
          return {
                  ...state,
                  successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                  errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
          };     
        case SAVE_STRIPE_ACCOUNT:
            return {
                 ...state,
                setupData : action.payload   && action.payload.data && action.payload.data.setupData ? action.payload.data.setupData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case CHECK_STRIPE_ACCOUNT:
            return {
                 ...state,
                accountVarify : action.payload   && action.payload.data && action.payload.data.accountVarify ? action.payload.data.accountVarify : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };  
        case LOGIN_STRIPE:
            return {
                 ...state,
                loginUrl : action.payload   && action.payload.data && action.payload.data.loginUrl ? action.payload.data.loginUrl : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case SETUP_STRIPE:
            return {
                 ...state,
                setupData : action.payload   && action.payload.data && action.payload.data.setupData ? action.payload.data.setupData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case FETCH_STRIPE_BANK_DETAILS:
            return {
                 ...state,
                bankDetails : action.payload   && action.payload.data && action.payload.data.bankDetails ? action.payload.data.bankDetails : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case EDIT_STRIPE_BANK_DETAILS:
            return {
                 ...state,
                loginUrl : action.payload   && action.payload.data && action.payload.data.loginUrl ? action.payload.data.loginUrl : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case GET_SUBSCRIPTION:
            return {
                 ...state,
                subscriptionData : action.payload   && action.payload.data && action.payload.data.subscriptionData ? action.payload.data.subscriptionData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };  
        case OWNER_SUBSCRIBE_PLAN:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case OWNER_PROFILE_UPDATE:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case CANCEL_SUBSCRIPTION:
            return {
                 ...state,
                successMsgCancel : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsgCancel : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_BOOKINGS:
            return {
                 ...state,
                eventBookingData : action.payload   && action.payload.data && action.payload.data.eventBookingData ? action.payload.data.eventBookingData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ASSIGN_TABLE:
            return {
                 ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case OWNER_EARNING_DATA:
            return {
                 ...state,
                earningData : action.payload   && action.payload.data && action.payload.data.earningData ? action.payload.data.earningData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case FETCH_ORDERS_EARNINGS:
            return {
                 ...state,
                orderEarningData : action.payload   && action.payload.data && action.payload.data.orderEarningData ? action.payload.data.orderEarningData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };    
        case FETCH_EVENTS_EARNINGS:
            return {
                 ...state,
                eventEarningData : action.payload   && action.payload.data && action.payload.data.eventEarningData ? action.payload.data.eventEarningData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };     
        case ADMIN_CLEAR_MESSAGES:
            return {
                ...state,
                successMsg : null,
                errorMsg : null,
                errorMsgDelete : null,
                successMsgDelete : null,
                loginUrl:null,
                setupData:null,
                successMsgCancel:null,
                errorMsgCancel:null,
            };        
        default:
            return state;
    }
};