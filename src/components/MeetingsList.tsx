"use client";
import type { CalendarEvent } from "@/lib/types";

interface MeetingsListProps {
  meetings: CalendarEvent[];
}

export default function MeetingsList({ meetings }: MeetingsListProps) {
  if (meetings.length === 0) return null;

  const now = new Date();

  return (
    <section
      className="meetings-section"
      aria-labelledby="meetings-label"
    >
      <p className="section-label" id="meetings-label">
        Reuni&otilde;es de hoje
      </p>
      <ul className="meetings-list" role="list">
        {meetings.map((ev, i) => {
          const start = new Date(ev.start.dateTime || ev.start.date || "");
          const end = new Date(ev.end.dateTime || ev.end.date || "");
          const isPast = end < now;
          const isNow = start <= now && end >= now;

          const timeStr = ev.start.dateTime
            ? `${start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} &ndash; ${end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
            : "Dia inteiro";

          return (
            <li
              key={i}
              className={`meeting-item${isPast ? " meeting-item--past" : ""}${isNow ? " meeting-item--now" : ""}`}
              role="listitem"
            >
              <div
                className="meeting-item__time"
                dangerouslySetInnerHTML={{ __html: timeStr }}
              />
              <div className="meeting-item__body">
                <span className="meeting-item__title">
                  {ev.summary || "Sem título"}
                </span>
                {isNow && (
                  <span className="meeting-item__badge meeting-item__badge--now">
                    Agora
                  </span>
                )}
                {isPast && (
                  <span className="meeting-item__badge meeting-item__badge--past">
                    Encerrada
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
