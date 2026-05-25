"use client";

import { useEffect, useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";

const WA_GROUP = "https://chat.whatsapp.com/JJzwD46zLEiAjJXWqtoLgE?mode=gi_t";
const ICS_URL = "/webinar.ics";

// Helper: calcula el próximo jueves a las 16:00 hora Chile,
// retorna fecha + label legible para mostrar en el hero.
function getNextThursdayChile(now: Date = new Date()): { dateStr: string } {
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

  const label = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(base);

  return { dateStr: `${label} · 16:00 hora Chile` };
}

export default function ReservaLanding() {
  const [nextDate, setNextDate] = useState<string>("");

  useEffect(() => {
    setNextDate(getNextThursdayChile().dateStr);

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
      const href = a.href;
      const isWhatsApp = href.includes("chat.whatsapp.com/JJzwD46z");
      const isCalendar = href.includes("/webinar.ics");
      if (!isWhatsApp && !isCalendar) return;
      const eventName = isCalendar ? "webinar_calendar_add" : "webinar_join_click";
      window.dataLayer!.push({
        event: eventName,
        placement: "reserva",
        page_path: "/reserva",
        content_name: "Reserva tu cupo — Clinera",
      });
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "Reserva tu cupo — Clinera",
          content_category: isCalendar ? "webinar_calendar" : "webinar_join",
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
    <>
      <section
        style={{
          minHeight: "calc(100vh - 140px)",
          padding: "80px 24px 96px",
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
              marginBottom: 28,
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
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 18px",
              color: "#0A0A0A",
            }}
          >
            Reserva tu cupo del{" "}
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

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: 600,
              color: "#0A0A0A",
              padding: "12px 20px",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              marginBottom: 32,
              minHeight: 44,
            }}
          >
            <CalendarIcon />
            <span style={{ minWidth: 220 }}>
              {nextDate
                ? `Próximo: ${nextDate.charAt(0).toUpperCase() + nextDate.slice(1)}`
                : "Próximo jueves · 16:00 hora Chile"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            <a
              href={ICS_URL}
              download="webinar-clinera.ics"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "16px 26px",
                background: GRAD,
                color: "#fff",
                border: 0,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.005em",
                textDecoration: "none",
                lineHeight: 1,
                minWidth: 280,
                boxShadow:
                  "0 12px 32px -8px rgba(124,58,237,.35),0 4px 12px -2px rgba(217,70,239,.22)",
              }}
            >
              <CalendarIcon />
              Agregar a mi calendario
              <span style={{ marginLeft: 4 }}>→</span>
            </a>

            <a
              href={WA_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 24px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                color: "#0A0A0A",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                textDecoration: "none",
                letterSpacing: "-0.005em",
                lineHeight: 1,
                minWidth: 280,
                justifyContent: "center",
              }}
            >
              <WhatsAppIcon />
              Unirme al grupo del webinar
            </a>
          </div>

          <p
            style={{
              marginTop: 24,
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
            Al agregar al calendario quedas con TODOS los jueves del año agendados de una vez.
          </p>

          <div
            style={{
              marginTop: 56,
              paddingTop: 36,
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
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
    </>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  );
}
