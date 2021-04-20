import { once } from "lodash";
import { NextRouter } from "next/router";

export const focusRing = "focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-70";

export const loggedOutReasons = {
  token_invalid: "Your token is invalid.",
  token_expired: "Your session has expired.",
};

export type LoggedOutReasonCode = keyof typeof loggedOutReasons | null;

export enum logoutOptions {
  canRedirect = 0b01,
  removeToken = 0b10,
}

export const routeLogout = once(
  (router: NextRouter, reasonCode?: LoggedOutReasonCode | null, optionsBitmask?: number) => {
    const params = new URLSearchParams();
    if (reasonCode) params.append("reason", reasonCode);
    if (optionsBitmask) params.append("options", optionsBitmask.toString());
    const paramsWithQuery = params ? "?" + params : "";
    router.replace("/dashboard/auth" + paramsWithQuery);
  }
);

interface CancelablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export const makeCancelable = <T>(promise: Promise<T>): CancelablePromise<T> => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      (error) => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
