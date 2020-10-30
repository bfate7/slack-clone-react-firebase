import * as actionTypes from "./types";

export const setUser = (user) => {
  return { type: actionTypes.SET_USER, payload: user };
};

export const clearUser = (user) => {
  return { type: actionTypes.CLEAR_USER };
};
