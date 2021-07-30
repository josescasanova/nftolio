import Head from "next/head";
import axios from "axios";
import _ from "lodash";
import { GetServerSideProps } from "next";

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
}

const getCountOwned = (collection: Collection, assetCount: AssetCount) => {
  console.log("collection: ", collection);
  const primaryAddress =
    collection.primary_asset_contracts &&
    collection.primary_asset_contracts.length
      ? collection.primary_asset_contracts[0]
      : null;
  const contract =
    collection.asset_contract?.address || primaryAddress?.address;
  console.log("contract: ", contract);
  if (!contract) return null;

  console.log("getCountOwned: ", assetCount[contract]);
  return assetCount[contract];
};

const getTotalInEth = (collection: Collection, assetCount: AssetCount) => {
  const count = getCountOwned(collection, assetCount);
  if (!count) return 0;

  const floorPrice = collection.stats?.floor_price || 0;
  return count * floorPrice;
};

export default function Home(props: Props) {
  console.log("props: ", props);
  if (!props.collections.length) {
    return (
      <div className="text-sm font-medium text-gray-900">
        No collections found.
      </div>
    );
  }

  const stats = [
    // {name: 'ETH Price', stat: ''},
    {
      name: "Porfolio in ETH",
      stat: _.sum(
        props.collections.map((asset: Collection) =>
          getTotalInEth(asset, props.assetCount)
        )
      ),
    },
    // {name: 'Porfolio in USD', stat: ''},
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Fisherman</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col w-full flex-1 px-20 text-center">
        <div className="flex flex-col mt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            NFT Portfolio
          </h3>
          <dl
            className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-${stats.length}`}
          >
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
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Link</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {props.collections.map((asset: Collection) => (
                      <tr key={asset.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {asset.image_url ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={asset.image_url}
                                  alt={asset.name}
                                />
                              ) : null}
                            </div>
                            <div className="ml-4 items-center justify-center">
                              <div className="text-sm font-medium text-gray-900">
                                {asset.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCountOwned(asset, props.assetCount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {asset.stats?.floor_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getTotalInEth(asset, props.assetCount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {asset.external_url ? (
                            <a
                              href={asset.external_url}
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
    </div>
  );
}

const fetchCollections = async (owner: string) => {
  const limit = 300;
  // TODO fetch all assets/iterate till response is empty array
  let offset = 0;
  const url = `https://api.opensea.io/api/v1/collections?asset_owner=${owner}&offset=${offset}&limit=${limit}`;
  const { data } = await axios.get(url);

  return data;
};

const fetchAssets = async (owner: string) => {
  const limit = 50;
  const order = "desc";
  // TODO fetch all assets/iterate till response is empty array
  let offset = 0;
  const url = `https://api.opensea.io/api/v1/assets?owner=${owner}&order_direction=${order}&offset=${offset}&limit=${limit}`;
  const { data } = await axios.get(url);
  return data;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const owner = params.id as string | null;
  const collections = await fetchCollections(owner);
  const { assets } = await fetchAssets(owner);
  const assetCount = {};
  console.log("assets: ", assets);
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

  return {
    props: {
      collections: collections || [],
      assetCount,
      assets,
    },
  };
};
