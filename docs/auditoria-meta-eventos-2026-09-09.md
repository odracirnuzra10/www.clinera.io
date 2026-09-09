# Auditoría Meta — embudo, Conversion Leads y W1 (2026-09-09)

Documento para que **otra sesión/IA** revise sin repetir la pesquisa.
Para auditar *si el trabajo del 09-sep quedó bien* (repo + PUT a W1):
`docs/handoff-auditoria-embudo-meta-2026-09-09.md`.
Hechos medidos el 2026-09-09 contra el conector Meta Ads, la API de n8n
(solo lecturas) y el inventario del repo `www.clinera.io` + `baserow`.
No hay tokens en este archivo.

**Superada:** `docs/auditoria-meta-eventos-2026-08-26.md` en §1 (ids/campañas),
§3 (custom conversions como lo que *optimiza*), §4 (adsets activas) y
§10-P1 (`SQL_Plus` ya no se pide). Lo que esa auditoría midió ese día
sigue siendo cierto *para ese día*; el estado vivo cambió el 7-sep.

**Pedido de Ricardo (canónico desde la tarde del 09-sep):**

| Peldaño | Valor USD | Quién lo gana |
|---|---|---|
| Nuevo | 0 | entró al CRM |
| PQL | 1 | closer → `PQL` |
| MQL | 5 | **agendó** (wizard, IA, Camila, `/reserva-tu-hora`) |
| SQL | 10 | closer → `MEETING` / `SQL` |
| HOT | 100 | closer → `PROPOSAL` / `HOT` |
| NQL | 0 | closer → no califica |
| Customer (`Purchase`) | 279 / 379 / 479 | `CUSTOMER` según `planClinera` |

Sin SCREENING, NoContesta ni `Lead`. El pedido de la mañana
(Instant Form 5 / MQL 10 / SQL 100 / HOT 300) quedó atrás el mismo día.

**Veredicto en una línea:** el pixel no está “sucio” como caja. Desde el
**7-sep 23:00** las campañas activas optimizan **Conversion Leads** y el
CRM (`W1SybZZSEZqAItIt`) les enseña que **«No contesta» vale US$ 10**.
Un pixel nuevo con el mismo emisor repite el problema (ya pasó dos veces:
`Obsoleto` y `Obsoleto2`, último disparo el 12 y el 17 de agosto).

No aplicar W1 a n8n por mergear este documento. Hace falta OK explícito
de Ricardo en el chat. El mapeo corregido vive en
`integrations/n8n/crm-etapas-meta-capi.mapeo.js`.

---

## 0. Cómo usar este documento

1. Tablas de §1–§6 = fuente de verdad del **2026-09-09**. IDs no cambian;
   `last_fired_time`, gasto y counts sí. Si pasaron >48 h, re-leer stats
   y adsets.
2. No mezclar **evento crudo** (`event_name: MQL`) con **custom conversion**
   (objeto de Ads Manager) ni con **Conversion Leads** (`QUALITY_LEAD` +
   `lead_id`). Desde el 7-sep las campañas activas usan lo tercero.
3. Las etiquetas de Twenty **no** son el `stage`. `SCREENING` se lee «MQL»;
   `PQL` se lee «PQL · No contesta» y va en rojo.
4. No POST de prueba al webhook `clinera-meet` ni a `crm-sql` (escriben
   CRM / pixel).
5. Los secretos que se peguen en el chat (token Graph, API key n8n, CAPI)
   se rotan al cerrar. No reusarlos desde el historial.

---

## 1. Identificadores vivos

| Cosa | Valor |
|---|---|
| Ad account que gasta | `act_774716223970185` · **OAGC - TECH** · CLP · tz America/Santiago · BM **Metricads Marketing** `1329489250889334` |
| Pixel de producción | `1104567405156111` · `[2026] OACG TECH` · BM **Método Hebe** `1162184321174513` (no Metricads; la auditoría del 26-ago lo decía mal) |
| Dataset nuevo (0 eventos) | `Clinera.io` `1410371181304151` · creado 2026-09-09 07:49 PT · mismo BM Método Hebe |
| Cuenta `CLINERA.IO` | `act_806063489131174` · BM Método Hebe · activa · **sin método de pago** · el conector no la alcanza (rollout Meta) |
| Página Clinera | `697874326752777` · **no** está en Método Hebe ni en Metricads Marketing (Hebe tiene Clinera Brasil y Calendaria.io; Metricads tiene Hebe, Lumina, Alta Qualita, Blindaje Legal). Confirmar dueño con Ricardo. |
| Custom MQL | `1562704878613075` · default **0** · regla URL `clinera.io` · solo campañas **pausadas** |
| Custom SQL | `1389593139704601` · default 100 · misma regla URL · sin disparar la custom desde 2026-07-08 |
| Workflow W1 | `W1SybZZSEZqAItIt` · nombre «Clinera \| Twenty etapas → Meta CAPI» · **activo** · mapeo canónico aplicado 2026-09-09 · webhook `POST …/webhook/crm-sql` |
| W1 viejos | `dhwqS9oW3qfvq6Y4` (SQL) y `rWZDSfi8RJ780q76` (`SQL_Plus`) · **apagados** |
| HUB Instant Form | `qOGjfU1AgubcOHvt` → Sub A `YmauqyDqrZNKIYlg` |

---

## 2. Hallazgos por costo

### H1 · W1 manda `MQL` US$ 10 cuando el closer marca «No contesta» — confirmado con ejecuciones

Nodo `Mapear etapa y cifrar datos`, mapeo **vivo** (no el de este PR):

| stage Twenty | etiqueta en el tablero | evento que sale hoy | value |
|---|---|---|---|
| NEW | Nuevo | `Lead` | 1 |
| SCREENING | **MQL (agendó)** | `PQL` | 2 |
| PQL | **PQL · No contesta** | `MQL` | 10 |
| NQL | No califica | `NQL` | 0 |
| MEETING | SQL | `SQL` | 100 |
| PROPOSAL | HOT | `HOT` | 300 |
| CUSTOMER | Contrata | `Purchase` | 279/379/479 |

SCREENING y PQL están **cruzados** respecto a las etiquetas.

Envíos reales desde que se activó (26 envíos en ~530 ejecuciones):

| día | stage → evento | n | con `lead_id` |
|---|---|---|---|
| 08-sep | PQL (no contesta) → `MQL` 10 | **8** | **7** |
| 08-sep | SCREENING (agendó) → `PQL` 2 | 5 | 3 |
| 07/08-sep | MEETING → `SQL` 100 | 4 | 1 |
| 07/08-sep | PROPOSAL → `HOT` 300 | 2 | 1 |
| 08/09-sep | NQL → `NQL` 0 | 5 | 4 |
| 08-sep | NEW → `Lead` 1 | 1 | 0 |

Los 7 `MQL` con `lead_id` son exactamente lo que Conversion Leads usa para
aprender. El pico de MQL en Events Manager (10 el 08-sep, 8 el 09-sep)
coincide. `NEW → Lead US$ 1` duplica el `Lead US$ 5` de Sub A (otro `event_id`).

Ritmo: ~400 ejecuciones/día. 235 de 290 leídas = `no_opportunity` (Twenty
suscrito a `*.*`). No es un bug; es ruido y cuota.

**Cómo reproducir (solo lectura):**

```
GET {N8N}/api/v1/workflows/W1SybZZSEZqAItIt
  → nodes[].name === "Mapear etapa y cifrar datos" → parameters.jsCode

GET {N8N}/api/v1/executions?workflowId=W1SybZZSEZqAItIt&limit=100
  → en cada ejecución, item de salida con event_name / stage / lead_id
```

### H2 · Campañas activas ya optimizan Conversion Leads (desde el 7-sep)

Cuenta `act_774716223970185`:

| campaña | id | estado | optimización | destino | gasto 28d (CLP) | leads |
|---|---|---|---|---|---|---|
| SQL 🇨🇱 | `120247984833660218` | ACTIVA | `QUALITY_LEAD` | Instant Form (`ON_AD`) | 36.327 | 1 |
| SQL 🇲🇽 | `120247986964290218` | ACTIVA | `QUALITY_LEAD` | Instant Form | 43.437 | 2 |
| Remarketing SQL | `120247987023130218` | ACTIVA | `QUALITY_LEAD` | Instant Form | 41.439 | 1 |
| Frio 🇨🇱/🇲🇽/🇨🇴/🇨🇷, Remarketing, Evento Los Ángeles | varias | PAUSADAS 07-sep | `OFFSITE_CONVERSIONS` custom MQL `1562704878613075` | web + form | 1,78 M | 101 |
| Thruplay | — | PAUSADA | THRUPLAY | — | 258.434 | — |

«Resultados: Not available (Qualified leads)» en las tres activas: Meta
aún no tiene señal de calidad suficiente, y la que recibe está invertida (H1).

**Cómo reproducir:**

```
GET /act_774716223970185/campaigns?fields=id,name,status,objective
GET /{campaign_id}/adsets?fields=name,status,optimization_goal,destination_type,promoted_object
GET /act_774716223970185/insights?date_preset=last_28d&level=campaign
```

### H3 · El MQL del navegador no llega: 0 MQL web en 28 días

Stats del dataset `1104567405156111` (12-ago → 09-sep):

| evento | total | servidor | navegador |
|---|---|---|---|
| PageView | 29.892 | 16.629 | 13.263 |
| ViewContent | 29.087 | 15.751 | 13.336 |
| MQL | 149 | 149 | **0** |
| Lead | 122 | 122 | 0 |
| Schedule | 55 | 55 | 0 |
| SQL | 35 | 35 | 0 |
| PQL / NQL / HOT / Purchase / SQL_Plus | 10 / 9 / 2 / 6 / 6 | todos | 0 |

`fireMqlEvent` (`src/lib/metaEvents.ts`) debería disparar
`fbq('track','MQL')` con `eventID`. O no dispara en producción, o Meta
lo cuenta solo en el lado servidor por dedup. **Pendiente:** Test Events
en `/agenda` (el guardián `tests/ventas-meta-events.spec.ts` prueba contra
un stub, no contra Meta; además espera MQL al enviar el paso 3 y un
botón «Médica» que ya es `<select>` — `MQL_TRIGGER` vigente es
`booking_confirmed`).

EMQ de MQL = **2,8** (email 12,5 %, fbp 6,3 %): la mayoría viene de
caminos sin navegador. `Lead` (Instant Form) tiene EMQ 7,5.

**Cómo reproducir:**

```
ads_get_dataset_stats pixel=1104567405156111
  since=2026-08-12 until=2026-09-09 aggregation=event
  breakdown=event_source (BROWSER / SERVER / SERVER_ONLY)
```

### H4 · Custom conversions y reglas viejas

- `MQL` `1562704878613075`: default **0**, URL contiene `clinera.io`,
  descripción «/ventas». Solo campañas pausadas; sigue saliendo en reportes.
- `SQL` `1389593139704601`: default 100, misma URL, custom muerta desde
  el 08-jul (el CAPI del CRM no manda URL).
- `Demo Ready` (10.000) y `Clinera.io/gracias` (20.000): residuo CLP,
  sin uso desde abril.
- 9 reglas del Event Setup Tool (Contact / CompleteRegistration / Lead /
  SubmitApplication por texto de botón o URL `wa.me`): **0 eventos** en
  28 días. Una regla `Lead` por texto «confirmar agenda» puede revivir
  si cambia un botón.
- `SQL_Plus` (6) y `CRM_Stage_Test` (1) quedan en el histórico. No
  recrear `SQL_Plus`: PROPOSAL emite `HOT`.

### H5 · Propiedad de activos y audiencias

Cambiar de pixel **no** cuesta audiencias (120+ lookalikes INACTIVE; las
activas que importan son lista `Leads calificados` 1.200–1.400 y
engagement `Videos 28 agosto` 143–168 k; las web de 30 días tienen ~20
personas). Cuesta recableado: sitio + ~5 workflows n8n + custom
conversions + integración Conversion Leads.

`Clinera.io` `1410371181304151` **ya existe**. No crear otro. Migrar es
un proyecto aparte, **después** de corregir H1 y H4, con campañas
duplicadas.

### H6 · Ruido en el pixel

- Hosts: 2.574 eventos desde `localhost`, 90 desde `127.0.0.1`, 18 desde
  previews de Vercel, 3 desde `review.allot-wsp.local`.
- `/reunion` (`ReunionLanding.tsx`) disparaba `MQL` US$ 10 **al enviar el
  formulario**, sin agendar. La ruta pública `/reunion` redirige a
  `/agenda` (308 en `next.config.ts`); el componente sigue vivo.
- `public/inicia-2` manda `Lead` value 19 y `Programar` value 75;
  `/reserva` y `/webinars` mandan `Lead` value 0. Ninguno con `eventID`.
- `src/app/api/meta/capi/route.ts` aceptaba `Waitlist` y `Contact`
  (muertos). Este PR deja `ALLOWED_EVENTS = { MQL }`.
- Exports `crm-sql-twenty.workflow.json` y
  `clinera-agenda-reserva.workflow.json` llevan placeholder de token, no
  `$env`. El primero es **histórico** (grafo solo-SQL); el runtime es W1.

### H7 · Docs contradictorios (estado *antes* de este PR)

`AGENTS.md` decía que el emisor PQL→MQL «se canceló» y, más abajo,
documentaba ese mismo emisor como mapeo vivo de W1.
`integrations/n8n/README.md` describía dedupe con `Schedule` cuando el
evento es `MQL`. La auditoría de agosto pedía crear `SQL_Plus`.

Este PR alinea esas tres superficies al mapeo **corregido** (versionado,
no aplicado). El vivo sigue invertido hasta el OK de Ricardo.

---

## 3. Matriz pedido vs realidad (2026-09-09)

| Pedido | ¿Evento crudo? | ¿Entrena la campaña activa? | ¿Valor alineado? |
|---|---|---|---|
| Instant Form US$ 5 | Sí (`Lead` CAPI Sub A) | Conversion Leads usa `lead_id`; la calidad la ensucia H1 | 5 vs W1 `Lead` 1 duplicado |
| MQL US$ 10 = agendó | Sí, pero 8/26 envíos W1 son «no contesta» | **Sí, al revés** (H1+H2) | 10 |
| SQL US$ 100 | Sí | No (campañas no optimizan SQL) | 100 |
| HOT US$ 300 | Sí (2) | No | 300 |
| NQL / NoContesta como descalificado | W1 manda `NQL` 0; «no contesta» sale como **MQL** | El negativo útil no existe | — |

---

## 4. Mapeo canónico (Ricardo, 09-sep tarde — aplicado a W1 el 2026-09-09)

Fuente: `integrations/n8n/crm-etapas-meta-capi.mapeo.js`.
Sustituye el mapeo de la mañana (SCREENING→MQL 10, PQL→NoContesta 0,
SQL 100, HOT 300). Los mismos estados en CRM y en el pixel.

| stage | evento | value | condición |
|---|---|---|---|
| NEW | `Nuevo` | 0 | alta; también si lo escribió n8n |
| PQL | `PQL` | 1 | |
| MQL | `MQL` | 5 | |
| MEETING | `SQL` | 10 | alias `SQL` |
| PROPOSAL | `HOT` | 100 | alias `HOT` |
| NQL | `NQL` | 0 | no calificado |
| CUSTOMER | `Purchase` | valor del plan | VORTEX 279 / ATLAS 379 / SUMMIT 479 |
| SCREENING / SQL_Plus / NoContesta | — | — | no emiten |

Se mantiene ledger, `event_id = {oppId}_{stage}`, `lead_id` entero,
ventana 28 d. Nombre del workflow al aplicar: «Clinera | Twenty etapas →
Meta CAPI» (sin «inactivo»).

En Twenty: borrar SCREENING; crear/dejar `MQL`. `NQL` se queda.
Sub A (repo `baserow`) debe dejar de mandar `Lead` US$ 5.

---

## 5. Recomendación

**No crear otro pixel para arreglar calidad.** Con H1 corregido, el pixel
actual queda tan limpio como uno nuevo y sin fase de aprendizaje extra.
Si igual se migra a `Clinera.io` `1410371181304151` (ordenar BMs),
hacerlo **después** de H1 y H4, campañas duplicadas, nunca cambiando el
pixel a las que ya gastan.

---

## 6. Checklist manual (UI de Meta — Ricardo)

1. Events Manager → dataset `1104567405156111` → Conversion Leads →
   embudo: `Nuevo → PQL → MQL → SQL → HOT → Purchase`, con `NQL` ($0)
   como descalificado. Sin SCREENING, NoContesta ni Lead. El conector no lee ni edita esto.
2. Custom MQL `1562704878613075`: default **5**, quitar filtro URL,
   descripción «agendó demo». Custom SQL: default **10**, sin filtro URL.
   Archivar `Demo Ready` y `Clinera.io/gracias`.
3. Borrar las 9 reglas del Event Setup Tool.
4. Rotar: token Meta pegado el 09-sep, API key n8n del mismo día, y el
   token CAPI que estuvo commiteado (pendiente desde agosto).
5. Confirmar el BM dueño de la página `697874326752777`.
6. Decisión aparte: migrar o no a `Clinera.io` `1410371181304151`.

---

## 7. Cómo re-verificar

```
GET /{pixel}/stats?aggregation=event
GET /act_774716223970185/campaigns
  ?fields=id,name,status,objective
GET /{campaign_id}/adsets
  ?fields=optimization_goal,destination_type,promoted_object
GET {N8N}/api/v1/workflows/W1SybZZSEZqAItIt
```

Tras aplicar W1 (solo con OK): mover un negocio de prueba a `PQL` →
`PQL` value 1. A `MQL` → `MQL` value 5. A `SCREENING` → no emite.
`ads_get_dataset_stats` `event_name=MQL` `SERVER_ONLY` 48 h: los MQL
deben corresponder solo a citas (value 5).

H3 sigue abierto hasta Test Events en `/agenda`.
