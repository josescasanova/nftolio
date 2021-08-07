import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import _ from "lodash";
import { GetServerSideProps } from "next";
import currency from "currency.js";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { supabase } from "../../db/supabase";

interface Collection {
  asset_contract?: {
    address: string;
  };
  primary_asset_contracts: {
    address: string;
  }[];
  stats?: {
    floor_price: number;
  };
  banner_image_url: string;
  description: string;
  discord_url: string;
  external_url: string;
  featured_image_url: string;
  image_url?: string;
  name: string;
  owned_asset_count?: number;
}

interface Asset {
  asset_contract?: {
    address: string;
  };
}

type AssetCount = {
  [key: string]: number;
};

interface Props {
  collections: Collection[];
  assets: Asset[];
  assetCount: AssetCount;
  ethPrice: number;
  owner: string;
}

interface Wallet {
  id: number;
  address: string;
}

const fetchOrCreateWallet = async (owner?: string): Promise<Wallet> => {
  if (!owner) return null;
  try {
    console.log("fetch");
    let { data: wallet, error } = await supabase
      .from("wallet")
      .select("*")
      .eq("address", owner);

    console.log("error: ", error);
    if (error) return;

    console.log("wallet: ", wallet);
    if (!wallet.length) {
      console.log("inserting record");
      let { data, error: insertError } = await supabase
        .from("wallet")
        .insert([{ address: owner }]);
      console.log(insertError);
      console.log(data);
      return data[0];
    }
    return wallet[0];
  } catch (err) {
    console.log("fetchorcreatewallet err: ", err);
    return null;
  }
};

const getCountOwned = (collection: Collection, assetCount: AssetCount) => {
  if (collection.owned_asset_count) return collection.owned_asset_count;

  const primaryAddress =
    collection.primary_asset_contracts &&
    collection.primary_asset_contracts.length
      ? collection.primary_asset_contracts[0]
      : null;
  const contract =
    collection.asset_contract?.address || primaryAddress?.address;
  if (!contract) return null;
  return assetCount[contract];
};

const getTotalInEth = (
  collection: Collection,
  assetCount: AssetCount
): number => {
  const count = getCountOwned(collection, assetCount);
  if (!count) return 0;

  const floorPrice = collection.stats?.floor_price || 0;
  const total = count * floorPrice;
  return _.ceil(total * 100, 2) / 100;
};

const getTotalInUsd = (
  collection: Collection,
  assetCount: AssetCount,
  ethPrice: number
): string => {
  const count = getCountOwned(collection, assetCount);
  if (!count) return "$0";

  const floorPrice = collection.stats?.floor_price || 0;
  const total = count * floorPrice * ethPrice;
  return currency(_.ceil(total * 100, 2) / 100).format();
};

// TODO update this to get the highest bids
const getFloorInEth = (collection: Collection) => collection.stats?.floor_price;

// TODO track punks

const getData = (props: Props) => {
  const collections = _.reverse(
    _.sortBy(props.collections, (collection) =>
      getTotalInEth(collection, props.assetCount)
    )
  );

  const portfolioInEth = _.ceil(
    _.sum(
      collections.map((c: Collection) => getTotalInEth(c, props.assetCount))
    ),
    5
  );

  const portfolioInUsd = currency(
    _.ceil(_.toNumber(props.ethPrice * portfolioInEth), 2)
  ).format();

  return {
    collections,
    portfolioInEth,
    portfolioInUsd,
  };
};

const saveWalletLog = async (props: Props, wallet: Wallet) => {
  try {
    console.log("savewalletlog wallet: ", wallet);
    const { portfolioInEth, portfolioInUsd } = getData(props);
    const { data, error } = await supabase
      .from("wallet_log")
      .insert([
        {
          value_in_eth: portfolioInEth,
          value_in_usd: portfolioInUsd,
          wallet_id: wallet.id,
          timestamp_log: new Date(),
        },
      ]);
  } catch (err) {
    console.log("err saveWalletLog: ", err);
  }
};

export default function Home(props: Props) {
  const [walletTag, setWalletTag] = useState(null);
  if (!props.collections.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="text-sm font-medium text-gray-900">
          No collections found. Try clearing cache or refreshing. prob a rate
          limit error ¯\_(ツ)_/¯
        </div>
      </div>
    );
  }

  useEffect(() => {
    const lsWallets = localStorage.getItem("nft-wallets") || "[]";
    const jsonWallets = JSON.parse(lsWallets) || [];
    console.log("jsonWallets: ", jsonWallets);
    const selectedWallet = _.find(
      jsonWallets,
      (w) => w.address === props.owner
    );
    console.log("selectedWallet.name: ", selectedWallet.name);
    if (selectedWallet.name) {
      setWalletTag(selectedWallet.name);
    }
  });

  const { collections, portfolioInEth, portfolioInUsd } = getData(props);

  const stats = [
    {
      name: "Porfolio in ETH",
      stat: portfolioInEth,
    },
    {
      name: "ETH Price",
      stat: currency(props.ethPrice).format(),
    },
    {
      name: "Porfolio in USD",
      stat: portfolioInUsd,
    },
  ];

  return (
    <>
      <Head>
        <title>nftolio.xyz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col w-full flex-1 sm:px-2 px-2 lg:px-20">
          <div className="flex flex-col mt-8">
            {/* Subheader */}
            <h3 className="text-lg leading-6 font-medium text-gray-700 break-normal py-2">
              NFT Portfolio for{" "}
              <a
                href={`https://etherscan.io/address/${props.owner}`}
                className="text-indigo-900 break-normal"
              >
                {walletTag || props.owner}
              </a>
            </h3>
            <h5 className="text-sm leading-3 font-small text-gray-400 break-normal">
              <a
                href={`https://etherscan.io/address/${props.owner}`}
                className="text-indigo-900 break-normal"
              >
                Etherscan
              </a>
            </h5>
            <br />
            {/* Stats */}
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.name}
                  className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
                >
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {item.stat}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {/* NFTs Table */}
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
                          Collection
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Owned
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ETH Floor
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ETH Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          USD Total
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Link</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {collections.map((collection: Collection) => (
                        <tr key={collection.name}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {collection.image_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={collection.image_url}
                                    alt={collection.name}
                                  />
                                ) : null}
                              </div>
                              <div className="ml-4 items-center justify-center">
                                <div className="text-sm font-medium text-gray-900">
                                  {collection.external_url ? (
                                    <a
                                      href={collection.external_url}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      {collection.name}
                                    </a>
                                  ) : (
                                    collection.name
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getCountOwned(collection, props.assetCount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getFloorInEth(collection)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getTotalInEth(collection, props.assetCount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getTotalInUsd(
                              collection,
                              props.assetCount,
                              props.ethPrice
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {collection.external_url ? (
                              <a
                                href={collection.external_url}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Link
                              </a>
                            ) : null}
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

const fetchCollections = async (owner: string) => {
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  const limit = 300;
  // TODO fetch all assets/iterate till response is empty array
  let offset = 0;
  const url = `https://api.opensea.io/api/v1/collections?asset_owner=${owner}&offset=${offset}&limit=${limit}`;
  const { data } = await axios.get(url, {
    headers: {
      "X-API-KEY": process.env.OPENSEA_API_KEY,
    },
  });

  return data;
};

const fetchAssets = async (owner: string) => {
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  const max = 5;
  const limit = 50;
  const order = "desc";
  let offset = 0;
  const assets = [];
  // while (offset <= max) {
  const url = `https://api.opensea.io/api/v1/assets?owner=${owner}&order_direction=${order}&offset=${offset}&limit=${limit}`;
  const { data } = await axios.get(url, {
    headers: {
      "X-API-KEY": process.env.OPENSEA_API_KEY,
    },
  });
  // offset += 1;
  // if (data.assets.length > 0) {
  assets.push(data.assets);
  // }
  // }

  return _.flatten(assets);
};

const fetchEthPrice = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/ethereum"
  );
  const price = data?.market_data?.current_price.usd;
  return _.toNumber(price);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const owner = params.id as string | null;

  const wallet = await fetchOrCreateWallet(owner);

  try {
    const collections = await fetchCollections(owner);
    const assets = await fetchAssets(owner);
    const ethPrice = await fetchEthPrice();

    const assetCount = {};
    (assets || []).forEach((asset: Asset) => {
      const address = asset.asset_contract?.address;
      if (address) {
        if (assetCount.hasOwnProperty(address)) {
          assetCount[address] += 1;
        } else {
          assetCount[address] = 1;
        }
      }
    });

    const props = {
      collections: collections || [],
      assetCount: assetCount || {},
      assets: assets || [],
      ethPrice,
      owner,
    };

    await saveWalletLog(props, wallet);

    return {
      props,
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        collections: [],
        assetCount: {},
        assets: [],
        ethPrice: 0,
        owner: null,
      },
    };
  }
};
