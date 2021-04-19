import { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { apiBase } from "../lib/shorthands";

import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import updateLocale from "dayjs/plugin/updateLocale";
import { LoggedOutReasonCodes } from "../pages/dashboard";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    // relative time format strings, keep %s %d as the same
    future: "in %s",
    past: "%s ago",
    s: "<1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1y",
    yy: "%dy",
  },
});

axios.defaults.baseURL = apiBase;

type membersData = Array<{
  ign: string;
  lastseen: string | null;
  location: string | null;
  nickname: string;
  online: boolean;
  onlineFor: number; // milliseconds
  skinURL: string;
  uuid: string;
}>;

const fetchMembers = async () => {
  return axios
    .get<membersData>("/members", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(
      (res): membersData => {
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

interface MembersListProps {
  onInvalidToken?: (reason?: LoggedOutReasonCodes) => void;
}

const MembersList: FC<MembersListProps> = ({ onInvalidToken }) => {
  const [members, setMembers] = useState<membersData>();

  useEffect(() => {
    fetchMembers()
      .then((data) => {
        setMembers(data);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 403) {
          onInvalidToken?.("invalid_token");
        } else {
          console.error(err);
        }
      });
  }, []);

  return (
    <div className="bg-white text-black p-4 rounded-md max-w-md">
      <h2 className="font-bold text-2xl mb-3">Members</h2>
      <ol className="flex flex-col gap-5">
        {members?.map((member) => (
          <>
            <li key={member.uuid} className="h-10 flex items-center">
              <img
                src={member.skinURL}
                className="h-full w-10 flex-shrink-0 bg-gray-300 rounded-md"
              ></img>
              <p className="ml-2 flex-shrink-0">
                <span className="font-semibold">{member.ign}</span>
                <br />
                <Icon
                  path={mdiCircle}
                  size="0.8em"
                  className={`inline ${
                    member.online ? "text-green-500" : "text-gray-500"
                  } transform -translate-y-0.5`}
                />
                {member.online
                  ? " Online for " + dayjs.duration(member.onlineFor).humanize(false)
                  : " Offline for " + dayjs(member.lastseen ?? 0).toNow(true)}
              </p>
              {member.online ? (
                <span className="flex-grow flex-shrink self-end ml-4 text-right font-medium text-sm leading-none">
                  {(member.location ?? "").toUpperCase()}
                </span>
              ) : null}
            </li>
          </>
        ))}
      </ol>
    </div>
  );
};

export default MembersList;
