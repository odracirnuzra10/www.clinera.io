"use client";

import { useEffect, useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";

const MEET_URL = "https://meet.google.com/kye-abrq-qwj";
const MEET_DOMAIN = "meet.google.com/kye-abrq-qwj";
const WA_GROUP = "https://chat.whatsapp.com/JJzwD46zLEiAjJXWqtoLgE?mode=gi_t";

type NextDate = {
  monthLabel: string; // "MAYO"
  dayNum: number;     // 28
  weekdayLabel: string; // "JUEVES"
  year: number;       // 2026
  month: number;      // 5 (1-12)
  fullLabel: string;  // "Jueves 28 de mayo · 16:00 hora Chile"
  gcalUrl: string;    // Google Calendar pre-fill URL (recurrente)
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function buildGoogleCalendarUrl(y: number, m: number, d: number): string {
  const dateStr = `${y}${pad2(m)}${pad2(d)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Webinar Clinera — Empleados digitales con IA",
    dates: `${dateStr}T160000/${dateStr}T170000`,
    ctz: "America/Santiago",
    details: [
      "Webinar semanal en vivo de Clinera. 30 minutos para conocer cómo AURA atiende, agenda y cobra por WhatsApp 24/7.",
      "",
      "Grupo de WhatsApp donde llega el link cada semana:",
      WA_GROUP,
      "",
      "Más info en https://www.clinera.io/reserva",
    ].join("\n"),
    location: MEET_URL,
    recur: "RRULE:FREQ=WEEKLY;BYDAY=TH;UNTIL=20261231T235959Z",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Calcula el próximo jueves a las 16:00 hora Chile.
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
  const fullLabel = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
    .format(base);

  const y = base.getUTCFullYear();
  const m = base.getUTCMonth() + 1;
  const d = base.getUTCDate();

  return {
    monthLabel,
    dayNum: d,
    weekdayLabel,
    year: y,
    month: m,
    fullLabel: `${fullLabel} · 16:00 hora Chile`,
    gcalUrl: buildGoogleCalendarUrl(y, m, d),
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
      if (!a.href.includes("calendar.google.com/calendar/render")) return;
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
    <section
      style={{
        minHeight: "calc(100vh - 140px)",
        padding: "64px 24px 96px",
        background: "#FAFAFA",
        position: "relative",
        overflow: "hidden",
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
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          position: "relative",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: "#fff",
            border: "1px solid #E5E7EB",
            padding: "6px 12px",
            borderRadius: 999,
            marginBottom: 24,
          }}
        >
          <span
            className="live-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#10B981",
              display: "inline-block",
            }}
          />
          Webinar semanal · gratis · 30 min
        </span>

        <h1
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(30px, 4.5vw, 46px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 14px",
            color: "#0A0A0A",
          }}
        >
          Guarda la fecha del{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            próximo webinar
          </span>
          .
        </h1>

        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 auto 36px",
            maxWidth: 520,
          }}
        >
          Un click agrega TODOS los jueves del año a tu calendario. Sin recordatorios manuales.
        </p>

        <CalendarPreviewCard data={nextDate} />

        <a
          href={nextDate?.gcalUrl ?? "https://calendar.google.com/calendar/render?action=TEMPLATE"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "16px 30px",
            background: GRAD,
            color: "#fff",
            border: 0,
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.005em",
            textDecoration: "none",
            lineHeight: 1,
            minWidth: 280,
            marginTop: 32,
            boxShadow:
              "0 12px 32px -8px rgba(124,58,237,.4),0 4px 12px -2px rgba(217,70,239,.25)",
          }}
        >
          <GoogleCalendarIcon />
          Agregar a Google Calendar
          <span style={{ marginLeft: 4 }}>→</span>
        </a>

        <p
          style={{
            marginTop: 18,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "#6B7280",
            maxWidth: 460,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}
        >
          Abre Google Calendar con el evento recurrente pre-llenado. 1 click para guardar.
        </p>

        <div
          style={{
            marginTop: 64,
            paddingTop: 40,
            borderTop: "1px solid #E5E7EB",
            textAlign: "left",
          }}
        >
          <Eyebrow style={{ display: "block", marginBottom: 14 }}>Qué vas a ver</Eyebrow>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              "Cómo reemplazar a la recepcionista con IA — agenda, cobra, reactiva.",
              "Cómo conectar Meta Lead Ads en 30 segundos al WhatsApp de la clínica.",
              "Cuál de los 3 modos de IA elegir según tu volumen.",
              "Casos reales: clínicas operando 24/7 con números, no promesas.",
            ].map((t, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#1F2937",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CalendarPreviewCard — visual estilo "save the date" / event card.
   Muestra el próximo jueves prominente con detalles del webinar.
   ============================================================ */
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
      {/* Top gradient strip — accent visual */}
      <div
        aria-hidden
        style={{
          height: 4,
          background: GRAD,
        }}
      />

      {/* Header: month/year + weekday */}
      <div
        style={{
          padding: "20px 28px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
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

      {/* Day + weekday */}
      <div
        style={{
          padding: "24px 28px 18px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: "#0A0A0A",
            minWidth: 100,
            textAlign: "center",
          }}
        >
          {dayNum}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
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

      {/* Event detail rows */}
      <div
        style={{
          padding: "16px 28px 22px",
          borderTop: "1px solid #F3F4F6",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15.5,
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
              fontSize: 12,
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
      width="12"
      height="12"
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
