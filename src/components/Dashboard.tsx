"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import MeetingsList from "./MeetingsList";
import WeeklyChart from "./WeeklyChart";
import Footer from "./Footer";
import { useGmailData } from "@/hooks/useGmailData";
import { useCalendarData } from "@/hooks/useCalendarData";

interface DashboardProps {
  userName: string;
  userAvatar: string;
  onSignOut: () => void;
}

export default function Dashboard({
  userName,
  userAvatar,
  onSignOut,
}: DashboardProps) {
  const [todayDate, setTodayDate] = useState("");
  const [footerText, setFooterText] = useState("");
  const { unreadCount, emailSubtext, weeklyLabels, weeklyCounts } =
    useGmailData(true);
  const { meetingCount, meetingSubtext, meetings } = useCalendarData(true);

  const footerSet = useRef(false);

  useEffect(() => {
    const now = new Date();
    setTodayDate(
      now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    if (unreadCount === null || meetingCount === null) return;
    if (footerSet.current) return;
    footerSet.current = true;
    const now = new Date();
    setFooterText(
      `Dados reais da sua conta Google · atualizado às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
    );
  }, [unreadCount, meetingCount]);

  return (
    <div className="page">
      <Header
        userName={userName}
        userAvatar={userAvatar}
        onSignOut={onSignOut}
        todayDate={todayDate}
      />
      <hr className="divider" aria-hidden="true" />
      <SummaryCards
        unreadCount={unreadCount}
        emailSubtext={emailSubtext}
        meetingCount={meetingCount}
        meetingSubtext={meetingSubtext}
      />
      <MeetingsList meetings={meetings} />
      <WeeklyChart labels={weeklyLabels} counts={weeklyCounts} />
      <Footer text={footerText} />
    </div>
  );
}
