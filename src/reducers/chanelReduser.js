import * as actionTypes from "../actions/types";

const initiaState = {
  currentChanel: null,
};

const chanelReducer = (state = initiaState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_CURRENT_CHANEL:
      return {
        ...state,
        currentChanel: payload,
      };

    default:
      return state;
  }
};

export default chanelReducer;
