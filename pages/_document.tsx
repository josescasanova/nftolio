import Document, { Html, Head, Main, NextScript } from "next/document";

export default class BaseDocument extends Document {
  render() {
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
          <meta name="twitter:card" content="summary" />
          <meta property="og:title" content="nftolio.xyz - NFT value tracker" />
          <meta property="og:description" content="nftolio.xyz - NFT liquid value tracker. Find out how much your NFT portfolio based on ETH floor prices." />
          <meta property="og:image" content="https://nftolio.xyz/images/portfolioimg.jpg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
