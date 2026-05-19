"use client";
import { Mail, CalendarCheck, CircleCheckBig } from "lucide-react";

interface SummaryCardsProps {
  unreadCount: number | null;
  emailSubtext: string;
  meetingCount: number | null;
  meetingSubtext: string;
}

export default function SummaryCards({
  unreadCount,
  emailSubtext,
  meetingCount,
  meetingSubtext,
}: SummaryCardsProps) {
  return (
    <section aria-labelledby="summary-label">
      <p className="section-label" id="summary-label">
        Resumo do dia
      </p>
      <div className="summary-grid" role="list">
        <article
          className="card card--email"
          role="listitem"
          aria-label={`Emails não lidos: ${unreadCount ?? "—"}`}
        >
          <div className="card__header">
            <div className="card__icon-wrap" aria-hidden="true">
              <Mail />
            </div>
            <span className="card__badge">Inbox</span>
          </div>
          <div className="card__body">
            <span className="card__count">
              {unreadCount !== null ? (
                unreadCount
              ) : (
                <span className="skeleton skeleton--count" />
              )}
            </span>
            <span className="card__label">Emails n&atilde;o lidos</span>
            <span className="card__sublabel">
              {emailSubtext || <span className="skeleton skeleton--text" />}
            </span>
          </div>
        </article>

        <article
          className="card card--meeting"
          role="listitem"
          aria-label={`Reuniões hoje: ${meetingCount ?? "—"}`}
        >
          <div className="card__header">
            <div className="card__icon-wrap" aria-hidden="true">
              <CalendarCheck />
            </div>
            <span className="card__badge">Agenda</span>
          </div>
          <div className="card__body">
            <span className="card__count">
              {meetingCount !== null ? (
                meetingCount
              ) : (
                <span className="skeleton skeleton--count" />
              )}
            </span>
            <span className="card__label">Reuni&otilde;es hoje</span>
            <span className="card__sublabel">
              {meetingSubtext || <span className="skeleton skeleton--text" />}
            </span>
          </div>
        </article>

        <article
          className="card card--tasks"
          role="listitem"
          aria-label="Tarefas pendentes"
        >
          <div className="card__header">
            <div className="card__icon-wrap" aria-hidden="true">
              <CircleCheckBig />
            </div>
            <span className="card__badge">Tasks</span>
          </div>
          <div className="card__body">
            <span className="card__count">&mdash;</span>
            <span className="card__label">Tarefas pendentes</span>
            <span className="card__sublabel">Em breve via Google Tasks</span>
          </div>
        </article>
      </div>
    </section>
  );
}
