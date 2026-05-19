"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CLIENT_ID, SCOPES } from "@/lib/constants";

export function useGoogleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const tokenClientRef = useRef<any>(null);

  useEffect(() => {
    let gapiReady = false;
    let gsiReady = false;

    const poll = setInterval(() => {
      if (typeof window.gapi !== "undefined" && !gapiReady) {
        gapiReady = true;
        window.gapi.load("client", async () => {
          await window.gapi.client.init({});
          await window.gapi.client.load(
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          );
          await window.gapi.client.load(
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          );
        });
      }

      if (
        typeof window.google !== "undefined" &&
        window.google.accounts &&
        !gsiReady
      ) {
        gsiReady = true;
        tokenClientRef.current =
          window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (response: any) => {
              if (response.error) {
                console.error("Token error:", response);
                return;
              }
              setIsAuthenticated(true);
            },
          });
      }

      if (gapiReady && gsiReady) {
        clearInterval(poll);
        setIsLoading(false);
      }
    }, 200);

    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProfile = async () => {
      try {
        const res = await window.gapi.client.gmail.users.getProfile({
          userId: "me",
        });
        const email = res.result.emailAddress || "";
        const namePart = email.split("@")[0].replace(/[._]/g, " ");
        setUserName(namePart);
        setUserAvatar(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=365761&color=79f67a&bold=true&size=56`,
        );
      } catch {
        setUserName("Minha conta");
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  const signIn = useCallback(() => {
    tokenClientRef.current?.requestAccessToken({ prompt: "consent" });
  }, []);

  const signOut = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {});
      window.gapi.client.setToken(null);
    }
    setIsAuthenticated(false);
    setUserName("");
    setUserAvatar("");
  }, []);

  return { isAuthenticated, isLoading, userName, userAvatar, signIn, signOut };
}
