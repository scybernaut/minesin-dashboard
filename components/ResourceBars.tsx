import { FC, useState, useEffect } from "react";

import { LoggedOutReasonCodes } from "../lib/shorthands";
import { getUsagePromises, apiErrorHandler } from "../lib/api";

import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";

import ProgressBar from "./ProgressBar";

interface ResourceBarProps {
  logout?: (reason?: LoggedOutReasonCodes) => void;
}

const colorBreakpoints = [
  { max: 40, text: "text-green-500", bg: "bg-green-500" },
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

const ResourceBar: FC<ResourceBarProps> = ({ logout }) => {
  const [cpuUsage, setCPUUsage] = useState(0);
  const [ramUsage, setRAMUsage] = useState(0);

  useEffect(() => {
    const promises = getUsagePromises(localStorage.getItem("accessToken") ?? "");

    promises.cpu
      .then((usage) => {
        setCPUUsage(usage);
      })
      .catch((err) => apiErrorHandler(err, logout));

    promises.ram
      .then((usage) => {
        setRAMUsage(usage);
      })
      .catch((err) => apiErrorHandler(err, logout));
  }, []);

  const cpuColor = getBreakpoint(cpuUsage);
  const ramColor = getBreakpoint(ramUsage);

  return (
    <div className="bg-white text-black p-4 rounded-md max-w-md">
      <h2 className="text-2xl font-bold mb-3">Resources</h2>
      <p className="font-medium">CPU Usage</p>
      <ProgressBar color={cpuColor.bg} progress={cpuUsage} />
      <p className="mb-2">
        <Icon
          path={mdiCircle}
          size="0.8em"
          className={`inline ${cpuColor.text} transform -translate-y-0.5`}
        />{" "}
        Used: {cpuUsage.toFixed(2)}%
      </p>
      <p className="font-medium">RAM Usage</p>
      <ProgressBar color={ramColor.bg} progress={ramUsage} />
      <p className="mb-2">
        <Icon
          path={mdiCircle}
          size="0.8em"
          className={`inline ${ramColor.text} transform -translate-y-0.5`}
        />{" "}
        Used: {ramUsage.toFixed(2)}%
      </p>
    </div>
  );
};

export default ResourceBar;
