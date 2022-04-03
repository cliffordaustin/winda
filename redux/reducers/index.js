import { combineReducers } from "redux";

import authenticationReducer from "./auth";

export const reducers = combineReducers({
  auth: authenticationReducer,
});
