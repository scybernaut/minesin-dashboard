import { useEffect, useState } from "react";

import { homeNavs } from "../lib/navs";
import Layout from "../components/Layout";
import Button from "../components/Button";

import { mdiChevronRight } from "@mdi/js";

export default function Home() {
  const [hasToken, setHavingToken] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setHavingToken(accessToken !== null);
  }, []);

  return (
    <Layout navs={homeNavs} color="bg-gray-900" className="text-white flex flex-col justify-center">
      <div className="flex flex-col justify-center items-center m-4 gap-y-10 transform -translate-y-8">
        <h1 className="text-3xl font-extrabold mb-2">Hello there!</h1>
        <p className="text-lg text-center leading-relaxed">
          {/* <abbr className="abbr-no-underline font-bold" title="A MINESIN Dashboard">
            Minesin
          </abbr> */}
          Welcome to the next version of{" "}
          <a className="underline font-medium" href="https://omsinkrissada.sytes.net">
            MINESIN&nbsp;dashboard
          </a>
          .
        </p>
        <Button
          href={hasToken ? "/dashboard" : "/dashboard/auth"}
          iconPath={mdiChevronRight}
          xPadding="pr-1.5 pl-3.5"
          padIconLeft="ml-0"
        >
          Go to dashboard
        </Button>
      </div>
    </Layout>
  );
}
