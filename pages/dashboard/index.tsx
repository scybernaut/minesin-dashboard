import Layout from "../../components/Layout";
import { dashboardNavs } from "../../lib/navs";
import { loggedOutReasons } from "../../lib/shorthands";

import MembersList from "../../components/MembersList";

import { useRouter } from "next/router";
import { useEffect } from "react";

export type LoggedOutReasonCodes = keyof typeof loggedOutReasons;

export default function Dashboard() {
  const router = useRouter();
  const authRedirect = (reason?: LoggedOutReasonCodes) => {
    if (reason === "invalid_token") localStorage.removeItem("accessToken");
    router.replace(`/dashboard/auth${reason ? "?reason=" + encodeURIComponent(reason) : ""}`);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === null) authRedirect();
  }, []);

  return (
    <Layout navs={dashboardNavs} color="bg-gray-900" className="text-white m-4">
      <MembersList onInvalidToken={authRedirect}></MembersList>
    </Layout>
  );
}
