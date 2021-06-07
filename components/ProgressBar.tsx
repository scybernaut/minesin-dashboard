import { FC } from "react";
import { oneLine as l1 } from "common-tags";

type ProgressBarProps = {
  color: string; // tailwind bg class
  bgColor?: string; // tailwind bg class
  progress: number; // as percent ("40")
  height?: string; // tailwind class
  className?: string; // extra classes
};

const ProgressBar: FC<ProgressBarProps> = (props) => {
  const height = props.height ?? "h-8";
  return (
    <div
      className={l1`w-full rounded-md
      ${height} ${props.bgColor ?? "bg-gray-300"}
      ${props.className ?? ""}`}
    >
      <div
        style={{ width: props.progress + "%" }}
        className={`${height} ${props.color} rounded-md transition-all ease-in-out duration-300`}
      />
    </div>
  );
};

export default ProgressBar;
