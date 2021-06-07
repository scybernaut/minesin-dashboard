import { useEffect, useState, useRef, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Transition } from "@headlessui/react";
import { focusRing } from "../lib/shorthands";

import Icon from "@mdi/react";
import { mdiClose, mdiMenu, mdiLogoutVariant } from "@mdi/js";

import { oneLine as l1 } from "common-tags";
import throttle from "lodash/throttle";

export type LayoutActions = {
  navs: Array<{ name: string; href: string }> | null;
  buttonAction?: {
    name: string;
    onClick: MouseEventHandler;
  };
};

export type LayoutProps = {
  color: string;
  actions: LayoutActions;
  className?: string;
  alwaysTransparent?: boolean;
  useSolid?: boolean;
};

const Layout: React.FC<LayoutProps> = ({
  color,
  children,
  className,
  actions,
  useSolid,
  alwaysTransparent,
}) => {
  const router = useRouter();
  const pageIndex = actions.navs?.findIndex((nav) => nav.href === router.pathname);
  const [transparent, setTransparent] = useState(true);
  const scrollRef = useRef<HTMLElement>(null);

  if (useSolid === undefined) useSolid = true;

  const checkScroll = throttle(() => {
    const scrollTop: number = window.scrollY;

    if (scrollTop > 10) setTransparent(false);
    else setTransparent(true);
  }, 500);

  useEffect(() => {
    if (alwaysTransparent) return;

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div className={`flex flex-col w-full ${color}`}>
      <>
        <header
          className={l1`w-full h-nav p-3
              ${transparent ? (useSolid ? color : "transparent") : "bg-primary"}
              transition-colors duration-300 ease-in text-on-primary flex-grow-0
              top-0 left-0 right-0 sticky z-20`}
        >
          <div className="flex items-center justify-center h-full">
            {actions.navs != null ? (
              <Transition
                show
                appear
                enter="transition ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
              >
                <button
                  className={`flex items-center justify-center
                absolute top-3 left-3 w-8 h-8 rounded ${focusRing}
                transition-opacity duration-100 ease-in-out`}
                  onClick={toggleNav}
                >
                  <Icon
                    path={navOpen ? mdiClose : mdiMenu}
                    title={navOpen ? "Hide navigation menu" : "Show navigation menu"}
                    id={navOpen ? "icon-hide-nav" : "icon-show-nav"}
                  />
                </button>
              </Transition>
            ) : null}
            <Link href="/">
              <a className="text-2xl font-extrabold font-minecraft transform translate-y-1.5 translate-x-0.5">
                MINESIN
              </a>
            </Link>
            {actions.buttonAction ? (
              <button
                className={`flex items-center justify-center w-8 h-8 absolute top-3 right-3 rounded ${focusRing}`}
                onClick={actions.buttonAction.onClick}
              >
                {actions.buttonAction.name === "logout" && (
                  <Icon path={mdiLogoutVariant} title="Log out" id="logout" />
                )}
              </button>
            ) : null}
          </div>
        </header>
        {actions.navs != null ? (
          <Transition
            show={navOpen}
            enter="transition ease-in-out duration-300 transform origin-top-left"
            enterFrom="opacity-0 scale-0"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in-out duration-150 transform origin-top-left"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-0"
            className={l1`fixed left-0 top-14 z-10 mx-3 py-1 rounded
            bg-white text-black shadow-md border-2`}
            as="nav"
          >
            {actions.navs?.map((nav, index) => (
              <Link href={nav.href} key={nav.name}>
                <a
                  className={`block font-medium pl-4 pr-6 py-2 rounded ${
                    index === pageIndex && "text-primary-light font-bold"
                  }`}
                >
                  {nav.name}
                </a>
              </Link>
            ))}
          </Transition>
        ) : null}
      </>
      <main
        className={`flex-grow min-h-non-nav ${color} ${className ? className : ""}`}
        ref={scrollRef}
        onClick={() => {
          setNavOpen(false);
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
