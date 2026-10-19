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

## Canales por plan (Ricardo, 2026-10-07)

**Vortex:** solo WhatsApp. **Atlas:** WhatsApp + Facebook + Instagram.
**Summit:** WhatsApp + Facebook + Instagram + llamadas con IA (CAMILA).
La voz es **exclusiva de Summit**; antes se publicaba "desde Atlas" y es residuo.
Fuente: `channels` en `pricing.ts`; los logos salen de
`src/components/pricing/PlanChannelLogos.tsx`. Si ves "CAMILA desde Atlas" en
copy, FAQ o `llms*.txt`, corrígelo.

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

**Actualizado 2026-09-26:** la web pública muestra **el anual primero** y el
mensual después. El anual es el default (20% OFF de catálogo, totales en
`pricing.ts`: 2.678 / 3.638 / 4.598). El semestral sigue fuera de la web, en
el constructor (`cotizacion.oacg.cl`). La implementación se cobra igual en
las dos modalidades publicadas.

Así lo comunican las tarjetas de `<Pricing />` en home, `/planes` y `/planes-pro`:

- **Lo primero:** plan anual expresado como valor mensual (la cuota: 223 / 303 / 383), con el ahorro en una línea. El total del año no se imprime; sigue en `annualTotal` porque es lo que cobra Stripe. La tarjeta muestra un solo precio: el de la modalidad activa. Al pasar a mensual, desaparece el anual.
- **Cómo se paga el anual (26-sep):** 12 cuotas a precio de contado con Mercado Pago. El isotipo está en `public/brand/mercadopago.svg` y el texto en `MercadoPagoCuotas` y en la diapo `#planes`. No es un recargo: el total de las cuotas es el precio de contado del año.
- **Primer cobro:** implementación US$ 450 + el año (si es anual) o el primer mes (si es mensual).
- El switch dólar / peso mexicano no compite con esa elección: va a la derecha, chico, con las banderas de Estados Unidos y México (`PriceModalitySwitch`).

Usa `setupFeeFor(billing)` / `includesFreeSetup(billing)` — en catálogo ambos
devuelven 450 / false; no asumas implementación gratis.

**Monedas en la web (2026-09-27):** no se menciona el IVA. El servicio no lo
cobra y la nota «no incluye IVA» hacía pensar que el impuesto venía aparte.
El catálogo vive en USD. El switch tiene **2 opciones** — **Dólar** (default)
y **Peso mexicano**. MXN usa un FX **congelado** en `src/content/pricing.ts`:
`USD_TO_MXN = 16.95`, fecha `FX_LOCKED_ON`. No live-update. Redondeo de
pantalla: MXN a la decena. No hay peso chileno. Control: `PriceModalitySwitch`.
Guardián: `tests/price-modality.spec.ts`.

**Discurso de cierre (sep 2026, actualizado el 26):** deck interno
`public/presentacion-nuevo-discurso.html` (`/nuevodiscurso`). La web ofrece
el anual primero (20% OFF publicado) y el mensual después. El semestral sigue
solo en el constructor. El closer regala la implementación (100% hoy/mañana,
50% esta semana) con una excusa que vence. Hasta 200 clientes.
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
> **Cambio 2026-10-16 (Ricardo):** el pixel del SITIO pasa a ser el dataset
> **«Clinera Software» `2251201709002818`** (BM Método Hebe; compartido con la
> cuenta publicitaria CLINERA.IO `806063489131174`). Fuente única en
> `src/lib/meta-pixel-id.ts`; las páginas de `public/` llevan el ID escrito. Lo
> que NO se movió porque no vive acá: el CAPI de n8n (W1 y `crm-sql-twenty`,
> hacia `1104567405156111`), el token CAPI de Vercel y el pixel del contenedor
> GTM. Si el sitio y el servidor apuntan a pixeles distintos, el `event_id` no
> deduplica. Lo que sigue describe el pixel anterior.
>
> **El pixel nuevo lo carga GTM, no el código (16-oct, Ricardo):** el contenedor
> `GTM-NXT8BGS9` trae la etiqueta de Meta Pixel (plantilla de Meta, dataset
> `2251201709002818`) que traduce eventos de GA4 a eventos de Meta (`purchase` →
> `Purchase`, `begin_checkout` → `InitiateCheckout`, `generate_lead` → `Lead`,
> `page_view` → `PageView`, `view_item` → `ViewContent`); lo que no está en el
> mapeo pasa con su nombre crudo como evento custom. `Analytics.tsx` ya NO inicia el
> pixel: dos cargadores contaban cada PageView doble. Consecuencias que no se ven
> leyendo el código: (1) GTM no carga en localhost ni en `*.vercel.app`, para no
> mandar tráfico de dev/preview a Meta; (2) los `fbq(...)` sueltos del código
> necesitan que GTM haya cargado: `trackPixel` espera hasta ~8 s; (3) el `event_id`
> de la etiqueta de GTM lo genera GTM y NO coincide con `purchase_{session_id}`:
> el `purchase` que `/go/exito` empuja al dataLayer puede contar doble con el
> `Purchase` del navegador y el del servidor. Revisar en Probar eventos tras la
> primera venta real.
>
> **El clic a `buy.stripe.com` lo cuenta SOLO `Analytics.tsx`.** Su listener global
> dispara `InitiateCheckout` (dataLayer y pixel) con `data-plan`, `data-plan-name` y
> `data-plan-value` del enlace, y arma el `client_reference_id` de 7 segmentos
> (gclid, GA, fbc, fbp, UA) que lee n8n. Un `onClick` propio en `/go` o `/planes2`
> contaba el clic doble (visto en Probar eventos el 16-oct) y, si navega a la URL
> original, se salta ese `client_reference_id`. Todo botón de compra nuevo:
> `<a href="https://buy.stripe.com/…" data-plan data-plan-name data-plan-value>` y nada más.
>
> **Stripe → Meta (16-oct):** `POST /api/stripe/meta-purchase` manda un `Purchase`
> al pixel nuevo cuando alguien se suscribe (`checkout.session.completed`). Es un
> webhook propio, aparte de los de n8n. Requiere secretos en Vercel y registrar el
> endpoint en Stripe: `docs/stripe-meta-purchase.md`. Su `event_id`
> (`purchase_{session_id}`) debe ser igual al del navegador en `/go/exito`.
>
> Pixel de producción anterior `1104567405156111` (`[2026] OACG TECH`) pertenece al
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
el 2026-09-11 (sin HOT). El cruce SCREENING↔PQL (H1) y la tabla Nuevo 0 / PQL 1 /
MQL 5 / SQL 10 / HOT 100 son históricos (09-sep). El 10-sep se borró
`PQL`. El 11-sep se retiró `HOT` (`PROPOSAL`): los SQL pasaron a MQL y
los HOT a SQL **antes** de quitar la opción. **Al editar opciones de un
SELECT en Twenty, conservá el `id` de cada opción:** el 09-sep 19:48Z se
perdió el id de `MQL` y 130 negocios cayeron a `NEW`. `MEETING` sigue
siendo el valor interno de SQL. `SQL_Plus` no se tocó (sigue sin emitir).
`NQL` = no responde, $0.

| stage | event_name | value | condición |
|---|---|---|---|
| `NEW` | `Nuevo` | 0 | rellenó el formulario; también si lo escribió n8n (`API`) |
| `MQL` | `MQL` | 10 | closer verifica que es real |
| `MEETING` | `SQL` | 100 | alias `SQL` — calificado (la demo ocurrió) |
| `NQL` | `NQL` | 0 | no responde |
| `CUSTOMER` | `Purchase` | `planClinera`: VORTEX 279 / ATLAS 379 / SUMMIT 479; vacío → 279 | |
| `PQL` / `SCREENING` / `SQL_Plus` / `HOT` / `PROPOSAL` | — | — | no emiten |

`event_id` = `{opportunityId}_{stage}`. `user_data.lead_id` = `leadgenId` (entero,
sin hash) si existe. `action_source` = `system_generated`. Detalle:
`integrations/n8n/README.md` y `baserow/sales/etiqueta-hot-y-capi.md`.

**Un estado implica los anteriores (Ricardo, 10-sep): un lead en SQL fue MQL
sí o sí.** Las campañas optimizan `MQL`; si el closer pasa un negocio de
Nuevo a SQL sin pasar por MQL, Meta nunca recibe el MQL y ese lead no le
enseña nada a la campaña (la columna «Clientes potenciales cualificados»
cuenta los leads que llegan a la etapa optimizada). Por eso W1 **rellena la
escalera** `MQL < SQL < Purchase`: antes de mandar la etapa actual
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
sino porque los workflows de SQL/SQL+ marcan Baserow 152 y un feed en
`baserow` (`sales/n8n/gads-conversiones-sql-csv.js`) se lo sirve a Google
Ads Data Manager por HTTPS. Los montos canónicos vivos son Nuevo 0 /
MQL 10 / SQL 100 / NQL 0. El feed de GAds usa SQL 100 y `SQL+` 200
(sin cambio). `HOT` ya no se emite. Detalle en
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

# Modelo vigente: Vortex · Ecosistema y `/agenda` en 3 pasos (Ricardo, 18-oct-2026)

**Clinera vende dos opciones:** Vortex US$ 379/mes (software con IA: hasta 10
profesionales, 10.000 créditos, bandeja WhatsApp/IG/FB) y Ecosistema US$ 479/mes
(Vortex + marketing de performance: campañas, propuesta de valor, framework
comercial; «Recomendado»). Implementación US$ 450 pago único, en el primer
cobro, **siempre** (Ricardo, 18-oct: la promo «implementación gratis en Ecosistema»
se sacó; el descuento se negocia en la reunión de ventas, no se publica). **Extras del
software** (`EXTRAS` en `planes.ts`, valen para las dos opciones): profesional extra
US$ 9/mes, 500 conversaciones extra US$ 15, 5.000 créditos de IA extra US$ 15.
**Discurso de ahorro** (Ricardo, 19-oct: `AHORRO` en `planes.ts`, componente `AhorroEcosistema`,
bloque `.px-ahorro` de la presentación): agencia de marketing US$ 600–800/mes, software de
agendamientos US$ 100–300, agente IA con créditos US$ 300–600; por separado US$ 1.000–1.700 vs US$ 479
del Ecosistema («ahorras más de US$ 500 al mes»: 1.000 − 479 = 521 como mínimo). Son estimados de mercado: se publican como tales y
**sin nombrar competidores**.
Se muestra como una **«boleta» de gastos** minimalista (Ricardo, 19-oct: «bonito, minimalista, poco
espacio, nunca apiñado»), **boleta recortada**: el papel (línea de corte con tijera y borde rasgado) es una imagen
generada en Higgsfield y partida en `public/images/agenda/boleta-arriba.webp` y `boleta-abajo.webp`;
el texto va en HTML encima (una imagen con los números adentro los deforma, y no se leería con
lector de pantalla). La presentación tiene su propia copia en HTML (`.bol`).
Fuente única: `src/content/planes.ts`.
Se acabaron Flux, Hurricane, Nexus, Atlas, Summit, Go!, el cupón y la compra por
la web. Sin permanencia y sin plan anual (pendientes de
Ricardo: no los muestres). Todo CTA dice «Agendar videollamada» y va a
`/agenda?servicio=…` con la query de la visita (`agendaHref`).

- **`/agenda` es un wizard de 3 pasos, sin scroll de página** (`AgendaWizard.tsx`,
  copy en `agenda-oferta.ts`), en el formato de `protocololumina.cl/evaluacion`:
  pantalla partida (panel oscuro con una imagen por paso y wizard blanco; en móvil
  el panel va arriba, compacto). Paso 1: **la boleta «lo que te ahorras con el Ecosistema»** y el botón deslizante «Desliza para ahorrar» (al completarse hace el «pum»: un círculo de color
  se abre desde la perilla, se disuelve y el paso 2 entra bloque por bloque; sin movimiento si el
  usuario pide reducir animaciones)
  (Ricardo, 19-oct: **ya no se elige servicio**, se vende el Ecosistema; el lead viaja siempre
  con `servicio_interes: "ambas"` y `?servicio=` ya no cambia el flujo; en móvil el panel de
  imágenes no va en este paso porque la boleta es la imagen); paso 2: **solo nombre, correo, celular y nombre de la clínica** (Ricardo: «el
  resto lo manejamos nosotros»; el país sale del prefijo y `tipo_clinica`,
  `boxes_profesionales` y `ciudad` viajan vacíos); paso 3: horario con el calendario
  nativo (`StepClineraScheduler`). Imágenes en `public/images/agenda/` (generadas en
  Higgsfield, 16:9, con marcas ficticias). `/clinica-estetica`, `/activar-cuenta`,
  `/reunion-comercial` y similares redirigen ahí (308, con query).
- **Eventos del sitio (pixel `2251201709002818` vía GTM):** `Lead` US$ 3 al
  enviar el paso 2 (datos); `ViewContent` al elegir servicio; `MQL` US$ 10 al agendar;
  `SQL` US$ 30 (asistió, es real y califica) lo emite el CRM, **no el sitio**, y
  hoy W1 de n8n manda SQL US$ 100 al pixel viejo: cambiarlo es en n8n; `Cliente`
  = valor del plan vía Stripe (`planVigenteDe` en `meta-purchase.ts`).
- **Pendientes que no se resuelven en este repo:** campo «servicio de interés»
  en Twenty y su mapeo en n8n; si la inversión publicitaria va incluida (FAQ de
  `/planes` con marcador `[PENDIENTE]`); desactivar en Stripe el cupón y los
  Payment Links anteriores; Webhooks/API no tienen plan asignado en el modelo nuevo.
- **Conflicto de nombres:** `pricing.ts` (contratos `/firma`, `/cotizacion`) y
  `planes2.ts` (`/go/exito`) conservan el catálogo viejo, donde «Vortex» vale 279.
  `planVigenteDe` valoriza cualquier «Vortex» como 379.
- **Dispositivos:** `tests/dispositivos-moviles.spec.ts` recorre 21 aparatos (iPhone SE a 15 Pro Max, Galaxy,
  Pixel, iPad, tabletas y en horizontal) con el motor Chromium: perilla con dedo, campos de 16 px o más
  (si no, iOS hace zoom), nada tapa los botones, sin scroll de página. Las alturas de iPhone ya
  descuentan las barras de Safari: **en pantallas de menos de ~680 px de alto la boleta se achica**
  para que la perilla quede a la vista (si se agrega algo al paso 1, vuelve a correr esa prueba). No
  es Safari real.
- Guardianes: `tests/agenda-wizard.spec.ts`, `tests/planes-vigentes.spec.ts`,
  `tests/clinica-estetica.spec.ts` (redirects y home).

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

# `/presentacion`: archivo estático, 4 diapositivas como máximo (Ricardo, 7 y 19-oct-2026)

`/presentacion` (el deck de ventas) no es una ruta de Next.js: `next.config.ts` reescribe
`/presentacion` → `/presentacion/index.html`, un único archivo HTML/CSS/JS en
`public/presentacion/index.html`. No hay componente React que tocar ahí.

**Son 4 diapositivas, a propósito (máximo 4, Ricardo 19-oct):** `#quienes-somos` (historia en 3 hitos:
agencia 2017 → «más de 1.500 clínicas» (ningún software las satisfacía; se recopilaron sus datos y necesidades, Ricardo 7-oct) → Clinera sep 2025, tras más de 1 año de desarrollo y testeo — Ricardo 7-oct), `#funciones` (funciones +
IA), `#beneficios` (por qué contratar Clinera: costo con el ahorro en números, todo unificado,
software hecho para clínicas estéticas y médicas) y `#planes` (precio y detalle por plan). Antes eran 13 (Rebeca, ago–sep
2026: origen, por qué Clinera, AURA, Intelligence ×3, empleados, canales,
normativa, migración); se resumieron porque la reunión pide algo ultra breve.
No reponer diapos sueltas: si un tema necesita espacio, va dentro de una de
las tres. Hechos citables: sin cifras nuevas; HL7 FHIR va **solo como roadmap 2027** (nunca «construido sobre FHIR»: hoy no lo está); no nombrar competidores ni Open
Factura. **CAMILA y LIA van «Oct 2026» (próximamente); AURA es la que está en
vivo.** En `#planes`, los canales por plan siguen la misma regla que
`pricing.ts` (Vortex WhatsApp; Atlas +FB/IG; Summit +llamadas con IA); los
logos son `<symbol>` (`#ch-wa`, `#ch-fb`, `#ch-ig`, `#ch-tel`) en el SVG de
arriba del `<body>`. Anual primero, dólar/MXN chico con banderas, 12 cuotas
con Mercado Pago. Los números están duplicados en el HTML porque el deck no
importa TS: si cambia un precio, crédito o usuario, hay que tocar la diapo.
Guardianes: `tests/presentacion-4-diapos.spec.ts` y
`tests/presentacion-planes.spec.ts`.

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

# `/software-para-clinicas`: la página genérica (oct 2026)

Pilar para las keywords amplias «software / programa / sistema de gestión para
clínicas» (usa el esqueleto `software-vertical`, contenido `CLINICAS`). **Por qué
existe:** «programa para clínicas» en Google Chile devuelve diplomados y
programas académicos, no software; por eso la página titula con «software» y
mete «programa» y «sistema de gestión» en tesis, FAQ y keywords. Mapa de
keywords completo (sin volúmenes: Semrush sin unidades de API al 15-oct) en el
`docs/seo-keyword-map-2026-10.xlsx` (estado, pendientes y trampas de la sesión en
`docs/seo-keywords-handoff-2026-10-16.md`: léelo antes de seguir); `/mejor-software-clinicas/peru` ya existe (ranking con AgendaPro, Doctocliq y Medesk;
Clinera no emite comprobantes SUNAT: confirmado por Ricardo, 16-oct). Páginas por
especialidad (kinesiología, psicología, nutrición, podología) salen de una fábrica
`especialidad()` en `content.ts`; la ficha es 100% editable y hay una biblioteca de
fichas para copiar dentro de Clinera (Ricardo, 16-oct): la FAQ de esas páginas lo dice.
No prometer fichas específicas por especialidad ya armadas, solo editables + biblioteca. Podología se sumó después (15-oct, misma fábrica). Todas sin volúmenes de búsqueda.
Guardián: `tests/seo-q4-paginas.spec.ts`.
`/recordatorios-citas-whatsapp` (contenido `RECORDATORIOS`) cubre recordatorios y
confirmación: son plantillas Utility de Meta (solo informan la cita, sin promo);
no prometer porcentajes de reducción de no-shows, no hay dato propio.
**No pongas « | Clinera» al final de `meta.title`** en `content.ts`: el layout ya lo agrega y el
`<title>` sale «… | Clinera | Clinera» (pasó en 8 páginas hasta el 16-oct; el test lo vigila).
`/crm-para-clinicas` (contenido `CRM`): el CRM es un módulo del mismo software, no
un producto aparte; no prometer email marketing ni triggers de cumpleaños (son
«próximas funciones»). Webhooks/API pública no se presentan como integración de agenda.

# Nicho estético: home y la landing (Ricardo, 18-oct-2026)

Clinera se enfoca en **clínicas estéticas** (enfermeras, médicos estéticos,
clínicas y centros de estética) y en segundo lugar médicas: es donde el
producto brilla, porque nació en Método Hebe (corporal) y Protocolo Lumina
(facial). El copy del nicho vive en `src/content/estetica.ts` y lo consumen
el home (hero + `EsteticaSection`) y `/clinica-estetica/activar-cuenta`.
Los tratamientos precargados (Sculptra, Radiesse, Endoláser, Rinolips) son los
que nombró Ricardo: no agregues otros sin que él lo confirme.

`/clinica-estetica` ya no es una página: redirige a la landing única (ver
arriba). La landing vieja de Google Ads (wizard corto + calendario, perfil en
`subtipo_clinica`) se borró el 18-oct; `PERFILES_ESTETICA` y `ESTETICA_LP_FAQ`
quedaron sin uso en `estetica.ts`. Guardián de los redirects:
`tests/clinica-estetica.spec.ts`.

**Fotos y franja (18-oct):** `EsteticaSection` lleva una modelo con el copy de
los anuncios de Ricardo (`MODELOS_ESTETICA`: la dueña en el home, la enfermera
en la landing; generadas en Higgsfield, sin nombre porque no son clientas). El
bloque «Lo construimos para nuestras propias clínicas» se reemplazó por la
franja de logos reales en blanco y negro (`ClinicasLogos`, lista en
`src/content/clinicas-logos.ts`, incluye Método Hebe). La franja vieja del home
tenía nombres **inventados** («Hospital del Valle»…): `Logos()` ahora pinta los
reales. Everest usa `everest-mono.png` (el original trae fondo azul).

# Banda «Activa tu ecosistema» (Ricardo, 18-oct-2026)

`src/components/agente-ia/AgenteIABanda.tsx` (el nombre del archivo quedó del título
anterior, «Activa tu agente IA»): panel oscuro de tipografía gigante que rompe el
ritmo light del sitio a propósito. **Va siempre** en el home, en las landings
(todas las `software-vertical`) y en cada artículo del blog (`/blog/[slug]`,
variante `enColumna`). Una por página. Ricardo pidió enfocarla en **todo el
ecosistema, no solo el software**: tres tarjetas — campañas de marketing,
framework comercial y canales + agenda (la IA responde por WhatsApp, Facebook,
Instagram y teléfono y deja la cita creada). CTA «Agendar videollamada» a `/agenda`
con la query de la visita. Usa `aria-label`, no `aria-labelledby`: un nombre accesible con
«WhatsApp» hacía que `getByLabel("WhatsApp")` de los tests de formularios
encontrara la banda. Guardián: `tests/agente-ia-banda.spec.ts` (también vigila el
ranking `/blog/mejores-software-clinicas-esteticas`: Clinera 1.º, Reservo,
AgendaPro, Medilink, Doctoralia; cifras de competidores = las que ellos publican,
con fecha).

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

## Clinera Podcast (sep 2026)

Serie de **5 capítulos** en `/podcast` (`src/content/podcast.ts`). Cada
capítulo publicado tiene artículo en `src/content/posts/` con `<VimeoEmbed
hash=…>` (videos unlisted). El hub destaca el publicado más reciente
(`featuredPodcastEpisode`). Cap. 1:
`/blog/clinera-podcast-1-como-escalar-clinica` (Vimeo `1227087546` /
`f809ac4f9a`). Cap. 2:
`/blog/clinera-podcast-2-facturacion-no-es-administrar` (Vimeo `1229666017` /
`505f8b4905`) — facturar no es administrar: sueldos 25–40 %, arriendo
15–30 %, costo por lead según ticket, equilibrio en las 3 primeras semanas,
meta = promedio 12 meses + 20 %. Esos rangos son lo que dice Ricardo en el
episodio, no tarifario de Clinera. Al subir caps. 3–5: catálogo + MDX + llms.
Guardián: `tests/podcast.spec.ts`.

El botón de la barra superior (y el menú móvil) **no** es el podcast: es
«Ver demo 3 min» → `/demo`, con el punto verde y el texto violeta (sin caja).
El podcast queda en el footer, columna Recursos. El video de la demo
(`src/content/demo-video.ts`) se embebe en el home y en `/plataforma`
(`DemoEnVivo`, justo bajo el hero). En el resto del sitio el atajo es el
flotante de la izquierda (`VerDemoFloat`): ícono de cámara de video + «Ver
demo». No va un player en el footer.

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
  Clinera. Ricardo es **fundador** (no co-fundador) de Clinera, Método Hebe,
  Protocolo Lumina y Metricads. El cargo vive en `FOUNDER.jobTitle`. Organization Clinera: `https://clinera.io/#organization` (sin www),
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

# Plan SEO/AEO Q4 2026: reglas que dejó (oct 2026)

- **robots.txt:** un bot con bloque propio ignora el bloque `*`. Las rutas
  internas (`STAR_DISALLOW`) se aplican también a los bots de IA y SEO en
  `src/lib/robots-txt.ts`. Si agregas una ruta interna, va en esa lista.
  Guardián: `tests/robots.spec.ts`.
- **Comparativas:** ninguna comparativa dice que Clinera se integra o se sincroniza
  con agendas de terceros (Ricardo, 1-oct-2026: «siguen prometiendo lo mismo» →
  se reescribieron todas). Pasó en `src/app/comparativas/[slug]/page.tsx`,
  `comparativas-cross.ts`, `recursos-templates.ts` y `mejor-software.ts`. La
  postura vigente: Clinera opera sobre su propia agenda, ficha y pagos; se migran
  los datos en el onboarding; para conectar herramientas hay Webhooks + API
  pública (Atlas y Summit). Guardián: `tests/seo-q4-paginas.spec.ts`
  (patrones prohibidos en esos 5 archivos).
- **Páginas de compra:** `/software-estetica` y `/agendamiento-whatsapp-ia`
  usan el esqueleto `software-vertical` (`ESTETICA`, `WHATSAPP_IA` en
  `content.ts`). Cada apertura (`thesis`) mide 40–60 palabras: es lo que
  extraen las IA. Guardián: `tests/seo-q4-paginas.spec.ts`.
- **Ficha clínica:** `/ley20584` es la página de seguridad de datos con
  respuesta directa, FAQ y demo; los 9 artículos de ficha clínica llevan
  `<FichaCTA />` a mitad de texto (`lead_source=blog_ficha_clinica`).

# `/go/exito` y el modelo Go! / Flux / Ultra (histórico)

`/planes2`, `/go` y `/activa` se borraron el 18-oct-2026 (`/go` y `/activa` redirigen
a `/agenda`). Siguen vivos solo `/go/exito` (activación por WhatsApp de soporte),
`/api/go/*` y el reconocimiento de planes viejos en `meta-purchase.ts`, con
`src/content/planes2.ts`, porque aún pueden llegar pagos de esos planes por
Stripe. No los promociones ni los reconectes al sitio.
