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
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MINESIN Dashboard</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
