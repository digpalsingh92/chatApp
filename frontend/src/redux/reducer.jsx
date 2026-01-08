import { combineReducers } from "redux";
import authSlice from "@/redux/slices/authSlice";

const rootReducer = combineReducers({
  auth: authSlice,
});

export default rootReducer;
