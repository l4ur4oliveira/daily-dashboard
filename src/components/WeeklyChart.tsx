"use client";

import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

interface WeeklyChartProps {
  labels: string[];
  counts: number[];
}

export default function WeeklyChart({ labels, counts }: WeeklyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || labels.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const style = getComputedStyle(document.documentElement);
    const get = (v: string) => style.getPropertyValue(v).trim();
    const lime400 = get("--color-lime-400");
    const teal700 = get("--color-teal-700");
    const teal800 = get("--color-teal-800");
    const teal300 = get("--color-teal-300");
    const teal100 = get("--color-teal-100");
    const fontMono = get("--font-oxygen-mono");

    const todayIdx = labels.length - 1;
    const barColors = counts.map((_, i) =>
      i === todayIdx ? lime400 : teal700,
    );
    const barHover = counts.map((_, i) =>
      i === todayIdx ? "#a4f8a5" : teal300,
    );

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Emails",
            data: counts,
            backgroundColor: barColors,
            hoverBackgroundColor: barHover,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: teal800,
            titleColor: teal300,
            bodyColor: teal100,
            borderColor: teal700,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: fontMono, size: 11 },
            bodyFont: { family: fontMono, size: 13 },
            callbacks: {
              title: (items: any[]) => {
                const i = items[0].dataIndex;
                return i === todayIdx ? `${labels[i]} · hoje` : labels[i];
              },
              label: (item: any) => ` ${item.parsed.y} emails`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: teal300, font: { family: fontMono, size: 11 } },
          },
          y: {
            grid: { color: teal800 },
            border: { display: false },
            ticks: {
              color: teal300,
              font: { family: fontMono, size: 11 },
              maxTicksLimit: 5,
            },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [labels, counts]);

  return (
    <section className="chart-section" aria-labelledby="chart-label">
      <p className="section-label" id="chart-label">
        Contexto da semana
      </p>
      <div className="chart-card">
        <div className="chart-card__header">
          <div className="chart-card__title-group">
            <span className="chart-card__title">
              Volume de emails na semana
            </span>
            <span className="chart-card__subtitle">
              &Uacute;ltimos 7 dias &middot; hoje em destaque
            </span>
          </div>
          <div className="chart-card__legend" aria-hidden="true">
            <span className="chart-card__legend-dot" />
            emails / dia
          </div>
        </div>
        <div className="chart-card__canvas-wrap">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Gráfico de barras com volume de emails nos últimos 7 dias"
          />
        </div>
      </div>
    </section>
  );
}
