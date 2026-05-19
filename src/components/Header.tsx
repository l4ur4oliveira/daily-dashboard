"use client";
import { LogOut } from "lucide-react";

interface HeaderProps {
  userName: string;
  userAvatar: string;
  onSignOut: () => void;
  todayDate: string;
}

export default function Header({
  userName,
  userAvatar,
  onSignOut,
  todayDate,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__top-row">
        <span className="header__eyebrow">
          <span className="header__eyebrow-dot" aria-hidden="true" />
          Sprint IA &middot; Dashboard
        </span>
        <button
          className="signout-btn"
          onClick={onSignOut}
          aria-label="Sair da conta"
          type="button"
        >
          <span className="user-avatar-wrap" aria-hidden="true">
            <img
              className="user-avatar"
              src={userAvatar}
              alt=""
              width="28"
              height="28"
            />
          </span>
          <span className="user-name">{userName}</span>
          <LogOut className="signout-icon" />
        </button>
      </div>
      <h1 className="header__title">
        Por onde começo <mark>hoje?</mark>
      </h1>
      <p className="header__date">{todayDate}</p>
    </header>
  );
}
