import React, { useState, useEffect } from "react";
import _ from "lodash";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AddressBook() {
  const [wallets, setWallets] = useState([]);
  const [newWallet, setNewWallet] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    const lsWallets = localStorage.getItem("nft-wallets") || "[]";
    const jsonWallets = JSON.parse(lsWallets);
    if (jsonWallets && jsonWallets.length && !_.isEqual(jsonWallets, wallets)) {
      setWallets(jsonWallets);
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!newWallet.name || !newWallet.address) return;
    setWallets([...wallets, newWallet]);
    localStorage.setItem(
      "nft-wallets",
      JSON.stringify([...wallets, newWallet])
    );
    setNewWallet({ name: "", address: "" });
  };

  const onAddressChange = (e) => {
    setNewWallet({ ...newWallet, address: e.target.value });
  };

  const onNameChange = (e) => {
    setNewWallet({ ...newWallet, name: e.target.value });
  };

  const removeWallet = (address: string) => {
    const newWallets = _.filter(wallets, (w) => !_.isEqual(w.address, address));
    setWallets(newWallets);
    localStorage.setItem("nft-wallets", JSON.stringify(newWallets));
  };

  return (
    <>
      <Head>
        <title>nftolio.xyz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col w-full flex-1 px-20">
          <div className="flex flex-col mt-8">
            <a href="/">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Address Book
              </h3>
            </a>
          </div>
          <div className="flex flex-col">
            <form onSubmit={onSubmit} className="mt-12 sm:flex">
              <div className="min-w-0 flex-1">
                <label htmlFor="wallet-name" className="sr-only">
                  Wallet Name
                </label>
                <input
                  onChange={onNameChange}
                  value={newWallet.name}
                  id="wallet-name"
                  type="input"
                  className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  placeholder="Enter the wallet name"
                />
              </div>
              <div className="min-w-0 flex-1 margin-left: 0.75rem;">
                <label htmlFor="wallet-address" className="sr-only">
                  Wallet Address
                </label>
                <input
                  onChange={onAddressChange}
                  value={newWallet.address}
                  id="wallet-address"
                  type="input"
                  className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  placeholder="Enter the wallet address"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-3">
                <button
                  onClick={onSubmit}
                  type="submit"
                  className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="flex flex-col mt-8">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Wallet
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        ></th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wallets.map((wallet) => (
                        <tr key={wallet.name}>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">
                            {wallet.name}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">
                            {wallet.address}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-blue-500 hover:text-blue-900 cursor-pointer">
                            <a
                              key={wallet.address}
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`/wallet/${wallet.address}`}
                            >
                              Link
                            </a>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-red-500 hover:text-red-900 cursor-pointer">
                            <span onClick={() => removeWallet(wallet.address)}>
                              Remove
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
