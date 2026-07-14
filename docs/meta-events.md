# Eventos de Meta — wizard de `/ventas`

Reconfiguración del disparo de eventos de Meta (Pixel + Conversions API) del
wizard de calificación de `/ventas` y `/hablar-con-ventas`.

- **Código de tracking:** [`src/lib/metaEvents.ts`](../src/lib/metaEvents.ts)
- **Endpoint CAPI (servidor):** [`src/app/api/meta/capi/route.ts`](../src/app/api/meta/capi/route.ts)
- **Wizard (dónde se disparan):** [`src/components/ventas/VentasLanding.tsx`](../src/components/ventas/VentasLanding.tsx)

---

## Regla de oro: una sola fuente de verdad para "califica"

La calificación la decide **únicamente** la función pura `evaluateQualification`
del wizard, con los umbrales de `QUALIFY_THRESHOLDS`:

```
califica       = (sucursales >= 2) OR (pacientes_mes >= 200) OR (profesionales >= 4)
prioridad_alta = se cumplen 2 o más de esas condiciones
```

El código de tracking **no reimplementa la regla ni conoce los umbrales**: sólo
recibe el resultado `Qualification` y gatea con `qual.califica`. Cambiar los
umbrales en `QUALIFY_THRESHOLDS` cambia qué leads generan MQL **sin tocar el
código de tracking**.

---

## Deduplicación (Pixel + CAPI)

Cada evento se envía dos veces con el **mismo `event_id`**:

- **Pixel** (navegador): `fbq('track', <evento>, custom_data, { eventID })`
- **CAPI** (servidor): `POST /api/meta/capi` con el mismo `event_name` + `event_id`

Meta deduplica por `(event_name, event_id)` → el par cuenta como **un solo
evento**. Se incluyen `fbp` y `fbc` cuando existen. La PII (email/teléfono) se
**hashea con SHA-256 normalizado en el navegador** antes de salir del origen; el
endpoint agrega `client_ip_address` y `client_user_agent` del request.

---

## Los 3 eventos

### 1. `MQL`

| | |
|---|---|
| **Trigger (default)** | Lead **calificado** completa el **Paso 3** (submit OK del backend n8n). |
| **Envío** | Pixel + CAPI (dedup por `event_id` del lead, compartido con el webhook n8n). |
| **`user_data`** | `em`, `ph` (SHA-256 de email y teléfono E.164), `fbp`, `fbc`, `client_ip_address`, `client_user_agent`. |
| **`custom_data`** | `software_actual`, `sucursales`, `pacientes_mes`, `profesionales`, `prioridad_alta`, `pais`, `value: 10`, `currency: "USD"`. |
| **Idempotencia** | Flag `cl_mql_fired` en `sessionStorage` → recarga, doble-click de submit y volver-atrás **no** lo redisparan. |
| **No calificado** | **Nunca** se dispara MQL. |

### 2. `Waitlist`

| | |
|---|---|
| **Trigger** | Lead **NO calificado** llega a la pantalla de lista de espera (una vez por sesión). |
| **Envío** | Pixel + CAPI (dedup por `event_id` propio del waitlist). |
| **`user_data`** | Ninguno (aún no dio email/teléfono) — sólo `fbp`/`fbc`/IP/UA. |
| **`custom_data`** | `software_actual`, `sucursales`, `pacientes_mes`, `profesionales`, `prioridad_alta`, `pais` (`pais` = `""` pre-contacto). |
| **Idempotencia** | Flag `cl_waitlist_fired` en `sessionStorage`. |

### 3. `Contact` (estándar de Meta)

| | |
|---|---|
| **Trigger** | Click en **"Quiero quedar en la lista de espera"** (botón de WhatsApp de la pantalla de waitlist), **antes** de abrir `wa.me`. |
| **Envío** | Pixel + CAPI (fire-and-forget, con `fbp`/`fbc`, sin PII). `event_id` propio por click. |
| **`custom_data`** | Igual que Waitlist (atributos de calificación, sin PII). |

> El Pixel solo ya sería aceptable aquí (no hay identificadores personales); se
> agrega CAPI porque `fbp`/`fbc` sí suelen existir y mejoran el match, siempre con
> el mismo `event_id` para deduplicar.

---

## `MQL_TRIGGER` — punto de disparo configurable

En [`src/lib/metaEvents.ts`](../src/lib/metaEvents.ts):

```ts
export const MQL_TRIGGER: MqlTrigger = "contact_submitted";
```

| Valor | Cuándo dispara MQL | `user_data` |
|---|---|---|
| `"contact_submitted"` **(default)** | Al completar el Paso 3 con submit OK del backend. | email + teléfono hasheados. |
| `"qualified_step2"` | Al **calificar** en el Paso 2 (más volumen de señal para ads). | **Sin** email/teléfono (aún no existen). |

Ambos caminos están implementados; sólo el default está activo. Cambiar el valor
mueve el disparo sin tocar nada más. La idempotencia (`cl_mql_fired`) garantiza
que, sea cual sea el trigger, el MQL se envíe **una sola vez por sesión**.

---

## Configuración del endpoint CAPI (variables de entorno)

`POST /api/meta/capi` reenvía a la Graph API de Meta. Variables:

| Variable | Requerida | Default | Uso |
|---|---|---|---|
| `META_CAPI_ACCESS_TOKEN` | **Sí** (para enviar a Meta) | — | Token del dataset/pixel. Sin él, el endpoint hace **no-op elegante** (200) y solo queda el Pixel. |
| `META_PIXEL_ID` | No | `1104567405156111` | Pixel de Clinera. |
| `META_TEST_EVENT_CODE` | No | — | Código de **Meta Test Events** para QA (ver abajo). |
| `META_GRAPH_VERSION` | No | `v21.0` | Versión de la Graph API. |

El token **nunca** se expone al navegador (vive solo en el servidor). El seam del
cliente es la constante `CAPI_ENDPOINT` en `metaEvents.ts` — se puede repuntar a
un webhook de n8n que haga el forward si el equipo lo prefiere.

---

## QA con Meta Test Events

1. Setear `META_CAPI_ACCESS_TOKEN` y `META_TEST_EVENT_CODE` en el entorno.
2. Abrir **Events Manager → Test Events** con ese código.
3. Verificar los criterios:

| # | Escenario | Esperado |
|---|---|---|
| 1 | Lead calificado completa Paso 3 | **Un** solo `MQL` (Pixel+CAPI deduplicados), `custom_data` correcto, `user_data` hasheado (`em`/`ph`). |
| 2 | Lead no calificado | **No** llega `MQL`. Llega `Waitlist` al mostrar la pantalla y `Contact` al click de WhatsApp. |
| 3 | Recargar tras el submit o volver-atrás | **No** hay segundo `MQL` (flag `cl_mql_fired`). |
| 4 | `MQL_TRIGGER = "qualified_step2"` | El `MQL` se mueve al Paso 2, sin `user_data` de contacto. |
| 5 | Cambiar umbrales en `QUALIFY_THRESHOLDS` | Cambia qué leads generan `MQL` sin tocar el tracking. |

Regresión automatizada (red 100% mockeada, sin tocar producción):
`tests/ventas-meta-events.spec.ts`.

---

## Notas para el PR

- El evento custom **`LeadUnderMinimum`** (que se disparaba para los no
  calificados) fue **reemplazado** por el nuevo evento **`Waitlist`**, para no
  duplicar la señal de lista de espera. No quedaba ningún otro consumidor.
- El wizard **no** tenía un evento `Lead` genérico; los eventos preexistentes de
  funnel (`ViewContent`, `InitiateCheckout`, `Schedule`) se mantienen intactos y
  **sólo se disparan para leads calificados** (los pasos que los emiten no son
  alcanzables por los no calificados).
- El MQL viejo se disparaba con el Pixel dentro de `submitContactLead` **antes**
  de la respuesta del backend y sin idempotencia. Ahora se dispara desde
  `metaEvents.ts` **después** del OK del backend, con dedup por `event_id`,
  `user_data` hasheado e idempotencia por sesión.
