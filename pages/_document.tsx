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
          <meta
            name="title"
            content="nftolio.xyz - liquid NFT portfolio tracker"
          />
          <meta
            name="description"
            content="Find out how much, and liquid, your NFT portfolio is based on ETH floor prices."
          />
          <meta
            name="keywords"
            content="nft, portfolio tracker, nft portfolio tracker, nft portfolio"
          />
          <meta name="robots" content="index, follow" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="English" />
          <meta name="revisit-after" content="7 days" />
          <meta name="author" content="nftolio.xyz" />

          <meta name="twitter:card" content="summary" />
          <meta property="og:title" content="nftolio.xyz - NFT value tracker" />
          <meta
            property="og:description"
            content="nftolio.xyz - liquid NFT portfolio tracker. Find out how much, and liquid, your NFT portfolio is based on ETH floor prices."
          />
          <meta
            property="og:image"
            content="https://nftolio.xyz/images/portfolioimg.jpg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
