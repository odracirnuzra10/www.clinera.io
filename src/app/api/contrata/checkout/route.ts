// TODO(Mercado Pago): el primer cobro de Chile será Mercado Pago en CLP 14990
// ($14.990). Stripe queda para después. No conectar keys: todavía no están.
// Hasta entonces esta ruta sigue armando la Checkout Session de Stripe.

// Carrito de /contrata → Checkout Session. Misma guarda que /api/go/checkout:
// origen, 8 por minuto por IP, y 503 si no hay STRIPE_SECRET_KEY. Los precios
// se buscan por lookup_key. No crea Products ni Prices. Con onboarding humano
// crea un cupón de monto fijo (un solo uso) para no rebajar el cobro único.

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { ejecutarCheckout, type StripeContrata } from "@/lib/contrata-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return fallo("bad_json", 400);
  }

  const stripe = new Stripe(key);
  const result = await ejecutarCheckout({
    body: data,
    origin: new URL(request.url).origin,
    stripe: stripe as unknown as StripeContrata,
  });
  return NextResponse.json(result.body, { status: result.status });
}
