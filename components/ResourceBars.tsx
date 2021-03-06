import { FC } from "react";

import ProgressBar from "./ProgressBar";

import { oneLine as l1 } from "common-tags";

export type Resources = {
  cpuPercent: number;
  ramPercent: number;
};

interface ResourceBarProps {
  usages: Resources;
  className?: string;
}

const colorBreakpoints = [
  { max: 30, text: "text-green-500", bg: "bg-green-500" },
  { max: 80, text: "text-yellow-500", bg: "bg-yellow-500" },
  { text: "text-red-500", bg: "bg-red-500" },
];

const getBreakpoint = (value: number) => {
  for (let index = 0; index < colorBreakpoints.length; index++) {
    let breakpoint = colorBreakpoints[index];
    const threshold = breakpoint.max ?? Infinity;
    if (value < threshold) return breakpoint;
  }

  return colorBreakpoints[colorBreakpoints.length - 1];
};

const ResourceBar: FC<ResourceBarProps> = ({ usages, className }) => {
  const cpuColor = getBreakpoint(usages.cpuPercent);
  const ramColor = getBreakpoint(usages.ramPercent);

  return (
    <div
      className={l1`bg-white text-black dark:bg-gray-800 dark:text-white
                    p-4 rounded-md ${className ? className : ""}`}
    >
      <h2 className="text-2xl font-bold mb-4">Server Resources</h2>
      <div className="flex justify-between items-end">
        <h3 className="leading-relaxed font-semibold">CPU Usage</h3>
        <span className="leading-snug">{usages.cpuPercent.toFixed(2)}%</span>
      </div>
      <ProgressBar
        className="mt-1"
        color={cpuColor.bg}
        progress={usages.cpuPercent}
      />

      <div className="flex justify-between items-end mt-4">
        <h3 className="leading-relaxed font-semibold">RAM Usage</h3>
        <span className="leading-snug">{usages.ramPercent.toFixed(2)}%</span>
      </div>
      <ProgressBar
        className="mt-1 mb-3"
        color={ramColor.bg}
        progress={usages.ramPercent}
      />
    </div>
  );
};

export default ResourceBar;
