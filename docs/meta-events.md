# Eventos de Meta — wizard de `/ventas`

Disparo del evento de Meta (Pixel + Conversions API) del wizard de calificación
de `/ventas` y `/hablar-con-ventas`.

- **Código de tracking:** [`src/lib/metaEvents.ts`](../src/lib/metaEvents.ts)
- **Endpoint CAPI (servidor):** [`src/app/api/meta/capi/route.ts`](../src/app/api/meta/capi/route.ts)
- **Wizard (dónde se dispara):** [`src/components/ventas/VentasLanding.tsx`](../src/components/ventas/VentasLanding.tsx)

---

## Regla de oro: una sola fuente de verdad para "califica"

La calificación la decide **únicamente** la función pura `evaluateQualification`
del wizard. Desde el rediseño del filtro (paso 2 con encuadre de precio), **toda
clínica que completa el filtro califica** — el precio de entrada de US$279/mes
auto-selecciona, así que ya no hay lista de espera:

```
califica       = true   // todo el que completa el paso 2
prioridad_alta = (sucursales >= 2) OR (pacientes_mes >= 500)   // PRIORITY_THRESHOLDS
```

`prioridad_alta` es solo una señal de tamaño para el equipo comercial (no cambia
el flujo). El código de tracking **no reimplementa la regla**: recibe el resultado
`Qualification` y gatea con `qual.califica`.

---

## Deduplicación (Pixel + CAPI)

El evento se envía dos veces con el **mismo `event_id`**:

- **Pixel** (navegador): `fbq('track', 'MQL', custom_data, { eventID })`
- **CAPI** (servidor): `POST /api/meta/capi` con el mismo `event_name` + `event_id`

Meta deduplica por `(event_name, event_id)` → el par cuenta como **un solo
evento**. Se incluyen `fbp` y `fbc` cuando existen. La PII (email/teléfono) se
**hashea con SHA-256 normalizado en el navegador** antes de salir del origen; el
endpoint agrega `client_ip_address` y `client_user_agent` del request.

---

## El evento `MQL`

| | |
|---|---|
| **Trigger (default)** | Lead completa el **Paso 3** (submit OK del backend n8n). |
| **Envío** | Pixel + CAPI (dedup por `event_id` del lead, compartido con el webhook n8n). |
| **`user_data`** | `em`, `ph` (SHA-256 de email y teléfono E.164), `fbp`, `fbc`, `client_ip_address`, `client_user_agent`. |
| **`custom_data`** | `software_actual`, `sucursales`, `pacientes_mes`, `prioridad_alta`, `pais`, `value: 10`, `currency: "USD"`. |
| **Idempotencia** | Flag `cl_mql_fired` en `sessionStorage` → recarga, doble-click de submit y volver-atrás **no** lo redisparan. |

> El wizard ya no tiene lista de espera, así que se eliminaron los eventos
> `Waitlist` y `Contact` que existían en la versión anterior del filtro.

---

## `MQL_TRIGGER` — punto de disparo configurable

En [`src/lib/metaEvents.ts`](../src/lib/metaEvents.ts):

```ts
export const MQL_TRIGGER: MqlTrigger = "contact_submitted";
```

| Valor | Cuándo dispara MQL | `user_data` |
|---|---|---|
| `"contact_submitted"` **(default)** | Al completar el Paso 3 con submit OK del backend. | email + teléfono hasheados. |
| `"qualified_step2"` | Al completar el Paso 2 (más volumen de señal para ads). | **Sin** email/teléfono (aún no existen). |

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
| 1 | Lead completa Paso 3 | **Un** solo `MQL` (Pixel+CAPI deduplicados), `custom_data` correcto, `user_data` hasheado (`em`/`ph`). |
| 2 | Recargar tras el submit o volver-atrás | **No** hay segundo `MQL` (flag `cl_mql_fired`). |
| 3 | `MQL_TRIGGER = "qualified_step2"` | El `MQL` se mueve al Paso 2, sin `user_data` de contacto. |

Regresión automatizada (red 100% mockeada, sin tocar producción):
`tests/ventas-meta-events.spec.ts`.

---

## Notas

- Los eventos de funnel preexistentes (`ViewContent`, `InitiateCheckout`,
  `Schedule`) se mantienen intactos.
- El MQL se dispara desde `metaEvents.ts` **después** del OK del backend, con
  dedup por `event_id`, `user_data` hasheado e idempotencia por sesión.
