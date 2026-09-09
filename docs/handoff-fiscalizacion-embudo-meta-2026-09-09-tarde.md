# Handoff de fiscalización: embudo Meta, bloque de la tarde del 2026-09-09

Documento para **otra IA o persona**. Objetivo: confirmar o refutar, con
evidencia propia, que lo que se declara acá es cierto. No rehacer el
trabajo. No hacer PUT a n8n ni mover negocios reales salvo lo que dice §6.

Antecedente: `docs/handoff-auditoria-embudo-meta-2026-09-09.md` (la
auditoría de la mañana) y `docs/auditoria-meta-eventos-2026-09-09.md`
(hallazgos H1–H9). Todo lo de abajo se mergeó en `main` en el PR #269
(squash `f2cb754`).

Sin tokens en este archivo. Usar `N8N_URL` / `N8N_API_KEY` del
environment. La key que se usó el 09-sep fue pegada en un chat: **debe
estar rotada**; si el fiscalizador encuentra que sigue vigente, es un
hallazgo.

---

## 0. Qué se declara (confirmar o refutar cada línea)

| # | Declaración | Dónde comprobar |
|---|---|---|
| D1 | El jsCode de W1 `W1SybZZSEZqAItIt` (nodo «Mapear etapa y cifrar datos») es idéntico a `integrations/n8n/crm-etapas-meta-capi.mapeo.js` y devuelve `omitido`, `payload`, `ledgerKey` | §3 |
| D2 | W1 manda de verdad a Meta: una ejecución con `omitido=false` termina en `events_received: 1` | §3 |
| D3 | El IF «Corresponde enviar?» de W1 está en formato v2 y los ítems omitidos salen por la rama «false» | §3 |
| D4 | Wizard `A3wOPmhQjit8VswM`, Meet `FZvyK42lkQdKWcIl` y Sub A `YmauqyDqrZNKIYlg` no escriben ni comparan `SCREENING`; escriben `MQL` | §4 |
| D5 | El Wizard reetiqueta `VOLVIO_A_COTIZAR` y pone la nota «🔁 Volvió a cotizar» al lead que vuelve, sin tocar la etapa | §4 |
| D6 | En Twenty el campo `stage` tiene exactamente NEW / PQL / MQL / MEETING / PROPOSAL / CUSTOMER / NQL, con etiquetas Nuevo / PQL / MQL / SQL / HOT / Customer / NQL | §5 |
| D7 | Conteo por etapa al cierre: MQL 130 · NQL 94 · CUSTOMER 76 · MEETING 70 · PQL 36 · PROPOSAL 13 · NEW 8. Ningún negocio en SCREENING | §5 |
| D8 | El multi-select `etiquetas` tiene HOT / LANZAMIENTO_LOS_ANGELES / VOLVIO_A_COTIZAR | §5 |
| D9 | Repo: tablas de `AGENTS.md` y `integrations/n8n/README.md` = `mapearEtapa`; specs verdes | §2 |

Si D1, D2 o D3 fallan, W1 no quedó bien. Si D4 falla y D6 es cierto,
**cada lead que agenda está fallando al crearse en Twenty** (POST con
enum inválido): revisar ejecuciones del Wizard con error y avisar de
inmediato.

---

## 1. Cronología del bloque (UTC, 2026-09-09)

| Hora | Acción | Cómo |
|---|---|---|
| ~16:38 | PUT de la mañana a W1 (jsCode sin `payload`/`omitido`) — **rompió el envío** (H8) | sesión anterior |
| 18:2x | PR #269 abierto con el arreglo del jsCode y test «nodo completo» | repo |
| ~19:0x | Twenty: opción `VOLVIO_A_COTIZAR` creada en `etiquetas` | conector Twenty |
| ~19:2x | Twenty: opción `MQL` creada en `stage`; `PQL` re-etiquetada «PQL»; `SCREENING` re-etiquetada «Screening (migrar a MQL)» | conector Twenty |
| ~19:31 | Twenty: 131 negocios `SCREENING` → `MQL` (`update_many`, filtro `stage eq SCREENING`) | conector Twenty |
| 19:44:46 | n8n: `aplicar_w1_mapeo.py --aplicar` (jsCode + nombre). Respaldo previo fuera del repo | API n8n |
| 19:46 | n8n: `aplicar_etapa_mql.py --aplicar` (Wizard, Meet, Sub A → `MQL`) | API n8n |
| 19:47 | n8n: `aplicar_wizard_volvio_a_cotizar.py --aplicar` | API n8n |
| 19:48 | Twenty: opción `SCREENING` borrada de `stage`. **Incidente:** al reescribir las opciones se perdió el `id` de la opción `MQL` creada a las 19:2x; Twenty mandó los 130 `MQL` al default `NEW` (conteo momentáneo NEW 138) | conector Twenty |
| 19:49 | Twenty: los 131 ids migrados a las 19:31 devueltos a `MQL` (`update_many`, filtro `id in [...]` + `stage eq NEW`). Conteo vuelve a MQL 130 / NEW 8 | conector Twenty |
| 19:49 | n8n: `aplicar_w1_filtro.py --aplicar` (IF v2) tras ver que los omitidos llegaban al HTTP (H9) | API n8n |
| 19:53:38 | Prueba funcional: negocio `[E2E TEST] W1 payload b 2026-09-09` creado por API en NEW con teléfono de 10 dígitos → W1 `Nuevo` 0 → `events_received: 1` | conector Twenty + API n8n |
| 19:54 | Negocio de prueba borrado (soft delete). Un primer intento (`…payload 2026-09-09`, 19:49:26) se omitió por `sin_email_ni_telefono_ni_lead_id` y también se borró | conector Twenty |
| 19:58 | PR #269 actualizado y mergeado (squash `f2cb754`) | GitHub |

Los dos negocios de prueba quedaron **soft-deleted** en Twenty. El
fiscalizador puede borrarlos definitivamente o dejarlos; no cuentan en
los conteos.

---

## 2. Repo (`main` @ `f2cb754`)

```bash
git log --oneline -3          # f2cb754 arriba
grep -n "| \`MQL\` | \`MQL\` | 5 |" AGENTS.md integrations/n8n/README.md
pnpm exec playwright test \
  tests/crm-etapas-meta-capi.spec.ts \
  tests/reunion-meta-events.spec.ts \
  tests/meta-pixel-host.spec.ts \
  tests/reserva-tu-hora.spec.ts \
  tests/analytics.spec.ts \
  tests/lead-source.spec.ts
```

Esperado: 38 passed. `crm-etapas-meta-capi.spec.ts` tiene un bloque
«nodo completo» que corre el jsCode entero con stubs y exige `omitido`,
`payload.data[0]`, `ledgerKey`; si alguien vuelve a romper el contrato,
ese bloque falla.

Aplicadores versionados (`integrations/n8n/`): `aplicar_w1_mapeo.py`,
`aplicar_w1_filtro.py`, `aplicar_etapa_mql.py`,
`aplicar_wizard_volvio_a_cotizar.py`. Todos hacen simulacro sin
`--aplicar`. Correrlos **sin** `--aplicar` es una comprobación válida:
cada uno debe decir «ya estaba aplicado» (o el equivalente: 0 cambios).

---

## 3. W1 vivo (`W1SybZZSEZqAItIt`)

```
GET {N8N_URL}/api/v1/workflows/W1SybZZSEZqAItIt   (X-N8N-API-KEY)
```

Sin volcar el JSON (trae el ledger):

- `name` = `Clinera | Twenty etapas → Meta CAPI`, `active` = true.
- Nodo «Mapear etapa y cifrar datos»: `parameters.jsCode` ==
  contenido exacto de `integrations/n8n/crm-etapas-meta-capi.mapeo.js`.
  Atajo: `python3 integrations/n8n/aplicar_w1_mapeo.py` (sin
  `--aplicar`) → «Ya estaba aplicado».
- Nodo «Corresponde enviar?»: `typeVersion` 2 y `parameters.conditions`
  con la forma `{options, conditions:[{leftValue:"={{ $json.omitido }}",
  operator:{type:"boolean",operation:"false"}}], combinator:"and"}`.
  Atajo: `python3 integrations/n8n/aplicar_w1_filtro.py` → «Ya estaba
  aplicado».
- Los otros cuatro nodos no se tocaron.

Ejecuciones (`GET /api/v1/executions?workflowId=W1SybZZSEZqAItIt&includeData=true`):

- Buscar la de `2026-09-09T19:53:38Z`: salida del nodo de mapeo con
  `omitido: false`, `evento: "Nuevo"`, `payload.data[0].custom_data.value: 0`;
  «Corresponde enviar?» con salidas `[1, 0]`; «Enviar evento a Meta
  CAPI» con `events_received: 1`; «Confirmar y auditar» con `ok: true`.
- Cualquier ejecución posterior con `omitido: true` debe tener salidas
  del IF `[0, 1]` y **no** debe tener runData de «Enviar evento a Meta
  CAPI».
- Cualquier ejecución posterior con `omitido: false` debe terminar en
  `events_received ≥ 1`. Si aparece `events_received: 0` con error
  «not valid JSON», D1 o D3 fallaron.

Meta (`ads_get_dataset_stats`, dataset `1104567405156111`,
`SERVER_ONLY`): desde las 19:53Z tiene que haber al menos un `Nuevo`.
Las stats no muestran `value`; para valores, Events Manager → Test
Events / detalle del evento.

---

## 4. Wizard, Meet y Sub A

```
GET /api/v1/workflows/A3wOPmhQjit8VswM   nodo «Twenty - Crear Lead»
GET /api/v1/workflows/FZvyK42lkQdKWcIl   nodo «Twenty - Agendó (Meet)»
GET /api/v1/workflows/YmauqyDqrZNKIYlg   nodo «Twenty - Crear Lead»
```

En el `jsCode` de cada uno, ninguna línea de código (fuera de
comentarios) contiene `SCREENING`. Deben contener:

- Los tres: `const ORDEN = { NEW: 0, PQL: 1, MQL: 2, MEETING: 3, PROPOSAL: 4, CUSTOMER: 5 };`
- Wizard: `const etapaDestino = agendo ? 'MQL' : 'NEW';`
- Meet: `const DESTINO = 'MQL';`
- Wizard, bloque del negocio existente: `refresco.etiquetas = etiquetasPrevias.includes('VOLVIO_A_COTIZAR') ? …`
  y `refresco.notas = '🔁 Volvió a cotizar';` dentro del guard
  `booking_status !== 'confirmed'`. Cero apariciones de «Ya había
  cotizado».

Atajo: `python3 integrations/n8n/aplicar_etapa_mql.py` y
`python3 integrations/n8n/aplicar_wizard_volvio_a_cotizar.py` sin
`--aplicar` → «ya estaba aplicado» / «queda 'Ya había cotizado': 0».

Ejecuciones del Wizard después de las 19:48Z: ninguna con error 400 de
Twenty por enum inválido. Si las hay, D4 falló antes de borrar
SCREENING y hay leads perdidos: listar sus correos desde la salida del
webhook y darlos de alta a mano.

**La fuente canónica de estos tres workflows NO está en este repo**
(repo `baserow`, `sales/n8n/`, y `integrations/n8n/clinera-meet-por-profesional.workflow.json`
acá para el Meet). Sigue **sin replicarse** allá: es un pendiente, no
un error de lo aplicado.

---

## 5. Twenty

Conector Twenty o REST (`GET /rest/metadata/fields`):

- Campo `stage` (id `7d5e561d-ea1c-4210-8f1f-d0f7ad474f06`): 7 opciones,
  valores NEW / PQL / MQL / MEETING / PROPOSAL / CUSTOMER / NQL. La opción
  `MQL` lleva el id `20202020-e685-4671-ac32-26d304dacb6e` (el que antes
  era SCREENING). `PQL` = `6962bd90-c367-4053-817a-e191fd810211`.
- Campo `etiquetas` (id `72e212e5-afc1-4541-8c7a-548b5be2d323`): HOT,
  LANZAMIENTO_LOS_ANGELES, VOLVIO_A_COTIZAR.
- `group_by opportunities` por `stage` = D7 (más lo que haya entrado
  después; ningún SCREENING).
- Riesgo a revisar: el incidente de las 19:48 pasó por `NEW` a 130
  negocios durante ~1 minuto. Twenty **no** emitió webhooks por esos
  cambios masivos (W1 no tiene ejecuciones con esos ids en ese rango) y
  la restauración fue por id, pero conviene muestrear 5 negocios de la
  lista de la auditoría (`docs/auditoria-meta-eventos-2026-09-09.md` no
  la trae; los ids están en el log de la sesión) y confirmar que están en
  `MQL` con su `fechaDemo` intacta.

---

## 6. Prueba funcional que puede repetir el fiscalizador

Sin mover negocios reales:

1. Crear en Twenty un negocio `[E2E TEST] fiscalización <fecha>` en
   `NEW`, con `telefonoContacto.primaryPhoneNumber` de **10 dígitos**
   (con 9 dígitos y sin correo W1 lo omite por
   `sin_email_ni_telefono_ni_lead_id`).
2. En n8n, la ejecución de W1 para ese id debe dar `Nuevo` 0 y
   `events_received: 1`.
3. Borrar el negocio de prueba.

Un PQL real lo mueve un closer en la UI: si se mueve por API, W1 lo
omite a propósito (`etapa_movida_por_automatizacion`). No usar la API
para probar PQL/SQL/HOT.

---

## 7. Lo que sigue abierto (no es parte de lo declarado)

- Sub A `YmauqyDqrZNKIYlg` sigue mandando CAPI `Lead` US$ 5 por cada
  Instant Form. Debe ser `Nuevo` US$ 0 (repo `baserow`).
- Events Manager: embudo de Conversion Leads, custom conversions MQL/SQL
  (default 5 / 10, sin filtro URL), 9 reglas del Event Setup Tool.
- Feed Google Ads / Baserow 152 con montos viejos.
- Replicar Wizard / Meet / Sub A en el repo `baserow`.
- SQL = videollamada realizada (regla de Ricardo): es criterio del
  closer, no hay automatización. Los 70 SQL actuales no se revisaron.
- Rotar la API key de n8n del 09-sep y el token CAPI que estuvo
  commiteado en agosto.
