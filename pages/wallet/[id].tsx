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
}

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

const getTotalInEth = (collection: Collection, assetCount: AssetCount) => {
  const count = getCountOwned(collection, assetCount);
  if (!count) return 0;

  const floorPrice = collection.stats?.floor_price || 0;
  const total = count * floorPrice;
  return _.ceil(total * 100, 4) / 100;
};

// TODO update this to get the highest bids
const getFloorInEth = (collection: Collection) => collection.stats?.floor_price;

// const getTotalNftCount = (assetCount: AssetCount) => {
//   const keys = _.keys(assetCount);
//   return _.sum(_.map(keys, (key) => assetCount[key] || 0));
// };

// ! V1 - tweet2see
// TODO hide "portfolio in eth" w tooltip or something to say register to reveal
// TODO if tweets about it then show the $

// ! V2 - register
// TODO add "register function" --- CONTRACT https://etherscan.io/address/0xdfa76df49ce8b01562f3de48126b8b6377c4e0a6#code @ 0.01 eth
// TODO hide "portfolio in eth" w tooltip or something to say register to reveal
// TODO do mini note that says "just send .01 eth to this address from the wallet u wanna see"
// TODO if registered then show the $

// const ethereumButton = document.querySelector('.enableEthereumButton');
// const sendEthButton = document.querySelector('.sendEthButton');

// let accounts = [];

// //Sending Ethereum to an address
// sendEthButton.addEventListener('click', () => {
//   ethereum
//     .request({
//       method: 'eth_sendTransaction',
//       params: [
//         {
//           from: accounts[0],
//           to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
//           value: '0x29a2241af62c0000',
//           gasPrice: '0x09184e72a000',
//           gas: '0x2710',
//         },
//       ],
//     })
//     .then((txHash) => console.log(txHash))
//     .catch((error) => console.error);
// });

// ethereumButton.addEventListener('click', () => {
//   getAccount();
// });

// async function getAccount() {
//   accounts = await ethereum.request({ method: 'eth_requestAccounts' });
// }

export default function Home(props: Props) {
  // console.log("props: ", props);
  if (!props.collections.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="text-sm font-medium text-gray-900">
          No collections found. Try clearing cache or refreshing. prob a rate limit error ¯\_(ツ)_/¯
        </div>
      </div>
    );
  }

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

  const stats = [
    {
      name: "Porfolio in ETH",
      stat: portfolioInEth,
    },
    // {
    //   name: "Total Collections Checked",
    //   stat: getTotalNftCount(props.assetCount),
    // },
    {
      name: "Porfolio in USD",
      stat: `$${_.ceil(_.toNumber(props.ethPrice * portfolioInEth), 2)}`,
    },
    {
      name: "ETH Price",
      stat: `$${props.ethPrice}`,
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>nftolio.xyz</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_API_KEY}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>

      <main className="flex flex-col w-full flex-1 px-20 text-center">
        <div className="flex flex-col mt-8">
          <a href="/">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              NFT Portfolio
            </h3>
          </a>
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
                                {collection.name}
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
  const max = 5;
  const limit = 50;
  const order = "desc";
  let offset = 0;
  const assets = [];
  while (offset <= max) {
    const url = `https://api.opensea.io/api/v1/assets?owner=${owner}&order_direction=${order}&offset=${offset}&limit=${limit}`;
    console.log("url: ", url);
    const { data } = await axios.get(url);
    offset += 1;
    console.log("data: ", data.assets.length);
    if (data.assets.length > 0) {
      assets.push(data.assets);
    }
  }

  return _.flatten(assets);
};

const fetchEthPrice = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/ethereum"
  );
  const price = data?.market_data?.current_price.usd;
  console.log("price: ", price);
  return _.toNumber(price);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const owner = params.id as string | null;

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

    return {
      props: {
        collections: collections || [],
        assetCount: assetCount || {},
        assets: assets || [],
        ethPrice,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        collections: [],
        assetCount: {},
        assets: [],
        ethPrice: 0,
      },
    };
  }
};
