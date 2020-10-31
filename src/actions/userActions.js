import * as actionTypes from "./types";

export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: user,
});

export const clearUser = (user) => ({
  type: actionTypes.CLEAR_USER,
});
