import {
  SEND_QUERY,
  AFTER_SUCCESS,
  FETCH_QUERIES,
  CLEAR_MESSAGES,
  FETCH_QUERY,
  RESOLVE_QUERY
} from "../constants/actionTypes";


const defaultState = {
    successMsg: null,
    errorMsg: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SEND_QUERY:
            return {
                ...state,
                successMsg : action.payload  && action.payload.isSuccess && action.payload.data ? action.payload.message : null,
                errorMsg : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case RESOLVE_QUERY:
            return {
                ...state,
                successMsg : action.payload  && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsg : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case FETCH_QUERIES:
            return {
                ...state,
                queryData : action.payload  && action.payload.data && action.payload.data.queryData ? action.payload.data.queryData : null,
                errorMsg : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case FETCH_QUERY:
            return {
                ...state,
                queryDetailData : action.payload  && action.payload.data && action.payload.data.queryDetailData ? action.payload.data.queryDetailData : null,
                errorMsg : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case AFTER_SUCCESS:
         return {
                ...state,
                successMsg: null,
                errorMsg: null
         };
        case CLEAR_MESSAGES:
         return {
                ...state,
                successMsg: null,
                errorMsg: null
         };
        default:
            return state;
    }
};