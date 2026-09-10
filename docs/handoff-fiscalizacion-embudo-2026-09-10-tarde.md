# Handoff de auditoría: bloque de la tarde del 2026-09-10 (16:45–18:55Z)

Documento para **otra IA o persona**. Objetivo: confirmar o refutar, con
evidencia propia, que lo que se declara acá es cierto. No rehacer el
trabajo. Solo lecturas; nada de PUT a n8n, nada de mover negocios reales,
nada de tocar conjuntos de anuncios.

Antecedentes: `docs/handoff-embudo-etapas-2026-09-10.md` (lo que se
fiscalizó) y `docs/fiscalizacion-embudo-etapas-2026-09-10.md` (resultado
D1–D10, hallazgos laterales). PR `www.clinera.io` #273 (squash a `main`).

Sin tokens en este archivo. Usar `N8N_URL` / `N8N_API_KEY` /
`TWENTY_URL` / `TWENTY_API_KEY` y, para Meta, `META_ACCESS_TOKEN`
(token de usuario con acceso a `act_774716223970185`) del environment.

---

## 0. Qué se declara (confirmar o refutar cada línea)

| # | Declaración | Dónde comprobar |
|---|---|---|
| E1 | El jsCode del nodo «Mapear etapa y cifrar datos» de W1 `W1SybZZSEZqAItIt` es idéntico a `integrations/n8n/crm-etapas-meta-capi.mapeo.js` en `main`, contiene `const ESCALERA` y `function etapasImplicitas`, y se aplicó el **2026-09-10 18:50:07Z** (`updatedAt` del workflow) | §2 |
| E2 | `python3 integrations/n8n/aplicar_w1_mapeo.py` (sin `--aplicar`) dice «Ya estaba aplicado»; el workflow sigue `active: true` y el webhook `crm-sql` registrado | §2 |
| E3 | Los otros 5 nodos de W1 no cambiaron: 6 nodos, mismas `connections`, IF v2 sobre `$json.omitido`, HTTP `JSON.stringify($json.payload)` a `graph.facebook.com/v26.0/1104567405156111/events`, «Confirmar y auditar» empareja `$('Mapear…').all()[i]` con `$input.all()[i]` | §2 |
| E4 | Regla nueva: un estado implica los anteriores. Un `opportunity.updated` **manual** a `MEETING` sin `MQL:{id}` en el ledger produce **dos ítems** en «Mapear…»: `MQL` 10 (`implicita: true`, `event_id {id}_MQL`, `event_time` un segundo antes) y luego `SQL` 100 (`{id}_MEETING`); ambos con `pairedItem {item: 0}`. `CUSTOMER` sin nada en el ledger produce MQL, SQL, HOT, Purchase. `MQL`, `NQL`, `Nuevo` producen un ítem. Movido por `API` o sin contacto: un ítem omitido | §1, §2 |
| E5 | Specs `tests/crm-etapas-meta-capi.spec.ts` + `tests/reunion-meta-events.spec.ts` = **15 passed** en `main` | §1 |
| E6 | Meta: los 6 conjuntos activos (3 de `MQL 🇨🇱 120248035606070218`, 3 de `MQL 🇲🇽 120248035556840218`) tienen `optimization_goal QUALITY_LEAD`, `promoted_object.custom_event_str "MQL"`, `custom_event_type OTHER`, `ads_signal_source_type capi_crm`, `page_id 697874326752777`, `pixel_id 1104567405156111`, `destination_type ON_AD` | §3 |
| E7 | Esos 6 conjuntos tienen `attribution_spec [{CLICK_THROUGH, window_days 1}]`. No se cambió: es decisión de Ricardo (recomendado 7 días clic) | §3 |
| E8 | Las campañas del handoff anterior (`120247984833660218`, `120247986964290218`, `120247987023130218`) están archivadas; no hay otra campaña activa en la cuenta | §3 |
| E9 | Al equipo se le comunicó la regla «todo SQL pasa antes por MQL»: mensaje en Slack `#comercial` (`C0BUA2RFY3A`, ts `1789065736.892519`, 18:42Z) y **borrador** en Gmail (id `r3465703340541925139`, no enviado al cierre de este handoff) | §4 |
| E10 | W1 sigue mandando `user_data` **solo con `lead_id`** (sin `em`/`ph`): la lectura de la persona en Twenty falla en silencio. No se tocó. Los negocios sin `leadgenId` salen `sin_email_ni_telefono_ni_lead_id` | §5 |
| E11 | `AGENTS.md` (bloque del embudo Meta) y `integrations/n8n/README.md` documentan la regla, el estado real de las campañas y la ventana de 1 día; `main` contiene el PR #273 mergeado | §1 |

Si E1 o E3 fallan, parar: o el PUT no quedó como el archivo, o alguien
editó W1 después. Si E4 falla en una ejecución real, W1 puede estar
mandando un solo evento (comportamiento viejo) o rompiendo el
emparejamiento por índice de «Confirmar y auditar».

---

## 1. Repo

```bash
git log --oneline -6                      # debe incluir el squash del PR #273
grep -n "const ESCALERA\|function etapasImplicitas\|pairedItem" integrations/n8n/crm-etapas-meta-capi.mapeo.js
grep -n "Un estado implica los anteriores" AGENTS.md
grep -n "Etapas implícitas" integrations/n8n/README.md
BASE_URL=http://127.0.0.1:9 npx playwright test tests/crm-etapas-meta-capi.spec.ts tests/reunion-meta-events.spec.ts
```

Esperado: 15 passed. El bloque «Nuevo → SQL directo» corre el jsCode
entero con stubs y prueba E4 sin red.

## 2. n8n W1 (solo lectura)

```bash
python3 integrations/n8n/aplicar_w1_mapeo.py     # «Ya estaba aplicado»
# GET /api/v1/workflows/W1SybZZSEZqAItIt → nodos, connections, updatedAt, jsCode (sha256 vs archivo)
# GET /api/v1/executions?workflowId=W1SybZZSEZqAItIt&limit=100 → filtrar startedAt > 2026-09-10T18:50:07Z
```

Prueba real de E4: buscar la primera ejecución posterior a 18:50:07Z cuyo
webhook sea `opportunity.updated`, `updatedBy.source` distinto de `API`,
`record.stage` = `MEETING` y sin `MQL:{id}` en el ledger. Debe tener dos
ítems en «Mapear…» (MQL con `implicita: true`, luego SQL) y dos respuestas
con `events_received: 1`; el ledger (`staticData.global.enviados`) queda
con `MQL:{id}` y `SQL:{id}`. **Si no hubo ninguna todavía, decirlo; no
mover negocios reales para provocarla.** Un `opportunity.updated` a `MQL`
sigue siendo un solo ítem.

Respaldos del JSON vivo (no commiteados; existen solo en el environment
donde se aplicó): `integrations/n8n/backup/W1SybZZSEZqAItIt-20260910-160250.json`
(antes del mapeo sin PQL) y `…-20260910-185007.json` (antes del relleno).

Trampa conocida: la guarda de `aplicar_w1_mapeo.py` exige los literales
`payload: payload`, `ledgerKey: ledgerKey` y `omitido: false` en el
archivo. Un refactor que arme esas claves en línea hace que el aplicador
se niegue con «El archivo no devuelve 'payload: payload'» (pasó a las
18:48Z; se ajustó el archivo, no la guarda).

## 3. Meta (Graph API, solo lectura)

```bash
curl -sS -G "https://graph.facebook.com/v26.0/act_774716223970185/adsets" \
  --data-urlencode "fields=id,name,campaign{id,name,status},effective_status,optimization_goal,promoted_object,attribution_spec" \
  --data-urlencode 'effective_status=["ACTIVE","PAUSED","CAMPAIGN_PAUSED","WITH_ISSUES","IN_PROCESS","PENDING_REVIEW"]' \
  --data-urlencode "access_token=$META_ACCESS_TOKEN"
```

Esperado (18:48Z): 6 conjuntos activos con `custom_event_str: "MQL"` y
`attribution_spec: [{"event_type":"CLICK_THROUGH","window_days":1}]`, más
uno archivado (`Video Viewers Engagement CL`, campaña `C3 - Purchase`).
El MCP de Meta (`ads_get_ad_entities`) **no** devuelve `custom_event_str`:
no usarlo para refutar E6.

Custom conversions de la cuenta (no las usan los conjuntos activos):
«MQL» `1562704878613075` (default 0, filtro URL) y «SQL»
`1389593139704601` (default 100).

## 4. Comunicación al equipo

- Slack `#comercial`: permalink
  `https://oyarzunacuaco-xrs8466.slack.com/archives/C0BUA2RFY3A/p1789065736892519`.
  Texto: regla, por qué (la campaña optimiza MQL), paso a paso Nuevo /
  MQL / SQL / HOT / Customer / NQL, «nada de saltos», «lo que mueve una
  automatización no cuenta».
- Gmail: borrador con el mismo contenido en HTML, para Jorge Cheul y
  Catalina Fuentes con copia a Nohelymar Sánchez y Rebeca Navarro.
  Ricardo revisa destinatarios contra el organigrama vigente antes de
  enviar. Si al auditar ya está enviado, anotarlo.

## 5. Lo que queda afuera (no se tocó)

1. `user_data` solo con `lead_id` (E10): revisar por qué falla
   `helpers.httpRequest` a `$env.TWENTY_URL + /rest/people/{id}` dentro
   del Code node (¿variables ausentes en n8n?, ¿`$env` bloqueado?). Los
   leads sin `leadgenId` quedan fuera del embudo CAPI.
2. Ventana de atribución 1 día clic (E7).
3. W1 no filtra `opportunity.destroyed`: borrar un negocio cuyo evento no
   está en el ledger reemite su etapa (pasó con el negocio E2E, 107615).
4. Tres emisores paralelos de `MQL` 10 al agendar (sitio `fireMqlEvent`,
   Wizard `Meta CAPI - MQL`, Meet `Meta CAPI - MQL (IA)`).
5. Relleno «tarde» para negocios anteriores al ledger (7-sep): al avanzar
   hoy reciben el MQL/SQL que no consta. Aceptado.

## 6. Qué sí / no tocar al auditar

Sí: GET a n8n, Twenty y Graph API; correr los specs; leer ejecuciones.

No: PUT a n8n; mover negocios reales «para probar»; mandar `lead_id`
inventado a CAPI; cambiar `promoted_object` o `attribution_spec` de los
conjuntos; enviar el borrador de Gmail.

## 7. Cronología UTC 2026-09-10

| Hora | Acción |
|---|---|
| 16:45 | PR #273 creado (fiscalización D1–D10, AGENTS.md campañas) |
| 16:53 | Push: hallazgo `user_data` solo `lead_id` |
| 17:5x | Ricardo pide corregir: todo SQL pasa antes por MQL, avisar al equipo |
| 18:42 | Push `97c0914` (relleno de etapas + specs + docs); Slack `#comercial`; borrador Gmail |
| 18:48 | Graph API: 6 conjuntos `custom_event_str MQL`, atribución 1 día clic |
| 18:48:31 | Primer `--aplicar`: la guarda rechazó (`payload: payload`); ajuste de literales |
| 18:50:07 | W1 PUT aplicado; simulacro «Ya estaba aplicado» |
| 18:5x | Docs + este handoff; merge squash del PR #273 |

## 8. Cómo revertir (solo si hay que abortar)

1. W1: PUT del respaldo `W1SybZZSEZqAItIt-20260910-185007.json`, o
   `git show 97c0914^:integrations/n8n/crm-etapas-meta-capi.mapeo.js >
   integrations/n8n/crm-etapas-meta-capi.mapeo.js` y
   `python3 integrations/n8n/aplicar_w1_mapeo.py --aplicar`.
2. Slack: borrar el mensaje a mano si la regla cambia.
3. Nada que revertir en Meta: no se escribió.
