import { persistReducer } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

const homePageState = {
  topBanner: true,
};

const homePageReducer = (state = homePageState, action) => {
  switch (action.type) {
    case "HIDE_TOP_BANNER":
      return { ...state, topBanner: false };

    case "SHOW_TOP_BANNER":
      return { ...state, topBanner: true };

    default:
      return state;
  }
};

const persistConfig = {
  key: "home",
  storage: storage,
  whitelist: ["topBanner"],
};

export default persistReducer(persistConfig, homePageReducer);
