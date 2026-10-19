// ============================================================================
// Stripe → Meta CAPI: evento `Purchase` cuando alguien se suscribe
// ----------------------------------------------------------------------------
// Lógica pura (sin red) de `/api/stripe/meta-purchase`: arma el evento de
// Conversions API desde una Checkout Session de Stripe. Vive acá, y no en la
// ruta, para poder probarla sin levantar Next ni llamar a Stripe/Meta.
//
// Por qué un `Purchase` por servidor y no solo el del navegador (`/go/exito`):
// el navegador solo cubre a quien vuelve a la página de éxito y solo en /go.
// Stripe avisa de TODA suscripción, con correo y celular ya verificados.
//
// Deduplicación: `event_id` = `purchase_{checkout_session_id}`. `/go/exito`
// dispara el Purchase del navegador con ese mismo id (Stripe devuelve el
// `session_id` en la URL de éxito), así Meta lo cuenta una sola vez.
// ============================================================================

import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { GO, ULTRA } from "@/content/planes2";
import { PLANES, type Plan } from "@/content/planes";
import { clienteEventId, purchaseEventId, trialEventId } from "@/lib/meta-purchase-id";

export const PURCHASE_EVENT_NAME = "Purchase";
/** Go! (USD 17): quien paga es un TRIAL (Ricardo, 17-oct). */
export const TRIAL_EVENT_NAME = "TRIAL";
/** Planes vigentes (Vortex 279 · Ecosistema 529) y Ultra (179): quien paga es un CLIENTE. */
export const CLIENTE_EVENT_NAME = "CLIENTE";

export { clienteEventId, purchaseEventId, trialEventId };

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Meta pide minúsculas y sin espacios antes de hashear. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Solo dígitos, con el código de país y sin `+`: "+56 9 1234 5678" → "56912345678". */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export type HashedUserData = {
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  country?: string[];
  external_id?: string[];
};

/** `user_data` de CAPI: todo hasheado con SHA-256. Los vacíos se omiten. */
export function buildUserData(session: Stripe.Checkout.Session): HashedUserData {
  const details = session.customer_details;
  const out: HashedUserData = {};
  const email = details?.email ?? session.customer_email ?? "";
  if (email) out.em = [sha256Hex(normalizeEmail(email))];
  const phone = details?.phone ?? "";
  if (normalizePhone(phone)) out.ph = [sha256Hex(normalizePhone(phone))];
  const [first, ...rest] = (details?.name ?? "").trim().split(/\s+/).filter(Boolean);
  if (first && normalizeName(first)) out.fn = [sha256Hex(normalizeName(first))];
  const last = rest.join("");
  if (last && normalizeName(last)) out.ln = [sha256Hex(normalizeName(last))];
  const country = details?.address?.country ?? "";
  if (country) out.country = [sha256Hex(country.trim().toLowerCase())];
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId) out.external_id = [sha256Hex(customerId)];
  return out;
}

/**
 * ¿Es una venta de Clinera? Marketing (Metricads) también cobra por Stripe y no
 * debe sumar al pixel de Clinera. Mismo criterio que el workflow de n8n de
 * suscripciones: se clasifica por el nombre del producto. Sin nombres (no se
 * pudieron leer las líneas) se asume Clinera: perder una venta duele más que
 * contar una de más.
 */
export function isClineraSale(productNames: string[]): boolean {
  if (productNames.length === 0) return true;
  return !productNames.every((n) => /marketing|metricads/i.test(n));
}

export type CapiEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: "system_generated";
  user_data: HashedUserData;
  custom_data: {
    value: number;
    currency: string;
    content_name: string;
    content_ids: string[];
    content_type: "product";
    num_items: number;
    order_id: string;
  };
};

/** ¿Esta sesión es una suscripción ya cobrada (o sin cobro inicial)? */
export function isSubscriptionPurchase(session: Stripe.Checkout.Session): boolean {
  return (
    session.mode === "subscription" &&
    (session.payment_status === "paid" || session.payment_status === "no_payment_required")
  );
}

/** Los nombres de producto de Stripe: «Go!», «Flux», «Ultra» (con o sin «Clinera» delante). */
export function isGoPlan(productNames: string[]): boolean {
  return productNames.some((n) => /(^|\s)go!?(\s|$)/i.test(n.trim()));
}
export function isFluxPlan(productNames: string[]): boolean {
  return productNames.some((n) => /(^|\s)flux(\s|$)/i.test(n.trim()));
}
export function isUltraPlan(productNames: string[]): boolean {
  return productNames.some((n) => /(^|\s)ultra(\s|$)/i.test(n.trim()));
}

/**
 * Plan vigente (`planes.ts`) por el nombre del producto en Stripe: «Ecosistema»
 * (529) o «Vortex» (279), con o sin «Clinera» o «Plan» delante. Ricardo,
 * 18-oct-2026: «paga: Cliente, con valor dinámico del plan».
 *
 * OJO: el catálogo viejo (`pricing.ts`, contratos de /firma) también tiene un
 * «Vortex», de 279. Una suscripción nueva a ese producto se valoriza acá como 279.
 * [PENDIENTE: Ricardo] decidir si el producto viejo se renombra en Stripe.
 */
export function planVigenteDe(productNames: string[]): Plan | null {
  for (const p of PLANES) {
    const re = new RegExp(`(^|\\s)${p.name}(\\s|$)`, "i");
    if (productNames.some((n) => re.test(n.trim()))) return p;
  }
  return null;
}

/** Monedas sin decimales en Stripe: `amount_total` ya viene entero (CLP 17.401 = 17401). */
const ZERO_DECIMAL = new Set(["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"]);

export function sessionValue(session: Stripe.Checkout.Session): number {
  const total = session.amount_total ?? 0;
  return ZERO_DECIMAL.has((session.currency ?? "usd").toLowerCase()) ? total : total / 100;
}

/**
 * Evento de conversión de la sesión (Ricardo, 17-oct):
 *  · Go! (USD 17)            → `TRIAL`   USD 17
 *  · Vortex (279), Ecosistema (529) — planes vigentes, 18-oct — y
 *    Ultra (179) → `CLIENTE` con el valor del plan
 *  · cualquier otro (Atlas/Summit viejos, /firma) → `Purchase` con el valor cobrado.
 * El valor sale del catálogo, en USD: la sesión puede cobrar en CLP o con cupón.
 */
export function buildConversionEvent(session: Stripe.Checkout.Session, productNames: string[] = []): CapiEvent {
  const ev = buildPurchaseEvent(session, productNames);
  if (isGoPlan(productNames)) {
    return { ...ev, event_name: TRIAL_EVENT_NAME, event_id: trialEventId(session.id), custom_data: { ...ev.custom_data, value: GO.monthlyUsd, currency: "USD" } };
  }
  // El valor es el precio de catálogo del plan, no lo cobrado: la sesión puede venir
  // en CLP o incluir la implementación (USD 450) junto con el primer mes.
  const cliente = planVigenteDe(productNames) ?? (isUltraPlan(productNames) ? ULTRA : null);
  if (cliente) {
    return { ...ev, event_name: CLIENTE_EVENT_NAME, event_id: clienteEventId(session.id), custom_data: { ...ev.custom_data, value: cliente.monthlyUsd, currency: "USD" } };
  }
  return ev;
}

export function buildPurchaseEvent(
  session: Stripe.Checkout.Session,
  productNames: string[] = [],
): CapiEvent {
  const name = productNames[0] || "Clinera";
  return {
    event_name: PURCHASE_EVENT_NAME,
    event_time: session.created,
    event_id: purchaseEventId(session.id),
    event_source_url: "https://www.clinera.io/go",
    // Misma convención que W1 (CRM → CAPI): el cobro lo detecta un sistema.
    action_source: "system_generated",
    user_data: buildUserData(session),
    custom_data: {
      value: sessionValue(session),
      currency: (session.currency ?? "usd").toUpperCase(),
      content_name: name,
      content_ids: [name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")],
      content_type: "product",
      num_items: 1,
      order_id: session.id,
    },
  };
}
