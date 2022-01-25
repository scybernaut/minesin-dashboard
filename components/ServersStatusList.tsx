import { FC } from "react";

import { oneLine as l1 } from "common-tags";

import dotCss from "./dotIndicator.module.css";

export type ServersStatus = Array<{
  online: boolean;
  name: string;
}>;

interface ServersStatusProps {
  statuses: ServersStatus;
  className?: string;
}

const ServersStatus: FC<ServersStatusProps> = ({ statuses, className }) => {
  return (
    <div
      className={l1`bg-white text-black dark:bg-gray-800 dark:text-white
                    p-4 rounded-md ${className ? className : ""}`}
    >
      <h2 className="text-2xl font-bold mb-2">Servers Status</h2>
      <div className="mb-3">
        {statuses.map((status) => (
          <div
            className={l1`flex justify-between items-center
                          sm:px-1 sm:mx-2 pt-1 border-b border-black/30 dark:border-white/30`}
            key={status.name}
          >
            <span>{status.name}</span>
            <p
              className={`w-[7ch] ml-4 ${dotCss.dot} ${
                status.online
                  ? dotCss.dot__active + " text-green-500"
                  : "text-gray-400"
              }`}
            >
              {status.online ? "Online" : "Offline"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServersStatus;
