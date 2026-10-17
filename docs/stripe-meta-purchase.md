# Stripe → Meta: `Purchase` cuando alguien se suscribe

Ruta: `POST /api/stripe/meta-purchase` (`src/app/api/stripe/meta-purchase/route.ts`).
Lógica del evento: `src/lib/meta-purchase.ts`. Pixel destino: dataset «Clinera
Software» `2251201709002818` (`src/lib/meta-pixel-id.ts`).

Es un webhook **propio**. Stripe ya manda eventos a n8n (workflow de suscripciones
y de pagos fallidos); esto no los toca. Un mismo evento de Stripe puede ir a varios
endpoints.

## Qué hace
1. Stripe avisa `checkout.session.completed`.
2. Se verifica la firma. Solo pasan suscripciones cobradas (`mode=subscription`,
   `paid` o `no_payment_required`).
3. Si hay `STRIPE_SECRET_KEY`, se lee el nombre del producto y se descarta
   Marketing/Metricads (también cobra por Stripe).
4. Se manda un `Purchase` a la Conversions API: valor y moneda reales, correo,
   celular, nombre y país **hasheados** (SHA-256). `event_id` = `purchase_{session_id}`.

`/go/exito` dispara el `Purchase` del navegador con el **mismo** `event_id`
(Stripe devuelve `session_id` en la URL de éxito), así que Meta lo cuenta una vez.
Eso exige que el Payment Link redirija a
`https://www.clinera.io/go/exito?session_id={CHECKOUT_SESSION_ID}`.

El celular solo llega si el Payment Link tiene activado «Recopilar números de
teléfono». Sin él, el match se hace con el correo.

## Puesta en marcha (en este orden)
1. **Meta:** Events Manager → dataset «Clinera Software» → Configuración →
   Conversions API → *Generar token de acceso*. Ese token es `META_CAPI_ACCESS_TOKEN`.
   En Probar eventos, copia el código de prueba (`TEST…`).
2. **Vercel** (Production): `META_CAPI_ACCESS_TOKEN`, `META_TEST_EVENT_CODE` (solo
   mientras pruebas), y `META_PIXEL_ID` si quieres fijarlo (por defecto ya es el nuevo).
   Si ya existe `META_PIXEL_ID` con el ID viejo, cámbialo o bórralo.
3. **Stripe** → Desarrolladores → Webhooks → *Agregar endpoint*:
   `https://www.clinera.io/api/stripe/meta-purchase`, evento
   `checkout.session.completed`. Copia el *signing secret* (`whsec_…`) y guárdalo en
   Vercel como `STRIPE_META_WEBHOOK_SECRET`. Redeploy.
4. **Probar:** haz una compra real de Go! (o con cupón 100%) y mira *Probar
   eventos*: debe aparecer `Purchase` con valor 17 USD y, si el navegador también
   lo mandó, marcado como deduplicado. Después quita `META_TEST_EVENT_CODE`.

No uses «Enviar webhook de prueba» de Stripe sin `META_TEST_EVENT_CODE`: manda una
venta falsa al pixel real.

## Respuestas de la ruta
`503` sin secretos configurados (Stripe reintenta), `400` sin firma o firma mala,
`200` con `ignored` para eventos que no cuentan, `502` si Meta rechaza (Stripe
reintenta; el `event_id` fijo evita contar dos veces), `200` con `events_received`.
Guardián: `tests/meta-purchase.spec.ts`.

> **17-oct:** el evento depende del plan: Go! = `TRIAL` USD 17 (`event_id` `trial_{session_id}`), Flux/Ultra = `CLIENTE` USD 89/179 (`cliente_{session_id}`); los planes viejos siguen con `Purchase`. `MQL` sale del wizard de `/go`. Ver AGENTS.md, «/planes2 y /go».
