import Head from 'next/head'
// import Image from 'next/image'
import axios from 'axios';
import _ from 'lodash';

export default function Home(props) {
  console.log(props);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Fisherman</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Assets
        </h1>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          {props.assets.map(asset => <img src={asset.image_url || 'TODO'} alt="TODO" />)}
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}


export async function getStaticProps(context) {
  const owner = '0x97F6B9d7B870226A7A51e9F2D5637C51e4d00537';
  const offset = 0;
  const limit = 20;
  const order = 'desc';
  const url = `https://api.opensea.io/api/v1/assets?order_direction=${order}&offset=${offset}&=limit=${limit}&owner=${owner}`;

  const { data } = await axios.get(url);
  console.log('data: ', data);
  return {
    props: data
  }
}