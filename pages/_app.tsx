import "normalize.css";
import "../styles/tailwind.css";

import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="The superior version of MINESIN dashboard" />
        <meta name="author" content="VOIDWEAVER" />
        <title>MINESIN Dashboard</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
