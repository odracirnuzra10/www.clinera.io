// ============================================================================
// Stripe → Meta CAPI — `SQL` (Go!) o `Purchase` (Flux, Ultra) al suscribirse
// ----------------------------------------------------------------------------
// Webhook de Stripe (`checkout.session.completed`). Verifica la firma, filtra
// las suscripciones de Clinera y reenvía a la Conversions API del pixel del
// sitio un `SQL` de USD 17 si es Go! (regla de Ricardo, 17-oct) o un `Purchase`. La lógica del evento está en `src/lib/meta-purchase.ts`.
//
// Es un endpoint PROPIO, distinto de los que Stripe ya tiene hacia n8n: no toca
// ese flujo (no versionado en este repo) ni lo reemplaza.
//
// Variables de entorno:
//   STRIPE_META_WEBHOOK_SECRET  whsec_… del endpoint registrado en Stripe (REQUERIDA)
//   META_CAPI_ACCESS_TOKEN      token con acceso al dataset (REQUERIDA)
//   META_PIXEL_ID               opcional; por defecto `src/lib/meta-pixel-id.ts`
//   STRIPE_SECRET_KEY           opcional; con permiso de lectura en Checkout Sessions
//                               permite leer el nombre del producto (filtra Marketing)
//   META_TEST_EVENT_CODE        opcional, para Test Events de Meta
//   META_GRAPH_VERSION          opcional, por defecto v21.0
// Sin las dos primeras responde 503: Stripe reintenta, nada se pierde en silencio.
// ============================================================================

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { META_PIXEL_ID } from "@/lib/meta-pixel-id";
import {
  buildConversionEvent,
  isClineraSale,
  isSubscriptionPurchase,
} from "@/lib/meta-purchase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function productNamesOf(stripe: Stripe, sessionId: string): Promise<string[]> {
  try {
    const items = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 10,
      expand: ["data.price.product"],
    });
    return items.data
      .map((li) => {
        const p = li.price?.product;
        return typeof p === "object" && p && "name" in p ? String(p.name) : li.description ?? "";
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_META_WEBHOOK_SECRET;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!secret || !token) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "no_signature" }, { status: 400 });
  }

  // La firma se calcula sobre el cuerpo EXACTO: hay que leerlo como texto.
  const raw = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_not_set");
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  if (!isSubscriptionPurchase(session)) {
    return NextResponse.json({ ok: true, ignored: "not_a_paid_subscription" });
  }

  const names = process.env.STRIPE_SECRET_KEY ? await productNamesOf(stripe, session.id) : [];
  if (!isClineraSale(names)) {
    return NextResponse.json({ ok: true, ignored: "not_clinera" });
  }

  const pixelId = process.env.META_PIXEL_ID || META_PIXEL_ID;
  const version = process.env.META_GRAPH_VERSION || "v21.0";
  const payload: Record<string, unknown> = { data: [buildConversionEvent(session, names)] };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  const res = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const out = (await res.json().catch(() => ({}))) as { events_received?: number; error?: { message?: string } };
  if (!res.ok) {
    // 502: Stripe reintenta. El `event_id` fijo evita contar la venta dos veces.
    console.error("[stripe→meta] CAPI rechazó el Purchase", res.status, out.error?.message);
    return NextResponse.json({ ok: false, error: "meta_rejected", detail: out.error?.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true, events_received: out.events_received ?? 0 });
}
