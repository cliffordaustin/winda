import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";

import authenticationReducer from "./auth";
import homePageReducer from "./home";
import stayReducer from "./stay";
import activityReducer from "./activity";

export const reducers = combineReducers({
  auth: authenticationReducer,
  home: homePageReducer,
  stay: stayReducer,
  activity: activityReducer,
});

export const mainReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      activity: {
        activities: [
          ...action.payload.activity.activities,
          ...state.activity.activities,
        ],
      },
      stay: {
        stays: [...action.payload.stay.stays, ...state.stay.stays],
      },
    };
    if (state.stay.stays.length > 0) {
      nextState.stay.stays = state.stay.stays;
    }
    if (state.activity.activities.length > 0) {
      nextState.activity.activities = state.activity.activities;
    }
    return nextState;
  } else {
    return reducers(state, action);
  }
};
