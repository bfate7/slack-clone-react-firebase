import * as actionTypes from "../actions/types";

const initiaState = {
  currentChannel: null,
  isPrivate: false,
};

const channelReducer = (state = initiaState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: payload,
      };

    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivate: payload.isPrivateChannel,
      };

    default:
      return state;
  }
};

export default channelReducer;
