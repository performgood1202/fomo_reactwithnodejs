import {
  PLAN_FETCH,
  ADMIN_PLAN_FETCH,
  PLAN_FEATURES,
  PLAN_DETAIL,
  SUBSCRIBE_PLAN,
  ADD_PLAN,
  ADMIN_FEATURE_FETCH,
  ADD_FEATURE,
  CLEAR_PLAN_MESSAGE,
  ADMIN_PLAN_DETAIL,
  ADMIN_EDIT_PLAN,
  ADMIN_PLAN_FEATURE_FETCH,
  EDIT_FEATURE,
  DELETE_FEATURE,
  CLEAR_PLAN_DATA,
  CLEAR_MESSAGES
} from "../constants/actionTypes";



const defaultState = {
    plans: null,
    plan_features: null,
    adminplans: null,
    adminPlanDetail: null,
    features: null,
    detail: null,
    data: false,
    successMessagePlan: null,
    errorMessagePlan: null,
    planSuccess: null,
    planError: null,
    spSuccess: null,
    spError: null,
    adminfeature: null,
    errorMessageFeature: null,
    successMessageFeature: null,
    adminplanfeature:null,
    successMessagePlanFeature:null,
    errorMessagePlanFeature:null,
    plan_feature:null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case PLAN_FETCH:
            return {
                ...state,
                data: action.payload && action.payload.data ? true : false,
                plans : action.payload && action.payload.data  && action.payload.data.plans ? action.payload.data.plans : null,
                plan_features : action.payload && action.payload.data  && action.payload.data.features ? action.payload.data.features : null                
            };
        case ADMIN_PLAN_FETCH:
            return {
                ...state,
                data: action.payload && action.payload.data ? true : false,
                adminplans : action.payload && action.payload.data  && action.payload.data.plans ? action.payload.data.plans : null
            };
        case PLAN_FEATURES:
            return {
                ...state,
                features : action.payload && action.payload.data  && action.payload.data.features ? action.payload.data.features : null
            };
        case PLAN_DETAIL:
            return {
                ...state,
                detail : action.payload && action.payload.data && action.payload.data.plan ? action.payload.data.plan : null
            };
        case ADMIN_PLAN_DETAIL:
            return {
                ...state,
                adminPlanDetail : action.payload && action.payload.data && action.payload.data.plan ? action.payload.data.plan : null
            };    
        case ADD_PLAN:
            return {
                ...state,
                successMessagePlan : action.payload  && action.payload.isSuccess && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessagePlan : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case ADMIN_EDIT_PLAN:
            return {
                ...state,
                successMessagePlanFeature : action.payload  && action.payload.isSuccess && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessagePlanFeature : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case ADD_FEATURE:
            return {
                ...state,
                successMessageFeature : action.payload  && action.payload.isSuccess && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessageFeature : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case EDIT_FEATURE:
            return {
                ...state,
                successMessageFeature : action.payload  && action.payload.isSuccess && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessageFeature : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case DELETE_FEATURE:
            return {
                ...state,
                successMessageFeature : action.payload  && action.payload.isSuccess && action.payload.data && action.payload.data.message ? action.payload.data.message : null,
                errorMessageFeature : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case ADMIN_FEATURE_FETCH:
            return {
                ...state,
                adminfeature : action.payload && action.payload.data  && action.payload.data.features ? action.payload.data.features : null
            };
        case ADMIN_PLAN_FEATURE_FETCH:
            return {
                ...state,
                adminplanfeature : action.payload && action.payload.data  && action.payload.data.planfeature ? action.payload.data.planfeature : null,
            }; 
        case CLEAR_PLAN_MESSAGE:
            return {
                ...state,
                successMessagePlan : null,
                errorMessagePlan : null,
                successMessageFeature : null,
                errorMessageFeature : null,
                successMessagePlanFeature : null,
                errorMessagePlanFeature : null,
            };
        case CLEAR_PLAN_DATA:
            return {
                ...state,
                plan_feature : null,
            };
        case SUBSCRIBE_PLAN:
            return {
                ...state,
                spSuccess : action.payload  && action.payload.isSuccess && action.payload.data ? action.payload.message : null,
                spError : action.payload  && action.payload.errMessage ? action.payload.errMessage : null
            };
        case CLEAR_MESSAGES:
            return {
                ...state,
                spSuccess : null,
                spError : null
            };
        default:
            return state;
    }
};