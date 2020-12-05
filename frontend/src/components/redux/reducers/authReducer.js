import { AUTH_ERROR, AUTH_SUCCESS, USER_LOADING } from "../actions/types";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: {},
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_SUCCESS:
      const { user, token } = action.payload;
      console.log(user);
      localStorage.setItem("token", token);
      return {
        ...state,
        isLoading: true,
        user: user,
        token: token,
      };
    case AUTH_ERROR:
      return {
        ...state,
        isLoading: false,
        user: {},
        token: null,
      };
    default:
      return state;
  }
};
export default authReducer;
