import { api } from "./api";
import { errorActions } from "./errorActions";
import { WALLET_LOADING, WALLET_LOADED, WALLET_ERROR } from "./types";
import { uuid } from "uuidv4";

export const createWallet = (user) => async (dispatch) => {
  dispatch({ type: WALLET_LOADING });
  const { id } = user;
  const body = { customer_xid: id };
  api
    .post("init", body)
    .then((res) => {
      console.log(res);
      const { token } = res.data;
      localStorage.setItem("token", token);
      dispatch(getWallet());
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: WALLET_ERROR });
      dispatch(errorActions(err));
    });
};

export const getWallet = () => async (dispatch) => {
  dispatch({ type: WALLET_LOADING });
  api
    .get("wallet")
    .then((res) => {
      dispatch({ type: WALLET_LOADED, payload: res.data });
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
      dispatch(errorActions(err));
      dispatch({ type: WALLET_ERROR });
    });
};

export const makeDeposit = (data) => async (dispatch) => {
  dispatch({ type: WALLET_LOADING });
  const body = { ...data, reference_id: uuid() };
  api
    .post("wallet/deposits", body)
    .then((res) => {
      console.log(res.data);
      const { wallet } = res.data;
      dispatch({ type: WALLET_LOADED, payload: wallet });
    })
    .catch((err) => {
      dispatch({ type: WALLET_ERROR });
      dispatch(errorActions(err));
    });
};
export const makeWithdraw = (data) => async (dispatch) => {
  dispatch({ type: WALLET_LOADING });
  const body = { ...data, reference_id: makeUniqueId() };
  api
    .post("wallet/withdrawals", body)
    .then((res) => {
      console.log(res.data);
      const { wallet } = res.data;
      dispatch({ type: WALLET_LOADED, payload: wallet });
    })
    .catch((err) => {
      dispatch({ type: WALLET_ERROR });
      dispatch(errorActions(err));
    });
};

export const disableWallet = () => async (dispatch) => {
  dispatch({ type: WALLET_LOADING });
  api
    .patch("wallet", { is_disabled: true })
    .then((res) => {
      console.log(res.data);
      dispatch({ type: WALLET_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: WALLET_ERROR });
      dispatch(errorActions(err));
    });
};

export const enableWallet = () => async (dispatch) => {
  dispatch({ type: WALLET_LOADING });
  api
    .post("wallet")
    .then((res) => {
      console.log(res.data);
      dispatch({ type: WALLET_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: WALLET_ERROR });
      dispatch(errorActions(err));
    });
};

const makeUniqueId = () => uuid();
