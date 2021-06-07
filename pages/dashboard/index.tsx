import Layout from "../../components/Layout";
import { dashboardNavs } from "../../lib/navs";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === null) router.replace("/dashboard/auth");
  }, []);

  return (
    <Layout
      navs={dashboardNavs}
      color="bg-gray-900"
      className="text-white flex flex-col justify-center"
    ></Layout>
  );
}
