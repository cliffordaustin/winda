import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { reducers } from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createFilter from "redux-persist-transform-filter";

const authSubsetFilter = createFilter("auth", ["token"]);

const persistConfig = {
  key: "token",
  storage: storage,
  whitelist: ["auth"],
  transforms: [authSubsetFilter],
};

const middleware = [thunk];

const initialState = {};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

export default { store, persistor };
