import Head from "next/head";
// import Image from 'next/image'
import axios from "axios";
import _ from "lodash";
import { GetServerSideProps } from "next";

interface Props {}

export default function Home(props: Props) {
  console.log(props);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Fisherman</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Assets</h1>

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
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {props.assets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={asset.image_url}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {"name"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {"email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {"person.title"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {"person.department"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {"person.role"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
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
  const { owner, limit, order, offset } = options;
  const url = `https://api.opensea.io/api/v1/assets?order_direction=${order}&offset=${
    offset || 0
  }&=limit=${limit}&owner=${owner}`;

  const { data } = await axios.get(url);
  console.log("offset: ", offset);
  console.log("data: ", data);
  console.log(" ");
  return data;
};

const fetchAll = async () => {
  const owner = "0x72e464537c954e5451e96b725fdf22105dcf4ff4";
  const limit = 50;
  const order = "desc";
  // TODO fetch all assets/iterate till response is empty array
  let offset = 0;

  const data = await fetch({
    owner,
    limit,
    order,
    offset,
  });

  return data;
};

export const getStaticProps: GetServerSideProps = async (context) => {
  const assets = await fetchAll();
  const addresses = _.map(assets, (asset) => asset.asset_contract.address);
  return {
    props: {
      assets,
      addresses,
    },
  };
};
