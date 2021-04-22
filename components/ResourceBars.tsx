import { FC } from "react";

import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";

import ProgressBar from "./ProgressBar";

interface ResourceBarProps {
  usages: {
    cpu: number;
    ram: number;
  };
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

const ResourceBar: FC<ResourceBarProps> = ({ usages }) => {
  const cpuColor = getBreakpoint(usages.cpu);
  const ramColor = getBreakpoint(usages.ram);

  return (
    <div className="bg-white text-black p-4 rounded-md">
      <h2 className="text-2xl font-bold mb-3">Resources</h2>
      <p className="font-medium">CPU Usage</p>
      <ProgressBar color={cpuColor.bg} progress={usages.cpu} />
      <p className="mb-2">
        <Icon
          path={mdiCircle}
          size="0.8em"
          className={`inline ${cpuColor.text} transform -translate-y-0.5`}
        />{" "}
        Used: {usages.cpu.toFixed(2)}%
      </p>
      <p className="font-medium">RAM Usage</p>
      <ProgressBar color={ramColor.bg} progress={usages.ram} />
      <p className="mb-2">
        <Icon
          path={mdiCircle}
          size="0.8em"
          className={`inline ${ramColor.text} transform -translate-y-0.5`}
        />{" "}
        Used: {usages.ram.toFixed(2)}%
      </p>
    </div>
  );
};

export default ResourceBar;
