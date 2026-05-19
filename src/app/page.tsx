"use client";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { isAuthenticated, isLoading, userName, userAvatar, signIn, signOut } =
    useGoogleAuth();

  if (isLoading) {
    return (
      <div className="login-screen">
        <div className="login-glow" aria-hidden="true" />
        <div className="login-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--color-teal-300)" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onSignIn={signIn} />;
  }

  return (
    <Dashboard
      userName={userName}
      userAvatar={userAvatar}
      onSignOut={signOut}
    />
  );
}
