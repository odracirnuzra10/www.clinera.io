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
import { purchaseEventId } from "@/lib/meta-purchase-id";

export const PURCHASE_EVENT_NAME = "Purchase";

export { purchaseEventId };

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
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      content_name: name,
      content_ids: [name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")],
      content_type: "product",
      num_items: 1,
      order_id: session.id,
    },
  };
}
