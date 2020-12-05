import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "../redux/actions/walletActions";
import CreateWallet from "./createwallet";
import WalletDetail from "./walletDetail";

function Wallet() {
  const { isLoading, wallet } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWallet());
  }, []);
  return (
    <div className="w-1/4 h-48">
      {isLoading ? (
        <span>Loading...</span>
      ) : wallet !== null ? (
        <WalletDetail wallet={wallet} />
      ) : (
        <CreateWallet />
      )}
    </div>
  );
}

export default Wallet;
