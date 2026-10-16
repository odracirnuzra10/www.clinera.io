/**
 * `event_id` del Purchase de una suscripción. Lo usan el navegador (`/go/exito`)
 * y el servidor (`/api/stripe/meta-purchase`): con el mismo `event_id` y el
 * mismo nombre de evento, Meta deduplica y cuenta la venta una sola vez.
 * Va aparte de `meta-purchase.ts` porque ese módulo usa `node:crypto`.
 */
export function purchaseEventId(checkoutSessionId: string): string {
  return `purchase_${checkoutSessionId}`;
}
