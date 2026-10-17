// ============================================================================
// /go/exito → correo con el que contrató
// ----------------------------------------------------------------------------
// La página de éxito necesita el correo que Stripe cobró (puede ser distinto del
// que la persona escribió en el wizard) para dejarlo en el mensaje a soporte.
// Se lee de la sesión de Checkout con el `session_id` que Stripe pone en la URL de
// éxito: es un identificador largo y no adivinable, y solo se devuelve el correo,
// y solo de una sesión ya completada.
//
//   GET /api/go/session?session_id=cs_live_…   →   { ok: true, email }
//
// Necesita `STRIPE_SECRET_KEY` con lectura de Checkout Sessions. Si falla, /go/exito
// usa el correo del wizard (o ninguno) y el mensaje a soporte sigue funcionando.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 20;
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

const sinCache = { "Cache-Control": "no-store" };
const fallo = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: sinCache });

export async function GET(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return fallo("not_configured", 503);

  const sid = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(sid)) return fallo("invalid", 400);

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "desconocida";
  if (superaRateLimit(ip)) return fallo("rate_limit", 429);

  try {
    const sesion = await new Stripe(key).checkout.sessions.retrieve(sid);
    if (sesion.status !== "complete") return fallo("not_complete", 404);
    const email = (sesion.customer_details?.email ?? sesion.customer_email ?? "").trim();
    if (!email) return fallo("no_email", 404);
    return NextResponse.json({ ok: true, email }, { headers: sinCache });
  } catch (e) {
    console.error("[go/session] Stripe no devolvió la sesión", e instanceof Error ? e.message : e);
    return fallo("stripe", 502);
  }
}
