import { useEffect, useState } from "react";

import { homeNavs } from "../lib/navs";
import Layout from "../components/Layout";
import Button from "../components/Button";

import { mdiChevronRight } from "@mdi/js";

import { checkTokenStatus, tokenStatus } from "../lib/api";

export default function Home() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setHasToken(checkTokenStatus(token) !== tokenStatus.Empty);
  }, []);

  return (
    <Layout navs={homeNavs} color="bg-gray-900" className="text-white flex flex-col justify-center">
      <div className="flex flex-col justify-center items-center m-4 gap-y-10 transform -translate-y-8">
        <h1 className="text-3xl font-extrabold mb-2">Hello there!</h1>
        <p className="text-lg text-center leading-relaxed">
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
