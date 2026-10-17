/**
 * `event_id` del Purchase de una suscripción de los planes viejos. Lo usan el servidor
 * (`/api/stripe/meta-purchase`) y, si hiciera falta, el navegador: con el mismo
 * `event_id` y el mismo nombre de evento, Meta deduplica y cuenta la venta una sola vez.
 * Va aparte de `meta-purchase.ts` porque ese módulo usa `node:crypto`.
 */
export function purchaseEventId(checkoutSessionId: string): string {
  return `purchase_${checkoutSessionId}`;
}

/**
 * `event_id` del `TRIAL` de Go! (Ricardo, 17-oct): quien paga Go! (USD 17) es un TRIAL,
 * no un Purchase. Lo mandan el navegador (`/go/exito`) y el servidor con este mismo id.
 */
export function trialEventId(checkoutSessionId: string): string {
  return `trial_${checkoutSessionId}`;
}

/** `event_id` del `CLIENTE` (Flux USD 89 y Ultra USD 179). Solo lo manda el servidor. */
export function clienteEventId(checkoutSessionId: string): string {
  return `cliente_${checkoutSessionId}`;
}
