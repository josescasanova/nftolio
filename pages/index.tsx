import Head from "next/head";
// import Image from 'next/image'
import axios from "axios";
import _ from "lodash";
import { GetServerSideProps } from "next";

interface Collection {
  stats?: {
    floor_price: number;
  };
  banner_image_url: string;
  description: string;
  discord_url: string;
  external_url: string;
  featured_image_url: string;
  image_url: string;
  name: string;

}

interface Props {
  collections: Collection[];
}

export default function Home(props: Props) {
  console.log(props);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Fisherman</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="container mx-auto m-4">
          <h1 className="text-6xl font-bold">Fisherman</h1>
        </div>

        {/* <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          {props.assets.map(asset => <img src={asset.image_url || 'TODO'} alt="TODO" />)}
        </div> */}
        <div className="flex flex-col">
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
                        ETH Floor
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
                              <img
                                className="h-10 w-10 rounded-full"
                                src={asset.image_url}
                                alt={asset.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {asset.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {asset.stats?.floor_price}
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

const fetch = async (options) => {
  const { owner, limit, offset } = options;
  const url = `https://api.opensea.io/api/v1/collections?asset_owner=${owner}&offset=${offset}&limit=${limit}`;

  const { data } = await axios.get(url);
  console.log("data: ", data);
  console.log(" ");
  return data;
};

const fetchCollections = async () => {
  const owner = "0x72e464537c954e5451e96b725fdf22105dcf4ff4";
  const limit = 300;
  // TODO fetch all assets/iterate till response is empty array
  let offset = 0;

  const data = await fetch({
    owner,
    limit,
    offset,
  });

  return data;
};

export const getStaticProps: GetServerSideProps = async (context) => {
  const collections = await fetchCollections();
  return {
    props: {
      collections
    },
  };
};
