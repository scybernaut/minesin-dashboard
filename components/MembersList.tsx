import { FC, useState, useEffect } from "react";

import { MembersArray } from "../lib/api";
import { formatUUID } from "../lib/shorthands";

import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";

import { Switch } from "@headlessui/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import updateLocale from "dayjs/plugin/updateLocale";

import { oneLine as l1 } from "common-tags";

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

interface MembersListProps {
  members: MembersArray;
  className?: string;
}

const logMap = (
  n: number,
  domainFloor: number,
  domainCeiling: number,
  rangeFloor: number,
  rangeCeiling: number
) => {
  const logOr0 = (n: number) => {
    const result = Math.log(n);
    if (result !== -Infinity) return result;
    return 0;
  };

  const result =
    ((logOr0(n) - logOr0(domainFloor)) / (logOr0(domainCeiling) - logOr0(domainFloor))) *
      (rangeCeiling - rangeFloor) +
    rangeFloor;

  return result;
};

const humanDuration = (ISODate: string | undefined | null) => {
  if (ISODate == undefined) return "";
  return " for " + dayjs(ISODate).toNow(true);
};

const MAX_DAYS = 3;

const MembersList: FC<MembersListProps> = ({ members, className }) => {
  const now = dayjs();

  const [showUUID, setShowUUID] = useState(false);

  useEffect(() => {
    setShowUUID(localStorage.getItem("showUUID") === "true");
  }, []);

  return (
    <div
      className={l1`bg-white text-black dark:bg-gray-800 dark:text-white
                       p-4 rounded-md ${className ? className : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">Members</h2>
        <div className="flex items-center">
          <span className="mr-2 font-medium text-sm">
            <span className="hidden sm:inline">Show </span>UUIDs
          </span>
          <Switch
            checked={showUUID}
            onChange={(enabled: boolean) => {
              localStorage.setItem("showUUID", enabled.toString());
              setShowUUID(enabled);
            }}
            className={l1`${showUUID ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-500"}
            relative inline-flex items-center h-6 rounded-full w-11
            focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <span
              className={l1`transform transition ease-in-out duration-200
               ${showUUID ? "translate-x-6" : "translate-x-1"}
               inline-block w-4 h-4 transform bg-white rounded-full`}
            />
          </Switch>
        </div>
      </div>
      <ol className="flex flex-col gap-5">
        {members?.map((member) => (
          <li
            key={member.uuid}
            className={`${showUUID ? "h-auto" : "h-10"} flex`}
            style={{
              opacity: member.online
                ? 1
                : logMap(
                    Math.min(now.diff(dayjs(member.offlineSince ?? ""), "days", true), MAX_DAYS) +
                      1,
                    1,
                    MAX_DAYS + 1,
                    0.9,
                    0.3
                  ),
            }}
          >
            <img
              src={member.skinURL}
              className="h-10 w-10 flex-shrink-0 bg-gray-300 rounded-sm pixelated"
            />
            <p className="ml-2 flex-grow">
              <p className="font-semibold">{member.ign}</p>
              <div className="flex justify-between items-center">
                <div className="flex-shrink-0">
                  <Icon
                    path={mdiCircle}
                    size="0.8em"
                    className={`inline ${
                      member.online ? "text-green-500" : "text-gray-500 dark:text-gray-400"
                    } transform -translate-y-0.5`}
                  />
                  {member.online
                    ? " Online" + humanDuration(member.onlineSince)
                    : " Offline" + humanDuration(member.offlineSince)}
                </div>

                {member.online ? (
                  <span className="flex-grow flex-shrink ml-4 text-right font-medium text-sm leading-none">
                    {(member.location ?? "").toUpperCase()}
                  </span>
                ) : null}
              </div>
              {showUUID && (
                <p className="text-sm font-mono text-gray-400 dark:text-gray-400 break-all">
                  {formatUUID(member.uuid)}
                </p>
              )}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MembersList;
