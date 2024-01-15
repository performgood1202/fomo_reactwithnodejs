import {
  ADMIN_DASHBOARD_DATA,
  ADMIN_PROFILE_UPDATE,
  ADMIN_CLEAR_MESSAGES,
  SAVE_PROMOTION_SETTING,
  GET_PROMOTION_SETTING,
  FETCH_ADMIN_PROMOTIONS,
  ADMIN_EARNING_DATA,
  ADMIN_CHANGE_PASSWORD,
  ADMIN_SAVE_SETTINGS,
  ADMIN_GET_NOTIFICATION_STATUS,
  PROMOTIONS_BY_CLUB,
  ADMIN_PAYMENTS_FETCH,
  FEATCH_PAYMENT_BY_ID
} from "../constants/actionTypes";


const defaultState = {
    successMsg: null,
    errorMsg: null,
    promotionSettings: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case ADMIN_DASHBOARD_DATA:
            return {
                ...state,
                dashboarddata : action.payload   && action.payload.data && action.payload.data.dashboard ? action.payload.data.dashboard : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case ADMIN_EARNING_DATA:
            return {
                ...state,
                earningData : action.payload   && action.payload.data && action.payload.data.earningData ? action.payload.data.earningData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADMIN_PAYMENTS_FETCH:
            return {
                ...state,
                paymentsData : action.payload   && action.payload.data && action.payload.data.paymentsData ? action.payload.data.paymentsData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FEATCH_PAYMENT_BY_ID:
            return {
                ...state,
                paymentData : action.payload   && action.payload.data && action.payload.data.paymentData ? action.payload.data.paymentData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADMIN_GET_NOTIFICATION_STATUS:
            return {
                ...state,
                notificationStatus : action.payload   && action.payload.data && action.payload.data.notificationStatus ? action.payload.data.notificationStatus : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case ADMIN_CHANGE_PASSWORD:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADMIN_SAVE_SETTINGS:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADMIN_PROFILE_UPDATE:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case SAVE_PROMOTION_SETTING:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_PROMOTION_SETTING:
            return {
                ...state,
                promotionSettings : action.payload   && action.payload.data && action.payload.data.promotionSettings ? action.payload.data.promotionSettings : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case FETCH_ADMIN_PROMOTIONS:
            return {
                ...state,
                promotionData : action.payload   && action.payload.data && action.payload.data.promotionData ? action.payload.data.promotionData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
        case PROMOTIONS_BY_CLUB:
            return {
                ...state,
                promotionDataByClub : action.payload   && action.payload.data && action.payload.data.promotionDataByClub ? action.payload.data.promotionDataByClub : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };     
        case ADMIN_CLEAR_MESSAGES:
            return {
                ...state,
                successMsg : null,
                errorMsg : null,
            };    
        default:
            return state;
    }
};