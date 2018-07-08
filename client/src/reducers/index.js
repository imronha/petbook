// Root reducer, bring and combine in all other reducers here
import { combineReducers } from "redux";
import authReducer from "./authReducer";

export default combineReducers({
  auth: authReducer
});
