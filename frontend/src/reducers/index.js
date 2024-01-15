import auth from "./auth";
import { combineReducers } from "redux";
import common from "./common";
import plan from "./plan";
import admin from "./admin";
import manager from "./manager";
import club from "./club";
import query from "./query";
import staff from "./staff";
import owner from "./owner";
import { routerReducer } from "react-router-redux";

export default combineReducers({
    auth,
    admin,
    manager,
    common,
    plan,
    club,
    query,
    staff,
    owner,
    router: routerReducer,
});
