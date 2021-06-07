import Button from "../../components/Button";
import Layout from "../../components/Layout";
import PasswordField from "../../components/PasswordField";

import { mdiLoginVariant } from "@mdi/js";
import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/router";

const apiBase = "https://omsinkrissada.sytes.net/api/minecraft/";

export default function AuthPage() {
  const [errorText, setErrorText] = useState("");
  const [errorParity, setErrorParity] = useState(false);

  const showError = (errorText: string) => {
    setErrorText(errorText);
    setErrorParity(!errorParity);
  };

  let passwordValue = "";

  const setPasswordValue = (newValue: string) => {
    passwordValue = newValue;
  };

  const router = useRouter();

  const authenticate = (password: string) => {
    axios
      .post(apiBase + "login", { passphrase: password })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        showError("Incorrect password");
      });
  };

  return (
    <Layout
      navs={null}
      color="bg-gray-900"
      className="text-white flex flex-col items-center justify-center"
    >
      <div className="w-72 transform -translate-y-8">
        <h2 className="text-3xl font-bold text-center mb-10">Hello, friends!</h2>
        <PasswordField
          label="Password"
          errorText={errorText}
          errorParity={errorParity}
          valueSetter={setPasswordValue}
          onEnter={() => authenticate(passwordValue)}
        />
        <Button
          iconPath={mdiLoginVariant}
          as="button"
          xPadding="pl-3 pr-2.5"
          className="mt-6 mx-auto"
          props={{
            onClick: () => authenticate(passwordValue),
          }}
        >
          Authenticate
        </Button>
      </div>
    </Layout>
  );
}
