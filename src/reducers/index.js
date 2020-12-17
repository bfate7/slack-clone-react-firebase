import { combineReducers } from "redux";
import userReducer from "./userReducer";
import channelReducer from "./channelReduser";

export default combineReducers({ user: userReducer, channel: channelReducer });
