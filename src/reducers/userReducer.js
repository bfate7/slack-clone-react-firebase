import * as actionTypes from "../actions/types";

const initiaState = {
  currentUser: null,
  isLoading: true,
};

const userReducer = (state = initiaState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: payload,
        isLoading: false,
      };

    case actionTypes.CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default userReducer;
