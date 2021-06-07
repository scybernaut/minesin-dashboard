import axios, { AxiosError } from "axios";
import { NextRouter } from "next/router";
import { LoggedOutReasonCode, routeLogout } from "./shorthands";

axios.defaults.baseURL = "https://omsinkrissada.sytes.net/api/minecraft/";

export type MembersArray = Array<{
  ign: string;
  lastseen: string | null;
  location: string | null;
  nickname: string;
  online: boolean;
  onlineFor: number; // in milliseconds
  skinURL: string;
  uuid: string;
}>;

export type ResourceUsage = {
  percent: number;
};

export enum tokenStatus {
  Valid,
  Invalid,
  Expired,
}

export const authenticate = async (password: string) => {
  return axios.post("/login", { passphrase: password }).then((res) => res.data.accessToken);
};

// There seems to be no standard way to check the validity of tokens,
// so this function performs a simple GET request the endpoint
// that would return the smallest data
export const checkTokenValidity = async (token: string) => {
  return new Promise<tokenStatus>((resolve) => {
    axios
      .get<ResourceUsage>("/cpuusage", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        resolve(tokenStatus.Valid);
      })
      .catch(reqErrorToTokenStatus);
  });
};

/**
 * Converts Axios request error to token status
 * @param err the error from Axios
 * @returns the corresponding token status, or undefined
 * if there is no corresponding token status
 * // throws {Error} if the response code is not recongnized as any token status
 */

const reqErrorToTokenStatus = (err: AxiosError) => {
  switch (err.response?.status) {
    case 401:
      return tokenStatus.Expired;
    case 403:
      return tokenStatus.Invalid;
    default:
      // throw Error();
      return undefined;
  }
};

/**
 * Converts token status to logout reason code
 * @param status the token status
 * @returns the corresponding logout reason code, or undefined
 * if there is no corresponding reason code
 */

const tokenStatusToLogoutReason = (status: tokenStatus): LoggedOutReasonCode | undefined => {
  switch (status) {
    case tokenStatus.Expired:
      return "token_expired";
    case tokenStatus.Invalid:
      return "invalid_token";
  }
};

export default class MinesinAPI {
  token: string;
  router: NextRouter;
  authHeader: {
    Authorization: string;
  };

  constructor(token: string, router: NextRouter, checkToken = false) {
    this.token = token;
    this.router = router;
    this.authHeader = {
      Authorization: "Bearer " + token,
    };

    if (checkToken)
      checkTokenValidity(token).then((validity) => {
        if (validity !== tokenStatus.Valid)
          routeLogout(this.router, tokenStatusToLogoutReason(validity));
      });
  }

  #errorHandler = (err: AxiosError) => {
    const status = reqErrorToTokenStatus(err);
    if (status !== undefined) routeLogout(this.router, tokenStatusToLogoutReason(status));
    return undefined;
    // throw err;
  };

  getMembers = async () => {
    return axios
      .get<MembersArray>("/members", {
        headers: this.authHeader,
      })
      .then(
        (res): MembersArray => {
          res.data[1].online = true;
          res.data[1].onlineFor = 200000;
          res.data[1].location = "survival 2020";

          return res.data.sort((l, r) => {
            if (!l.online && !r.online)
              return new Date(r.lastseen ?? 0).valueOf() - new Date(l.lastseen ?? 0).valueOf();

            return r.onlineFor - l.onlineFor;
          });
        }
      )
      .catch(this.#errorHandler);
  };

  getCPUUsage = async () => {
    return axios
      .get<ResourceUsage>("/cpuusage", {
        headers: this.authHeader,
      })
      .then((res) => {
        return res.data.percent;
      })
      .catch(this.#errorHandler);
  };

  getRAMUsage = async () => {
    return axios
      .get<ResourceUsage>("/memusage", {
        headers: this.authHeader,
      })
      .then((res) => {
        return res.data.percent;
      })
      .catch(this.#errorHandler);
  };
}
