import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import walletReducer from "./walletReducer";
import authReducer from "./authReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "wallet"],
};

const rootReducer = combineReducers({
  wallet: walletReducer,
  auth: authReducer,
});

export default persistReducer(persistConfig, rootReducer);
