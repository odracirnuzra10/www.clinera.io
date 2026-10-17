/**
 * `event_id` del Purchase de una suscripción. Lo usan el navegador (`/go/exito`)
 * y el servidor (`/api/stripe/meta-purchase`): con el mismo `event_id` y el
 * mismo nombre de evento, Meta deduplica y cuenta la venta una sola vez.
 * Va aparte de `meta-purchase.ts` porque ese módulo usa `node:crypto`.
 */
export function purchaseEventId(checkoutSessionId: string): string {
  return `purchase_${checkoutSessionId}`;
}

/**
 * `event_id` del `SQL` de Go! (Ricardo, 17-oct): pagar Go! cuenta como SQL de
 * USD 17, no como `Purchase`. Mismo criterio que arriba: navegador y servidor
 * mandan este id con el nombre `SQL` y Meta los cuenta una sola vez. No puede
 * ser `{oppId}_SQL` (el id del CRM) porque el navegador no conoce la oportunidad.
 */
export function sqlEventId(checkoutSessionId: string): string {
  return `sql_${checkoutSessionId}`;
}
