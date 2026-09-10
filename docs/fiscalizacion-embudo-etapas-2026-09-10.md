# Fiscalización del embudo sin PQL — 2026-09-10 (16:05–16:45Z)

Verifica, con evidencia propia, las diez declaraciones D1–D10 de
`docs/handoff-embudo-etapas-2026-09-10.md`. Solo lecturas: **sin PUT a
n8n, sin mover negocios, sin tocar opciones de `stage`, sin reactivar PQL
ni el nodo Lead, sin `lead_id` inventado a CAPI.** Repo en `main @ 0767689`.

Sin tokens en este archivo. Los nombres de leads no se copiaron; los ids
de negocio son UUIDs de Twenty.

Herramientas: API pública de n8n (`N8N_URL`/`N8N_API_KEY`), REST y MCP de
Twenty, MCP de Meta Ads (cuenta `774716223970185` consultable), Playwright.

## Resultado

**D1 y D4 OK → no hubo que parar.** D9 falla en su premisa (las campañas
que nombra ya no existen) y sigue pendiente en Ads Manager.

**Actualización 18:48Z (Graph API con token de usuario de Ricardo):** los 6
conjuntos activos tienen `promoted_object.custom_event_str: "MQL"`,
`ads_signal_source_type: capi_crm`, `page_id 697874326752777`, pixel
`1104567405156111`: **optimizan el evento MQL del CRM**. D9 queda resuelto.
Dato nuevo: `attribution_spec` = 1 día clic en los 6 (ver pendientes).

| # | Declaración | Veredicto | Evidencia (comando → recorte) |
|---|---|---|---|
| D1 | jsCode de W1 = `crm-etapas-meta-capi.mapeo.js`; devuelve `omitido`, `payload`, `ledgerKey` | **OK** | `python3 integrations/n8n/aplicar_w1_mapeo.py` → `jsCode vivo bytes: 11023 archivo bytes: 11023 · webhook crm-sql: registrado · Ya estaba aplicado`. `GET /workflows/W1SybZZSEZqAItIt` → sha256 vivo = archivo `04bb9c2c8fbe393dde54…`, `active: True`, `updatedAt 2026-09-10T16:02:50.705Z`; IF v2 `={{ $json.omitido }}` is false; HTTP `={{ JSON.stringify($json.payload) }}` → `graph.facebook.com/v26.0/1104567405156111/events`; «Confirmar y auditar» lee `ledgerKey` + `events_received`. Twenty `GET /rest/webhooks` → `https://n8n.oacg.cl/webhook/crm-sql` `['*.*']` |
| D2 | NEW→Nuevo 0 · MQL→MQL 10 · MEETING→SQL 100 · PROPOSAL→HOT 200 · NQL→NQL 0 · PQL→skip `etapa_eliminada` | **OK** | Spec «los estados canónicos y ningún otro» + «PQL ya no emite» verdes (ver D8). Pixel `1104567405156111` server-side: último `PQL` en el bucket 09-sep 06:00 -07 (13:xxZ); ninguno después |
| D3 | Ejecución `107614` armó `Nuevo` 0 con payload; Graph respondió 100/2804036 por `lead_id` inventado; no es H8 | **OK** | `GET /executions/107614?includeData=true` → mapear `{omitido: False, etapa: NEW, evento: Nuevo, value: 0, ledgerKey: Nuevo:657b1b33-…, lead_id: 9990001112223}`; HTTP → `OAuthException code 100, error_subcode 2804036, fbtrace_id AV0obcXJMgREdk2Se29nxE0`; confirmar → `events_received: 0` y el ledger **no** tiene esa clave. Post-PUT reales: `107606` (16:03:14Z) `MQL` 10 con `lead_id` de Meta → `events_received: 1` (`AxYsGAnY1y1hEyZ8o9vhrr5`); `107612` (16:04:17Z) `MQL` → 1. Ledger con `at` de hoy: 14 entradas (8 Nuevo, 4 MQL, 2 NQL) |
| D4 | Twenty `stage` sin PQL; NEW/MQL/MEETING/PROPOSAL/CUSTOMER/NQL con los mismos ids; NQL = «NQL · No responde» | **OK** | `get_field_metadata id=7d5e561d-ea1c-4210-8f1f-d0f7ad474f06` → 6 opciones, ids **exactos** a la tabla del handoff (`…587a`, `…cb6e`, `…cb4a`, `…f654`, `…1104`, `54cb87ec-…2bf665`), label `NQL · No responde`, `updatedAt 2026-09-10T16:03:09.117Z`. REST `?filter=stage[eq]:PQL` → **HTTP 400** `invalid input value for enum …opportunity_stage_enum: "PQL"`; control `stage[eq]:NQL` → 200 |
| D5 | 36 PQL→NQL **antes** de borrar la opción; MEETING 69 · PROPOSAL 14 · CUSTOMER 76 intactos | **OK** | `group_by_opportunities stage` → NEW 11 · MQL 135 · MEETING **69** · PROPOSAL **14** · CUSTOMER **76** · NQL 131 (total 436 = foto post-apply 436; NEW −1 / MQL +2 / NQL −1 son movimientos manuales del closer: `107606`, `107612`). Orden: ≥29 `opportunity.updated` source `API` stage `NQL` entre 16:02:58 y 16:03:08Z (W1 `107574`–`107602`, todos omitidos `etapa_movida_por_automatizacion`) y recién después `metadata.fieldMetadata.updated` a las 16:03:11.495Z (`107604`) |
| D6 | Wizard, Meet y Sub A con `ORDEN = { NEW: 0, MQL: 1, MEETING: 2, PROPOSAL: 3, CUSTOMER: 4 }` | **OK** | `python3 integrations/n8n/aplicar_embudo_sin_pql.py` → los tres «ORDEN ya sin PQL». GET de cada uno: literal exacto en `Twenty - Crear Lead` (Wizard `updatedAt 16:03:18.534Z`, Sub A `16:03:21.898Z`) y `Twenty - Agendó (Meet)` (`16:03:19.728Z`); los tres `active: True` |
| D7 | `Meta CAPI - Lead` de Sub A `disabled: true`; el alta es `Nuevo` 0 por W1 | **OK** | GET `YmauqyDqrZNKIYlg` → nodo `disabled: True` («ya estaba apagado»). Sub A: 0 ejecuciones después de 16:03:21Z (la última, `107518` 15:44:05Z, aún corrió Lead y produjo el `Nuevo` 15:44:17Z del ledger). Pixel server-side `Lead` desde 16:04Z → `stats: []` |
| D8 | Specs verdes (11); tablas de AGENTS.md y README = `mapearEtapa` | **OK** | `BASE_URL=http://127.0.0.1:9 npx playwright test tests/crm-etapas-meta-capi.spec.ts tests/reunion-meta-events.spec.ts` → `11 passed (1.4s)`. `grep` → `AGENTS.md:349` `| NEW | Nuevo | 0 |`, `:350` `| MQL | MQL | 10 |`; `README.md:356/357` ídem; fila `| PQL | PQL | 1 |` ausente en ambos |
| D9 | Las campañas activas de Conversion Leads siguen pudiendo tener el evento **SQL**; deben optimizar **MQL** | **FALLO de premisa · PENDIENTE** | MCP `ads_get_ad_entities` sobre `120247984833660218`, `120247986964290218`, `120247987023130218` → las tres `ARCHIVED`. Activity log: `…6964290218` y `…7023130218` → Deleted 09-sep 15:08 (-03); `…4833660218` → Deleted 10-sep 13:01 (-03). Activas hoy: **MQL 🇨🇱 `120248035606070218`** (creada 13:00:29 -03) y **MQL 🇲🇽 `120248035556840218`** (12:59:06 -03), 6 conjuntos `QUALITY_LEAD`, `promoted_object {pixel_id: 1104567405156111, custom_event_type: OTHER}`. El nombre del evento custom **no es legible** por esta API (ni `promoted_object` ni el log lo traen) |
| D10 | MQL = el closer verifica que el lead es real; formulario = Nuevo $0 | **OK (documentado)** | `AGENTS.md:349-350` y `integrations/n8n/README.md:356-357`: `NEW → Nuevo 0 · rellenó el formulario`, `MQL → MQL 10 · closer verifica que es real`; mismo texto en el comentario de `mapearEtapa`. W1 omite MQL/SQL/HOT/NQL movidos por `API` (solo Nuevo pasa) — verificado en las 29 ejecuciones de la migración |

## Hallazgos laterales (no son D1–D10)

1. **W1 no filtra `opportunity.destroyed`.** `107615` (16:05:42Z) reintentó
   `Nuevo` 0 al borrar el negocio E2E; `107613` hizo lo mismo con otro de
   prueba. El código solo descarta `.updated` sin `stage` en
   `updatedFields`; un `.destroyed` con `record.stage` pasa igual. El
   ledger lo frena solo si el envío original quedó confirmado hace < 28 d.
2. **Tres emisores de `MQL` 10 siguen activos además del closer:**
   `fireMqlEvent` en `src/lib/metaEvents.ts` (al confirmar hora en
   `/agenda` y `/reserva-tu-hora`), `Meta CAPI - MQL` del Wizard y
   `Meta CAPI - MQL (IA)` del Meet. El handoff §1 ya lo declara.
3. `Prepare Lead Data` de Sub A conserva un comentario que dice que `PQL`
   está rotulado «PQL · No contesta». Solo texto; ya no es cierto.
4. **W1 manda solo `lead_id` en `user_data`.** En los 8 eventos reales de
   hoy revisados (Nuevo, MQL y NQL entre 12:02 y 15:58Z) `user_data` fue
   `['lead_id']`: sin `em`, `ph`, `fn` ni `ln`, aunque el negocio tenía
   `pointOfContactId`. El cuerpo del webhook no trae el correo y la lectura
   a `/rest/people/{id}` (con `$env.TWENTY_URL` + `$env.TWENTY_API_KEY`
   dentro del Code node) falla en silencio (`catch {}`). Meta confirma
   igual (`events_received: 1`) porque cruza por `lead_id`, y el EMQ del
   canal CRM lo refleja: `Nuevo` 0,7 (teléfono 16,7 %), `NQL` 2,0, `MQL`
   2,9 (el teléfono del MQL viene de los otros emisores). Consecuencia: un
   negocio **sin** `leadgenId` (wizard, Camila, orgánico, Google) sale
   como `sin_email_ni_telefono_ni_lead_id` y su MQL/SQL/HOT/Purchase nunca
   llega a Meta. Pendiente: verificar que n8n tenga esas dos variables y
   que el Code node pueda leer `$env`.
5. **Nuevo → SQL directo no emitía MQL** (corrido sobre el jsCode vivo:
   el nodo solo mira la etapa en que queda el negocio). Con la campaña
   optimizando `MQL`, ese lead no sumaba en «Clientes potenciales
   cualificados» ni le enseñaba nada a Meta. **Corrección (10-sep, pedido
   de Ricardo), aplicada al vivo a las 18:50:07Z con
   `aplicar_w1_mapeo.py --aplicar` (respaldo `…-20260910-185007.json`,
   fuera del commit):** W1 rellena la escalera `MQL < SQL <
   HOT < Purchase` con las etapas que falten en el ledger antes de mandar
   la actual (ítems separados; ver AGENTS.md, «Un estado implica los
   anteriores»). Al equipo comercial se le comunicó la regla: todo SQL
   pasa antes por MQL.

## Si algo está mal, qué riesgo tiene

1. **D9:** si algún conjunto quedó en `SQL`, la campaña optimiza a un
   evento que llega días después y 1–2 veces al día: Meta no sale de
   aprendizaje y el CPL sube; si quedó en la custom «MQL» `1562704878613075`
   (default 0, filtro URL), cuenta solo el MQL del navegador y nunca el del
   closer. Se ve únicamente en Ads Manager.
2. **MQL diluido:** con la campaña optimizando `MQL`, Meta aprende igual
   del agendamiento sin verificar (sitio/Wizard/Meet) que del verificado
   por el closer. No rompe nada hoy, pero contradice la definición de
   Ricardo y empuja a leads que agendan y no asisten.
3. **`.destroyed`:** borrar a mano un negocio cuyo evento no está en el
   ledger reemite `MQL`/`SQL`/`HOT` con el mismo `event_id`; Meta solo
   deduplica 48 h. Un SQL fantasma de US$ 100 cada tanto.
4. **Ledger en `staticData`:** un PUT que no reenvíe `staticData` lo borra
   y W1 reenvía todo lo que se mueva en 28 días. Los aplicadores lo
   preservan; un PUT a mano no necesariamente.
5. **`Nuevo` real post-PUT sin muestra:** entre 16:03Z y 16:45Z no entró
   ningún Instant Form (Sub A: 0 ejecuciones). El camino `Nuevo` no cambió
   entre el jsCode del 09 y el del 10-sep (14 confirmaciones hoy con el
   anterior), pero la primera prueba real con el nuevo sigue pendiente.

## Pendientes de Ricardo

1. **Resuelto (18:48Z):** el evento de conversión de los 6 conjuntos es el
   evento `MQL` del CRM (`custom_event_str: "MQL"`, `capi_crm`). No hay
   cambio que hacer en Ads Manager por ese lado.
2. **Nuevo: ventana de atribución 1 día clic** en los 6 conjuntos
   (`attribution_spec: [{CLICK_THROUGH, 1}]`). El MQL lo declara el closer;
   si lo hace después del día siguiente al clic, ese MQL llega al pixel
   pero no se le atribuye a la campaña ni entrena la entrega. Recomendación:
   7 días clic. Decisión de Ricardo; cambio en Ads Manager o por API.
3. Arreglar la lectura de persona en W1 (hallazgo lateral 4).

## Cómo se corrió (reproducible, sin tokens)

```bash
# repo
grep -n '| `NEW` | `Nuevo` | 0 |\|| `MQL` | `MQL` | 10 |' AGENTS.md integrations/n8n/README.md
BASE_URL=http://127.0.0.1:9 npx playwright test tests/crm-etapas-meta-capi.spec.ts tests/reunion-meta-events.spec.ts
# n8n (simulacro = solo GET)
python3 integrations/n8n/aplicar_w1_mapeo.py
python3 integrations/n8n/aplicar_embudo_sin_pql.py
# GET /api/v1/workflows/{W1SybZZSEZqAItIt,YmauqyDqrZNKIYlg,A3wOPmhQjit8VswM,FZvyK42lkQdKWcIl}
# GET /api/v1/executions?workflowId=W1SybZZSEZqAItIt&limit=60 → GET /executions/{id}?includeData=true
# Twenty
# GET /rest/opportunities?filter=stage[eq]:PQL&limit=1   → 400
# MCP: get_field_metadata(id 7d5e561d-…) · group_by_opportunities(stage)
# Meta (MCP, solo lectura): ads_get_ad_entities campaign/adset · ads_account_get_activity_logs · ads_get_dataset_stats(1104567405156111, SERVER_ONLY)
```
