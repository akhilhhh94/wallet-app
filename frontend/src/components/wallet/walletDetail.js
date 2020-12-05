import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  makeDeposit,
  makeWithdraw,
  enableWallet,
  disableWallet,
} from "../redux/actions/walletActions";

function WalletDetail({ wallet }) {
  const { status, balance } = wallet;
  const [deposit, setDeposit] = useState({ amount: 0 });
  const [withdraw, setWithdraw] = useState({ amount: 0 });
  const dispatch = useDispatch();
  const onChangeDeposit = (e) => {
    const { name, value } = e.target;
    setDeposit({ [name]: value });
  };

  const onChangeWithdraw = (e) => {
    const { name, value } = e.target;
    setWithdraw({ [name]: value });
  };

  const sumbitHandler = (e, type) => {
    e.preventDefault();
    if (type === "DEPOSIT") dispatch(makeDeposit(deposit));
    else dispatch(makeWithdraw(withdraw));
  };
  return (
    <div>
      <p>Status:{status}</p>
      <p>Balance:{balance}</p>
      {status === "enabled" ? (
        <div>
          <button
            onClick={() => dispatch(disableWallet())}
            type="button"
            className="text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-lg"
          >
            Disable
          </button>
          <form onSubmit={(e) => sumbitHandler(e, "DEPOSIT")}>
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Deposit
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={deposit.amount}
                onChange={onChangeDeposit}
              />
            </div>
            <button
              type="submit"
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Deposit
            </button>
          </form>
          <form onSubmit={(e) => sumbitHandler(e, "WITHDRAW")}>
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Withdraw
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={withdraw.amount}
                onChange={onChangeWithdraw}
              />
            </div>
            <button
              type="submit"
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Withdraw
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => dispatch(enableWallet())}
          type="button"
          className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
        >
          Enable
        </button>
      )}
    </div>
  );
}

export default WalletDetail;
