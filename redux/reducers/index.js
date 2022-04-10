import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";

import authenticationReducer from "./auth";
import homePageReducer from "./home";
import stayReducer from "./stay";

export const mainReducer = combineReducers({
  auth: authenticationReducer,
  home: homePageReducer,
  stay: stayReducer,
});

// export const mainReducer = (state, action) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state,
//       ...action.payload,
//     };
//     // if (state.stay.name) {
//     //   nextState.stay.name = state.stay.name;
//     // }
//     return nextState;
//   } else {
//     return reducers(state, action);
//   }
// };
