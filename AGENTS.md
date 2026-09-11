<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mantén este archivo al día

Orden permanente de Ricardo (2026-08-19): **cuando aprendas algo significativo
trabajando en este repo, anótalo acá.** Significativo = lo que haría que el
próximo que abra el proyecto se equivoque si no lo sabe: una decisión de
negocio con un número detrás, un contrato entre sistemas, una trampa que ya
costó un error.

Dos reglas para que no se pudra:

1. **Punteros, no copias.** Las tablas y los valores viven en su fuente
   (`pricing.ts`, el README de `integrations/n8n/`, el código). Acá va qué
   existe, por qué, y dónde mirar. Duplicar tablas las desincroniza.
2. **El porqué antes que el qué.** El qué se lee del código; el porqué no.

# Economía de Clinera: créditos, costos y precios

Antes de tocar cualquier número de precio, crédito, consumo o equivalencia en
el sitio, lee esta sección completa. Los números están entrelazados: cambiar
una tarifa sin recalcular las equivalencias deja el sitio contradiciéndose a
sí mismo, que es exactamente el estado del que se salió en agosto 2026.

## Fuente única de verdad

`src/content/pricing.ts` es la fuente canónica de precios de planes y add-ons.
Alimenta `/planes`, `/cotizacion` y **la generación de contratos firmados** en
`src/lib/firma/cotizacion.ts`. Un número mal puesto ahí sale en un contrato,
no solo en una landing.

Las tarifas de consumo por crédito viven duplicadas en las dos calculadoras
(`src/components/cro/ConsumptionCalculator.tsx` y
`src/components/planes-pro/ConsumoCalculator.tsx`). Si cambias una, cambia la
otra.

## Un solo modo de agendamiento: Agentic

Clinera opera **exclusivamente en modo Agentic** sobre **Kimi K2.6**. Los modos
Eficiente y Agentic Pro se eliminaron en agosto 2026 y no deben reaparecer en
copy, FAQs, comparativas ni contenido nuevo.

Clinera **no se integra con agendas de terceros** (Reservo, AgendaPro, Medilink,
Dentalink, Sacmed). Opera sobre su propia agenda, fichas clínicas y módulo de
pagos; la migración de datos se hace en el onboarding. Sí existen y se venden
Webhooks + API pública hacia n8n, Make y Zapier (Atlas y Summit) — esa
capacidad no debe confundirse con integración de agenda.

## La unidad: qué es un crédito

> **1.000 créditos = US$ 1 de costo de modelo.** Es decir, **1 crédito = US$ 0,001**.

El crédito es una envoltura del costo real en OpenRouter, no una unidad
arbitraria. La cadena completa es:

```
tokens  ->  US$ (tarifa del modelo en OpenRouter)  ->  créditos (x 1.000)
```

Dicho al revés, que es como se lee más rápido: **la bolsa de créditos de un plan
es su presupuesto de gasto en OpenRouter, en milésimas de dólar.** Los 28.000
créditos de Vortex son US$ 28 de consumo real; los 46.000 de Summit, US$ 46.

> [!IMPORTANT]
> Equivalencia **confirmada por Ricardo (agosto 2026)**. Es además la única
> escala que hace cuadrar tres cosas a la vez: la política interna de COGS
> 10–20%, los volúmenes de tokens medidos (16,1M tokens por clínica/mes) y los
> precios de plan publicados. La alternativa de 1 crédito = US$ 1 daría un COGS
> de 10.000% y es inviable — si alguien la propone, está mal.
> Si algún día cambia la escala, **hay que recalcular toda esta sección** y las
> dos calculadoras.

## Costo real del modelo (OpenRouter, verificado agosto 2026)

`moonshotai/kimi-k2.6`:

| Concepto | USD / 1M tokens |
|---|---|
| Input | 0,600 |
| Output | 3,410 |
| Cache read | 0,200 |

**Costo efectivo: US$ 0,727 / 1M tokens**, asumiendo 42,9% de cache hit (medido
en el panel de OpenRouter) y un mix agéntico de ~90% input / ~10% output. El
input pesa tanto porque en cada turno se reenvían system prompt, definiciones
de tools e historial.

A esa tarifa, **1 crédito ≈ 1.376 tokens**.

Referencia de otros modelos con el mismo método (para comparar, no en uso):
Gemini 2.5 Flash US$ 0,416/1M (1,00x) · Gemini 3 Flash US$ 0,576/1M (1,39x) ·
Kimi K2.6 US$ 0,727/1M (1,75x).

## Tarifario de cara al cliente

| Concepto | Créditos | Costo interno | ≈ tokens Kimi |
|---|---|---|---|
| Conversación que **no** termina en cita | 30 | US$ 0,030 | 41.265 |
| Conversación que agenda, reagenda o cancela | 195 | US$ 0,195 | 268.226 |
| Minuto de voz (CAMILA) | 25 | US$ 0,025 | 34.388 |
| Fiscalización de LIA | 0 | — | — |
| Informes de LIA | 4.000 / mes | US$ 4,000 | 5.502.063 |

La tarifa de texto fue 10 cr hasta agosto 2026; ese número era la tarifa del
modo Eficiente y quedó obsoleto al pasar todo por el modelo agéntico. **Si ves
"10 créditos por conversación" en algún lado, es residuo — corrígelo a 30.**

## Planes y margen

| Producto | Créditos | Precio | Venta / crédito | Costo | COGS | Margen | Markup |
|---|---|---|---|---|---|---|---|
| Vortex | 28.000 | US$ 279 | 0,00996 | US$ 28,00 | 10,0% | 90,0% | 9,96x |
| Atlas | 37.000 | US$ 379 | 0,01024 | US$ 37,00 | 9,8% | 90,2% | 10,24x |
| Summit | 46.000 | US$ 479 | 0,01041 | US$ 46,00 | 9,6% | 90,4% | 10,41x |
| Recarga | 5.000 | US$ 15 | 0,00300 | US$ 5,00 | **33,3%** | 66,7% | **3,00x** |

Equivalencias de consumo por plan (créditos ÷ tarifa, **siempre redondeando
hacia abajo**), que deben mantenerse sincronizadas en `pricing.ts`, las
calculadoras, `planes-faq.ts`, `/planes-pro` y `public/llms*.txt`:

| Plan | Conversaciones | Agendamientos |
|---|---|---|
| Vortex | ~933 | ~143 |
| Atlas | ~1.233 | ~189 |
| Summit | ~1.533 | ~235 |

La recarga rinde ~166 conversaciones o ~25 agendamientos.

El piso es obligatorio porque las calculadoras recomiendan plan con la regla
`bolsa ≥ créditos necesarios`: un número redondeado hacia arriba (p. ej. los
~190/~236 que se publicaron hasta agosto 2026) no cabe en la bolsa y hace que
la calculadora recomiende el plan siguiente al valor exacto prometido.

## Política de COGS

El techo operativo interno es que **el costo de IA no supere el 10–20% del
valor del plan** (definido en el deck interno `/26mayo`, sección "Política de
límites"). Los tres planes cumplen holgadamente.

**La recarga de US$ 15 es la excepción y está fuera de política**: 33,3% de
COGS, más de 3x peor que los planes. Vende el crédito a US$ 0,003 cuando dentro
del plan vale US$ 0,010. Para alinearla al 10–20% el pack de 5.000 créditos
tendría que costar entre US$ 25 y US$ 50. Es una decisión comercial pendiente,
no un bug — pero si alguien pregunta por qué la recarga tiene mal margen, la
respuesta es esta.

## Implementación y estructura de pago

**Resuelto por Ricardo (agosto 2026): la implementación vale US$ 450** — el
valor de `SETUP_FEE_USD` en `pricing.ts`, el mismo que va a los contratos
firmados. El US$ 750 que existió en `/planes-pro`, FAQ, calculadoras y
`public/llms*.txt` era residuo y ya se corrigió; si reaparece, es un error.

**Actualizado 2026-09:** la web pública (`clinera.io`) muestra **sólo plan mensual**.
El primer cobro es implementación US$ 450 **más el primer mes** del plan; después,
el plan mes a mes. No hay semestral ni anual en la web: las dos viven en el
constructor de cotización (`cotizacion.oacg.cl`), donde la cotización es
privada. El catálogo también cobra la implementación salvo que el closer la
regale.

Así lo comunican las tarjetas de `<Pricing />` en home, `/planes` y `/planes-pro`:

- **Primer cobro:** implementación US$ 450 + primer mes del plan (Vortex 279 / Atlas 379 / Summit 479).
- **Después:** el plan se renueva mes a mes a precio de lista.

Usa `setupFeeFor(billing)` / `includesFreeSetup(billing)` — en catálogo ambos
devuelven 450 / false; no asumas implementación gratis.

**Discurso de cierre (sep 2026):** deck interno `public/presentacion-nuevo-discurso.html`
(`/nuevodiscurso`). La web no ofrece anual ni semestral. El closer regala la
implementación (100% hoy/mañana, 50% esta semana) con una excusa que vence.
Anual solo si el cliente lo pide, y ahí 10% o 20%. Hasta 200 clientes.
Guardián: `tests/nuevo-discurso.spec.ts`.

## `/ventas2026`: reunión interna de la campaña MQL

Deck interno (sep 2026) para el equipo comercial. Archivo
`public/presentacion-campana-mql.html`, URL corta `/ventas2026`. **Interno:**
`noindex`, `Disallow` en robots, fuera del sitemap y del menú. No es el deck
de ventas al dueño (`/presentacion`).

La campaña aprende **solo de MQL**. Camino obligatorio: Nuevo → MQL → SQL.
Nunca Nuevo → SQL: ese salto se ve eficiente y no enseña nada. Guardián:
`tests/ventas2026.spec.ts`.
## Modelo de venta en dos reuniones

Deck interno del equipo comercial: `public/presentacion-venta-2-reuniones.html`
(`/nueva-reunion`). No es el deck de ventas al dueño. Titulares grandes,
sin texto chico: se proyecta, no se lee. La URL corta es la que se le
manda al equipo.

El modelo viejo tiraba todo el software en una sola reunión y quemaba el
interés. El nuevo divide: **R1** es la reunión inicial de exploración
(2–3 funciones del dolor); **R2** es la reunión de cierre, idealmente con
el gerente de operaciones. El precio exacto **nunca** sale en R1 — solo el
rango Vortex–Summit (USD 279–479/mes, `pricing.ts`); la implementación se
detalla en R2.

**Por defecto todos van a dos reuniones.** Una sola solo si el cliente lo
pide expresamente. No se recorta por sucursal, ticket ni lead caliente:
esa excepción vieja hacía que se saltara la exploración. Guardián:
`tests/presentacion-venta-2-reuniones.spec.ts`.

## Programa partner: `/partners` (antes `/agencias`)

La URL pública del programa es **`/partners`**. `/agencias` redirige permanente
(308) ahí — no reabrir esa ruta ni volver a publicar el 15% de "descuento
permanente" de agencias: ese modelo se reemplazó en agosto 2026.

Números y copy viven en `src/content/partners-program.ts` El CTA «Aplicar al programa» ancla a `/partners#aplicar`: formulario de nombre + celular (MX/PE/CL/CO/UY/CR/PA) → `POST /api/partner-apply` → correo a Ricardo. (sep 2026): **bono
al cierre según modalidad** — US$ 150 mensual / US$ 400 anual (el anual sólo
via constructor de cotización, no en la web). **Sin pago mensual** al partner
(no hay comisión recurrente). **Sin descuento adicional** para la clínica referida.
Requisitos: perfil en redes orientado al trabajo; bio de Instagram con
`partner @clinera.io`; notebook o tablet para presentar en clínicas. Apoyo:
equipo comercial para cerrar + acceso al CRM. No confundir con el 15% permanente
de agencias (muerto) ni con el modelo viejo de US$ 150 fijo + 10% × 3 meses al
referido (retirado). La landing
(`src/app/partners/page.tsx` + `src/components/partners/PartnersLanding.tsx`)
los consume. El deck `public/presentacion-partners/index.html` no puede
importar TS: si cambian bonos, requisitos o apoyo, hay que tocar esas slides a
mano. `/presentacion-agencia` redirige a ese deck (el archivo viejo quedó
huérfano: no lo actualices pensando que es el vigente).

`public/reseller.html` es un "Programa Reseller" viejo y huérfano (50% de
comisión + 10% de descuento) que **no** está enlazado desde `/partners` ni
desde ningún componente en `src/` — no es el programa vigente, no lo revivas.

Las microlandings individuales (`/partner/{vanity}`, p.ej. `/partner/km`) son
otra cosa: páginas de referido, no el programa. Viven en `src/lib/partners.ts`
+ `src/components/partner/`. Ya **no** publican el 10% × 3 meses: el titular es
la recomendación del partner + CTA a reunión.

# Embudo de Meta Y Google Ads: qué evento vale cuánto, y dónde vive de verdad

> [!WARNING]
> **Leer solo este repo lleva a conclusiones falsas.** De los tres workflows
> que mandan conversiones al pixel `1104567405156111`, **dos no están
> versionados acá**. En agosto de 2026 se diseñó un cambio entero sobre la
> premisa —falsa— de que SQL+ no generaba ninguna señal, porque el repo no lo
> mostraba. Antes de tocar el embudo, mira la instancia de n8n.
>
> Handoff para auditar el embudo del **2026-09-10** (sin PQL; Nuevo $0;
> MQL $10 cuando el closer verifica que es real; campañas deben optimizar
> `MQL`, no `SQL`): `docs/handoff-embudo-etapas-2026-09-10.md`.
> Fiscalización de ese handoff (D1–D8 y D10 OK; D9 resuelto por Graph API
> el 10-sep 18:48Z): `docs/fiscalizacion-embudo-etapas-2026-09-10.md`.
> Handoff para fiscalizar el bloque de la tarde del 10-sep (relleno de
> etapas en W1, evento MQL en Ads, aviso al equipo):
> `docs/handoff-fiscalizacion-embudo-2026-09-10-tarde.md`.
> Auditoría del **2026-09-09** (Conversion Leads, W1 cruzado, BM del pixel):
> `docs/auditoria-meta-eventos-2026-09-09.md`. Handoff para auditar si
> el PUT y el repo quedaron bien:
> `docs/handoff-auditoria-embudo-meta-2026-09-09.md`. Handoff para
> fiscalizar el bloque de la tarde (aplicaciones a n8n, Twenty, prueba
> funcional, cronología con el incidente de las 19:48Z):
> `docs/handoff-fiscalizacion-embudo-meta-2026-09-09-tarde.md`. La del 26-ago quedó superada
> en §1, §3, §4 y §10-P1; se conserva como foto de ese día.
> Embudo CRM→CAPI: workflow `W1SybZZSEZqAItIt`. El mapeo canónico
> (Ricardo, 10-sep) vive en
> `integrations/n8n/crm-etapas-meta-capi.mapeo.js`: Nuevo $0 · MQL $10 ·
> SQL $100 · HOT $200 · Customer = valor del plan · NQL $0 (no responde).
> Sin PQL, SCREENING, NoContesta ni `Lead`. W1 se reaplicó el 2026-09-10.
> Formulario = `Nuevo` US$ 0. MQL US$ 10 = el closer verifica que es real.
> Las campañas activas deben optimizar el evento `MQL`, no `SQL`.
>
> **El MQL lo declara el closer** al verificar que el lead es real
> (paso anterior a SQL). Rellenar el formulario es `Nuevo` US$ 0, no MQL.
> W1 vivo (desde el 7-sep 21:17Z) cruzaba `PQL` → CAPI `MQL` US$ 10
> («no contesta»). El PUT del 09-sep ya no lo hace; el del 10-sep
> tampoco emite PQL. Las campañas activas deben optimizar el evento
> `MQL` (no `SQL`). Un pixel nuevo con el W1 viejo lo repite
> (`Obsoleto`, `Obsoleto2`).
>
> Pixel de producción `1104567405156111` (`[2026] OACG TECH`) pertenece al
> BM **Método Hebe** `1162184321174513`, no a Metricads Marketing. La
> cuenta que gasta (`act_774716223970185`) sí es de Metricads. El dataset
> `Clinera.io` `1410371181304151` ya existe (0 eventos); no crear otro.
>
> Instant Form de Chile se activó el **26-ago noche**. Hasta entonces las
> campañas iban 100 % a `clinera.io/agenda`. La basura histórica (abandono
> en paso 2, `size_captured` sin contacto) es del wizard, no de Lead Ads.
>
> **Intake Instant Form:** el HUB `qOGjfU1AgubcOHvt` (`/webhook/meta-leadads`)
> enruta el page_id Clinera `697874326752777` a Sub A `YmauqyDqrZNKIYlg`.
> Ese sub crea contacto en Clinera (funnel 890), fila Baserow 152, negocio
> Twenty. El nodo `Meta CAPI - Lead` de Sub A se apagó el 2026-09-10:
> el alta emite `Nuevo` US$ 0 por W1, no `Lead` US$ 5. Spec:
> `baserow/openspec/changes/lanzamiento-instant-forms-embudo/`. En anuncios
> no prometer CAMILA/LIA. Graph del form en español usa `correo_electrónico`
> / `nombre_y_apellidos` / `número_de_teléfono` (no los nombres en inglés) —
> el mapeo vive en `baserow/sales/n8n/leadgen-preparar.js`.
>
> **Por qué el HUB está en 0 ejecuciones (2026-08-27):** no es n8n. Un `GET`
> pelado a `/webhook/meta-leadads` devuelve **403**, y eso se leyó como «n8n
> rebota a Meta» — falso, y costó medio día. Un GET sin `hub.verify_token` a un
> webhook de verificación de Meta *tiene* que dar 403; con el token bueno
> devuelve el challenge, y el POST (lo que Meta usa para entregar) siempre dio
> 200. El HUB está completo y no hay que tocarlo.
>
> **Y después falló un segundo diagnóstico, por la misma clase de error.**
> `GET /697874326752777/subscribed_apps` devolvió `{"data":[]}` y se concluyó
> «ningún app suscrito a la página». Falso: esa respuesta está **acotada al app
> dueño del token**, y se preguntó con el de un conector. Con un token del app
> de n8n (`1239051817789232`) las tres páginas —Clinera, Hebe y Lumina—
> aparecen suscritas con `leadgen`. Un `[]` de un token ajeno no es un
> diagnóstico; `verificar_hub_meta.py` ahora se niega a responder si el token
> no es del app auditado.
>
> **Lo que sigue roto (27-ago):** con la suscripción puesta y el webhook sano,
> Meta igual no entrega. De los 6 leads del día, los 6 llegaron al CRM porque
> se inyectaron a mano. El corte está en la otra mitad, la que
> `subscribed_apps` no ve: el **callback a nivel de app** (App Dashboard →
> Webhooks → objeto «Página»). Detalle en `baserow/sales/HANDOFF.md` §27.

| Evento | Cuándo | Valor | Dónde vive |
|---|---|---|---|
| `Nuevo` | rellenó el formulario (Instant Form o alta) | US$ 0 | W1 (`NEW`); Sub A ya no manda `Lead` |
| `MQL` | closer verifica que el lead es **real** (paso anterior a SQL) | US$ 10 | W1 si el stage es `MQL`. Campañas activas optimizan este evento |
| `SQL` | closer → SQL (`MEETING`): **la videollamada se realizó**. Agendar no es SQL; asistir sí | US$ 100 | W1 |
| `HOT` | closer → HOT (`PROPOSAL`): a punto de cerrar | US$ 200 | W1 |
| `NQL` | closer → no responde | US$ 0 | W1 |
| `Purchase` | Customer | valor del plan | W1 (`planClinera`) |

> [!WARNING]
> **Las demos que Camila agenda por teléfono NO emitían MQL hasta el
> 2026-08-30.** Reservaban en **Cal.com**, cuyo webhook manda `Schedule` —que no
> es peldaño del embudo— y desde el 16-ago dejó de escribir en el CRM: el
> negocio se quedaba en `Nuevo`, sin fecha ni enlace. Hoy Camila entra por el
> mismo webhook que `/agenda` (`clinera-meet`) y emite el MQL como todos.
> Causa raíz con el log de n8n, contratos y el riesgo asumido:
> `baserow/sales/HANDOFF.md` §28 y `baserow/CLAUDE.md`, sección «Camila agenda
> en Google Calendar».

### CRM Twenty → Meta CAPI (workflow unificado, sep-2026)

Workflow vivo: **`W1SybZZSEZqAItIt`** (*Clinera \| Twenty etapas → Meta CAPI*;
activo desde el 2026-09-07 21:17Z; mapeo sin PQL aplicado el 2026-09-10),
webhook `POST …/webhook/crm-sql`, suscrito en Twenty a `*.*` (incluye
`opportunity.updated` sin filtro de stage). Los viejos `dhwqS9oW3qfvq6Y4`
(SQL) y `rWZDSfi8RJ780q76` (`SQL_Plus`) están **apagados**. `SQL_Plus`
ya no se emite.

**Campañas (10-sep, verificado por Marketing API vía MCP):** las tres del
7-sep (SQL 🇨🇱 `120247984833660218`, SQL 🇲🇽 `120247986964290218`,
Remarketing SQL `120247987023130218`) están **archivadas**: dos se borraron
el 09-sep 15:08 (-03) y la última el 10-sep 13:01 (-03). Las activas son
**MQL 🇨🇱 `120248035606070218`** y **MQL 🇲🇽 `120248035556840218`**
(creadas el 10-sep 12:59–13:00 -03, tres conjuntos cada una, `QUALITY_LEAD`
sobre el pixel `1104567405156111`, `promoted_object.custom_event_type:
OTHER`). El MCP de Meta **no devuelve** el nombre del evento custom; por
Graph API con token de usuario (`GET /act_774716223970185/adsets?fields=
promoted_object,attribution_spec`) los 6 conjuntos tienen
`custom_event_str: "MQL"`, `ads_signal_source_type: capi_crm`, `page_id
697874326752777` (verificado el 10-sep 18:48Z): optimizan el **evento `MQL`
del CRM**, no la custom conversion «MQL» `1562704878613075` (default 0,
filtro URL `clinera.io`, de las campañas pausadas) ni la custom «SQL»
`1389593139704601`. **Ventana de atribución: 1 día clic** en los 6: un MQL
que el closer declara después de ese día no se le atribuye a la campaña
(decisión pendiente de Ricardo: 7 días clic). Fiscalización:
`docs/fiscalizacion-embudo-etapas-2026-09-10.md`.

Mapeo canónico `stage` → evento CAPI → value USD (`currency: USD`).
Fuente: `integrations/n8n/crm-etapas-meta-capi.mapeo.js`. Aplicado al vivo
el 2026-09-10. El cruce SCREENING↔PQL (H1) y la tabla Nuevo 0 / PQL 1 /
MQL 5 / SQL 10 / HOT 100 son históricos (09-sep). El 10-sep se borró
`PQL`: las filas «no contesta» pasaron a `NQL` **antes** de quitar la
opción. **Al editar opciones de un SELECT en Twenty, conservá el `id`
de cada opción:** el 09-sep 19:48Z se perdió el id de `MQL` y 130
negocios cayeron a `NEW`. `MEETING`/`PROPOSAL` siguen siendo los
valores internos de SQL/HOT. `NQL` = no responde, $0.

| stage | event_name | value | condición |
|---|---|---|---|
| `NEW` | `Nuevo` | 0 | rellenó el formulario; también si lo escribió n8n (`API`) |
| `MQL` | `MQL` | 10 | closer verifica que es real |
| `MEETING` | `SQL` | 100 | alias `SQL` — calificado (la demo ocurrió) |
| `PROPOSAL` | `HOT` | 200 | alias `HOT` — a punto de cerrar |
| `NQL` | `NQL` | 0 | no responde |
| `CUSTOMER` | `Purchase` | `planClinera`: VORTEX 279 / ATLAS 379 / SUMMIT 479; vacío → 279 | |
| `PQL` / `SCREENING` / `SQL_Plus` | — | — | no emiten |

`event_id` = `{opportunityId}_{stage}`. `user_data.lead_id` = `leadgenId` (entero,
sin hash) si existe. `action_source` = `system_generated`. Detalle:
`integrations/n8n/README.md` y `baserow/sales/etiqueta-hot-y-capi.md`.

**Un estado implica los anteriores (Ricardo, 10-sep): un lead en SQL fue MQL
sí o sí.** Las campañas optimizan `MQL`; si el closer pasa un negocio de
Nuevo a SQL sin pasar por MQL, Meta nunca recibe el MQL y ese lead no le
enseña nada a la campaña (la columna «Clientes potenciales cualificados»
cuenta los leads que llegan a la etapa optimizada). Por eso W1 **rellena la
escalera** `MQL < SQL < HOT < Purchase`: antes de mandar la etapa actual
emite, como ítems separados y un segundo aparte, las anteriores que no
consten en el ledger para ese negocio (a cualquier fecha, no solo 28 días).
`Nuevo` y `NQL` no son peldaños y no se rellenan. Los nodos de abajo no
cambian: «Confirmar y auditar» empareja por índice y escribe una entrada de
ledger por ítem. La regla operativa sigue siendo pasar por MQL en la UI: el
relleno cubre el salto en Meta, no el historial del CRM. **Aplicado al vivo
el 10-sep 18:50Z** con `aplicar_w1_mapeo.py --aplicar` (el simulacro dice
«Ya estaba aplicado»); la guarda del aplicador exige los literales
`payload: payload` y `ledgerKey: ledgerKey` en el archivo. Guardián: bloque
«Nuevo → SQL directo» de `tests/crm-etapas-meta-capi.spec.ts`.

**El jsCode de W1 tiene un contrato de salida con los nodos de abajo, y ya
se rompió una vez.** «Corresponde enviar?» lee `omitido`, «Enviar evento a
Meta CAPI» manda `JSON.stringify($json.payload)`, «Confirmar y auditar» lee
`ledgerKey` y escribe el ledger sólo si Meta confirma. El PUT del 09-sep
16:38Z pegó un jsCode que devolvía `ok` + `event_name` sin `payload` ni
`omitido`: las ejecuciones salían en verde en n8n, pero el HTTP fallaba con
«JSON Body is not valid JSON» y `events_received: 0`. W1 no mandó nada a
Meta hasta el arreglo (aplicado el 09-sep 19:44Z; prueba funcional
`Nuevo` 0 → `events_received: 1`). Verificar «aplicado» mirando
`events_received` en una ejecución real, no el nombre ni el `active`. El
bloque «nodo completo» de `tests/crm-etapas-meta-capi.spec.ts` corre el
jsCode entero con stubs. Segunda trampa del mismo workflow: el IF
«Corresponde enviar?» es v2 y con parámetros v1 no filtra nada
(`aplicar_w1_filtro.py`, H9).

**Desde el 2026-08-21, Google Ads recibe el mismo embudo** — no por CAPI,
sino porque los workflows de SQL/HOT marcan Baserow 152 y un feed en
`baserow` (`sales/n8n/gads-conversiones-sql-csv.js`) se lo sirve a Google
Ads Data Manager por HTTPS. Los montos canónicos desde el 09-sep tarde
son Nuevo 0 / MQL 10 / SQL 100 / HOT 200 / NQL 0. El feed de GAds
usa SQL 100 y el alias `SQL+` = HOT 200. Detalle en
`baserow/sales/HANDOFF.md`.

Ids, disparos y el detalle completo: `integrations/n8n/README.md`.

# tech.oacg.cl/movimiento: dónde se registra una venta de Stripe (y por qué puede no aparecer)

`/movimiento` de tech.oacg.cl **no vive en este repo**: es la tabla **940** de
Baserow (base 97) y el panel está en el repo `baserow` (`tech/index.html`,
`GMOV`). La fila la crea n8n, workflow **`7jgtp669q8pWJKm6`** («OACG TECH |
Suscripción (Stripe)», evento `customer.subscription.created`), que además
escribe Ventas (156) y Activación (957) y avisa por Telegram y Google Chat.
Export, jsCode canónicos y aplicador en vivo:
`baserow/n8n/suscripcion-stripe*.{json,js}` y
`baserow/scripts/aplicar_suscripcion_por_empresa_en_vivo.py`; el porqué en
`baserow/n8n/README.md`. Ni `/firma` ni nada de acá le avisa a ese tablero:
todo entra por el webhook de Stripe.

**Lo que costó una venta (ERNESTO, 9-sep-2026, Vortex 279 + Marketing 250 =
US$529):** con dos o más productos en una suscripción Stripe manda `plan: null`,
y el nodo de producto hacía `plan.product` → la ejecución moría antes de
escribir nada y sin aviso. Desde el 10-sep el workflow recorre todos los ítems
y Movimiento recibe **una fila por empresa** (`clinera` / `metricads`): un
cliente con Clinera + Marketing son dos clientes, uno por empresa (Ricardo).

Ojo con este repo: el checkout de `/firma` (`src/lib/firma/stripe.ts`) arma la
suscripción con `price_data` y **varias líneas** (plan + usuarios extra + packs),
o sea también multi-ítem. Sus nombres («Plan Summit · Clinera», «Usuario
adicional · Clinera», «Pack de créditos IA · Clinera») se clasifican Clinera por
nombre; si algún día se vende otra empresa por ahí, que el nombre diga
«Marketing»/«MetricAds» o que el producto lleve `metadata.empresa` en Stripe.

# `/reserva-tu-hora`: el destino del Instant Form, solo calendario

Creada el 27-ago-2026. Es la URL que el Instant Form de Meta abre sola al
enviarse (destino «Reservar cita» → enlace personalizado). **Antes apuntaba a
`/demo`, que es una página de video sin calendario**: el lead completaba el
formulario y no tenía dónde agendar — el embudo se cortaba ahí.

- **No duplica el calendario**: importa `StepClineraScheduler` de
  `VentasLanding.tsx`, igual que `/agenda`. Sus piezas internas (BackBtn,
  reparto determinista de profesional, doble hora local/Chile) no están
  exportadas; copiar el JSX sería mantener dos calendarios que se
  desincronizan.
- **Dos modos, y el segundo no es raro**: Meta no garantiza prellenar un enlace
  «Personalizado» (sí lo hace con Calendly/HubSpot). Con
  `?nombre=&email=&telefono=` va directo al calendario; sin ellos pide esos tres
  campos, que el webhook del turno necesita sí o sí.
- **`leadgen_id` decide si se da de alta el lead.** Con él, el lead YA existe
  (lo creó n8n al recibir el formulario) y esta página sólo agrega la reserva:
  volver a darlo de alta sería una segunda llamada de la IA al mismo teléfono.
  Sin él, la página lo crea. Ese id viaja en el payload hasta el campo
  `leadgenId` del negocio en Twenty, que es lo que habilita Conversion Leads.
- Al confirmar la hora sale el **`MQL` US$ 10**, el mismo que `/agenda`: el lead
  de formulario gana su MQL agendando, no por cambiar de etapa en el CRM.
- `noindex` en tres capas (metadata, `robots.ts`, fuera del sitemap): es un paso
  de un anuncio, no contenido, y no debe competir con `/agenda`.
- Para que la atribución no salga `organico`, la URL del anuncio debe llevar
  `?lead_source=meta-ads` — `clasificarLeadSource()` le da prioridad a la query,
  y un Instant Form no deja `fbclid`.
- **WhatsApp por país:** la validación vive en `src/lib/telefono.ts` (CL = 9
  dígitos `9XXXXXXXX`; MX/CO = 10; etc.). Si pegan `+56`/`56` se normaliza al
  local; el webhook recibe E.164. No reaplicar la regla de Chile a todos.

Guardián: `tests/reserva-tu-hora.spec.ts` + `tests/telefono.spec.ts`.

# `/agenda`: layout Hebe, agendador de siempre

La página canónica es `AgendaHebeLanding` (50/50, carousel, 5 pasos). El
calendario **no** es Cal.com: reusa `StepClineraScheduler` de
`VentasLanding.tsx` (nativo primero, embed de `app.clinera.io` de respaldo).
`/ventas` sigue con el wizard anterior. `/agenda-hebe` redirige a `/agenda`.

El aviso de Google Chat y Twenty los arma `OACG TECH | Wizard` (`A3wOPmhQjit8VswM`)
en n8n: en `/agenda` ya no se anuncia «Software actual». Van necesidad, cargo,
web/redes, volumen y clínica (ciudad se dejó de pedir en el paso 3 — el
webhook sigue mandando `ciudad: ""`). El botón «Agenda con tu ingeniero» abre
el calendario **sin esperar** el webhook — si se vuelve a `await`, se pierden leads.

# `/agenda`: la hora que se guarda es de Chile, siempre

El último paso de `/agenda` (`StepClineraNativo` en
`src/components/ventas/VentasLanding.tsx`) recibe los bloques de la API de
Clinera como texto plano en **hora de Chile** (`"10:00"`), sin zona.

- **Lo que se muestra** es la hora **local de la IP** (`x-vercel-ip-timezone`
  de Vercel), no el reloj del sistema. Un dueño en México con la laptop en
  hora Chile veía "10:00" y creía que era su 10:00. Si el offset no es el de
  Chile, cada bloque muestra las dos: `14:00` tu hora + `17:00 Chile`.
- **Lo que se manda al webhook no se toca**: sigue siendo la hora de Chile.
  Clinera, el turno y el Meet dependen de eso.
- **El offset de Chile sale de `Intl`, nunca de una constante.** Chile pasa a
  GMT−3 el primer domingo de septiembre; un número escrito a mano empieza a
  mentir ese día sin que nadie se entere.

El profesional tampoco lo elige el visitante: se reparte según disponibilidad,
de forma **determinista**. Nada de `Math.random()` ahí — el cálculo corre en un
`useMemo` que se recalcula varias veces, y el azar le cambiaría el profesional
al lead entre que elige la hora y confirma.

**No ofrecer el día UTC en curso.** La API arma esa grilla desde la hora
actual, no desde el horario de atención: de día faltan horas y de noche
aparecen madrugadas (`01:45`, `02:45`…). El picker ya partía en "mañana", pero
"mañana" del visitante (o de Chile) **sigue siendo hoy en UTC después de las
20:00 Chile**. Hay que saltar los dos calendarios (`diasCandidatosAgenda`) y
filtrar bloques fuera de oficina (`esBloqueHabil`).

Guardián: `tests/agenda-scheduler.spec.ts`.

# `/vision-2027`: deck interno de la tesis (septiembre 2026)

Ruta Next en `src/app/vision-2027/`. **Interna:** `noindex, nofollow`, fuera del
sitemap y de la navegación pública, `Disallow` en `robots-txt.ts`. No enlazarla
desde el menú. Light, Outfit + JetBrains Mono, un solo uso del gradiente de
marca por slide. Contenido fijado por el brief de Ricardo: no inventar cifras
ni funciones. Anexo de producto (no es el deck):
`/internal/mi-clinera/especificacion` y `/internal/mi-clinera/mockup`.
Guardián: `tests/vision-2027.spec.ts`.

# `/presentacion`: archivo estático, no componente — rediseño Rebeca (ago 2026)

`/presentacion` (el deck de ventas) no es una ruta de Next.js: `next.config.ts` reescribe
`/presentacion` → `/presentacion/index.html`, un único archivo HTML/CSS/JS en
`public/presentacion/index.html`. No hay componente React que tocar ahí.

**Rediseño comercial (Rebeca → gerencia, 27-ago-2026):** el hero abre con
métricas de impacto en fondo oscuro, **sin** la franja «Clínicas que ya operan
con Clinera»; se borraron `#veredicto` y `#herramientas`; no se prometen
cobros/conciliación/exámenes; la migración habla de «7 días de Red de
Seguridad». Fuente: correo de Rebeca con
`Analisis_Presentacion_Clinera_Gerencia.pdf`. `#canales` y `#empleados-digitales`
se mantienen (guardians propios). Guardián del rediseño:
`tests/presentacion-redisenio-rebeca.spec.ts`.

**Quiénes somos antes del producto (Ricardo, sep 2026):** justo después del
hero van `#origen` («Cómo nació Clinera») y `#por-que-clinera` («¿Por qué
Clinera y no otro software?»); AURA es la **4.ª** diapositiva. El orden es
quiénes somos y por qué nosotros → producto. Las cuatro razones salen de la
tarea Todoist de optimizar esa pregunta. Hechos citables de la historia:
Metricads/agencia 2017, Método Hebe y Protocolo Lumina (tres sedes), lanzamiento
octubre 2025 — **nada de cifras nuevas**. No nombrar competidores ni Open
Factura. Guardián: `tests/presentacion-por-que-clinera.spec.ts`.

**Tope de 12 diapos (sep 2026):** al sumar origen + por-qué se retiró
`#la-fuga` — el hero ya lleva las mismas cifras (20 %, US$ 1.500, 300 leads /
60 que se escapan). No reponer esa diapo sin sacar otra. Orden canónico:
`clinera` → `origen` → `por-que-clinera` → `aura` → `intelligence` →
`inteligencia` → `inteligencia-deudas` → `inteligencia-profesionales` →
`empleados-digitales` → `canales` → `normativa` → `migracion`.

**Clinera Intelligence (sep 2026):** el WOW del deck ya **no** es el QR
«Prueba tú mismo» (`#demostracion` eliminado). Son **3 diapos** seguidas
(`#inteligencia`, `#inteligencia-deudas`, `#inteligencia-profesionales`) con
pregunta en español + gráfico de respuesta: ventas por tratamiento, top 5
deudores, top 5 profesionales. Guardián:
`tests/presentacion-intelligence.spec.ts`.

**1 cuenta Clinera = 1 número de WhatsApp, 1 cuenta de Instagram y 1 cuenta de Facebook.**
Es el recorte comercial de canales, no un detalle de onboarding. Si la clínica opera con
más de un número o más de un perfil, son más cuentas (y más planes). Vive en la
diapositiva `#canales` de ese HTML. No diluirlo en un bullet de AURA: tiene slide propio
porque en la demo se asume mal. Guardián: `tests/presentacion-canales.spec.ts`.

**CAMILA y LIA en el deck:** próximamente octubre 2026. AURA es la disponible
hoy. El lead de `#empleados-digitales` no puede volver a decir "Disponibles hoy"
sobre las tres. Visualmente AURA es la tarjeta protagonista (`.ed-agent-now`);
CAMILA y LIA van apagadas (`.ed-agent-soon`, foto en gris). No dejar las tres
al mismo peso: en la demo se lee como que las tres se contratan hoy.
Guardián: `tests/presentacion-empleados.spec.ts`.

**Próximas funciones.** Catálogo en `src/content/proximas-funciones.ts`.
Anunciadas en blog + `llms*.txt` (agosto 2026), **no en `/presentacion`**:
Open Factura (DTE Chile, emisor — no ERP), odontograma y presupuestador,
Instagram Direct + Messenger, email marketing, trigger de cumpleaños.
Fuente pública: `/blog/proximas-funciones-clinera-dte-odontograma-instagram`
(hub) + un artículo por función en `POSTS_POR_FUNCION`
(`src/content/proximas-funciones.ts`). Siguen inéditas: inventario y
liquidaciones de sueldos (Clinera, diciembre 2026).
El deck no debe mencionar Open Factura. Guardián: `tests/proximas-funciones.spec.ts`.

**Citar marcas con link.** En copy público (blog, landings, llms), la primera
mención de un competidor o emisor lleva al sitio oficial y, si existe, a
`/comparativas/{slug}`. El posicionamiento AEO/SEO sale de asociar entidades
(Dentalink, Dentalsoft, Reservo, AgendaPro, SII, Meta), no de dejar el nombre
en texto plano.

La franja "Clínicas que ya operan con Clinera" **salió del deck** en el rediseño
Rebeca (ago 2026): el hero ahora abre con métricas, no con logos. Los archivos
siguen en `public/presentacion/clientes/*.{png,svg}` por si otra landing los usa.
Las otras dos listas de logos **no se sincronizan** entre sí y siguen vigentes:
- `src/components/plataforma/PlataformaLanding.tsx` (`CLIENTS`, para `/plataforma`):
  sólo 6, le falta CLC.
- `src/components/home-v3/sections.tsx` (`Logos()`, para `/`): nombres de clínicas
  **inventados** ("Hospital del Valle", "Dermaclinic"...), no son clientes reales.

# Landings `/software-medico` y `/software-dental`

Dueñas de los clusters de Google Ads "Softwares" (software médico / software
dental). Esqueleto compartido en `src/components/software-vertical/`; el copy
vive solo en `content.ts`. CTA canónico: `/agenda` **preservando la query**
(`Nav`, sticky móvil y CTAs internos): la query sigue mandando sobre todo lo
demás en `clasificarLeadSource()`, así que perderla degrada la atribución aunque
ya no la borre (ver abajo).
`lead_source` de GTM: `software_medico_landing` / `software_dental_landing`.
El wizard de `/agenda` no tiene opción "Dental" a propósito.

**Identidad AEO:** marca = Clinera, producto = Clinera O.S. Fuente:
`src/content/entidad.ts` (frase de entidad, mercados, sameAs, founder).
Organization y SoftwareApplication salen de `orgSchema` / `softwareSchema`
en `src/components/seo/schemas.ts`. **No duplicar JSON-LD en `src/app/page.tsx`**
con precios o nombres distintos: el `lowPrice: 129` / `Clinera Intelligence`
de septiembre 2026 era exactamente eso. No usar "Clinera Intelligence" como
nombre de entidad (homónimo clinera.ai). Mercados: 9, lista en `MARKETS`.
`lastmod` del sitemap: `src/content/page-dates.ts`, no `new Date()` de build.

# De dónde viene el lead: la regla vive en UNA función pura

`clasificarLeadSource()` (`VentasLanding.tsx`) decide entre `google-ads`,
`meta-ads` y `organico`; `detectLeadSource()` solo junta las señales. El orden
es la regla y está explicado ahí mismo, pero lo que hay que saber antes de
tocarlo es **por qué el identificador de click va antes que el `utm`**: un `utm`
lo escribe cualquiera, un `gclid` lo pone Google al hacer clic.

Dos cosas que costaron leads pagados contados como orgánicos, corregidas en
agosto 2026 y que no deben volver:

- **`gbraid` / `wbraid` son identificadores de click de Google**, los de
  YouTube/Demand Gen e iOS, donde no viene `gclid`. `gclid.ts` los guardaba y
  viajaban en el payload desde siempre; la clasificación no los miraba.
- **La segunda página.** Quien entra por un anuncio a `/planes` y llega a
  `/agenda` por el menú ya no trae query. El identificador sigue en la cookie
  `_clinera_gclid` (90 días) y en el sessionStorage de `metaIds.ts`, así que hoy
  se leen de ahí como respaldo — el lead ya no sale `organico` con su propio
  `gclid` al lado en el mismo webhook.

La cookie `_fbp` **no** es señal de origen: la tiene todo visitante que cargue
el Pixel. Guardián: `tests/lead-source.spec.ts`.

Ojo con el alcance: **el `Origen` que se ve en Baserow 152 y en Twenty NO sale
de acá**, sale de `classifyOrigin()` dentro del nodo "Prepare Sales Lead Data"
del workflow `OACG TECH | Wizard` (`A3wOPmhQjit8VswM`), que no vive en este
repo. Ese nodo lee el `lead_source` que le manda el sitio, pero sólo después de
sus propias reglas. El reemplazo revisado está en el repo `baserow`
(`sales/n8n/wizard-classify-origin.js`).

# Vista de Negocios en Twenty: el teléfono no sale de la Persona

La tabla de Opportunities **no puede** mostrar el teléfono de
`pointOfContact` como columna: vive en otro objeto. Por eso el negocio
tiene el campo denormalizado `telefonoContacto` (tipo PHONES, label
«Teléfono del contacto»), pegado al contacto en «Todas las oportunidades».
n8n lo copia al crear o refrescar el lead (Sub A, Wizard y Meet). El SQL
de Meta sigue hasheando el número desde la Persona, no desde esta columna.
Aplicador: `integrations/n8n/aplicar_telefono_contacto.py`.

# El wizard manda VARIOS webhooks por lead, no uno

`/agenda` postea al mismo webhook de n8n (`088a2cfe-…`) hasta tres veces con el
mismo correo, y cada uno es una etapa distinta del wizard:

| Cuándo | `lead_stage` | `booking_status` | Qué trae de nuevo |
|---|---|---|---|
| Paso 2, si califica | `size_captured` | `pending` | tamaño; **sin contacto** |
| Paso 3, al enviar | `contact` | `pending` | nombre, correo, teléfono, clínica |
| Al confirmar la hora | `booking_confirmed` | `confirmed` | `cal_date`, `cal_organizer_name` |

El primero no lleva correo y n8n lo descarta en su nodo "Tiene contacto?". Los
otros dos entran los dos, así que **el segundo encuentra la fila que creó el
primero un minuto antes**: eso NO es un lead recurrente, es el mismo lead
terminando de agendar. Hasta agosto 2026 cada uno producía su propio aviso de
Google Chat —y el segundo anunciaba «lead recurrente»—; desde entonces n8n corta
el envío de la reserva y manda **un solo aviso**, después de esperar y releer la
ficha (ver el repo `baserow`, `sales/n8n/recablear_aviso_unico.py`).

Si cambiás las claves `lead_stage` / `booking_status`, ese corte deja de
funcionar y los avisos vuelven a duplicarse sin ningún error visible.

**Lead que vuelve a completar `/agenda` (Ricardo, 09-sep-2026):** el nodo
«Twenty - Crear Lead» del Wizard encuentra el negocio abierto del contacto
y lo refresca. Además de `horaRegistro` nuevo (sube a «Leads del día»),
le agrega la etiqueta `VOLVIO_A_COTIZAR` («Volvió a cotizar», opción del
multi-select `etiquetas` de Twenty) sin pisar las que tenía, y la nota de
la columna dice «🔁 Volvió a cotizar». **La etapa no se toca**: un PQL o
NQL que vuelve a cotizar sigue en su etapa, sólo con la etiqueta. Todo eso
va dentro del guard `booking_status !== 'confirmed'`, porque el
`booking_confirmed` del mismo lead entra por la misma rama un minuto
después del `contact` y no es un lead que volvió. Aplicador:
`integrations/n8n/aplicar_wizard_volvio_a_cotizar.py`; la fuente canónica
del Wizard sigue en el repo `baserow`.

# Pack AEO agosto 2026 — punteros post-migración

Decisiones consolidadas en la rama `feat/aeo-fase1-contenido` (agosto 2026):

- **Stack IA (desde 01-08-2026):** GLM 5.2, Gemini 3.7 Flash, Claude Opus 4.8 y
  Claude Sonnet 5 vía Vertex AI (Google Cloud). Nombres y orden canónicos:
  `src/content/ia-stack.ts`. OpenRouter y Kimi K2.6 son residuo — solo aparecen
  en `/blog/efectividad` como nota histórica del estudio publicado.
- **Datos clínicos:** GCP región Santiago (`southamerica-west1`). Los datos
  residen en Chile (Ley 21.719).
- **CAMILA y LIA:** en el sitio público siguen listadas en Atlas/Summit. En el
  deck de ventas (`/presentacion`, `#empleados-digitales`) van **próximamente
  octubre 2026**; AURA es la que está disponible hoy. No volver a poner
  "Disponibles hoy" sobre las tres — en la demo se vende lo que aún no opera.
- **MFA:** activo desde 2026-08-25 (fila confirmada en `src/content/seguridad.ts`).
- **Precio máximo publicado:** USD 479/mes (Summit). Plan Corporativo USD 1.900
  eliminado del sitio público.
- **"Empleado digital":** término canónico de Clinera para AURA/CAMILA/LIA.
  Definición en `src/content/empleado-digital-definicion.ts`, artículo en
  `/blog/que-es-un-empleado-digital-para-clinicas`, DefinedTerm en
  `/empleado-digital`. No llamarlos "chatbot" salvo para contrastar.
- **Landings "mejor software":** pilares en `/mejor-software-clinicas` (+ `/chile`,
  `/mexico`, `/colombia`); city-pages siguen en `/recursos/mejor-software-clinicas-*`.
  Data tipada en `src/content/mejor-software.ts`.
- **Identidad pública (sept 2026):** `src/content/entidad.ts`. Título plantilla
  `{página} | Clinera`. `/casos-de-exito` redirige a `/clinicas`. Los casos
  citables del puente AEO con las clínicas del grupo son `/casos/metodo-hebe` y
  `/casos/protocolo-lumina`. El caso partner (no filial de OACG) es
  `/casos/katherine-meza` (alias 301 `/casos/km-estetica`); `@id` de la clínica
  `https://kmestetica.cl/#organization` y Person
  `https://kmestetica.cl/fundador/#person`. No reabrir `/casos-de-exito`.
  `/equipo` es la página de autores; el Person de Ricardo usa el `@id` de Hebe
  (`https://www.metodohebe.cl/fundador/#person`), no un Person duplicado en
  Clinera. Organization Clinera: `https://clinera.io/#organization` (sin www),
  padre OACG `https://oacg.cl/#organization`. Guardián: `tests/aeo-entidad.spec.ts`
  y `tests/aeo-puente-clinicas.spec.ts`.

# Programa partners (`/partner/{vanity}` y `/p/[slug]`)

Un partner = una entrada en `src/lib/partners.ts`. La landing, el OG, el kit y
el mensaje de WhatsApp se arman solos: no hay que tocar componentes para sumar
al número 2 ni al 50. Si el partner tiene `vanity`, la URL pública es
`/partner/{vanity}` y `next.config.ts` redirige `/p/{slug}` ahí.

Katherine Meza: vanity `km` → `https://www.clinera.io/partner/km`. El kit
(privado, `noindex`) está en `/partner/km/kit`. Yasna Vásquez: vanity `yv` →
`/partner/yv`, ref `YASNA01`.

El CTA público dice **«Coordinar reunión con Clinera»** (`PARTNER_CTA_LABEL` en
`src/lib/partners.ts`): hero, cierre y sticky. Sigue yendo a WhatsApp con el
mensaje de `src/lib/whatsapp.ts` (incluye `ref: KATHE01` / `YASNA01`). El helper
«Te responde una persona, no un bot.» se queda. No volver a «Hablar con Rebeca
por WhatsApp».

El clip de CNN es el mismo de `/plataforma` (`PressCNN`): Vimeo
`1205127087`, src en `PARTNER_CNN_VIMEO_SRC`. Foto del partner:
`public/partners/<slug>.jpg` (ver `public/partners/README.md`); si falta, las
iniciales — nunca un img roto. El círculo recorta el centro del cuadrado: la
cara tiene que ir al medio, no abajo. El primer recorte de Yasna mostró la
frente y el letrero QUALITY/VITALITY.

**En `/partner/{vanity}` el titular es la recomendación del partner**, no un
descuento publicado. El programa ya no ofrece 10% × 3 meses al referido; los
bonos del partner (US$ 150 / 200 / 400) viven en `/partners`. Sigue sin
publicarse precio de plan (Vortex/Atlas/Summit, 279/379/479/450).

**Por qué el `ref` va dentro del texto de WhatsApp.** El 90% del tráfico llega
desde un sticker de Instagram o un DM. En WhatsApp no sobreviven cookies ni
UTMs. Si se acorta o se “limpia” el mensaje pre-llenado de
`src/lib/whatsapp.ts`, se pierde la atribución y el closer no sabe de quién
viene el prospecto.

La landing pública no muestra precios de plan: eso lo conversa ventas (hoy
Rebeca). El kit es lo que se le manda al partner, no al prospecto.

**Convenio doctores.** La postulación es **previa** (wizard en
`/partners#convenio-doctores`, 3 pasos nombre/correo/motivo →
`POST /api/convenio-doctores`). `/convenio-doctores` es el trato **una vez
calificado**, no otro formulario. Beneficios (Ricardo, sep 2026): sitio web
remodelado por el equipo; Clinera **Vortex 3 meses**; mismos bonos de
referido (US$ 150 / 200 / 400); **30% de descuento** después de esos 3 meses.
Requisitos: usar Clinera activamente; recomendarla; asociar el perfil
empresarial como `Partner de @clinera.io` (ejemplo: bio de KM Estética). El
programa partner sigue siendo **solo el bono**. Slide `#convenio-doctores`
del deck apunta a `/convenio-doctores#requisitos`. Copy en
`PARTNERS_DOCTORS_CONVENIO` / `CONVENIO_DOCTORES_BENEFICIOS`. Guardián:
`tests/partners-program.spec.ts`.
