// ============================================================================
// Meta Conversions API (CAPI) — endpoint server-side del wizard de /ventas
// ----------------------------------------------------------------------------
// Recibe un evento ya armado por el navegador (src/lib/metaEvents.ts) y lo
// reenvía a la Graph API de Meta. El token de acceso NUNCA sale del servidor.
//
// Deduplicación: el navegador dispara el mismo evento por Pixel con
// `{ eventID }` y aquí lo reenviamos con el MISMO `event_id`. Meta deduplica el
// par (event_name, event_id) → cuenta como UN solo evento.
//
// PII: llega YA hasheada desde el cliente (SHA-256 normalizado: em, ph). Este
// endpoint sólo agrega señales que el servidor conoce mejor que el navegador
// (client_ip_address, client_user_agent).
//
// Config por variables de entorno (ver docs/meta-events.md):
//   META_CAPI_ACCESS_TOKEN  (secreto, REQUERIDO para que se envíe a Meta)
//   META_PIXEL_ID           (default: pixel público de Clinera)
//   META_TEST_EVENT_CODE    (opcional, para Meta Test Events / QA)
//   META_GRAPH_VERSION      (opcional, default v21.0)
// Sin token, el endpoint hace no-op elegante (200) — el Pixel ya cubrió el
// browser-side, así que el flujo del usuario nunca se rompe.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PIXEL_ID = process.env.META_PIXEL_ID || "1104567405156111";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

// Solo los 3 eventos del wizard pueden pasar por acá.
const ALLOWED_EVENTS = new Set(["MQL", "Waitlist", "Contact"]);

type HashedUserData = { em?: string; ph?: string };

type CapiBody = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  action_source?: string;
  fbp?: string;
  fbc?: string;
  user_data?: HashedUserData;
  custom_data?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let body: CapiBody;
  try {
    body = (await request.json()) as CapiBody;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const eventName = body.event_name ?? "";
  if (!ALLOWED_EVENTS.has(eventName) || !body.event_id) {
    return NextResponse.json({ ok: false, error: "bad_event" }, { status: 400 });
  }

  // Sin token no hay forma de llamar a Graph → no-op. 200 para no ensuciar la
  // consola del cliente; el Pixel ya registró el evento browser-side.
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, skipped: "no_access_token" });
  }

  const h = await headers();
  const clientIp =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (h.get("x-real-ip") ?? "");
  const userAgent = h.get("user-agent") ?? "";

  // user_data: identificadores hasheados (del cliente) + señales del servidor.
  const userData: Record<string, unknown> = {};
  if (body.user_data?.em) userData.em = body.user_data.em;
  if (body.user_data?.ph) userData.ph = body.user_data.ph;
  if (body.fbp) userData.fbp = body.fbp;
  if (body.fbc) userData.fbc = body.fbc;
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;

  const eventData: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    action_source: body.action_source || "website",
    user_data: userData,
    custom_data: body.custom_data ?? {},
  };
  if (body.event_source_url) eventData.event_source_url = body.event_source_url;

  const payload: Record<string, unknown> = { data: [eventData] };
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
    ACCESS_TOKEN,
  )}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "graph_error", detail: json },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, result: json });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "fetch_failed", detail: String(e) },
      { status: 502 },
    );
  }
}
