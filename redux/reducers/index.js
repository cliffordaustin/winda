import { combineReducers } from "redux";

import authenticationReducer from "./auth";
import homePageReducer from "./home";
import stayReducer from "./stay";

export const reducers = combineReducers({
  auth: authenticationReducer,
  home: homePageReducer,
  stay: stayReducer,
});
