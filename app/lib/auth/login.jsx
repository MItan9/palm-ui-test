"use client";

import { useUserContext } from "@/app/user-context";
import axios from "axios";
import https from "https";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Replace the enum with a plain object for JavaScript
const LoginExperience = {
  DEFAULT: 0,
  IFRAME: 1,
};

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REVERSE_PROXY_URI}`,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

async function getLoginOptions() {
  const response = await axiosInstance.get("/bff/login-options");
  return response.data;
}

export default function Login({ onLogin }) {
  const user = useUserContext();
  const [loginUri, setLoginUri] = useState("");
  const [selectedLoginExperience, setSelectedLoginExperience] = useState(
    LoginExperience.DEFAULT
  );
  const [isLoginModalDisplayed, setIsLoginModalDisplayed] = useState(false);
  const [isIframeLoginPossible, setIframeLoginPossible] = useState(false);
  const currentPath = usePathname();
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    iframe?.addEventListener("load", onIframeLoad);

    return () => {
      fetchLoginOptions();
      iframe?.removeEventListener("load", onIframeLoad);
    };
  }, []);

  async function fetchLoginOptions() {
    const loginOpts = await getLoginOptions();
    if (loginOpts?.length < 1 || !loginOpts[0].loginUri) {
      setLoginUri("");
      setIframeLoginPossible(false);
    } else {
      setLoginUri(loginOpts[0].loginUri);
      setIframeLoginPossible(true);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!loginUri) {
      return;
    }
    const url = new URL(loginUri);

    url.searchParams.append(
      "post_login_success_uri",
      `${process.env.NEXT_PUBLIC_BASE_URI}${currentPath}`
    );
    url.searchParams.append(
      "post_login_failure_uri",
      `${process.env.NEXT_PUBLIC_BASE_URI}/login-error`
    );
    const loginUrl = url.toString();
    if (
      selectedLoginExperience === LoginExperience.IFRAME &&
      iframeRef.current
    ) {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.src = loginUrl;
        setIsLoginModalDisplayed(true);
      }
    } else {
      window.location.href = loginUrl;
    }
  }

  function onIframeLoad() {
    if (isLoginModalDisplayed) {
      onLogin({});
    }
  }

  return (
    <span>
      <form onSubmit={onSubmit} className="flex items-center space-x-4">
        {isIframeLoginPossible && (
          <select
            className="px-2 py-1 border rounded-md"
            value={selectedLoginExperience}
            onChange={(e) => {
              setSelectedLoginExperience(
                parseInt(e.target.value, 10) === LoginExperience.IFRAME
                  ? LoginExperience.IFRAME
                  : LoginExperience.DEFAULT
              );
            }}
          >
            <option
              value={LoginExperience.IFRAME}
              hidden={!isIframeLoginPossible}
            >
              iframe
            </option>
            <option value={LoginExperience.DEFAULT}>default</option>
          </select>
        )}
        <button
          disabled={user.isAuthenticated}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Login
        </button>
      </form>
      <div
        className={
          !user.isAuthenticated && isLoginModalDisplayed
            ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            : "hidden"
        }
        onClick={() => setIsLoginModalDisplayed(false)}
      >
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex justify-end">
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsLoginModalDisplayed(false)}
            >
              X
            </button>
          </div>
          <iframe
            ref={iframeRef}
            className="w-full h-96 border rounded-md"
          ></iframe>
        </div>
      </div>
    </span>
  );
}
