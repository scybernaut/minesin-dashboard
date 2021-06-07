import axios, { AxiosError } from "axios";
import { LoggedOutReasonCodes } from "./shorthands";

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

export const fetchMembers = async (token: string) => {
  return axios
    .get<MembersArray>("/members", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    );
};

export type UsageData = {
  percent: number;
};

export const getUsagePromises = (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return {
    cpu: axios
      .get<UsageData>("/cpuusage", {
        headers,
      })
      .then((res) => {
        return res.data.percent;
      }),

    ram: axios
      .get<UsageData>("/memusage", {
        headers,
      })
      .then((res) => {
        return res.data.percent;
      }),
  };
};

export const authenticate = async (password: string) => {
  return axios.post("/login", { passphrase: password }).then((res) => res.data.accessToken);
};

export const apiErrorHandler = (
  err: AxiosError,
  callback?: (code: LoggedOutReasonCodes) => void
) => {
  switch (err.response?.status) {
    case 401:
      callback?.("token_expired");
      break;
    case 403:
      callback?.("invalid_token");
      break;
    default:
      console.error(err);
  }
};
