import { NextResponse } from "next/server";

const WA_GROUP = "https://chat.whatsapp.com/JJzwD46zLEiAjJXWqtoLgE?mode=gi_t";
const MEET_URL = "https://meet.google.com/kye-abrq-qwj";

/**
 * Calcula el próximo jueves a las 16:00 hora Chile (America/Santiago).
 * Reglas:
 * - Si hoy es jueves antes de las 16:00 Chile → ese mismo jueves.
 * - Si hoy es jueves después de las 16:00 Chile → próximo jueves (en 7 días).
 * - Otros días → próximo jueves más cercano.
 *
 * Retorna { y, m, d } en fecha local Chile (no UTC), porque el .ics
 * usa DTSTART;TZID=America/Santiago:YYYYMMDDTHHMMSS (sin Z).
 */
function nextThursdayInChile(now: Date = new Date()): { y: number; m: number; d: number } {
  // Convertimos `now` (UTC bajo el hood) a fecha+hora Chile usando Intl.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const year = parseInt(get("year"), 10);
  const month = parseInt(get("month"), 10); // 1-12
  const day = parseInt(get("day"), 10);
  const weekday = get("weekday"); // "Mon" "Tue" "Wed" "Thu" "Fri" "Sat" "Sun"
  const hour = parseInt(get("hour"), 10);

  // Map weekday short → 0-6 (Sun=0 ... Sat=6)
  const dayOfWeek: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const todayDow = dayOfWeek[weekday] ?? 0;

  // Días hasta el próximo jueves (Thu = 4)
  let daysAhead = (4 - todayDow + 7) % 7;
  if (daysAhead === 0 && hour >= 17) {
    // Hoy es jueves después de las 17:00 (webinar terminado) → próximo jueves
    daysAhead = 7;
  }

  // Calcular la fecha resultante (en local Chile). Como JavaScript Date no
  // soporta arithmetic en zona arbitraria, construyo desde components.
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + daysAhead);

  return {
    y: base.getUTCFullYear(),
    m: base.getUTCMonth() + 1,
    d: base.getUTCDate(),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatIcsLocalDateTime(y: number, m: number, d: number, hh: number, mm: number): string {
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function buildIcs(start: { y: number; m: number; d: number }): string {
  const dtStart = formatIcsLocalDateTime(start.y, start.m, start.d, 16, 0);
  const dtEnd = formatIcsLocalDateTime(start.y, start.m, start.d, 17, 0);

  // DTSTAMP en UTC del momento de generación (request time).
  const now = new Date();
  const dtStamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  // DESCRIPTION: escapar , ; \ y usar \n para newlines (RFC 5545)
  const description = [
    "Webinar semanal en vivo de Clinera. 30 minutos para conocer como AURA atiende, agenda y cobra por WhatsApp 24/7.",
    "",
    "Grupo de WhatsApp donde llega el link cada semana:",
    WA_GROUP,
    "",
    "Mas info en https://www.clinera.io/reserva",
  ]
    .join("\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Clinera//Webinar Semanal//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:webinar-clinera-semanal@clinera.io",
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=America/Santiago:${dtStart}`,
    `DTEND;TZID=America/Santiago:${dtEnd}`,
    "RRULE:FREQ=WEEKLY;BYDAY=TH;UNTIL=20261231T235959Z",
    "SUMMARY:Webinar Clinera - Empleados digitales con IA",
    `DESCRIPTION:${description}`,
    `LOCATION:${MEET_URL}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function GET() {
  const start = nextThursdayInChile();
  const ics = buildIcs(start);
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="webinar-clinera.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
