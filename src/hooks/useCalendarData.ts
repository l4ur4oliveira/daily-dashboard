"use client";

import { useState, useEffect, useCallback } from "react";
import type { CalendarEvent } from "@/lib/types";

export function useCalendarData(isAuthenticated: boolean) {
  const [meetingCount, setMeetingCount] = useState<number | null>(null);
  const [meetingSubtext, setMeetingSubtext] = useState("");
  const [meetings, setMeetings] = useState<CalendarEvent[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const res = await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 20,
      });

      const events: CalendarEvent[] = res.result.items || [];
      const count = events.length;
      setMeetingCount(count);
      setMeetings(events);

      if (count === 0) {
        setMeetingSubtext("Nenhuma reunião hoje 🙌");
      } else {
        const upcoming = events.find((e) => {
          const start = new Date(e.start.dateTime || e.start.date || "");
          return start > now;
        });

        if (upcoming) {
          const t = new Date(
            upcoming.start.dateTime || upcoming.start.date || "",
          );
          setMeetingSubtext(
            `Próxima: ${t.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · ${upcoming.summary || "Sem título"}`,
          );
        } else {
          setMeetingSubtext(
            count === 1
              ? "1 reunião hoje"
              : `${count} reuniões hoje`,
          );
        }
      }
    } catch {
      setMeetingCount(null);
      setMeetingSubtext("Erro ao buscar agenda");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  return { meetingCount, meetingSubtext, meetings };
}
