import { FC, createElement } from "react";
import Icon from "@mdi/react";

import { icon24 } from "./Layout";

import Link from "next/link";

export type ButtonProps = {
  iconPath?: string;
  as?: string;
  href?: string;
  props?: Record<string, any>;
  xPadding?: string;
  padIconLeft?: string;
  className?: string;
};

const Button: FC<ButtonProps> = ({
  iconPath,
  as,
  href,
  xPadding,
  padIconLeft,
  children,
  className,
  props,
}) => {
  const Button = createElement(
    as ?? "a",
    {
      className: `text-on-primary bg-primary-light font-semibold py-2 ${
        xPadding ?? (iconPath ? "px-3" : "px-4")
      } rounded flex cursor-pointer hover:bg-primary focus:bg-primary-light focus:ring focus:outline-none ${
        className ?? ""
      }`,
      href,
      ...props,
    },
    <>
      <span>{children}</span>
      {iconPath ? (
        <Icon path={iconPath} className={`${padIconLeft ?? "ml-1.5"} h-6`} {...icon24} />
      ) : null}
    </>
  );

  if (as === undefined && href !== undefined) return <Link href={href}>{Button}</Link>;
  return Button;
};

export default Button;
