import { NextRouter } from "next/router";
import { LayoutActions } from "../components/Layout";
import { logoutOptions, routeLogout } from "./shorthands";

export const homeActions: LayoutActions = { navs: null };
export const dashboardActions = (router: NextRouter): LayoutActions => ({
  navs: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "World Map", href: "/dashboard/map" },
  ],
  buttonAction: {
    name: "logout",
    onClick: () => routeLogout(router, "logout", logoutOptions.removeToken),
  },
});
