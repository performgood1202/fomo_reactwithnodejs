import {
 MANGER_PROFILE_UPDATE,
 MANGER_CHANGE_PASSWORD,
 ADMIN_CLEAR_MESSAGES,
 GET_CURRENT_ORDERS,
 GET_ORDER_DETAIL,
 SET_ORDER_STATUS,
 GET_ORDER_BILL,
 GENERATE_ORDER_INVOICE
} from "../constants/actionTypes";


const defaultState = {
    successMsg: null,
    errorMsg: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
       
        case MANGER_PROFILE_UPDATE:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case MANGER_CHANGE_PASSWORD:
            return {
                ...state,
                successMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_CURRENT_ORDERS:
            return {
                ...state,
                bookingData : action.payload   && action.payload.data && action.payload.data.bookingData ? action.payload.data.bookingData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_ORDER_DETAIL:
            return {
                ...state,
                orderData : action.payload   && action.payload.data && action.payload.data.orderData ? action.payload.data.orderData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GET_ORDER_BILL:
            return {
                ...state,
                orderBillData : action.payload   && action.payload.data && action.payload.data.orderBillData ? action.payload.data.orderBillData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case SET_ORDER_STATUS:
            return {
                ...state,
                orderStatusSuccessMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                orderStatusErrorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case GENERATE_ORDER_INVOICE:
            return {
                ...state,
                orderInvoiceSuccessMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                orderInvoiceErrorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
        case ADMIN_CLEAR_MESSAGES:
            return {
                ...state,
                successMsg : null,
                errorMsg : null,
                orderStatusSuccessMsg : null,
                orderStatusErrorMsg : null,
                orderInvoiceSuccessMsg : null,
                orderInvoiceErrorMsg : null,
            };    
        default:
            return state;
    }
};