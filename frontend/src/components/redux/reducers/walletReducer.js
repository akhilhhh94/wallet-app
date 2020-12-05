import { WALLET_ERROR, WALLET_LOADED, WALLET_LOADING } from "../actions/types";

const initialState = {
  isLoading: false,
  wallet: null,
};
const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case WALLET_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case WALLET_LOADED:
      return {
        ...state,
        isLoading: false,
        wallet: action.payload,
      };
    case WALLET_ERROR:
      return { ...state, isLoading: false, balance: null };
    default:
      return state;
  }
};

export default walletReducer;
