import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";

import authenticationReducer from "./auth";
import homePageReducer from "./home";
import stayReducer from "./stay";

export const reducers = combineReducers({
  auth: authenticationReducer,
  home: homePageReducer,
  stay: stayReducer,
});

export const mainReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      stay: {
        stays: [...action.payload.stay.stays, ...state.stay.stays],
      },
    };

    return nextState;
  } else {
    return reducers(state, action);
  }
};
