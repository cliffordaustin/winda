import { combineReducers } from "redux";

import authenticationReducer from "./auth";
import homePageReducer from "./home";

export const reducers = combineReducers({
  auth: authenticationReducer,
  home: homePageReducer,
});
