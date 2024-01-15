import {
  FEATCH_CLUB_REQUEST,
  ACCEPT_CLUB_REQUEST,
  CLEAR_REQUEST_MESSAGE,
  DECLINE_CLUB_REQUEST,
  ADMIN_CLUB_FETCH,
  RECENT_CLUB_REQUEST,
  FEATCH_CLUB_BY_ID,
  DELETE_CLUB,
  ADMIN_CLEAR_MESSAGES
} from "../constants/actionTypes";


const defaultState = {
    successMsg: null,
    errorMsg: null,
    successMsgDelete: null,
    errorMsgDelete: null,
    successMessageClubRequest: null,
    errorMessageClubRequest: null,
    clubrequests:[],
    recentclubrequests:[],
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case ADMIN_CLUB_FETCH:
            return {
                ...state,
                adminclubs : action.payload   && action.payload.data && action.payload.data.clubs ? action.payload.data.clubs : null,
                errorMsg : action.payload   &&  action.payload.errMessage ? action.payload.errMessage : null,
            };
        case FEATCH_CLUB_BY_ID:
            return {
                ...state,
                clubData : action.payload   && action.payload.data && action.payload.data.clubData ? action.payload.data.clubData : null,
            };
        case DELETE_CLUB:
            return {
                ...state,
                successMsgDelete : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMsgDelete : action.payload   &&  action.payload.errMessage ? action.payload.errMessage : null,
            };    
        case FEATCH_CLUB_REQUEST:
            return {
                ...state,
                clubrequests : action.payload   && action.payload.data && action.payload.data.clubs ? action.payload.data.clubs : null,
                errorMsg : action.payload  &&  action.payload.errMessage ? action.payload.errMessage : null,
            };
        case RECENT_CLUB_REQUEST:
            return {
                ...state,
                recentclubrequests : action.payload   && action.payload.data && action.payload.data.clubs ? action.payload.data.clubs : null,
            };
        case ACCEPT_CLUB_REQUEST:
            return {
                ...state,
                successMessageClubRequest : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessageClubRequest : action.payload   &&  action.payload.errMessage ? action.payload.errMessage : null,
            };
        case DECLINE_CLUB_REQUEST:
            return {
                ...state,
                successMessageClubRequest : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessageClubRequest : action.payload   &&  action.payload.errMessage ? action.payload.errMessage : null,
            };
        case CLEAR_REQUEST_MESSAGE:
            return {
                ...state,
                successMessageClubRequest : null,
                errorMessageClubRequest :  null,
            };
        case ADMIN_CLEAR_MESSAGES:
            return {
                ...state,
                successMsg : null,
                errorMsg : null,
                successMsgDelete : null,
                errorMsgDelete : null,

            };     
        default:
            return state;
    }
};