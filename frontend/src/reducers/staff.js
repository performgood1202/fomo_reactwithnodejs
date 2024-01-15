import {
    GET_STAFF,
    SAVE_STAFF,
    AFTER_STAFF_SAVE,
    STAFF_DETAIL,
    STAFF_UPDATE,
    ADMIN_CLEAR_MESSAGES,
    DELETE_STAFF
} from "../constants/actionTypes";

const defaultState = {
    staff_members: null,
    saveSuccess: null,
    errorMsg: null,
    saveError: null,
    staff_detail: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case GET_STAFF:
            return {
                ...state,
                staff_members : action.payload && action.payload.data  && action.payload.data.staff ? action.payload.data.staff : null, 
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,               
            };
        case AFTER_STAFF_SAVE:
            return {
                ...state,
                saveSuccess : null,
                saveError : null,                
                errorMsg : null,  
                successMsgStaffDelete : null,
                errorMsgStaffDelete : null,              
            };
        case SAVE_STAFF:
            return {
                ...state,
                saveSuccess : action.payload && action.payload.data  && action.payload.data.message && action.payload.isSuccess ? action.payload.data.message : null,
                saveError : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,                
            };
        case STAFF_UPDATE:
            return {
                ...state,
                saveSuccess : action.payload && action.payload.data  && action.payload.data.message && action.payload.isSuccess ? action.payload.data.message : null,
                saveError : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,                
            };
        case DELETE_STAFF:
            return {
                ...state,
                successMsgStaffDelete : action.payload && action.payload.data  && action.payload.data.message && action.payload.isSuccess ? action.payload.data.message : null,
                errorMsgStaffDelete : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,                
            };
        case STAFF_DETAIL:
            return {
                ...state,
                staff_detail: action.payload && action.payload.data && action.payload.data.detail ? action.payload.data.detail : null
            };
        case ADMIN_CLEAR_MESSAGES:
            return {
                ...state,
                successMsgStaffDelete : null,
                errorMsgStaffDelete : null,
            };
        default:
            return state;
    }
};