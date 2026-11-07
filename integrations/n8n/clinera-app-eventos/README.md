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

## Trial en Twenty y aviso a Comercial (7-nov-2026)

Con `account_created`, el nodo «Trial en Twenty» (`trial-twenty.js`) busca el negocio en clientes.oacg.cl:
- primero por correo y después por celular nacional exacto;
- si existe, lo sube a la etapa **TRIAL** («Trial 🎯»);
- si no existe, crea la persona y el negocio en TRIAL, con `canalOrigen` según `fbclid`, `gclid` o `utm_source`;
- nunca toca un negocio en CUSTOMER.

«Avisar a Comercial» publica en [Clinera] Comercial «🎯 Trial nuevo…» con el link al negocio, una vez por cuenta. El webhook de la sala se copia del nodo vivo «Chat Comercial» de `qQZiENSRbmFg307W` y no va en el repo. Un cambio manual a TRIAL en Twenty no avisa.

## Loops: serie de correos de la prueba gratis

«Armar evento Loops» (`loops-evento.js`) manda cada aviso a `POST https://app.loops.so/api/v1/events/send`:

| Aviso de la app | Evento en Loops |
|---|---|
| `account_created` | `trial_iniciado` |
| `whatsapp_connected` | `whatsapp_conectado` |
| `first_conversation` | `primera_conversacion` |
| `subscription_started` | `plan_contratado` |

Cada evento lleva las propiedades del contacto. Estos nodos solo se crean si existe en n8n la credencial Header Auth **«Loops API»** (`Authorization: Bearer <API key>`); sin ella, el aplicador los omite y lo dice. La serie y sus filtros están en `docs/loops-serie-prueba-gratis.md`.
