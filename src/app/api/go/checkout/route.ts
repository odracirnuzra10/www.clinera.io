// ============================================================================
// /go → Stripe: el pago con los datos del wizard ya cargados
// ----------------------------------------------------------------------------
// Un Payment Link solo admite precargar el correo (`prefilled_email`). Para que
// Checkout traiga también el nombre y el celular que la persona ya escribió en el
// wizard (Ricardo, 17-oct: «que no vuelva a tipear») hay que crear la sesión por
// API: se busca o se crea el Customer de Stripe con esos datos y la sesión se abre
// sobre él.
//
//   Navegador  →  POST /api/go/checkout   { nombre, clinica, email, prefix, phone, clientRef, eventId }
//   Servidor   →  Stripe: Customer + Checkout Session (suscripción Go!, USD 17)
//   Respuesta  →  { ok: true, url }       (el navegador redirige ahí)
//
// Si algo falla (sin llave, sin permiso, Stripe caído) responde { ok:false } y el
// navegador sigue con el Payment Link de siempre (con el correo precargado): la
// compra nunca depende de esta ruta.
//
// Qué conserva de la sesión del Payment Link, porque n8n y la web dependen de eso:
//   · `client_reference_id` con los 7 segmentos «::» que arma `Analytics.tsx`
//     (n8n lee gclid, GA, fbc, fbp y user agent de ahí);
//   · `success_url` → /go/exito?session_id=… (activación por WhatsApp y TRIAL);
//   · código de promoción, celular y cobro en moneda local (precios adaptables).
//
// Variables de entorno:
//   STRIPE_SECRET_KEY  llave con permiso de ESCRITURA en Customers y Checkout Sessions.
//                      Con una llave de solo lectura Stripe responde 403 y se usa el
//                      Payment Link.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { emailValido, telefonoValido } from "@/app/api/wizard/validation";
import { GO, GO_ANALYTICS, GO_EXITO_PATH, GO_STRIPE_PRICE_ID } from "@/content/planes2";
import { aE164, digitosTelefono } from "@/lib/telefono";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rate limit en memoria, mismo patrón que /api/wizard: defensa mínima, no autenticación.
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 8;
const golpes = new Map<string, number[]>();

function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);
  if (golpes.size > 500) {
    for (const [clave, marcas] of golpes) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(clave);
    }
  }
  return previos.length > MAX_POR_VENTANA;
}

const fallo = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

/** Stripe limita `client_reference_id` a 200 caracteres. El user agent (último segmento) es lo que sobra. */
function recortarClientRef(ref: string, max = 200): string {
  if (ref.length <= max) return ref;
  return ref.slice(0, max);
}

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return fallo("not_configured", 503);

  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
    if (!host || originHost !== host) return fallo("origin", 403);
  }
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "desconocida";
  if (superaRateLimit(ip)) return fallo("rate_limit", 429);

  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return fallo("bad_json", 400);
  }

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const nombre = str(data.nombre, 120);
  const clinica = str(data.clinica, 160);
  const email = str(data.email, 200).toLowerCase();
  const prefix = str(data.prefix, 6);
  const digits = digitosTelefono(str(data.phone, 20));
  const eventId = str(data.eventId, 80);
  const clientRef = recortarClientRef(str(data.clientRef, 600));

  // Revalidación: la del navegador se salta con un curl.
  if (nombre.length < 2 || !emailValido(email) || !telefonoValido(prefix, digits)) return fallo("invalid", 400);

  const stripe = new Stripe(key);
  const celular = aE164(prefix, digits);
  const base = new URL(request.url).origin;

  try {
    // Un Customer por correo: si ya existe (otro intento, otro plan) se actualiza, no se duplica.
    const previos = await stripe.customers.list({ email, limit: 1 });
    const datosCliente = {
      name: nombre,
      phone: celular,
      metadata: { fuente: "go_wizard", clinica, ...(eventId ? { lead_event_id: eventId } : {}) },
    };
    const cliente = previos.data[0]
      ? await stripe.customers.update(previos.data[0].id, datosCliente)
      : await stripe.customers.create({ email, ...datosCliente });

    const params = {
      mode: "subscription",
      customer: cliente.id,
      line_items: [{ price: GO_STRIPE_PRICE_ID, quantity: 1 }],
      ...(clientRef ? { client_reference_id: clientRef } : {}),
      allow_promotion_codes: true,
      phone_number_collection: { enabled: true },
      customer_update: { name: "auto" },
      success_url: `${base}${GO_EXITO_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/go`,
      locale: "auto",
      metadata: { fuente: "go_wizard", plan: "go", ...(eventId ? { lead_event_id: eventId } : {}) },
      // Precios adaptables: el Payment Link muestra el cambio CLP/USD; la API lo pide explícito.
      adaptive_pricing: { enabled: true },
    } as unknown as Stripe.Checkout.SessionCreateParams;

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (e) {
      // Una versión de la API que no conozca `adaptive_pricing` no debe tumbar la compra.
      if (!/adaptive_pricing/i.test(e instanceof Error ? e.message : "")) throw e;
      const sinAdaptable = { ...(params as unknown as Record<string, unknown>) };
      delete sinAdaptable.adaptive_pricing;
      session = await stripe.checkout.sessions.create(sinAdaptable as unknown as Stripe.Checkout.SessionCreateParams);
    }
    if (!session.url) return fallo("no_url", 502);
    return NextResponse.json({ ok: true, url: session.url, plan: GO_ANALYTICS.contentId, precio: GO.monthlyUsd });
  } catch (e) {
    // 502: el navegador cae al Payment Link. No se registra PII, solo el motivo.
    console.error("[go/checkout] Stripe rechazó la sesión", e instanceof Error ? e.message : e);
    return fallo("stripe", 502);
  }
}
