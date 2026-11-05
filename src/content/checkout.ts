// Payment Links de Stripe de Flux, Hex y Vortex (Ricardo, 5-nov-2026). Los tres tienen
// allow_promotion_codes=true. Si cambia el precio en Stripe, cambia monthlyUsd y el link a la vez.
export type PlanCheckoutId = "flux" | "hex" | "vortex";

export const CHECKOUT_URL: Record<PlanCheckoutId, string> = {
  flux: "https://buy.stripe.com/14A28tgNz1MegZl9471441J",
  hex: "https://buy.stripe.com/14AdRbdBnfD49wTgwz1441M",
  vortex: "https://buy.stripe.com/cNi00ldBnduW24r8031441I",
};

// Código de promoción del cupón FPxQMFcc «50% OFF - 3 meses» (percent_off 50, repeating 3).
// VACÍO A PROPÓSITO: el cupón existe pero no tiene ningún promotion code. Ricardo debe crearlo
// en Stripe (código previsto: "CLINERA50X3") y pegarlo aquí. Vacío = el link cobra precio lleno.
export const PROMO_CODE = "";

export const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export const TRACKING_PARAMS = [...UTM_PARAMS, "gclid", "gbraid", "wbraid", "fbclid"] as const;

/** Stripe: client_reference_id solo [A-Za-z0-9_-], máx. 200. */
export function sanitizarRef(v: string): string {
  return (v || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 200);
}

/** Query de la visita reducida a los parámetros de atribución (para propagar a /contrata). */
export function soloTracking(search: string): URLSearchParams {
  const visita = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const k of TRACKING_PARAMS) {
    const v = visita.get(k);
    if (v) out.set(k, v);
  }
  return out;
}

/**
 * Link de pago con los utm de la visita, el gclid como client_reference_id base (Analytics.tsx
 * lo reemplaza al hacer clic por el de 7 segmentos que lee n8n), el correo prellenado y, solo si
 * `promo` y hay código, prefilled_promo_code.
 */
export function checkoutUrl(
  plan: PlanCheckoutId,
  opts: { search?: string; email?: string; promo?: boolean; promoCode?: string } = {},
): string {
  const { search = "", email = "", promo = false, promoCode = PROMO_CODE } = opts;
  const visita = new URLSearchParams(search);
  const u = new URL(CHECKOUT_URL[plan]);
  for (const k of UTM_PARAMS) {
    const v = visita.get(k);
    if (v) u.searchParams.set(k, v);
  }
  const ref = sanitizarRef(visita.get("gclid") || "");
  if (ref) u.searchParams.set("client_reference_id", ref);
  if (email.trim()) u.searchParams.set("prefilled_email", email.trim());
  if (promo && promoCode.trim()) u.searchParams.set("prefilled_promo_code", promoCode.trim());
  return u.toString();
}
