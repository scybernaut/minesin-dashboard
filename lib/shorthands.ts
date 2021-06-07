import { NextRouter } from "next/router";

export const focusRing = "focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-70";

export const loggedOutReasons = {
  invalid_token: "Your token is invalid.",
  token_expired: "Your session has expired.",
};

export type LoggedOutReasonCode = keyof typeof loggedOutReasons;

export const routeLogout = (router: NextRouter, reasonCode?: LoggedOutReasonCode) => {
  router.replace(`/dashboard/auth${reasonCode ? "?reason=" + encodeURIComponent(reasonCode) : ""}`);
};
