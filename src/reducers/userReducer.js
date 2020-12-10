import * as actionTypes from "../actions/types";

const initiaState = {
  currentUser: null,
  isLoading: true,
  usersPosts: null,
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

    case actionTypes.SET_USERS_POSTS:
      return {
        ...state,
        usersPosts: payload,
      };

    default:
      return state;
  }
};

export default userReducer;
