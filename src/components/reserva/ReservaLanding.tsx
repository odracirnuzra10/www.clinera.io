"use client";

import { useEffect, useState } from "react";
import { GRAD } from "@/components/brand-v3/Brand";

const MEET_DOMAIN = "meet.google.com/kye-abrq-qwj";

// Link al evento publicado en Google Calendar del user.
// Apunta al evento real con Google Meet ya adjunto (no es un URL template
// reconstruido — eso no permite adjuntar conferenceData). Al hacer click,
// el usuario ve la pill "Unirse con Google Meet" correctamente integrada
// y al guardar en su calendar la conferencia se adjunta automaticamente.
const GCAL_PUBLISHED_URL =
  "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Nm5ya3JiY2c1N3U3Y3Q1cmw0czBzOTFxMTlfMjAyNjA1MjhUMjAwMDAwWiByaWNhcmRvQG9hY2cuY2w&tmsrc=ricardo%40oacg.cl&scp=ALL";

type NextDate = {
  monthLabel: string;
  dayNum: number;
  weekdayLabel: string;
  year: number;
  month: number;
};

function getNextThursdayChile(now: Date = new Date()): NextDate {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const year = parseInt(get("year"), 10);
  const month = parseInt(get("month"), 10);
  const day = parseInt(get("day"), 10);
  const weekday = get("weekday");
  const hour = parseInt(get("hour"), 10);
  const dayOfWeek: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const todayDow = dayOfWeek[weekday] ?? 0;

  let daysAhead = (4 - todayDow + 7) % 7;
  if (daysAhead === 0 && hour >= 17) daysAhead = 7;

  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + daysAhead);

  const monthLabel = new Intl.DateTimeFormat("es-CL", { month: "long", timeZone: "UTC" })
    .format(base)
    .toUpperCase();
  const weekdayLabel = new Intl.DateTimeFormat("es-CL", { weekday: "long", timeZone: "UTC" })
    .format(base)
    .toUpperCase();

  const y = base.getUTCFullYear();
  const m = base.getUTCMonth() + 1;
  const d = base.getUTCDate();

  return {
    monthLabel,
    dayNum: d,
    weekdayLabel,
    year: y,
    month: m,
  };
}

export default function ReservaLanding() {
  const [nextDate, setNextDate] = useState<NextDate | null>(null);

  useEffect(() => {
    setNextDate(getNextThursdayChile());

    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: "/reserva",
      page_name: "reserva_landing",
      content_name: "Reserva tu cupo — Clinera",
      content_category: "webinar",
    });

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      if (!a.href.includes("calendar.google.com/calendar/event")) return;
      window.dataLayer!.push({
        event: "webinar_calendar_add",
        placement: "reserva",
        method: "google_calendar",
        page_path: "/reserva",
        content_name: "Reserva tu cupo — Clinera",
      });
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "Reserva tu cupo — Clinera",
          content_category: "webinar_calendar",
          placement: "reserva",
          value: 0,
          currency: "USD",
        });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true } as AddEventListenerOptions);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px 160px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(217,70,239,.10), transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(59,130,246,.08), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: "#fff",
            border: "1px solid #E5E7EB",
            padding: "6px 12px",
            borderRadius: 999,
            marginBottom: 18,
          }}
        >
          <span
            className="live-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "#10B981",
              display: "inline-block",
            }}
          />
          Próximo webinar
        </div>

        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: "0 0 28px",
            color: "#0A0A0A",
          }}
        >
          Guarda la fecha en tu Google Calendar.
        </h1>

        <CalendarPreviewCard data={nextDate} />
      </div>

      {/* Sticky floating CTA — único click posible en la página */}
      <a
        href={GCAL_PUBLISHED_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agregar el webinar a Google Calendar"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 28,
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "16px 28px",
          background: GRAD,
          color: "#fff",
          border: 0,
          borderRadius: 999,
          fontWeight: 600,
          fontSize: 16,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.005em",
          textDecoration: "none",
          lineHeight: 1,
          minWidth: 280,
          maxWidth: "calc(100vw - 32px)",
          boxShadow:
            "0 1px 2px rgba(11,11,15,.10), 0 16px 32px -10px rgba(11,11,15,.4)",
        }}
      >
        <GoogleCalendarIcon />
        Agregar a Google Calendar
        <span style={{ marginLeft: 4 }}>→</span>
      </a>
    </main>
  );
}

function CalendarPreviewCard({ data }: { data: NextDate | null }) {
  const monthLabel = data?.monthLabel ?? "MAYO";
  const dayNum = data?.dayNum ?? 28;
  const weekdayLabel = data?.weekdayLabel ?? "JUEVES";
  const year = data?.year ?? 2026;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 18,
        maxWidth: 420,
        margin: "0 auto",
        overflow: "hidden",
        boxShadow: "0 24px 64px -28px rgba(11,11,15,.18), 0 4px 14px -4px rgba(11,11,15,.06)",
        position: "relative",
        textAlign: "left",
      }}
    >
      <div aria-hidden style={{ height: 4, background: GRAD }} />

      <div
        style={{
          padding: "18px 24px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "#7C3AED",
            textTransform: "uppercase",
          }}
        >
          {monthLabel} {year}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "#9CA3AF",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RepeatIcon />
          Cada {weekdayLabel.toLowerCase().slice(0, 5)}
        </div>
      </div>

      <div
        style={{
          padding: "22px 24px 16px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: "#0A0A0A",
            minWidth: 92,
            textAlign: "center",
          }}
        >
          {dayNum}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "#6B7280",
              textTransform: "uppercase",
            }}
          >
            {weekdayLabel}
          </div>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#0A0A0A",
              letterSpacing: "-0.015em",
            }}
          >
            16:00 – 17:00
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.06em",
              color: "#9CA3AF",
            }}
          >
            hora Chile
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "14px 24px 20px",
          borderTop: "1px solid #F3F4F6",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#0A0A0A",
            letterSpacing: "-0.012em",
            lineHeight: 1.3,
          }}
        >
          Webinar Clinera — Empleados digitales con IA
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <VideoIcon />
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11.5,
              color: "#4B5563",
              letterSpacing: "0.01em",
            }}
          >
            {MEET_DOMAIN}
          </span>
        </div>
      </div>
    </div>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="3" fill="#fff" />
      <rect x="2" y="3" width="20" height="4" rx="3" fill="#4285F4" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#4285F4"
      >
        31
      </text>
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7C3AED"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
