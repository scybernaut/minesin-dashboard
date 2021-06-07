import Layout from "../../components/Layout";
import { dashboardNavs } from "../../lib/navs";
import MinesinAPI from "../../lib/api";

import MembersList from "../../components/MembersList";
import ResourceBars from "../../components/ResourceBars";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();

  const [api, setAPI] = useState<MinesinAPI | undefined>(undefined);

  useEffect(() => {
    setAPI(new MinesinAPI(localStorage.getItem("accessToken") ?? "", router, true));
    // console.log(api !== undefined);
  }, []);

  return (
    <Layout
      navs={dashboardNavs}
      color="bg-gray-900"
      className="text-white m-4 grid grid-cols-1 auto-rows-min gap-4"
    >
      <MembersList api={api} />
      <ResourceBars api={api} />
    </Layout>
  );
}
