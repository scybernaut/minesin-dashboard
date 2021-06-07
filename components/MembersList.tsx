import { FC } from "react";

import { MembersArray } from "../lib/api";

import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import updateLocale from "dayjs/plugin/updateLocale";

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
}

const MembersList: FC<MembersListProps> = ({ members }) => {
  return (
    <div className="bg-white text-black p-4 rounded-md">
      <h2 className="font-bold text-2xl mb-3">Members</h2>
      <ol className="flex flex-col gap-5">
        {members?.map((member) => (
          <li key={member.uuid} className="h-10 flex items-center">
            <img
              src={member.skinURL}
              className="h-full w-10 flex-shrink-0 bg-gray-300 rounded-sm"
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
        ))}
      </ol>
    </div>
  );
};

export default MembersList;
