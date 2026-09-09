// ============================================================================
// Evento de Meta del wizard de /ventas — MQL (lead que agendó)
// ----------------------------------------------------------------------------
// `evaluateQualification` (VentasLanding.tsx) ya NO filtra por umbral: toda
// clínica que completa el paso 2 "califica" (`califica: true` siempre) —
// decisión ya tomada ahí, no un stub pendiente (hallazgo #5 de
// auditoria-leads-clinera.md, PR #170; corregido acá el 2026-08-21, este
// comentario decía lo contrario). El gate real de MQL es `MQL_TRIGGER`
// más abajo: con "booking_confirmed", MQL = agendó, punto — un lead que deja
// sus datos y no agenda no cuenta. `prioridadAlta`/`priority` sólo alimentan
// la prioridad interna del equipo comercial, nunca el conteo de MQL.
//
// Envío doble con deduplicación de Meta:
//   • Pixel (navegador) → fbq('track', <evento>, custom_data, { eventID })
//   • CAPI  (servidor)  → POST /api/meta/capi con el MISMO event_id
// Meta deduplica por (event_name, event_id): el par Pixel+CAPI cuenta como UN
// solo evento. Se incluyen fbp/fbc si existen.
// ============================================================================

import { getClineraMetaIds } from "@/lib/metaIds";
import type { Qualification } from "@/components/ventas/VentasLanding";

// ---------------------------------------------------------------------------
// MQL_TRIGGER — punto de disparo del MQL. Constante configurable.
//   "booking_confirmed" (actual)  → el lead CALIFICADO confirma la reunión.
//        Definición vigente: "MQL = alguien agendó". Quien deja datos y no
//        agenda NO es MQL. Incluye user_data hasheado.
//   "contact_submitted"           → Paso 3 (submit OK). Residuo; no usar.
//   "qualified_step2"             → al completar el Paso 2, sin user_data.
// Los tres caminos están implementados; sólo booking_confirmed está activo.
// ---------------------------------------------------------------------------
export type MqlTrigger = "contact_submitted" | "qualified_step2" | "booking_confirmed";
export const MQL_TRIGGER: MqlTrigger = "booking_confirmed";

/** El pixel de producción no se inicializa en dev, preview ni loopback. */
export function shouldInitMetaPixel(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1") return false;
  if (h.endsWith(".vercel.app")) return false;
  return true;
}

// Endpoint server-side que reenvía a la Conversions API de Meta. Único seam
// configurable: por defecto la route del propio sitio; se puede repuntar a un
// webhook de n8n que haga el forward si el equipo lo prefiere.
const CAPI_ENDPOINT = "/api/meta/capi";

// Atributos de calificación (SIN PII) que viajan como custom_data.
export type QualCustomData = {
  software_actual: string;
  /** Tamaño de operación del paso 2 (banda de pacientes/mes). */
  operational_profile: string;
  /** Siempre "": el paso 2 ya no pregunta por sedes. */
  locations_band: string;
  /** "200_500" | "500_1000" | "gt_1000" | "unknown" (sin elegir). */
  patients_band: string;
  lead_priority: string;
  /** Legacy derivado del perfil: se mantiene para audiencias ya creadas en Meta. */
  sucursales: string;
  pacientes_mes: string;
  prioridad_alta: boolean;
  pais: string;
};

// PII de contacto (disponible en el Paso 3). Se hashea ANTES de salir del
// navegador; nunca viaja en claro fuera de nuestro origen.
export type ContactPII = {
  email: string;
  phoneE164: string; // dígitos con prefijo país, ej "+56912345678"
};

type MetaSignals = { fbp: string; fbc: string };

// Sólo necesitamos el resultado de la regla, nunca la regla en sí.
type QualResult = Pick<Qualification, "califica" | "prioridadAlta">;

// ---------------------------------------------------------------------------
// Hashing SHA-256 normalizado (requisito de user_data de CAPI).
// ---------------------------------------------------------------------------
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Normalización Meta: email en minúsculas + trim; teléfono sólo dígitos (E.164
// sin '+'). Devuelve los hashes o campos ausentes si el dato viene vacío.
export async function hashContact(pii: ContactPII): Promise<{ em?: string; ph?: string }> {
  const out: { em?: string; ph?: string } = {};
  const email = pii.email.trim().toLowerCase();
  if (email) out.em = await sha256Hex(email);
  const phone = pii.phoneE164.replace(/\D/g, "");
  if (phone) out.ph = await sha256Hex(phone);
  return out;
}

// ---------------------------------------------------------------------------
// Idempotencia por sesión (sessionStorage). Sobrevive recarga y navegación
// atrás/adelante en la misma pestaña → evita segundos disparos por recarga,
// doble click de submit o volver-atrás.
// ---------------------------------------------------------------------------
function alreadyFired(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (window.sessionStorage.getItem(key)) return true;
    window.sessionStorage.setItem(key, "1");
    return false;
  } catch {
    // Sin storage (incógnito estricto): no hay garantía persistente, pero el
    // estado de React evita el re-disparo dentro de la misma vista.
    return false;
  }
}

function readSignals(): MetaSignals {
  const ids = getClineraMetaIds();
  return { fbp: ids.meta_fbp, fbc: ids.meta_fbc };
}

// ---------------------------------------------------------------------------
// Núcleo: dispara Pixel + (opcional) CAPI con el MISMO event_id.
// ---------------------------------------------------------------------------
async function sendMetaEvent(opts: {
  eventName: "MQL";
  eventId: string;
  customData: Record<string, unknown>;
  userData?: { em?: string; ph?: string }; // hasheado; omitir si no hay PII
  capi: boolean;
}): Promise<void> {
  const { eventName, eventId, customData, userData, capi } = opts;
  const signals = readSignals();

  // 1) Pixel (navegador) — con eventID para que deduplique con el server.
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, customData, { eventID: eventId });
  }

  if (!capi) return;

  // 2) CAPI (servidor) — mismo event_id → Meta cuenta un solo evento.
  const body = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
    action_source: "website",
    fbp: signals.fbp,
    fbc: signals.fbc,
    user_data: userData ?? {},
    custom_data: customData,
  };
  try {
    await fetch(CAPI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (e) {
    // Nunca romper el flujo del usuario si CAPI falla; el Pixel ya salió.
    console.error(`CAPI ${eventName} failed`, e);
  }
}

// ===========================================================================
// (1) MQL — sólo leads CALIFICADOS. Idempotente por sesión.
//     value/currency para que Meta pueda optimizar por valor.
// ===========================================================================
export async function fireMqlEvent(opts: {
  eventId: string; // event_id del lead (compartido con el webhook n8n)
  qual: QualResult;
  customData: QualCustomData;
  contact?: ContactPII; // presente en "contact_submitted"; ausente en "qualified_step2"
}): Promise<void> {
  // Consume la regla: si no califica, MQL NO se dispara jamás.
  if (!opts.qual.califica) return;
  // Idempotencia: una sola vez por sesión/pestaña (sobrevive recarga y back/fwd).
  if (alreadyFired("cl_mql_fired")) return;

  const userData = opts.contact ? await hashContact(opts.contact) : undefined;
  await sendMetaEvent({
    eventName: "MQL",
    eventId: opts.eventId,
    customData: { ...opts.customData, value: 10, currency: "USD" },
    userData,
    capi: true,
  });
}
