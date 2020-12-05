import { login } from "./authActions";

export const errorActions = (err) => async (dispatch) => {
  console.log(err.response);

  const { status } = err.response;
  const { detail } = err.response.data;
  if (status !== undefined && status === 401) {
    dispatch(login());
  } else if (status === 400 && detail !== undefined) {
    alert(detail);
  }
};
