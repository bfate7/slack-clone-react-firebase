import * as actionTypes from "../actions/types";

const initiaState = {
  currentChanel: null,
  isPrivate: false,
};

const chanelReducer = (state = initiaState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_CURRENT_CHANEL:
      return {
        ...state,
        currentChanel: payload,
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

export default chanelReducer;
