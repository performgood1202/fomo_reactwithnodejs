import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  CURRENT_VIEW,
  CLEAR_LOGOUT,
  PAGE_ATTR,
  SAVE_SETTINGS,
  CLEAR_MESSAGES,
  GET_SETTINGS,
  ASYNC_END,
  GET_NOTIFICATION_COUNT,
  GET_NOTIFICATIONS,
  READ_NOTIFICATION
} from "../constants/actionTypes";

const defaultState = {
  pageheading: "Dashboard",
  appName: "vcalc",
  token: null,
  viewChangeCounter: 0,
  dashboardData: [],
  loginSuccess: false,
  redirectTo: false,
  loginError: null,
  appLoaded: false,
  logoutRedirectTo: false,
};

export default (state = defaultState, action) => {

  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        appLoaded: true,
        currentUser:
          action.payload && action.payload.data && action.payload.data.user
            ? action.payload.data.user
            : null,
        clubData: action.payload && action.payload.data && action.payload.data.clubData ? action.payload.data.clubData: null,    
      };
    case REDIRECT:
      return { ...state, redirectTo: "/" };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.payload && action.payload.data && action.payload.data.token ? true : false,
        loginSuccess: action.error || action.payload && action.payload.errMessage ? false : true,
        loginError: action.payload && action.payload.errMessage ? action.payload.errMessage : null,
        token: action.payload && action.payload.data && action.payload.data.token ? action.payload.data.token: null,
        currentUser: action.payload && action.payload.data && action.payload.data.user ? action.payload.data.user: null,
        clubData: action.payload && action.payload.data && action.payload.data.clubData ? action.payload.data.clubData: null,
      };
    case LOGOUT:
      return { ...state, logoutRedirectTo: true, token: null, currentUser: null, loginSuccess: false };
    case CLEAR_LOGOUT:
      return { ...state, logoutRedirectTo: false,redirectTo: false };
    case CURRENT_VIEW:
      return {
        ...state,
        viewName: action.payload.name,
        viewId: action.payload.id,
      };
    case PAGE_ATTR:
      return {
        ...state,
        pageheading: action.pageheading ? action.pageheading: state.pageheading ,
      };  
    case ASYNC_END:
      return {
        ...state,
        authError: action.promise && action.promise.errMessage && action.promise.errMessage && action.promise.errMessage == "Authetication failed" ? true : false,
      };  
    case SAVE_SETTINGS:
            return {
                ...state,
                successSettingMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorSettingMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            };
    case GET_SETTINGS:
            return {
                ...state,
                settingsData : action.payload   && action.payload.data && action.payload.data.settingsData ? action.payload.data.settingsData : null,
                errorSettingMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
    case GET_NOTIFICATION_COUNT:
            return {
                ...state,
                notificationCount : action.payload   && action.payload.data && action.payload.data.notificationCount ? action.payload.data.notificationCount : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
    case GET_NOTIFICATIONS:
            return {
                ...state,
                notificationData : action.payload   && action.payload.data && action.payload.data.notificationData ? action.payload.data.notificationData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
    case READ_NOTIFICATION:
            return {
                ...state,
                readNotificationData : action.payload   && action.payload.data && action.payload.data.readNotificationData ? action.payload.data.readNotificationData : null,
                errorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
    case FORGOT_PASSWORD:
            return {
                ...state,
                forgotPasswordSuccessMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                forgotPasswordErrorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
    case RESET_PASSWORD:
            return {
                ...state,
                resetPasswordSuccessMsg : action.payload   && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                resetPasswordErrorMsg : action.payload   && action.payload.errMessage ? action.payload.errMessage : null,
            }; 
    case CLEAR_MESSAGES:
            return {
                ...state,
                successSettingMsg : null,
                errorSettingMsg : null,
                errorMsg : null,
                successMsg : null,
                forgotPasswordSuccessMsg: null,
                forgotPasswordErrorMsg: null,
                resetPasswordSuccessMsg: null,
                resetPasswordErrorMsg: null,
            };           
    default:
      return state;
  }
};
