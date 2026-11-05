// /contrata?pago=ok lee el correo y el regalo de la sesión ya pagada.
// Sin STRIPE_SECRET_KEY responde 503 y la página igual muestra la confirmación.

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 20;
const golpes = new Map<string, number[]>();
const sinCache = { "Cache-Control": "no-store" };
const fallo = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: sinCache });

function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);
  return previos.length > MAX_POR_VENTANA;
}

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
    if (sesion.status !== "complete" || sesion.metadata?.fuente !== "contrata_carrito") return fallo("not_complete", 404);
    const email = (sesion.customer_details?.email ?? sesion.customer_email ?? "").trim();
    return NextResponse.json(
      {
        ok: true,
        email,
        lista_usd: sesion.metadata.lista_usd ?? "",
        promo_usd: sesion.metadata.promo_usd ?? "",
        regalo: sesion.metadata.regalo_nov ?? "",
      },
      { headers: sinCache },
    );
  } catch (e) {
    console.error("[contrata/session]", e instanceof Error ? e.message : e);
    return fallo("stripe", 502);
  }
}
