# Handoff de auditoría: embudo sin PQL, 2026-09-10

Documento para **otra IA o persona**. Objetivo: confirmar o refutar, con
evidencia propia, que lo que se declara acá es cierto. No rehacer el
trabajo. No hacer PUT a n8n ni mover negocios reales salvo lo que dice §6.

Antecedente: `docs/handoff-fiscalizacion-embudo-meta-2026-09-09-tarde.md`.
PRs: `www.clinera.io` #272 · `baserow` #454.

Sin tokens en este archivo. Usar `N8N_URL` / `N8N_API_KEY` /
`TWENTY_URL` / `TWENTY_API_KEY` del environment.

---

## 0. Qué se declara (confirmar o refutar cada línea)

| # | Declaración | Dónde comprobar |
|---|---|---|
| D1 | El jsCode de W1 `W1SybZZSEZqAItIt` (nodo «Mapear etapa y cifrar datos») es idéntico a `integrations/n8n/crm-etapas-meta-capi.mapeo.js` y devuelve `omitido`, `payload`, `ledgerKey` | §3 |
| D2 | `mapearEtapa`: NEW→`Nuevo` **0** · MQL→`MQL` **10** · MEETING→`SQL` **100** · PROPOSAL→`HOT` **200** · NQL→`NQL` **0** · PQL→skip `etapa_eliminada` | §2, §3 |
| D3 | W1 mandó de verdad a Meta: ejecución `107614` armó `Nuevo` 0 con payload; el HTTP de CAPI corrió. Meta respondió OAuth 100 / subcode 2804036 porque el `lead_id` de prueba no es de Meta — no es el fallo H8 («JSON Body is not valid JSON») | §3 |
| D4 | Twenty `stage` ya no tiene PQL. Quedan NEW / MQL / MEETING / PROPOSAL / CUSTOMER / NQL con **los mismos ids** que el 09-sep. Label de NQL = «NQL · No responde» | §5 |
| D5 | Se movieron 36 negocios PQL→NQL **antes** de borrar la opción. MEETING 69 · PROPOSAL 14 · CUSTOMER 76 intactos (no cayeron a NEW) | §5 |
| D6 | Wizard `A3wOPmhQjit8VswM`, Meet `FZvyK42lkQdKWcIl` y Sub A `YmauqyDqrZNKIYlg` tienen `ORDEN` sin PQL: `{ NEW: 0, MQL: 1, MEETING: 2, PROPOSAL: 3, CUSTOMER: 4 }` | §4 |
| D7 | El nodo `Meta CAPI - Lead` de Sub A está `disabled: true`. El alta es `Nuevo` 0 por W1, no `Lead` 5 | §4 |
| D8 | Specs `crm-etapas-meta-capi.spec.ts` + `reunion-meta-events.spec.ts` verdes (11). Tablas de `AGENTS.md` y `integrations/n8n/README.md` = `mapearEtapa` | §2 |
| D9 | **Pendiente manual:** las campañas activas de Conversion Leads siguen pudiendo tener el evento **SQL** seleccionado en Ads Manager. Ricardo pidió optimizar **MQL**. Este environment no tiene token de Marketing API | §7 |
| D10 | MQL = el closer verifica que el lead es **real** (paso anterior a SQL). Rellenar el formulario = Nuevo $0 | §1 |

Si D1 o D4 fallan, parar: o W1 no quedó aplicado, o Twenty perdió ids
(el 09-sep 19:48Z 130 MQL cayeron a NEW por reescribir opciones sin `id`).

---

## 1. La regla de negocio (10-sep, Ricardo)

| Label | value Twenty | CAPI | USD | Cuándo |
|---|---|---|---|---|
| Nuevo | `NEW` | `Nuevo` | 0 | rellenó el formulario (Instant Form o wizard) |
| MQL | `MQL` | `MQL` | 10 | el closer verifica que es real. **La campaña se optimiza a este evento** |
| SQL | `MEETING` | `SQL` | 100 | la demo ocurrió |
| HOT | `PROPOSAL` | `HOT` | 200 | a punto de cerrar |
| Customer | `CUSTOMER` | `Purchase` | plan | 279 / 379 / 479; vacío → 279 |
| NQL · No responde | `NQL` | `NQL` | 0 | no responde |
| PQL | — | — | — | eliminada. Las 36 filas pasaron a NQL |

El sitio (`fireMqlEvent` en `/agenda` y `/reserva-tu-hora`) **sigue**
mandando `MQL` US$ 10 al confirmar hora. Eso es un emisor paralelo al
W1. Si la campaña optimiza MQL, Meta también ve esos. El MQL que
Ricardo definió para Ads es el del closer en Twenty.

---

## 2. Repo

```bash
# www.clinera.io
git log --oneline -5
grep -n "| \`NEW\` | \`Nuevo\` | 0 |" AGENTS.md integrations/n8n/README.md
grep -n "| \`MQL\` | \`MQL\` | 10 |" AGENTS.md integrations/n8n/README.md
# no debe existir la fila vieja
grep -n "| \`PQL\` | \`PQL\` | 1 |" AGENTS.md integrations/n8n/README.md && echo MAL || echo ok

BASE_URL=http://127.0.0.1:9 npx playwright test \
  tests/crm-etapas-meta-capi.spec.ts \
  tests/reunion-meta-events.spec.ts
```

Esperado: 11 passed. El bloque «nodo completo» corre el jsCode entero
con stubs.

```bash
# baserow
grep -n "SQL+: 200\|'SQL+': 200" sales/n8n/gads-conversiones-sql-csv.js
```

---

## 3. n8n W1

```bash
python3 integrations/n8n/aplicar_w1_mapeo.py   # debe decir «Ya estaba aplicado»
```

Aplicado **2026-09-10 16:02:50Z**. Respaldo fuera del commit:
`integrations/n8n/backup/W1SybZZSEZqAItIt-20260910-160250.json`
(no commitear: JSON vivo).

Chequeos del aplicador: jsCode = archivo · activo · webhook `crm-sql`
registrado · emite Nuevo 0 · MQL 10 sin `event_name: "PQL"` · NQL 0 ·
devuelve `payload` + `omitido`.

**Prueba funcional 16:05:03Z**, ejecución `107614`:

- Negocio `[E2E TEST] W1 Nuevo 0 leadgen 2026-09-10`
  `657b1b33-01e2-4f06-980d-f375fc6d3e3a` (soft-deleted después).
- Nodo mapear: `omitido: false`, `evento: Nuevo`, `value: 0`,
  `ledgerKey: Nuevo:657b1b33-…`, payload con `event_name: Nuevo`.
- Nodo «Enviar evento a Meta CAPI» **sí pegó a Graph**. Meta respondió
  `OAuthException` 100 / `2804036` («Identificador del cliente
  potencial no válido») porque el `lead_id` `9990001112223` es
  inventado. `fbtrace_id` `AV0obcXJMgREdk2Se29nxE0`.
- Eso **no** es H8: H8 era HTTP con body `undefined` y
  `events_received: 0` sin hablarle a Graph.

Un `Nuevo` 0 de un Instant Form real (con `leadgenId` de Meta de 15 o
17 dígitos) debería dar `events_received: 1`. No repetir la prueba con
un `lead_id` inventado.

---

## 4. n8n emisores (ORDEN + Lead)

Aplicado **16:03:18–16:03:21Z** con
`integrations/n8n/aplicar_embudo_sin_pql.py --aplicar`.

| Workflow | Nodo | Qué |
|---|---|---|
| `A3wOPmhQjit8VswM` Wizard | Twenty - Crear Lead | ORDEN sin PQL |
| `FZvyK42lkQdKWcIl` Meet | Twenty - Agendó (Meet) | ORDEN sin PQL |
| `YmauqyDqrZNKIYlg` Sub A | Twenty - Crear Lead | ORDEN sin PQL |
| `YmauqyDqrZNKIYlg` Sub A | Meta CAPI - Lead | `disabled: true` |

Los tres workflows siguieron `active: true`. Respaldos en
`integrations/n8n/backup/*-sin-pql-20260910-*.json` — no commitear.

```python
# vivo
ORDEN = { NEW: 0, MQL: 1, MEETING: 2, PROPOSAL: 3, CUSTOMER: 4 }
```

---

## 5. Twenty

Campo `stage` id `7d5e561d-ea1c-4210-8f1f-d0f7ad474f06`.

| value | label | id (no cambiar) |
|---|---|---|
| `NEW` | Nuevo | `20202020-8e01-4afd-9c39-d2063097587a` |
| `MQL` | MQL | `20202020-e685-4671-ac32-26d304dacb6e` |
| `MEETING` | SQL | `20202020-dde9-4acc-b5ca-f6531a8ecb4a` |
| `PROPOSAL` | HOT | `20202020-696e-4f6b-91bc-f413e9b2f654` |
| `CUSTOMER` | Customer | `20202020-0bb5-4a6f-a8b2-774bbad21104` |
| `NQL` | NQL · No responde | `54cb87ec-be89-44a7-9a04-c3cd4e2bf665` |

PQL `6962bd90-c367-4053-817a-e191fd810211` **ya no está**. Un
`GET /rest/opportunities?filter=stage[eq]:PQL` debe dar 400.

Snapshot de los 36 ids (PII de nombres, no está en el repo):
`/tmp/pql-a-nql-snapshot.json`. Script:
`baserow/sales/migracion/migrar_pql_a_nql.py`.

| etapa | antes (sesión) | después 16:03Z |
|---|---|---|
| NEW | 17 | 12 |
| PQL | 36 | 0 (opción borrada) |
| MQL | 129 | 133 |
| MEETING | 69 | 69 |
| PROPOSAL | 14 | 14 |
| CUSTOMER | 76 | 76 |
| NQL | 95 | 132 |

NQL 95+36=131; el 132 incluye movimiento orgánico del día. NEW bajó
5 y MQL subió 4: no es el incidente de ids. MEETING/PROPOSAL/CUSTOMER
iguales → las opciones no se reescribieron sin `id`.

La vista kanban Pipeline
(`7e66c136-8555-4af9-9c5f-754fc8c764bb`) puede seguir mostrando un
grupo huérfano de PQL. Es cosmética; se oculta en la UI.

---

## 6. Qué sí / no tocar al auditar

Sí:

```bash
python3 integrations/n8n/aplicar_w1_mapeo.py
python3 integrations/n8n/aplicar_embudo_sin_pql.py
# Twenty: GET metadata field stage y contar por etapa (no filtrar PQL)
```

Un Instant Form **real** nuevo: W1 debe emitir `Nuevo` 0 y
`events_received: 1`. Un closer que mueva a MQL a mano (UI, no API)
debe emitir `MQL` 10.

No:

- PATCH de opciones de `stage` sin mandar cada `id`.
- Recrear PQL.
- Reactivar `Meta CAPI - Lead`.
- Mandar `lead_id` inventado a CAPI (Graph tira todo el batch).
- Mover negocios reales a MQL/SQL/HOT «para probar».

---

## 7. Lo que queda afuera (Ads Manager)

Ricardo, 10-sep, captura de Ads Manager: el conjunto de anuncios
tiene Conversion Leads («Maximizar clientes potenciales cualificados»)
y el evento seleccionado era **SQL**. Pidió optimizar **MQL**.

Campañas activas (09-sep):

| Campaña | id | objetivo |
|---|---|---|
| SQL 🇨🇱 | `120247984833660218` | `QUALITY_LEAD` |
| SQL 🇲🇽 | `120247986964290218` | `QUALITY_LEAD` |
| Remarketing SQL | `120247987023130218` | `QUALITY_LEAD` |

Cuenta `act_774716223970185`. Pixel `1104567405156111`.

Este environment **no tiene** `META_ACCESS_TOKEN` de Marketing API.
El cambio es manual en Ads Manager: evento de conversión **MQL**, no
SQL / PQL / Nuevo. Nuevo vale 0 y no sirve para optimizar.

Custom MQL `1562704878613075` (default 0 + filtro URL) sigue siendo
de las campañas **pausadas**. No usarla para las activas.

---

## 8. Cronología UTC 2026-09-10

| Hora | Acción |
|---|---|
| ~15:5x | Repo: mapeo Nuevo 0 / MQL 10 / SQL 100 / HOT 200; PQL skip; tests |
| 16:02:50 | W1 PUT `aplicar_w1_mapeo.py --aplicar`. jsCode = archivo |
| 16:02–16:03 | Twenty: 36 PQL → NQL; opciones sin PQL; ids intactos |
| 16:03:18 | Wizard / Meet / Sub A: ORDEN sin PQL |
| 16:03:21 | Sub A `Meta CAPI - Lead` disabled |
| 16:05:03 | E2E `107614`: Nuevo 0 + payload; Graph 2804036 por lead_id falso |
| 16:05 | Negocio y persona de prueba soft-deleted |

---

## 9. Cómo revertir (solo si hay que abortar)

1. W1: PUT del respaldo `W1SybZZSEZqAItIt-20260910-160250.json`.
2. Twenty: **no** reponer PQL sin avisar. Los 36 ya están en NQL.
3. Sub A Lead: quitar `disabled` del nodo en el respaldo
   `YmauqyDqrZNKIYlg-sin-pql-20260910-160321.json`.
4. Ads: si alguien ya cambió el evento a MQL, volverlo es otra
   decisión de Ricardo.
