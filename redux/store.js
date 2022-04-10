import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { mainReducer } from "./reducers";
import { persistStore } from "redux-persist";
import { createWrapper, Context } from "next-redux-wrapper";

const middleware = [thunk];

const initialState = {};

const store = createStore(
  mainReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

const makeStore = (Context) => store;

export const wrapper = createWrapper(makeStore);

export default { store, persistor };
