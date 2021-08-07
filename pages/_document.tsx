import Document, { Html, Head, Main, NextScript } from "next/document";

export default class BaseDocument extends Document {
  render() {
    const description =
      "Find out how much your NFT portfolio is based on ETH floor prices and liquidity.";
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
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
          <title>nftolio.xyz - liquid NFT portfolio tracker</title>
          <meta
            name="title"
            content="nftolio.xyz - liquid NFT portfolio tracker"
          />
          <meta name="description" content={description} />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://metatags.io/" />
          <meta
            property="og:title"
            content="nftolio.xyz - liquid NFT portfolio tracker"
          />
          <meta property="og:description" content={description} />
          {/* <meta
            property="og:image"
            content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
          /> */}

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://metatags.io/" />
          <meta
            property="twitter:title"
            content="nftolio.xyz - liquid NFT portfolio tracker"
          />
          <meta property="twitter:description" content={description} />
          {/* <meta
            property="twitter:image"
            content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
          /> */}

          <meta name="author" content="nftolio.xyz" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
