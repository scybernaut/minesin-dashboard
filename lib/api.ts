import axios, { AxiosError, AxiosInstance } from "axios";
import { NextRouter } from "next/router";
import {
  LoggedOutReasonCode,
  logoutOptions,
  makeResolvingCancelable,
  routeLogout,
} from "./shorthands";

import dayjs from "dayjs";
import { once } from "lodash";

axios.defaults.baseURL = "https://omsinkrissada.sytes.net/api/minecraft/";

export type MembersArray = Array<{
  ign: string;
  location: string | null;
  nickname: string;
  online: boolean;
  onlineSince: string | null;
  offlineSince: string | null;
  skinURL: string;
  uuid: string;
}>;

export type ResourceUsage = {
  percent: number;
};

export enum tokenStatus {
  // Set to truthy value to avoid bugs with || operator
  Valid = 1,

  // Workaround: use with `|| undefined` to resolve value to undefined
  // because Typescript does not allow setting "computed" undefined or null as enum value
  Empty = "",

  Invalid = "token_invalid",
  Expired = "token_expired",
}

export const authenticate = async (password: string) => {
  return axios.post("/login", { passphrase: password }).then((res) => res.data.accessToken);
};

type MinesinAPITokenPayload = {
  version: string;
  user: string;
  iat: number;
  exp: number;
};

type MinesinAPIError = {
  reason: string;
  code?: number; // TODO: Currently, there is a bug in the API that causes the API to not return `code`
};

export const checkTokenStatus = (token: string | null | undefined): tokenStatus => {
  if (!token) return tokenStatus.Empty;
  const [encodedHeader, encodedPayload] = token.split(".");

  let payload: MinesinAPITokenPayload;
  try {
    JSON.parse(atob(encodedHeader));
    payload = JSON.parse(atob(encodedPayload)) as MinesinAPITokenPayload;
  } catch (_) {
    return tokenStatus.Invalid;
  }

  const expirationTime = dayjs.unix(payload.exp);

  return dayjs().valueOf() < expirationTime.valueOf() ? tokenStatus.Valid : tokenStatus.Expired;
};

const errorToLogoutReason = (err: AxiosError<MinesinAPIError>): LoggedOutReasonCode => {
  switch (err.response?.data.code) {
    case 1002:
      return "token_expired";
    case 1003:
      return "token_invalid";
  }

  return "error";
};

export default class MinesinAPI {
  token: string;
  router: NextRouter;
  instance: AxiosInstance;

  #logout = once(
    (router: NextRouter, reasonCode?: LoggedOutReasonCode, optionsBitmask?: number) => {
      routeLogout(router, reasonCode, optionsBitmask);
    }
  );

  constructor(token: string, router: NextRouter, checkToken = false) {
    this.token = token;
    this.router = router;

    if (checkToken) {
      const status = checkTokenStatus(token);
      if (status !== tokenStatus.Valid) {
        const options = status !== tokenStatus.Empty ? logoutOptions.removeToken : undefined;
        this.#logout(this.router, status || undefined, options);
      }
    }

    this.instance = axios.create({
      baseURL: "https://omsinkrissada.sytes.net/api/minecraft/",
      headers: { Authorization: "Bearer " + token },
    });
  }

  #errorHandler = (err: AxiosError<MinesinAPIError>) => {
    const logoutReason = errorToLogoutReason(err);
    this.#logout(this.router, logoutReason, logoutOptions.removeToken);
    return undefined;
  };

  getMembers = () => {
    return makeResolvingCancelable(
      this.instance
        .get<MembersArray>("/members")
        .then(
          (res): MembersArray => {
            return res.data.sort((l, r) => {
              if (!l.online && !r.online)
                return Date.parse(r.offlineSince ?? "") - Date.parse(l.offlineSince ?? "");

              if (l.online !== r.online) return r.online ? 1 : -1;

              return Date.parse(l.onlineSince ?? "") - Date.parse(r.onlineSince ?? "");
            });
          }
        )
        .catch(this.#errorHandler)
    );
  };

  getCPUUsage = () => {
    return makeResolvingCancelable(
      this.instance
        .get<ResourceUsage>("/cpuusage")
        .then((res) => {
          return res.data.percent;
        })
        .catch(this.#errorHandler)
    );
  };

  getRAMUsage = () => {
    return makeResolvingCancelable(
      this.instance
        .get<ResourceUsage>("/memusage")
        .then((res) => {
          return res.data.percent;
        })
        .catch(this.#errorHandler)
    );
  };
}
