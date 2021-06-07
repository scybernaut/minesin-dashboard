import { useEffect, useState, useRef, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Transition } from "@headlessui/react";
import { focusRing } from "../lib/shorthands";

import Icon from "@mdi/react";
import { mdiClose, mdiMenu, mdiLogoutVariant, mdiBrightness3, mdiBrightness7 } from "@mdi/js";

import { oneLine as l1 } from "common-tags";
import _throttle from "lodash/throttle";

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
  useSolid?: boolean;
  always?: string;
  fullWidth?: boolean;
  showToggle?: boolean;
};

export const icon24 = {
  width: 24,
  height: 24,
};

export const icon32 = {
  width: 32,
  height: 32,
};

const Layout: React.FC<LayoutProps> = ({
  color,
  children,
  className,
  actions,
  useSolid,
  always,
  fullWidth,
  showToggle,
}) => {
  const router = useRouter();
  const pageIndex = actions.navs?.findIndex((nav) => nav.href === router.pathname);
  const [transparent, setTransparent] = useState(always !== "solid");
  const scrollRef = useRef<HTMLElement>(null);

  if (useSolid === undefined) useSolid = true;

  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    setDarkTheme(localStorage.getItem("darkTheme") !== "false");
  }, []);

  useEffect(() => {
    if (always !== undefined) return;

    const checkScroll = _throttle(() => {
      const scrollTop: number = window.scrollY;

      if (scrollTop > 10) setTransparent(false);
      else setTransparent(true);
    }, 500);

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div className={`flex flex-col w-full ${darkTheme ? "dark" : ""} ${color}`}>
      <header
        className={l1`w-full h-nav p-3
                      ${transparent ? (useSolid ? color : "transparent") : "bg-primary"}
                      transition-colors duration-300 ease-in text-on-primary flex-grow-0
                      top-0 left-0 right-0 sticky z-10 flex items-center justify-center`}
      >
        <div
          className={l1`absolute top-0 w-full p-3 mx-auto
                          ${fullWidth ? "" : "max-w-5xl"} flex justify-between`}
        >
          {actions.navs != null ? (
            <nav>
              <button
                className={l1`flex items-center justify-center
                              top-3 left-3 w-8 h-8 rounded ${focusRing}
                              transition-opacity duration-100 ease-in-out`}
                onClick={toggleNav}
              >
                <Icon
                  path={navOpen ? mdiClose : mdiMenu}
                  title={navOpen ? "Hide navigation menu" : "Show navigation menu"}
                  id={navOpen ? "icon-hide-nav" : "icon-show-nav"}
                  {...icon32}
                />
              </button>
              <Transition
                show={navOpen}
                enter="transition ease-in-out duration-300 transform origin-top-left"
                enterFrom="opacity-0 scale-0"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in-out duration-150 transform origin-top-left"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-0"
                className={l1`relative mx-1 my-2 py-1 rounded
                              bg-white text-black shadow-md border-2`}
                as="ul"
                unmount={false}
              >
                {actions.navs?.map((nav, index) => (
                  <li key={nav.name}>
                    <Link href={nav.href}>
                      <a
                        className={l1`block font-medium pl-4 pr-6 py-2 rounded ${focusRing}
                        ${index === pageIndex ? "text-primary-light font-bold" : ""}`}
                      >
                        {nav.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </Transition>
            </nav>
          ) : null}
          <h1
            className={l1`select-none
                absolute top-3 left-1/2 z-10
                transform -translate-x-1/2 translate-y-1.5`}
          >
            <Link href="/">
              <a
                className={l1`text-2xl font-extrabold font-minecraft
                              rounded ${focusRing}`}
                aria-label="Go to home page"
              >
                MINESIN
              </a>
            </Link>
          </h1>
          <div className="flex items-center top-3 right-3 h-8 gap-1 sm:gap-4">
            {showToggle ? (
              <button
                className={`flex items-center justify-center h-8 top-3 right-3 rounded sm:px-1 ${focusRing}`}
                onClick={() => {
                  localStorage.setItem("darkTheme", (!darkTheme).toString());
                  setDarkTheme(!darkTheme);
                }}
                aria-label="Toggle dark theme"
              >
                <span className="font-medium mr-1 hidden sm:block">
                  {`${darkTheme ? "Light" : "Dark"} theme`}
                </span>
                <Icon
                  path={darkTheme ? mdiBrightness7 : mdiBrightness3}
                  title="Toggle theme icon"
                  id="theme-toggle"
                  className="w-8 h-8 sm:h-6 sm:w-6"
                  {...icon32}
                />
              </button>
            ) : null}
            {actions.buttonAction ? (
              <button
                className={`flex items-center justify-center h-8 rounded sm:px-1 ${focusRing}`}
                onClick={actions.buttonAction.onClick}
                aria-labelledby="logout-text"
              >
                {actions.buttonAction.name === "logout" && (
                  <>
                    <span id="logout-text" className="font-medium mr-1 hidden sm:block">
                      Log out
                    </span>
                    <Icon
                      path={mdiLogoutVariant}
                      title="Log out icon"
                      id="logout-icon"
                      className="w-8 h-8 sm:h-6 sm:w-6"
                      {...icon32}
                    />
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </header>
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
