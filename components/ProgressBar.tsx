import { FC } from "react";
import { oneLine as l1 } from "common-tags";

type ProgressBarProps = {
  color: string; // tailwind bg class
  bgColor?: string; // tailwind bg class
  progress: number; // as percent (e.g. "40")
  height?: string; // tailwind class
  className?: string; // extra classes
};

const ProgressBar: FC<ProgressBarProps> = (props) => {
  const height = props.height ?? "h-8";
  return (
    <div
      className={l1`w-full rounded-md overflow-hidden
      ${height} ${props.bgColor ?? "bg-gray-300 dark:bg-gray-600"}
      ${props.className ?? ""}`}
      role="presentation"
    >
      <div
        style={{ width: props.progress + "%" }}
        className={`${height} ${props.color} rounded-md transition-all ease-in-out duration-300`}
      />
    </div>
  );
};

export default ProgressBar;
