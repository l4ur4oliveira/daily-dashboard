"use client";

import { useState, useEffect, useCallback } from "react";

export function useGmailData(isAuthenticated: boolean) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [emailSubtext, setEmailSubtext] = useState("");
  const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
  const [weeklyCounts, setWeeklyCounts] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await window.gapi.client.gmail.users.labels.get({
        userId: "me",
        id: "INBOX",
      });
      const total = res.result.messagesUnread || 0;
      setUnreadCount(total);
      setEmailSubtext(
        total === 0
          ? "Inbox zerado 🎉"
          : total === 1
            ? "1 mensagem aguarda atenção"
            : `${total} mensagens aguardam atenção`,
      );
      await loadWeeklyChart();
    } catch {
      setUnreadCount(null);
      setEmailSubtext("Erro ao buscar emails");
    }
  }, []);

  const loadWeeklyChart = async () => {
    const days: Date[] = [];
    const labels: string[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
      labels.push(label.replace(".", ""));
      days.push(d);
    }

    const counts: number[] = [];

    await Promise.all(
      days.map(async (d, idx) => {
        const after = Math.floor(new Date(d).setHours(0, 0, 0, 0) / 1000);
        const before = Math.floor(
          new Date(days[idx]).setHours(23, 59, 59, 999) / 1000,
        );
        try {
          let count = 0;
          let pageToken: string | undefined;
          do {
            const r = await window.gapi.client.gmail.users.messages.list({
              userId: "me",
              q: `in:inbox after:${after} before:${before}`,
              maxResults: 500,
              pageToken: pageToken,
              fields: "messages/id,nextPageToken",
            });
            if (r.result.messages) {
              count += r.result.messages.length;
            }
            pageToken = r.result.nextPageToken;
          } while (pageToken);
          counts[idx] = count;
        } catch {
          counts[idx] = 0;
        }
      }),
    );

    setWeeklyLabels(labels);
    setWeeklyCounts(counts);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  return { unreadCount, emailSubtext, weeklyLabels, weeklyCounts };
}
