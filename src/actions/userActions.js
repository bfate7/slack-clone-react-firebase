import * as actionTypes from "./types";

export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: user,
});

export const clearUser = (user) => ({
  type: actionTypes.CLEAR_USER,
});

export const setUsersPosts = (usersPosts) => ({
  type: actionTypes.SET_USERS_POSTS,
  payload: usersPosts,
});

export const setUserColors = (primaryColor, secondaryColor) => ({
  type: actionTypes.SET_COLORS,
  payload: {
    primaryColor,
    secondaryColor,
  },
});
