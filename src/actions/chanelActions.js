import * as actionTypes from "./types";

export const setCurrentChanel = (chanel) => ({
  type: actionTypes.SET_CURRENT_CHANEL,
  payload: chanel,
});

export const setPrivateChannel = (isPrivateChannel) => ({
  type: actionTypes.SET_PRIVATE_CHANNEL,
  payload: { isPrivateChannel },
});
