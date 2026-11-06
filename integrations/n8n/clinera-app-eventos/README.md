# app.clinera.io → Meta: StartTrial y UsoReal

Workflow n8n **«OACG | Clinera app → Meta (Trial y Uso real)»** (`mETMBrWPCelwvOuy`, activo desde el 6-nov-2026).

- **URL:** `POST https://n8n.oacg.cl/webhook/clinera-app-eventos`
- **Auth:** header `X-Clinera-Secret` (credencial n8n «Clinera app · webhook (X-Clinera-Secret)»). Sin el header, o con uno malo, n8n responde 403. El valor no está en el repo: se lo pasó Ricardo al equipo de app.clinera.io.
- **Eventos que manda la app:** `account_created`, `whatsapp_connected`, `first_conversation`, `subscription_started`.
- **Campos:** `event`, `event_id`, `occurred_at`, `account_id`, `clinic_id`, `nombre`, `email`, `telefono` (E.164), `clinica`, `plan`, `lead_event_id`, `fbp`, `fbc`, `fbclid`, `gclid`, `utm_*`. La landing (`/contrata`, `/kimi-gratis`) los pasa a `/auth/register` en la URL.

Qué manda a Meta (dataset «Clinera Software» `2251201709002818`, credencial «Meta CAPI Clinera Software»):

| Embudo | Evento Meta | Regla |
|---|---|---|
| Lead | `Lead` | lo manda la landing (pixel + `/api/meta/capi`) |
| Trial | `StartTrial` | `account_created`, una vez por cuenta (`trial_<account_id>`) |
| Uso real | `UsoReal` | `whatsapp_connected` + `first_conversation`, ambos dentro de 7 días desde `account_created` (`uso_real_<account_id>`) |
| Purchase | — | lo manda Stripe (`/api/stripe/meta-purchase`); `subscription_started` no envía nada para no contar doble |

- El estado por cuenta vive en el static data del workflow (se guarda solo en ejecuciones de producción) y se limpia a los 30 días.
- Un evento queda marcado como enviado solo si Meta responde `events_received ≥ 1` («Confirmar envío»). Si no, se reintenta con el siguiente aviso de esa cuenta.
- Una cuenta creada antes de que la app mande `account_created` nunca dará UsoReal.
- Cambiar la regla de uso real (p. ej. 3 conversaciones) es tocar `decidir.js` y volver a correr el aplicador.

Código: `decidir.js` y `confirmar.js`. Aplicador: `../aplicar_clinera_app_eventos.py` (simulacro por defecto; `--aplicar` crea o actualiza y activa; la credencial solo se crea si no existe). Guardián: `tests/clinera-app-eventos.spec.ts`.
