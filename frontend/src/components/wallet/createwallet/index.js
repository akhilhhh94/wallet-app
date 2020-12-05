import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWallet } from "../../redux/actions/walletActions";

function CreateWallet() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const initWallet = () => dispatch(createWallet(user));
  return (
    <div onClick={initWallet} className="bg-purple-400 p-5 rounded-md">
      click Here to create Acount
    </div>
  );
}

export default CreateWallet;
