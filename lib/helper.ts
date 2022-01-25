import axios, { AxiosError } from "axios";
import { NextRouter } from "next/router";
import { LoggedOutReasonCode, LogoutOptions, routeLogout } from "./shorthands";

import dayjs from "dayjs";
import _once from "lodash/once";

axios.defaults.baseURL = "https://minesin.krissada.com/api/";

export type ResourceUsage = {
  percent: number;
};

export enum TokenStatus {
  // Set to truthy value to avoid bugs with || operator
  Valid = 1,

  // Workaround: use with `|| undefined` to resolve value to undefined
  // because Typescript does not allow setting "computed" undefined or null as enum value
  Empty = "",

  Invalid = "token_invalid",
  Expired = "token_expired",
}

export const authenticate = async (username: string, password: string) => {
  return axios
    .post("/login", { username, password })
    .then((res) => res.data.accessToken);
};

type MinesinAPITokenPayload = {
  version: string;
  user: string;
  iat: number;
  exp: number;
};

type MinesinAPIError = {
  reason: string;
  code: number;
};

export const checkTokenStatus = (
  token: string | null | undefined
): TokenStatus => {
  if (!token) return TokenStatus.Empty;
  const [encodedHeader, encodedPayload] = token.split(".");

  let payload: MinesinAPITokenPayload;
  try {
    JSON.parse(atob(encodedHeader));
    payload = JSON.parse(atob(encodedPayload)) as MinesinAPITokenPayload;
  } catch (_) {
    return TokenStatus.Invalid;
  }

  const expirationTime = dayjs.unix(payload.exp);

  return dayjs().valueOf() < expirationTime.valueOf()
    ? TokenStatus.Valid
    : TokenStatus.Expired;
};

const errorToLogoutReason = (
  err: AxiosError<MinesinAPIError>
): LoggedOutReasonCode => {
  switch (err.response?.data.code) {
    case 1002:
      return "token_expired";
    case 1003:
      return "token_invalid";
    default:
      return "error";
  }
};

export const apiErrorHandler = (
  router: NextRouter,
  err: AxiosError<MinesinAPIError>
) => {
  const logoutReason = errorToLogoutReason(err);
  routeLogout(router, logoutReason, LogoutOptions.removeToken);
  return undefined;
};
