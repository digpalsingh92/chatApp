import { combineReducers } from "redux";
import authSlice from "@/redux/slices/authSlice";
import chatSlice from "@/redux/slices/chatSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
});

export default rootReducer;
