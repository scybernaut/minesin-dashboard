import { FC, useState, useEffect } from "react";

import { Member } from "../lib/helper";
import { formatUUID } from "../lib/shorthands";
import dotCss from "./dotIndicator.module.css";

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
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

interface MembersListProps {
  members: Member[];
  className?: string;
}

const humanDuration = (ISODate: string | undefined | null) => {
  if (ISODate == undefined) return "";
  return " for " + dayjs(ISODate).toNow(true);
};

const MembersList: FC<MembersListProps> = ({ members, className }) => {
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
        <div className="flex items-center ml-4">
          <Switch.Group>
            <Switch.Label
              className="mr-2 font-medium text-sm"
              aria-label="Show UUIDs"
            >
              <span className="hidden sm:inline">Show </span>UUIDs
            </Switch.Label>
            <Switch
              checked={showUUID}
              onChange={(enabled: boolean) => {
                localStorage.setItem("showUUID", enabled.toString());
                setShowUUID(enabled);
              }}
              className={l1`${
                showUUID ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-500"
              }
                              relative inline-flex items-center h-6 rounded-full w-11
                              focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            >
              <span
                className={l1`transform transition ease-in-out duration-200
               ${showUUID ? "translate-x-6" : "translate-x-1"}
               inline-block w-4 h-4 transform bg-white rounded-full`}
              >
                <span className="hidden">Toggle</span>
              </span>
            </Switch>
          </Switch.Group>
        </div>
      </div>
      <ol className="flex flex-col gap-5">
        {members?.map((member) => {
          const opacityClass = member.online ? "" : " opacity-70";

          return (
            <li key={member.uuid} className="flex">
              <img
                src={member.skinURL}
                alt={member.ign + "'s Minecraft skin"}
                width="64"
                className={
                  "h-10 w-10 shrink-0 bg-gray-300 rounded-sm pixelated" +
                  opacityClass
                }
              />
              <div className="ml-2 grow">
                <h4
                  className={"font-semibold leading-none mb-1" + opacityClass}
                >
                  {member.ign}
                </h4>
                <div
                  className={"flex justify-between items-center" + opacityClass}
                >
                  <p
                    className={`shrink-0 ${dotCss.dot} ${
                      member.online ? dotCss.dot__active : ""
                    }`}
                  >
                    {member.online
                      ? "Online" + humanDuration(member.onlineSince)
                      : "Offline" + humanDuration(member.offlineSince)}
                  </p>

                  {member.online ? (
                    <p className="grow ml-4 text-right font-medium text-sm leading-none">
                      {(member.location ?? "").toUpperCase()}
                    </p>
                  ) : null}
                </div>
                <p
                  className={
                    "text-sm text-gray-400 dark:text-gray-400 break-all" +
                    (member.online ? "" : " opacity-90") +
                    // Not using "display: none" in order to maintain width
                    (showUUID ? "" : " h-0 overflow-hidden")
                  }
                  aria-hidden={!showUUID}
                >
                  <code>{formatUUID(member.uuid)}</code>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default MembersList;
