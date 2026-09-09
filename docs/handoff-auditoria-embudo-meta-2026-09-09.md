# Handoff: auditar el embudo Meta (2026-09-09)

Documento para **otra sesión/IA**. No rehacer la pesquisa: comprobar si
lo mergeado y lo aplicado a n8n coinciden con lo que Ricardo pidió, y
si el vivo ya no enseña «no contesta» como MQL.

Repo: `odracirnuzra10/www.clinera.io` @ `main`.
Informe de hechos del día: `docs/auditoria-meta-eventos-2026-09-09.md`.
Mapeo versionado: `integrations/n8n/crm-etapas-meta-capi.mapeo.js`.
Aplicador: `integrations/n8n/aplicar_w1_mapeo.py`.

No hay tokens en este archivo. No reusar secretos pegados en el chat
(token Graph, API key n8n): rotarlos. Usar `N8N_URL` / `N8N_API_KEY`
del environment.

---

## 0. Veredicto que tenés que confirmar o refutar

1. El **repo** tiene un solo embudo canónico (tablas de `AGENTS.md` y
   `integrations/n8n/README.md` iguales al `mapearEtapa` del jsCode).
2. El **sitio** manda MQL a US$ 5 al agendar, no al enviar un form.
3. El **W1 vivo** `W1SybZZSEZqAItIt` ya no cruza PQL→MQL 10: el PUT
   del 09-sep reemplazó el jsCode y el nombre.
4. **No** está cerrado el embudo entero: Twenty sigue con SCREENING,
   Sub A sigue mandando `Lead` US$ 5, Events Manager y el feed de
   Google Ads no se tocaron.

Si (1)–(3) fallan, el trabajo no quedó bien. Si (4) se presenta como
«ya migrado», el auditor se equivocó de capa.

---

## 1. Pedido final de Ricardo (canónico)

Mismos nombres en CRM y pixel. `SCREENING`, `NoContesta`, `Lead` y
`SQL_Plus` no existen.

| CRM (valor del webhook Twenty) | Pixel `event_name` | value USD |
|---|---|---|
| `NEW` / Nuevo | `Nuevo` | 0 |
| `PQL` | `PQL` | 1 |
| `MQL` | `MQL` | 5 |
| `MEETING` / SQL | `SQL` | 10 |
| `PROPOSAL` / HOT | `HOT` | 100 |
| `NQL` | `NQL` | 0 (no calificado) |
| `CUSTOMER` | `Purchase` | plan: Vortex 279 / Atlas 379 / Summit 479; vacío → 279 |

Origen: chat del 09-sep. Primero pidió seis estados; después «Agrega
NQL $0 (no calificado)». Después «hay que tocar el n8n».

Customer en pixel es el evento estándar `Purchase` (Meta lo usa para
optimizar). El estado en CRM se llama Customer.

---

## 2. Qué se mergeó

| SHA | PR | Qué |
|---|---|---|
| `bdc1325` | #266 | Informe, mapeo versionado, MQL del sitio 10→5, pixel apagado en localhost/preview, CAPI del sitio solo `MQL`, `/reunion` MQL solo al agendar, docs |
| `ecdb911` | #267 | PUT a W1 + aplicador + respaldo del JSON cruzado + docs «ya aplicado» |

Ramas: `cursor/auditoria-meta-embudo-6941`, `cursor/aplicar-w1-n8n-6941`.

### Archivos de #266 (sitio + docs)

- `docs/auditoria-meta-eventos-2026-09-09.md` — H1–H7 medidos ese día
- `docs/auditoria-meta-eventos-2026-08-26.md` — cabecera «superada en §1, §3, §4, §10-P1»
- `integrations/n8n/crm-etapas-meta-capi.mapeo.js` — jsCode del nodo
- `AGENTS.md`, `integrations/n8n/README.md`, `docs/meta-events.md`
- `src/lib/metaEvents.ts` — `fireMqlEvent` `value: 5`; `shouldInitMetaPixel()`
- `src/components/Analytics.tsx` — no `fbq('init')` en localhost / 127.0.0.1 / `*.vercel.app`
- `src/app/api/meta/capi/route.ts` — `ALLOWED_EVENTS = new Set(["MQL"])`
- `src/components/reunion/ReunionLanding.tsx` — form → `InitiateCheckout`; booking → MQL 5
- `src/components/ventas/ReservaHoraLanding.tsx` — comentarios
- Tests: `tests/crm-etapas-meta-capi.spec.ts`, `tests/reunion-meta-events.spec.ts`, `tests/meta-pixel-host.spec.ts`; `tests/reserva-tu-hora.spec.ts` y `tests/analytics.spec.ts` actualizados
- `eslint.config.mjs` — ignora `integrations/n8n/**` (jsCode de nodo, `require('crypto')`)

**No se tocó:** `/agenda`, wizard de `/ventas`, `pricing.ts`.

### Archivos de #267 (n8n)

- `integrations/n8n/aplicar_w1_mapeo.py`
- `integrations/n8n/backup/W1SybZZSEZqAItIt-20260909-163845.json` — estado **antes** del PUT (mapeo cruzado). Sin `shared`/`project` (el JSON crudo traía el mail de Ricardo en el nombre del proyecto y el scan de secretos lo bloqueó).
- `integrations/n8n/backup/README.md`

---

## 3. Qué se aplicó en n8n (vivo)

Workflow `W1SybZZSEZqAItIt`, webhook `POST …/webhook/crm-sql`.

Antes del PUT (comprobado por GET):

```
NEW:       { event: 'Lead',     value: 1 }
SCREENING: { event: 'PQL',      value: 2 }
PQL:       { event: 'MQL',      value: 10 }
MEETING:   { event: 'SQL',      value: 100 }
PROPOSAL:  { event: 'HOT',      value: 300 }
CUSTOMER:  { event: 'Purchase', value: null }
NQL:       { event: 'NQL',      value: 0 }
```

Nombre UI: `Clinera | Twenty etapas → Meta CAPI (corregido · inactivo)`.
Estaba **activo** desde 2026-09-07 21:17Z. Ese cruce es H1: el closer
marca «PQL · No contesta» y Meta aprende MQL US$ 10. Las campañas
activas (SQL 🇨🇱/🇲🇽, Remarketing SQL) optimizan `QUALITY_LEAD` desde
el 7-sep.

El PUT (2026-09-09 ~16:38Z) tocó **solo**:

1. `jsCode` del nodo `Mapear etapa y cifrar datos` = archivo
   `crm-etapas-meta-capi.mapeo.js`
2. `name` → `Clinera | Twenty etapas → Meta CAPI`

No se tocaron los otros nodos (`Webhook Twenty`, `Corresponde enviar?`,
`Enviar evento a Meta CAPI`, `Confirmar y auditar`, `Responder OK`).
Se preservó `staticData` (ledger 28 d, ~64 `event_id`). El workflow
siguió activo. GET a `/webhook/crm-sql` siguió «registrado» (n8n
responde que el path no acepta GET: eso es «arriba»; 404 sería caído).

Contratos del nodo que **no** se cambiaron a propósito:

- `event_id = {opportunityId}_{stage}`
- `lead_id` = `leadgenId` entero, sin hash
- `action_source: system_generated`
- `NEW` emite aunque `updatedBy.source === API` (el alta la escribe n8n)
- el resto, si lo mueve API, se salta (el MQL del sitio/Meet ya cubrió)

> [!CAUTION]
> **Resultado de la auditoría (mismo día, más tarde):** el PUT dejó a W1
> sin mandar nada a Meta. El jsCode no devolvía `payload` ni `omitido`,
> que son lo que leen los nodos de abajo; el HTTP fallaba con «JSON Body
> is not valid JSON» y `events_received: 0`. Detalle en
> `docs/auditoria-meta-eventos-2026-09-09.md` §H8.
>
> **Cerrado el 2026-09-09 19:44Z:** se volvió a aplicar el jsCode
> (`aplicar_w1_mapeo.py`), se corrigió el IF «Corresponde enviar?» que
> dejaba pasar todo (`aplicar_w1_filtro.py`, §H9) y la prueba funcional
> con un negocio de prueba dio `Nuevo` 0 → `events_received: 1` a las
> 19:53:38Z. Ese mismo bloque aplicó `aplicar_etapa_mql.py` (Wizard, Meet
> y Sub A escriben `MQL`) y `aplicar_wizard_volvio_a_cotizar.py`; en
> Twenty se borró la opción SCREENING. Lo que sigue abierto del §4 es
> Sub A `Lead` US$ 5, Events Manager y el feed de Google Ads.

---

## 4. Qué no se hizo (y por qué)

| Cosa | Por qué no |
|---|---|
| Pixel / dataset nuevo `Clinera.io` `1410371181304151` | El sucio era el emisor, no el contenedor. `Obsoleto` / `Obsoleto2` ya fracasaron por eso. Migrar BMs es otro proyecto. |
| Borrar SCREENING / crear etapa `MQL` en Twenty | UI del CRM. W1 ahora hace skip `screening_eliminado` si el closer (o el wizard) deja el negocio en SCREENING. El sitio igual manda MQL $5 al agendar. |
| Sub A `YmauqyDqrZNKIYlg` `Lead` US$ 5 → `Nuevo` US$ 0 | Otro workflow, repo `baserow`. El Instant Form sigue emitiendo Lead 5. |
| Meet/IA `clinera-meet-por-profesional` value 10→5 | Otro workflow. El README de este repo ya dice 5; el vivo hay que leerlo. |
| Wizard n8n `A3wOPmhQjit8VswM` deja el negocio en SCREENING | Sigue escribiendo SCREENING, no `MQL`. |
| Conversion Leads en Events Manager | El conector no lee ni edita el embudo. Manual: `Nuevo → PQL → MQL → SQL → HOT → Purchase`, `NQL` descalificado. |
| Custom MQL `1562704878613075` default 0 + filtro URL | Manual. Debería default 5, sin URL. Custom SQL default 10, sin URL. |
| 9 reglas del Event Setup Tool | Manual. 0 eventos en 28 d; una regla Lead por texto puede revivir. |
| Feed Google Ads / Baserow 152 | Montos viejos (MQL 10 / SQL 100 / HOT 300). Vive en `baserow`. |
| Rotar token Meta / API key n8n / CAPI commiteado | Operación de secretos, no de código. |

---

## 5. Cómo auditar el repo

```bash
git checkout main
git log --oneline -5
# Esperado: ecdb911 (#267) y bdc1325 (#266) en la historia

# Una sola tabla canónica (no PQL→NoContesta ni SCREENING→MQL en tablas)
grep -n "PQL\|SCREENING\|NoContesta" AGENTS.md integrations/n8n/README.md

# Las tablas canónicas tienen que contener:
#   | `NEW` | `Nuevo` | 0 |
#   | `PQL` | `PQL` | 1 |
#   | `MQL` | `MQL` | 5 |
#   | `MEETING` | `SQL` | 10 |
#   | `PROPOSAL` | `HOT` | 100 |
#   | `NQL` | `NQL` | 0 |
# Prosa de H1 (histórico: W1 cruzaba) PUEDE decir PQL→MQL 10. Eso no es
# la tabla canónica.

pnpm exec playwright test \
  tests/crm-etapas-meta-capi.spec.ts \
  tests/reunion-meta-events.spec.ts \
  tests/meta-pixel-host.spec.ts \
  tests/reserva-tu-hora.spec.ts \
  tests/analytics.spec.ts \
  tests/lead-source.spec.ts
```

Oráculos de `mapearEtapa` (el spec extrae helpers con `vm` hasta
`// --- fin helpers puros ---`):

- `NEW` → `{Nuevo, 0}`; `PQL` → `{PQL, 1}`; `MQL` → `{MQL, 5}`
- `MEETING`/`SQL` → `{SQL, 10}`; `PROPOSAL`/`HOT` → `{HOT, 100}`
- `NQL` / `no califica` → `{NQL, 0}`
- `CUSTOMER` + Summit → `{Purchase, 479}`
- `SCREENING` (con o sin leadgenId) → skip `screening_eliminado`
- `PQL` nunca es `MQL` ni `NoContesta`

Sitio:

- `src/lib/metaEvents.ts` `fireMqlEvent` → `value: 5`
- `route.ts` allowlist solo `"MQL"`
- `Analytics.tsx` `META_PIXEL_SRC` retorna en localhost / 127.0.0.1 / `*.vercel.app`
- `ReunionLanding` `submitPartialLead` no hace `fbq("track","MQL")`

**No uses** `tests/ventas-meta-events.spec.ts` como juez: está stale
(espera botón «Médica» y MQL al submit del paso 3). El wizard usa
`<select>` y `MQL_TRIGGER=booking_confirmed`. No se tocó. Si falla,
no prueba que este trabajo esté mal.

`pnpm lint` del repo ya está rojo en `main` por archivos ajenos.

---

## 6. Cómo auditar n8n vivo

```
GET {N8N_URL}/api/v1/workflows/W1SybZZSEZqAItIt
  header X-N8N-API-KEY
```

Comprobar **sin volcar el JSON** (trae ledger de negocios):

- `name` = `Clinera | Twenty etapas → Meta CAPI` (sin «inactivo»)
- `active` = true
- Nodo `Mapear etapa y cifrar datos`: `jsCode` idéntico a
  `integrations/n8n/crm-etapas-meta-capi.mapeo.js`
- El jsCode **no** contiene `NEW:       { event: 'Lead'`
- Sí contiene `event_name: "Nuevo"`, `"PQL"`, `"MQL"`, `"NQL"` y
  `screening_eliminado`
- No contiene `event_name: "NoContesta"`
- GET `{N8N_URL}/webhook/crm-sql` → texto de «not registered for GET»
  (registrado), no 404

Idempotencia: `python3 integrations/n8n/aplicar_w1_mapeo.py` debe decir
«Ya estaba aplicado».

Prueba funcional (negocio de prueba, no producción real):

- Mover a `NQL` → ejecución `NQL` value 0
- A `PQL` → `PQL` value 1 (nunca MQL)
- A `SCREENING` → skip, no emite
- A `MQL` (si la etapa existe) → `MQL` value 5
- A `NEW` creado por n8n → `Nuevo` 0

`ads_get_dataset_stats` `event_name=MQL` `SERVER_ONLY` 48 h: value 5
y solo citas, no «no contesta».

H3 (0 MQL de navegador en 28 días) sigue **abierto**: Test Events en
`/agenda` en producción. El guardián local stubea `fbq`.

---

## 7. Trampas (para no firmar un OK falso)

1. **Docs vs vivo.** Hasta #267 los docs decían «no aplicar por mergear».
   Hoy el vivo **sí** está aplicado. Si leés solo #266, te mentís.
2. **Etiquetas Twenty ≠ stage.** `SCREENING` se leía «MQL (agendó)»;
   `PQL` se leía «PQL · No contesta». El webhook manda el valor interno.
3. **W1 aplicado ≠ Twenty limpio.** Si el wizard sigue escribiendo
   SCREENING, W1 no emite ese salto. El MQL del agendamiento web/IA
   sigue saliendo del sitio / Meet, no de SCREENING.
4. **Sub A `Lead` 5** convive con `Nuevo` 0 cuando W1 ve un `NEW`.
   Puede haber dos eventos de alta con `event_id` distintos hasta que
   Sub A deje de mandar Lead.
5. **Pixel `1104567405156111`** es del BM Método Hebe
   `1162184321174513`, no de Metricads. La cuenta que gasta
   (`act_774716223970185`) sí es de Metricads. Dataset `Clinera.io`
   `1410371181304151` ya existe (0 eventos): no crear otro.
6. El archivo de mapeo es jsCode de n8n (`return` de primer nivel,
   `require('crypto')`, `$env`, `$json`). No se `require()` desde Next.

---

## 8. Restaurar si el PUT salió mal

```
PUT {N8N}/api/v1/workflows/W1SybZZSEZqAItIt
body: name, nodes, connections, settings, staticData
de integrations/n8n/backup/W1SybZZSEZqAItIt-20260909-163845.json
```

Eso **vuelve** el cruce PQL→MQL 10. Solo si hay que abortar.

---

## 9. Checklist del auditor (marcar)

- [ ] `main` tiene `bdc1325` y `ecdb911`
- [ ] Tablas de `AGENTS.md` y README = `mapearEtapa`
- [ ] Specs listados en §5 en verde
- [ ] GET W1: nombre sin «inactivo», jsCode = archivo, active true
- [ ] Webhook `crm-sql` registrado
- [ ] Una ejecución de prueba: PQL → `PQL` 1, no `MQL` 10
- [ ] Anotar lo que sigue abierto (§4) sin venderlo como hecho
