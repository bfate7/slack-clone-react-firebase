import { combineReducers } from "redux";
import userReducer from "./userReducer";
import chanelReducer from "./chanelReduser";

export default combineReducers({ user: userReducer, chanel: chanelReducer });
