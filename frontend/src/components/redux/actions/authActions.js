import Axios from "axios";
import { errorActions } from "./errorActions";
import { USER_LOADED, USER_LOADING, AUTH_ERROR, AUTH_SUCCESS } from "./types";

export const login = () => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const body = { username: "johndoe@gmail.com", password: "johndoe" };

  Axios({
    method: "post",
    url: "http://localhost:8000/api/v1/auth/login",
    data: body,
  })
    .then((res) => {
      if (res.status === 200) {
        dispatch({ type: AUTH_SUCCESS, payload: res.data });
      }
    })
    .catch((err) => {
      dispatch({ type: AUTH_ERROR });
      dispatch(errorActions(err));
    });
};
