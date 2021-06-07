import Button from "../../components/Button";
import Layout from "../../components/Layout";
import InputField from "../../components/InputField";

import { mdiLoginVariant } from "@mdi/js";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { authenticate, checkTokenStatus, tokenStatus } from "../../lib/api";
import { loggedOutReasons, LoggedOutReasonCode, logoutOptions } from "../../lib/shorthands";

import { oneLine as l1 } from "common-tags";
import { AxiosError } from "axios";

import _once from "lodash/once";

export default function AuthPage() {
  const router = useRouter();

  const [errorText, setErrorText] = useState("");
  const [errorParity, setErrorParity] = useState(false);

  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!router.isReady) return;
    const reasonCode = router.query.reason;
    const optionsMask =
      typeof router.query.options === "string" ? parseInt(router.query.options) : NaN;

    if (typeof reasonCode === "string" && Object.keys(loggedOutReasons).includes(reasonCode)) {
      // Should be safe to cast type as the type is already checked in the above statement
      const safeReasonCode = reasonCode as Exclude<LoggedOutReasonCode, null>;

      const showReason = _once(() => {
        setReason(loggedOutReasons[safeReasonCode]);
        setShowReason(true);
      });

      if (document.visibilityState === "visible") {
        showReason();
      } else {
        window.addEventListener(
          "visibilitychange",
          () => {
            if (document.visibilityState !== "visible") return;
            showReason();
          },
          { once: true }
        );
      }
    }

    if (optionsMask != NaN) {
      if (logoutOptions.removeToken & optionsMask) {
        localStorage.removeItem("accessToken");
      }

      if (logoutOptions.canRedirect & optionsMask) {
        const token = localStorage.getItem("accessToken");
        if (checkTokenStatus(token) === tokenStatus.Valid) router.replace("/dashboard");
      }
    }

    const timeout = setTimeout(() => setShowReason(false), 5000);
    return () => clearTimeout(timeout);
  }, [router.isReady]);

  const showError = (errorText: string) => {
    setErrorText(errorText);
    setErrorParity(!errorParity);
  };

  let usernameValue = "";
  let passwordValue = "";

  const setPasswordValue = (newValue: string) => {
    passwordValue = newValue;
  };

  const setUsernameValue = (newValue: string) => {
    usernameValue = newValue;
  };

  const login = () => {
    authenticate(usernameValue, passwordValue)
      .then((accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        router.replace("/dashboard");
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
          case 403:
            showError("Invalid username or password");
            break;
          default:
            showError("An error occured while trying to sign in");
            console.error(err);
        }
      });
  };

  return (
    <Layout
      actions={{ navs: null }}
      color="bg-gray-900"
      className="text-white flex flex-col items-center justify-center"
    >
      <Transition
        show={showReason}
        appear
        enter="transition duration-300 ease-in-out transform"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition duration-300 ease-out transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
        className={l1`absolute top-16 py-0.5 px-2 mx-4 text-sm rounded-sm border
          bg-yellow-200 text-yellow-700 border-yellow-700`}
      >
        {reason}
      </Transition>
      <div className="w-full max-w-80 sm:max-w-96 lg:max-w-108 p-4">
        <h2 className="text-3xl font-bold text-center mb-10">Hello, friends!</h2>
        <InputField
          label="Minecraft Username"
          placeholder="Username"
          valueSetter={setUsernameValue}
        />
        <InputField
          label="Password"
          type="password"
          errorText={errorText}
          errorParity={errorParity}
          valueSetter={setPasswordValue}
          onEnter={login}
        />
        <Button
          iconPath={mdiLoginVariant}
          as="button"
          xPadding="pl-3 pr-2.5"
          className="mt-8 mx-auto"
          props={{
            onClick: login,
          }}
        >
          Authenticate
        </Button>
      </div>
    </Layout>
  );
}
