# Auditoría Meta — eventos, valores y campañas (2026-08-26)

> **Superada el 2026-09-09** en §1 (ids/campañas), §3 (qué optimiza de
> verdad), §4 (adsets activas) y §10-P1 (`SQL_Plus` ya no se pide).
> El estado vivo —Conversion Leads desde el 7-sep, W1 cruzando PQL→MQL,
> BM real del pixel— está en
> [`auditoria-meta-eventos-2026-09-09.md`](./auditoria-meta-eventos-2026-09-09.md).
> Este archivo se conserva como foto de ese día.

Documento para que **otra sesión/IA** revise sin repetir la pesquisa.
Hechos medidos el 2026-08-26 contra Graph API `v21.0` (cuenta `act_774716223970185`
**OAGC - TECH**, pixel `1104567405156111`) y contra repos `www.clinera.io` +
`baserow` + n8n vivo. No hay tokens en este archivo.

**Pedido de Ricardo (valores canónicos):**

| Peldaño | Valor USD |
|---|---|
| Formulario instantáneo (Lead Ads nativo) | 5 |
| MQL (agendó demo: wizard `/agenda` o IA WhatsApp) | 10 |
| SQL (closer califica en Twenty, etapa `MEETING`) | 100 |
| SQL+ (closer sube a propuesta, etapa `PROPOSAL`) | 300 |

**Veredicto en una línea:** el pixel recibe `MQL` y `SQL`, las campañas
optimizan una custom conversion **MQL con valor 0 y filtro de URL**, no existe
conversión `SQL+` ni evento de formulario instantáneo a 5 USD. Chile **acaba
de** activar Lead Form (antes era 100 % `clinera.io/agenda`); la basura
histórica sale del wizard, no del form nuevo.

**Después de mergear #206/#404 (26-ago 20:18Z):** una segunda IA auditó los
PRs en retrospectiva → MERGE CON NITS (nada que revertir). El único error
factual (H8): `nodo-sqlplus-preparar-capi.js` usa `|| 300` y el export
`crm-sqlplus-meta-capi.json` usa `|| 150`. Reunión Eduardo el mismo día:
lanzar Instant Forms midiendo `Lead`, MQL al PQL. Plan:
`baserow/openspec/changes/lanzamiento-instant-forms-embudo/`.

---

## 0. Cómo usar este documento

1. Tratar las tablas de §2–§4 como **fuente de verdad de ese día**. Si pasaron
   >48 h, re-leer custom conversions y adsets: los IDs no cambian, los
   `last_fired_time` sí.
   Ricardo corrigió el 26-ago noche: el Lead Form de Chile **se activó ese
   día**; no usarlo para explicar leads basura anteriores.
2. No mezclar **evento crudo del pixel** (`event_name: MQL`) con **custom
   conversion** (objeto de Ads Manager con regla). Las campañas no optimizan el
   evento crudo: optimizan `custom_conversion_id = 1562704878613075`.
3. No unificar `SQL` y `SQL_Plus`. Son peldaños distintos a propósito
   (`AGENTS.md`).
4. No mandar POST de prueba al webhook `clinera-meet` (lección fila Baserow 1635).
5. Tokens que Ricardo pegó en chat (CAPI, n8n API, user Graph) **deben rotarse**.
   No reusarlos desde el historial.
6. Esto es memoria del proyecto **cuando está en `main`**, porque
   `AGENTS.md` apunta acá y cada sesión de agente carga ese archivo. Un PR
   **abierto** no se consulta solo: hay que mergearlo. Un MD pegado en un
   chat muere con el hilo.

---

## 1. Identificadores vivos

| Cosa | Valor |
|---|---|
| Ad account | `act_774716223970185` · **OAGC - TECH** · currency **CLP** · tz America/Santiago |
| Business Manager | `1329489250889334` · Metricads Marketing |
| Pixel | `1104567405156111` · nombre `[2026] OACG TECH` |
| Custom conversion MQL | `1562704878613075` |
| Custom conversion SQL | `1389593139704601` |
| Custom conversion SQL+ | **no existe** |
| Campaña Chile | `120247833791560218` · **Conversión+ Chile** · `OUTCOME_LEADS` · ACTIVE |
| Adset Chile RMKT | `120247833791630218` |
| Adset Chile FRIO | `120247833791550218` |
| Campaña LATAM | `120247701603460218` · **Conversión LATAM** · `OUTCOME_LEADS` · ACTIVE |
| Adset LATAM RMKT | `120247781557560218` |
| Adset LATAM FRIO | `120247701603450218` |
| Workflow Meet (MQL IA) | n8n `FZvyK42lkQdKWcIl` · webhook `clinera-meet` · aplicado 2026-08-26 04:56Z |
| Workflow Reserva /agenda | n8n `q5btVHRWzS5yuDXW` |
| Workflow Wizard | n8n `A3wOPmhQjit8VswM` (no versionado; lleva credenciales) |
| Workflow SQL Twenty | n8n `dhwqS9oW3qfvq6Y4` · export `integrations/n8n/crm-sql-twenty.workflow.json` |
| Workflow SQL+ | n8n `rWZDSfi8RJ780q76` · **solo en n8n**, código `baserow/sales/n8n/nodo-sqlplus-preparar-capi.js` |
| SQL Conversión Alto Valor | n8n `1erGwPkeneXUkqzG` (segundo emisor SQL desde Baserow 152) |

PRs ya mergeados del MQL IA: [baserow#403](https://github.com/odracirnuzra10/baserow/pull/403),
[www.clinera.io#205](https://github.com/odracirnuzra10/www.clinera.io/pull/205).

---

## 2. Lo que realmente dispara cada emisor

Valores = lo que viaja en `custom_data.value` / `fbq` / `VALOR_*`, no lo que
Ads Manager *debería* mostrar.

| # | Emisor | `event_name` | `action_source` | value USD | URL / cookies | Dónde |
|---|---|---|---|---|---|---|
| A | Pixel navegador, wizard agendó | `MQL` | website (browser) | **10** | sí (`fbp`/`fbc`, URL `/agenda`) | `src/lib/metaEvents.ts` `fireMqlEvent` · `MQL_TRIGGER = booking_confirmed` |
| B | CAPI n8n, misma cita wizard | `MQL` | `website` | **0** | sí (`event_source_url` clinera.io/agenda + fbp/fbc) | `integrations/n8n/clinera-agenda-reserva.workflow.json` nodo `Meta CAPI - MQL` |
| C | CAPI n8n, cita IA WhatsApp | `MQL` | `system_generated` | **10** | **casi nunca** (sin URL; `fbc`/`fbp` solo si hay fila 152) | Meet vivo, nodos `Preparar MQL Agente IA` + `Meta CAPI - MQL (IA)` |
| D | CAPI n8n, closer → SQL | `SQL` | `system_generated` | **100** (`VALOR_SQL`) | sin URL; fbc/fbp si la 152 los tiene | `crm-sql-twenty.workflow.json` |
| E | CAPI n8n, segundo SQL (Baserow 152) | `SQL` | `system_generated` | 100 | mismo contrato de `event_id` hasheado | `1erGwPkeneXUkqzG` (no en este repo) |
| F | CAPI n8n, closer → SQL+ | `SQL_Plus` | `system_generated` (esperado) | **300** (`META_CAPI_VALUE_SQL_PLUS` o default 300) | sin URL | `rWZDSfi8RJ780q76` |
| G | Formulario instantáneo Meta | `Lead` nativo / leadgen | onsite Lead Ads | **no implementado a 5** | `leadgen_id` de Meta | Chile `destination_type = WEBSITE_AND_LEAD_FORM` **recién activado el 26-ago** (Ricardo: hasta hoy las campañas eran 100 % wizard `/agenda`). Workflows `Meta Leads Clinera` A/B/HUB: **0 ejecuciones** ese día — el form nuevo aún no está enganchado a n8n |
| H | Pixel `Schedule` | `Schedule` | website | (histórico) | URL | aparece en stats de agosto 1, no en las últimas 24 h como evento dominante |

Deduplicación A+B: mismo `event_id` (lo manda el sitio en el body del webhook y
en `fbq(..., { eventID })`). Meta colapsa por `(event_name, event_id)`. Si A
manda value 10 y B manda value 0, el valor que gana es el de Meta al mergear;
en la práctica la custom conversion usa **default 0**, así que Ads Manager
ve MQL **sin plata**.

C no colisiona con A/B: `event_id = mql_<sha12>_<fecha>_<hora>` y la
compuerta `origenCita === 'agente-ia'` deja fuera wizard y eco `web`.
Verificado en vivo post-apply (ejec. Meet 73586 wizard y 73601 eco web:
`Preparar MQL Agente IA` → `[]`, CAPI IA no corrió).

---

## 3. Custom conversions en Ads Manager (leídas 2026-08-26)

Solo las del pixel Clinera `1104567405156111`. El resto de la cuenta (Metricads,
cursos, ricardooyarzun.cl) no aplica.

### 3.1 MQL — `1562704878613075`

```
name: MQL
custom_event_type: OTHER
event_source_type: pixel
default_conversion_value: 0          ← debería ser 10
is_archived: false
rule: event == "MQL" AND URL i_contains "clinera.io"
description: "Leads que completaron el formulario en clinera.io/ventas"
first_fired: 2026-06-15
last_fired:  2026-08-26T09:48:51Z    ← coincide con booking wizard de las 09:43
```

**Efectos:**

- Las 4 adsets activas de Chile y LATAM optimizan **esta** conversión
  (`promoted_object.custom_conversion_id`).
- Un `MQL` CAPI sin URL (WhatsApp IA, `system_generated`) **no cumple la
  regla** → no entrena la campaña aunque Events Manager lo muestre.
- Descripción desactualizada: MQL vigente = **agendó**, no “completó el
  formulario en /ventas”.
- `default_conversion_value: 0` + CAPI wizard `value: 0` → LATAM 7 d reportó
  10 MQL y **`action_values: null`**.

### 3.2 SQL — `1389593139704601`

```
name: SQL
custom_event_type: OTHER
default_conversion_value: 100        ← correcto
rule: event == "SQL" AND URL i_contains "clinera.io"
first_fired: 2026-06-17
last_fired:  2026-07-09T04:00:54Z    ← 48 días sin disparar la CUSTOM
```

El **evento crudo** `SQL` sí llegó al pixel el 2026-08-25 (stats: 2 en ~24 h).
La custom no dispara porque el CAPI de Twenty **no manda `event_source_url`**.
Nadie está optimizando SQL (correcto: las campañas van a MQL). El hueco es
para reportes / value optimization / Conversion Leads de calidad.

### 3.3 SQL+ — no existe

No hay custom conversion `SQL_Plus` ni `SQL+` en este pixel. El workflow
`rWZDSfi8RJ780q76` puede estar mandando el evento crudo; en stats de pixel
de las últimas ~24 h **no apareció** `SQL_Plus`. Si la custom no existe, una
campaña no puede optimizar contra 300 USD aunque el evento crudo exista.

### 3.4 Otras custom del mismo pixel (ruido, no apagar sin mirar)

| Nombre | Regla | default | last_fired |
|---|---|---|---|
| Demo Ready `3105693459602525` | PageView URL contains `ready` | 10000 | 2026-04-29 |
| Clinera.io/gracias `821194463715246` | PageView URL contains `gracias` | 20000 | 2026-04-29 |

Valores 10000/20000 parecen **CLP residual**, no USD. No las usan las campañas
activas. No borrarlas en esta pasada (pueden tener históricos); no
optimizar contra ellas.

**No existe** custom ni evento valorado a **5 USD** para Lead Ads.

---

## 4. Campañas activas (Graph 2026-08-26)

Ambas `objective: OUTCOME_LEADS`, `optimization_goal: OFFSITE_CONVERSIONS`,
pixel `1104567405156111`, custom **MQL** `1562704878613075`, misma `pixel_rule`
con URL `clinera.io`. Atribución: clic 7 días + engaged video view 1 día.
**Sin** ventana view-through de 1 día de impresión (no está en `attribution_spec`).

| Campaña | Destino adset | Insights 7 d |
|---|---|---|
| Conversión+ Chile | `destination_type: WEBSITE_AND_LEAD_FORM` | vacío (campaña nueva / duplicado del 26-ago) |
| Conversión LATAM | `destination_type: UNDEFINED` (sitio) | spend **511 747 CLP**, 1373 link clicks, **10** `offsite_conversion.custom.1562704878613075` (MQL), **sin** `action_values`. También 2 `messaging_conversation_started_7d` |

Chile **recién activó** Lead Form el 26-ago (Ricardo: hasta entonces las
campañas iban 100 % a `clinera.io/agenda`). El `destination_type` que leímos
es ese cambio, no el histórico. Los workflows `YmauqyDqrZNKIYlg` /
`JR6Nb7mWHVBhD6H8` / `qOGjfU1AgubcOHvt` (Meta Leads Clinera) tuvieron **0
ejecuciones** ese día → el form nuevo **aún no** está cayendo a n8n/Twenty.
Cuando empiece a caer, esos leads viven en Ads Manager y **no** son MQL
salvo que alguien los agende. Hay que emitirles el evento a US$ 5
(distinto de MQL) o van a contaminar el costo sin tarifa.

LATAM 7 d: ~CLP 51 175 por MQL custom si se atribuyen los 10 (511747/10).
Eso es ~US$ 50+/MQL al dólar de agosto, sobre un evento con valor 0.

---

## 5. Matriz pedido vs realidad

| Pedido | ¿Evento crudo en pixel? | ¿Custom conversion? | ¿Valor  alineado? | ¿Entrena la campaña? |
|---|---|---|---|---|
| Instant form US$ 5 | No como `Lead` valorado; Chile admite Lead Form | No | No | No (y si el form convierte, Meta lo cuenta aparte, barato) |
| MQL US$ 10 | Sí (6 en ~24 h pixel stats) | Sí, default **0**, regla URL | Navegador 10 / CAPI wizard **0** / CAPI IA 10 / custom **0** | Solo MQL **con URL clinera.io** |
| SQL US$ 100 | Sí (2 en ~24 h) | Sí, default 100, regla URL | CAPI 100 OK | Custom **muerta desde 9-jul** por falta de URL |
| SQL+ US$ 300 | No visto en 24 h | **No** | CAPI 300 en código n8n | No |

---

## 6. Pixel stats recientes (agregado ~24 h, buckets horarios)

```
ViewContent     1501
PageView        1255
MQL                6
EngagedSession     2
SQL                2
```

No aparecen `Lead`, `SQL_Plus`, `SQL+`, `Schedule` en esa ventana. Relación
~200 PageView por MQL: tráfico Meta barato que no agenda. Coincide con el
wizard n8n: la mayoría de ejecuciones son `size_captured` **sin contacto**
(paso 2 y se van). Origen `META ADS - WIZARD`, UA Android / in-app Instagram,
landing `/agenda`.

---

## 7. Leads “asquerosos” / bots / competencia

**Hecho:** la basura que ya se veía **antes** de activar el form sale del
wizard: clic Meta → `/agenda` → abandono en paso 2 (`size_captured` sin
contacto). El MQL IA de WhatsApp **no** está inundando: no hubo cita
`agente-ia` post-apply al momento de la muestra (última IA real = ejec. Meet
72994, *antes* del cambio).

**Corrección de Ricardo (26-ago noche):** el Lead Form nativo **no** explica
esos leads. Las campañas eran 100 % `clinera.io/agenda` hasta hoy.

**Más probable que un rival llenando formularios:**

1. Inventario Meta (Advantage+, Audience Network, in-app) mandando clics a
   `/agenda` que no son dueños de clínica — el wizard se empieza y se abandona.
2. LATAM filtrándose (hubo booking `pais=CO` con `fbclid` de campaña LATAM
   en el mismo wizard).
3. **A partir de ahora**, el Lead Form de Chile *sí* puede sumar basura
   nueva (fricción cero, sin wizard). Aún no se veía en n8n el 26-ago.

Un competidor suele quemar presupuesto en clics, no completar agenda + mail +
hora. El MQL que se acaba de cablear **no crea** esos leads: avisa cuando
alguien **agenda**.

---

## 8. Atribución WhatsApp → Meta (para no reabrir el debate)

Twenty **no** habla con Meta. n8n manda CAPI en paralelo a crear el negocio.

Camino: clic CTWA (Meta lo guarda) → chat 1 día → IA agenda → Meet workflow
→ CAPI `MQL` `system_generated` con `em`/`ph` hasheados, value 10, sin
`ctwa_clid`. Meta intenta matching avanzado contra el clic (ventana 7 d clic
en estas campañas). Fiable para optimizar **si la custom conversion acepta
eventos sin URL**. Hoy **no los acepta**.

`ctwa_clid` no lo captura Clinera (fuera de alcance del cambio del 26-ago).

SQL ya usa el mismo matching. Decisión 2026-08-13: se mandan **todos** los
SQL+ (también orgánicos) para modelado; el costo es atribución holgada.

---

## 9. Incoherencias extra (no del pedido, no ignorar)

1. **`AGENTS.md`** dice MQL valor “— (Meta) / US$10 (Google Ads)”. El “—” es
   el residuo del CAPI wizard a 0. El pedido de Ricardo es 10 también en Meta.
2. Comentario en `nodo-sqlplus-preparar-capi.js` todavía menciona
   `Schedule=20` (escala vieja). El código manda 300.
3. Custom MQL description habla de `/ventas`; el disparo vigente es
   `/agenda` `booking_confirmed`.
4. CAPI wizard y GA4 gemelo mandan `value: 0` / `price: 0` en
   `Preparar Tracking` y en el jsonBody. Hay que cambiar **los dos**.
5. Token CAPI real estuvo commiteado en `crm-sql-twenty.workflow.json`; el
   PR #205 lo reemplazó por placeholder. **Rotar** en Meta Business y
   actualizar env n8n, nodos inline, Vercel.
6. `SQL+` workflow se importó desactivado en agosto 13; confirmar en n8n
   que `rWZDSfi8RJ780q76` está **active** antes de crear la custom conversion
   (si está apagado, no va a haber eventos que asociar).
7. Google Ads: MQL wizard sí (feed CSV); MQL IA **no** escribe la 152.
   SQL/SQL+ sí marcan 152. Pedido de este análisis fue Meta, no Google.

---

## 10. Reparación propuesta (orden, para la IA que ejecute)

No optimizar contra conversaciones de WhatsApp. No unificar SQL y SQL+.
No POST al webhook Meet. No purgar git history sin orden.

### P0 — para que el algoritmo reciba MQL con valor

1. En Ads Manager, custom `1562704878613075` (MQL):
   - `default_conversion_value` → **10**
   - Quitar el AND de URL **o** ampliarlo para que un CAPI sin URL cuente
     (si se deja la URL, el MQL de WhatsApp no entrena nunca).
   - Actualizar descripción: “Agendó demo (wizard /agenda o agente IA)”.
2. En n8n vivo **y** en `clinera-agenda-reserva.workflow.json`:
   `custom_data.value` del CAPI MQL wizard **0 → 10**, y el `value`/`price`
   del gemelo GA4 en `Preparar Tracking`.
3. Chile **recién** activó `WEBSITE_AND_LEAD_FORM`. No es la causa de la
   basura previa (era wizard). Si el form se queda: (a) engancharlo al
   webhook Meta Leads que hoy no corre, (b) emitir un evento valorado a
   **5 USD** (custom `Lead` o evento propio, **distinto de MQL**), (c) no
   optimizar la campaña de MQL contra ese form. Si no se quiere ese pozo,
   volver destino a website only.

### P1 — SQL / SQL+ visibles y valorados

4. Custom SQL `1389593139704601`: quitar filtro URL (mismo motivo). Valor
   100 ya está.
5. Crear custom conversion **SQL_Plus** en el pixel: `event == SQL_Plus`,
   default **300**, **sin** filtro URL. Comprobar que `rWZDSfi8RJ780q76`
   está activo y que el `event_name` en el POST vivo es exactamente
   `SQL_Plus`.
6. No hace falta que las campañas *optimicen* SQL/SQL+ todavía. Sirven
   para value ladder y, si un día se usa Conversion Leads, para calidad.
   Conversion Leads nativo de Meta **solo** funciona con `leadgen_id` de
   Lead Ads, no con el wizard (`baserow/sales/HANDOFF.md` § señal negativa).

### P2 — WhatsApp en el anuncio (cuando lo activen)

7. Destino adicional WhatsApp **sin** cambiar `optimization_goal` ni la
   custom MQL.
8. No optimizar “conversaciones”. El MQL IA ya avisa al agendar; la custom
   tiene que aceptar eventos sin URL (P0.1) para que ese camino entrena.
9. `ctwa_clid`: item de producto, no de n8n.

### P3 — higiene

10. Rotar tokens pegados en chat (Graph user, n8n API, CAPI si es el mismo).
11. Archivar o ignorar custom `Demo Ready` / `Clinera.io/gracias` en
    reportes; no usarlas de optimización.
12. Geo: campaña Chile ≠ LATAM. Un booking CO salió con fbclid de campaña
    LATAM; no mezclar conjuntos.

---

## 11. Cómo re-verificar (la IA siguiente)

```
GET /{pixel}/stats?aggregation=event
GET /act_774716223970185/customconversions
  ?fields=id,name,default_conversion_value,rule,last_fired_time,pixel
GET /{campaign_id}/adsets
  ?fields=name,optimization_goal,destination_type,promoted_object
```

Pixel `1104567405156111`. Tras P0: custom MQL `default_conversion_value=10`,
regla sin URL (o URL opcional), CAPI wizard value 10, insights con
`action_values` no nulos en MQL.

Tras la primera cita IA post-P0: Events Manager debe mostrar MQL con
`lead_source=clinera_agente_ia` **y** la custom 1562704878613075 debe
incrementar `last_fired_time`. Si el evento crudo sube y la custom no,
la regla URL sigue matando el camino WhatsApp.

---

## 12. Fuera de alcance de este documento

- CTA WhatsApp en `/agenda` (el sitio no lo tiene; vive en el anuncio).
- Feed Google Ads para citas IA.
- Purge de historial git del token CAPI.
- Rotación de los 14 nodos n8n que aún llevan el CAPI inline
  (`baserow/sales/etiqueta-hot-y-capi.md`).
