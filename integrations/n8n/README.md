# Workflows de n8n que consume el sitio

## clinera-agenda-reserva.workflow.json

Motor del paso final de `/agenda`: reserva nativa contra la agenda real de
Clinera **vía n8n.oacg.cl**, sin iframe. El sitio llama a tres webhooks y n8n
habla con la API pública de app.clinera.io (los mismos endpoints que usa el
widget embebido).

| Webhook (producción)                                   | Método | Rol |
|--------------------------------------------------------|--------|-----|
| `https://n8n.oacg.cl/webhook/clinera-agenda-config`    | GET    | Health-check + parámetros (clínica, sucursal, tratamiento, duración). Si no responde, `/agenda` cae automáticamente al iframe del embed oficial. |
| `https://n8n.oacg.cl/webhook/clinera-agenda-disponibilidad?fecha=YYYY-MM-DD` | GET | Proxy de `GET app.clinera.io/api/public/iframe/disponibilidad` |
| `…/clinera-agenda-disponibilidad?desde=YYYY-MM-DD&dias=21` | GET | Resumen: `{ dias: { "YYYY-MM-DD": nº de horas } }`. La página lo pide una vez al abrir el paso 4 para **no ofrecer días vacíos**; pedirlos uno por uno serían diez requests desde el navegador. Cuenta horas únicas (la API devuelve una entrada por profesional) y salta sábados y domingos. Un día que no se pudo consultar vuelve como `-1`, y ese se ofrece igual: mejor mostrar un día vacío que esconder uno que sí tenía horas. |
| `https://n8n.oacg.cl/webhook/clinera-agenda-turno`     | POST   | Upsert del paciente (`POST …/pacientes`) y creación de la cita (`POST …/citas`), replicando el flujo del widget. Body: `{ nombre, email, telefono, fecha, hora, professionalId, professionalName }` |

### Instalación (una vez)

1. n8n.oacg.cl → **Workflows → Import from File** → este JSON.
2. Revisar el objeto `CONFIG` de los nodos Code y el nodo "Responder Config"
   si algún día cambia la sucursal/tratamiento (están duplicados a propósito:
   cambiar ahí no requiere deploy del sitio).
3. **Activar** el workflow. Desde ese momento `/agenda` muestra el paso nativo
   con los datos precargados; mientras esté inactivo, `/agenda` sigue
   funcionando con el embed (el cliente re-tipea sus datos, como hoy).

### Tracking de conversión (Meta CAPI + GA4)

El embudo tiene los mismos estados en CRM y en el pixel
(Ricardo, 09-sep-2026):

| Evento | Cuándo | Dónde vive | Valor |
|---|---|---|---|
| **Nuevo** | rellenó el formulario (Instant Form o wizard) | W1; Sub A ya no manda `Lead` | US$ 0 |
| **MQL** | closer verifica que el lead es real (paso anterior a SQL) | W1 si el stage es `MQL`. Campañas activas optimizan este evento | US$ 10 |
| **SQL** | closer → SQL (`MEETING`) **cuando la videollamada se realizó**. Agendar y no asistir = sigue MQL | W1 | US$ 100 |
| **NQL** | closer → no responde | W1 | US$ 0 |
| **Purchase** | Customer | W1 (`planClinera`) | valor del plan |

Al crear la cita, el workflow dispara **en paralelo** a la respuesta del
navegador (nunca la demora ni la rompe):

| Nodo | Destino | Evento |
|---|---|---|
| `Meta CAPI - MQL` | Pixel `1104567405156111` | `MQL` |
| `GA4 - MQL` | `G-FB5YV66KKJ` (Measurement Protocol) | `mql` |

**Dedupe con el Pixel del navegador**: `/agenda` genera el `event_id` *antes*
de llamar al webhook, lo manda en el body y usa el mismo en
`fbq('track','MQL', …, { eventID })`. Meta deduplica por
(`event_name`, `event_id`), así que Pixel + CAPI cuentan **una** conversión.
El navegador también manda `meta_fbp` / `meta_fbc`, el `client_id` de la
cookie `_ga` y la atribución de Google Ads, de modo que el evento
server-side cae en la misma sesión y usuario.

> [!IMPORTANT]
> El JSON de este repo lleva **placeholders**, porque el repositorio es
> público: `__META_CAPI_ACCESS_TOKEN__` y `__GA4_API_SECRET__`. Los valores
> reales viven solo en n8n — son los mismos que ya usan
> "OACG TECH | Reunión Cal.com (Orgánico)" y "OACG TECH | Wizard". Si se
> reimporta este archivo hay que volver a pegarlos en los dos nodos.

### Contrato con el sitio

`src/components/ventas/VentasLanding.tsx` (constantes `N8N_AGENDA_*`) asume
las tres rutas de arriba. Si se renombran los paths de los webhooks hay que
actualizar esas constantes.

### El día en curso no se ofrece

Para **hoy UTC**, la API de Clinera arma la grilla desde la hora **UTC** actual
en vez del horario de atención del profesional. Chile va cuatro horas atrás,
así que a las 16:30 de la tarde el servidor ya está en 20:30 y devuelve cero
horas aunque queden bloques libres; más temprano (y sobre todo de madrugada
UTC, que en Chile todavía es el día anterior) devuelve bloques tipo `01:45`.

El picker parte en el hábil siguiente **y además salta el `YYYY-MM-DD` UTC
actual**: después de las 20:00 en Chile, "mañana" local sigue siendo hoy en
UTC. `diasCandidatosAgenda` + `esBloqueHabil` en `VentasLanding.tsx`. Cuando
Clinera corrija la grilla de hoy se puede volver a incluir el día en curso.

## clinera-meet-por-profesional.workflow.json

Crea un **Google Meet en el calendario de la persona con la que se agendó**.
Hoy mapea a Nohe y Rebe; sumar a alguien más es agregar una línea al array
`CALENDARIOS` del nodo "Normalizar Reserva".

| Profesional (match por nombre, sin acentos) | Calendario donde cae el evento |
|---|---|
| contiene `nohe` | `nohelymar.sanchez@oacg.cl` |
| contiene `rebe` | `rebeca@oacg.cl` |

Webhook: `POST https://n8n.oacg.cl/webhook/clinera-meet`

El JSON de este repo es el re-export sanitizado del vivo
(`FZvyK42lkQdKWcIl`, 2026-08-26, post `--aplicar`): incluye
`Twenty - Agendó (Meet)` y la rama MQL IA. Tokens →
`__BASEROW_TOKEN__` / `$env`.

Acepta dos formatos de payload:

1. **El del workflow de reserva de `/agenda`** — ya conectado: el nodo
   "Avisar Meet" lo llama en paralelo cuando la cita se crea, sin tocar la
   respuesta al navegador.
2. **El del webhook de automatizaciones de app.clinera.io** (Marketing →
   Automatizaciones → Configurar webhook → "Enviar payload completo"). El
   nodo "Normalizar Reserva" busca las claves en profundidad
   (`profesional`/`doctor`, `fecha`, `hora`, `nombre`, `email`, `telefono`,
   `duracion`), así que tolera el formato del evento que dispare.

Detalles:

- La hora del turno se interpreta en **hora de la clínica** (`America/Santiago`,
  con su DST) y se manda a Google con offset explícito, de modo que cada quien
  la ve en su huso (Nohe está en `America/Caracas`).
- El cliente va como invitado (`sendUpdates: all`), así recibe la invitación
  con el link del Meet.
- Anti-duplicado por `calendario + inicio + email` durante 10 minutos: si el
  mismo turno se avisa dos veces (workflow de `/agenda` + automatización de
  Clinera), se crea un solo Meet.
- `{"test": true}` en el body crea el evento marcado `[PRUEBA — BORRAR]` y sin
  invitados, para probar sin mandar correos.
- Si el profesional no es Nohe ni Rebe, responde `{"ok":false,"motivo":"sin_match"}`
  y no crea nada. El payload queda en la ejecución de n8n para poder mapearlo.

Credencial usada: **Google Calendar OACG** (la misma del workflow
"OACG TECH | Agendamiento (Meet)"). Requiere que esa cuenta tenga permiso de
**"Hacer cambios en los eventos"** sobre los calendarios de destino.

### Dónde queda guardado el evento

Al crear el Meet, el workflow busca el lead en Baserow por email y guarda la
referencia del evento en la columna `🔖 Cal Booking UID`, con el formato
`clinera#<eventId>@<calendarId>`. Va colgado de la creación, en paralelo a la
respuesta: si Baserow falla, el Meet ya está hecho y el navegador no se entera.

Sirve para **mover** el evento cuando el paciente reagende. Mover conserva el
link del Meet y el evento que el paciente ya tiene en su calendario; borrar y
recrear cambia el link y deja al paciente con una invitación muerta.

El prefijo `clinera#` distingue esta referencia de un uid de Cal.com, porque la
columna se comparte entre los dos agendadores.

> [!NOTE]
> El token de Baserow del workspace no tiene permiso para crear columnas, así
> que se reusó una existente. Si algún día se agrega una columna propia
> (p. ej. `Meet eventId`), conviene mover esto ahí.

### Segundo emisor MQL: citas del agente IA (WhatsApp)

Desde agosto 2026 el mismo evento `MQL` del pixel `1104567405156111` tiene
**dos disparos**. El de `/agenda` sigue arriba (este archivo, workflow de
reserva). El segundo vive **acá**, en el Meet, y solo corre cuando la
automatización de Clinera manda `metadata.origen === "agente-ia"`.

**Por qué no se cuenta dos veces.** La misma cita del wizard llega DOS veces
al webhook `clinera-meet` (Avisar Meet + eco `appointment_created` ~1 s
después). El eco viaja con `metadata.origen: "web"`. La compuerta es una
allowlist: payload de automatización AND `origen === "agente-ia"` AND no
es prueba. El wizard plano se reconoce por
`notas: 'Turno solicitado desde www.clinera.io/agenda'`. Embed/reagenda
(`origen: "web"`) sigue **sin** emitir MQL.

**`event_id`** (determinista por cita; un re-disparo dentro de 48 h
deduplica en Meta):

```
mql_ + sha256(email || telefono).slice(0, 12) + _ + fecha + _ + hora
```

Email: `trim().toLowerCase()`. Teléfono: solo dígitos con país. Misma
forma que el fallback del MQL del wizard, con el fallback a teléfono del
SQL. Una reagenda (otra fecha/hora) es un segundo MQL — aceptado, igual
que hoy en el wizard.

**Valores:** `action_source: system_generated`, `value: 10`,
`currency: USD`, `lead_source: clinera_agente_ia`. Token CAPI:
`$env.META_CAPI_ACCESS_TOKEN`. El `api_secret` de GA4 se copia del nodo
vivo `GA4 - MQL` del workflow de reserva al aplicar; no viaja por el repo.

**Mapa del payload de la automatización** (envuelto, a veces bajo clave
`""`): `patient{email,phone,full_name}`, `booking{id,date_time}` (ISO
Chile), `metadata{origen,estado,createdAt}`. `origenCita` y `bookingId`
los calcula `Normalizar Reserva` una sola vez.

**Twenty:** el nodo `Twenty - Agendó (Meet)` hace upsert **solo** para
`agente-ia` (contrato del wizard: etapa `MQL`, Vortex US$ 279). Wizard/web
siguen igual: solo refresco. Al crear o refrescar copia el teléfono del
contacto a `telefonoContacto` del negocio — es lo que se ve en la tabla
de Negocios, porque Twenty no muestra el de la Persona como columna de
la Opportunity. Aplicador: `integrations/n8n/aplicar_telefono_contacto.py`.
El de MQL IA sigue en `baserow/sales/n8n/aplicar_mql_agente_ia.py`. Spec:
`baserow/openspec/changes/medir-mql-agente-ia/`.

Este emisor **no marca Baserow 152**. La frase de que «los tres workflows
marcan la 152» era de SQL/SQL+ y del feed de Google Ads, no de este MQL.

## Por qué falló la llamada (en "OACG TECH | Vapi Outbound Trigger")

Ese workflow tampoco vive acá — lleva credenciales y es anterior a `/agenda` —
pero el 14 de agosto se le cambió el manejo de errores y conviene que quede
escrito.

**Lo que pasó:** la cuenta de Vapi se quedó sin saldo el 13 de agosto. Durante
dos días, cada llamada devolvió `400 — "Your Wallet Balance is -0.09"`, y el
workflow marcaba **todas** las filas como `Error / Número inválido`. Once leads
reales quedaron sin contacto —dos de ellos con demo agendada— y el tablero
decía que la base estaba sucia. Nadie se enteró hasta que se revisaron las
ejecuciones a mano.

Dos cosas lo hacían invisible: el motivo era mentira, y `Error` es un estado
del que nadie vuelve — el cron solo toma las filas en `🕐 En cola`.

**Lo que hace ahora** el nodo Code «Clasificar Fallo», colgado de la salida de
error de «Vapi Trigger Call»:

| Motivo | Cómo se detecta | Qué le pasa al lead | Avisa |
|---|---|---|---|
| `sin_saldo` | el mensaje menciona wallet balance / credits | vuelve a `🕐 En cola`, se le devuelve el intento gastado y se pone `📅 Próxima llamada` a +20 min | sí |
| `numero_invalido` | `customer.number must be a valid phone…` | `Error / Número inválido` (como antes) | no |
| `error_api` | cualquier otro rechazo | `Error / Error técnico`, con el mensaje real en el resumen | sí |

Los +20 minutos usan una regla que el cron ya respetaba: así no reintenta cada
diez minutos mientras el problema sigue sin resolverse, pero se recupera solo
apenas hay crédito, sin que nadie reencole nada.

El aviso va al mismo espacio de Google Chat, **una vez cada media hora por
motivo**, con la cuenta de leads afectados en la ventana. Seis llamadas que
fallan en la misma tanda son un mensaje, no seis.

### Por qué 166 leads llevaban un mes sin llamada

Baserow guarda `Intentos IA` como decimal: **`"1.00"`**. El cron
(«OACG TECH \| Camila Cron · Clinera», nodo «Split Items») lo leía así:

```js
parseInt(String(row['Intentos IA'] || '0').replace(/[^0-9]/g, ''))
```

`"1.00"` → quitar los no-dígitos → `"100"` → **100 intentos**. Y la regla de
más abajo es `if (intentos >= 3) skip`. O sea: **cualquier lead que recibiera
una sola llamada quedaba marcado como agotado y no se volvía a llamar jamás**.
Solo pasaban los que tenían el contador en 0 o vacío.

Se leyó con `parseFloat`. Es la misma trampa que hay que evitar en cualquier
sitio que lea un número de Baserow.

Al arreglarlo se liberaban de golpe 164 leads atascados desde julio, con sus
demos ya vencidas, así que se les puso `📅 Próxima llamada` a futuro para que
el cron no los tome hasta que se decida qué hacer con ellos.

Y como esos leads tienen fecha de demo pasada, «Prepare Call Data» ahora mira
si la demo quedó atrás: si ya pasó, la llamada vuelve a ser de **agendamiento**
en vez de confirmación. Llamar a alguien a «confirmar tu reunión del 14 de
julio» es peor que no llamarlo.

### Qué necesidad oye Camila

«Prepare Call Data» lee la columna `Necesidad principal` de Baserow (id 14264,
texto largo), que **no existía**: por eso Camila llamaba sin saber qué necesita
el lead y caía siempre en el genérico "optimizar su gestión clínica".

Ahora la columna existe y el wizard la escribe desde `necesidad_principal_label`,
que es la clave propia con que la landing manda la respuesta del paso 1 de
`/agenda`. En `/ventas` el paso 1 sigue preguntando el software y esa columna
queda vacía, como corresponde.

Queda además un respaldo en «Prepare Call Data»: si `Necesidad principal` viene
vacía y el lead entró por `/agenda`, se usa `Software actual`. Cubre a los leads
capturados antes de que existiera la columna. Ojo al rellenar hacia atrás: los
leads de `/agenda` anteriores al cambio de la pregunta 1 tienen un software de
verdad ahí (Dentalink, AgendaPro), y copiarlo como necesidad es peor que dejarlo
vacío.

El token de Baserow del workspace **no puede crear columnas** — eso necesita
sesión de usuario, se hace desde la interfaz.

### El tool de reagenda en el asistente de Vapi

`solicitar_reagenda` está montado en el asistente **Agendador de Citas
(Outbound)** (`d865820f-…`), junto a los tres que ya tenía. El prompt de Camila
elige camino según `{{cal_booking_uid}}`:

- **Cita de Cal.com** (uid normal) → sigue reagendando en vivo con
  `get_available_slots` + `book_demo`, como siempre.
- **Cita de Clinera** (uid vacío o que empieza con `clinera#`) → no puede
  moverla: usar `get_available_slots` ahí crearía una reunión paralela en otro
  calendario y dejaría la original ocupada. Pregunta cuándo le acomoda, llama a
  `solicitar_reagenda` con esa preferencia textual y cierra sin prometer hora.

## camila-tool-solicitar-reagenda.workflow.json

Tool de Vapi para **Camila**, la IA que llama a confirmar la reunión agendada.
Si el lead no puede y quiere moverla, Camila pregunta cuándo le acomoda, llama
a este tool y cierra la llamada.

Webhook: `POST https://n8n.oacg.cl/webhook/camila-solicitar-reagenda`

**No mueve la cita.** Clinera no expone endpoint para reagendar (ver más
abajo), así que el tool deja constancia y le pasa el caso a una persona:

1. Avisa a **Google Chat** con nombre, clínica, teléfono, email, la demo
   agendada, lo que el lead dijo textualmente sobre cuándo le acomoda, y el
   link a la fila de Baserow.
2. Marca la fila de Baserow con `Reunión: Reagendar`.
3. Le devuelve a Camila la instrucción de cerrar con *"Perfecto, déjame
   confirmar bien el horario y le escribo de vuelta, ¿está bien?"*, sin
   prometer fecha ni ofrecer horarios.

La preferencia del lead va **sin interpretar** ("la próxima semana en la
mañana"): quien devuelva la llamada necesita saber qué pidió, no una fecha que
adivinó un modelo.

Placeholders de secretos: `__GOOGLE_CHAT_WEBHOOK__` y `__BASEROW_TOKEN__`.

### Lo que falta en la API de Clinera para automatizarlo entero

Verificado contra `app.clinera.io` (agosto 2026): `POST …/citas` crea, y
`PATCH` / `PUT` / `DELETE` sobre `/citas` responden **405**; `/citas/{id}` ni
siquiera existe (**404**). Para que Camila reagende sola hacen falta:

| Endpoint | Para qué |
|---|---|
| `GET /citas?telefono=…` | Saber qué cita tiene quien llama |
| `PATCH /citas/{id}` | Mover fecha/hora validando disponibilidad en el servidor (409 si se la ganaron) |
| `DELETE /citas/{id}` | Cancelar y liberar el bloque |
| API key por header | Hoy son públicos sin llave: listar citas de pacientes así no corresponde |

Con eso, el tool pasa a mover la cita en Clinera y a **mover** el evento de
Google con `sendUpdates: all`, y el paciente recibe el correo con la hora nueva
sobre el mismo Meet.


## CRM Twenty → Meta CAPI (vivo, sep-2026)

Workflow unificado en n8n: **`W1SybZZSEZqAItIt`** (*Clinera | Twenty etapas → Meta CAPI*).
Webhook de producción: `POST …/webhook/crm-sql` (el mismo path que usaba el
workflow SQL viejo). En Twenty: Settings → APIs & Webhooks, target
`…/webhook/crm-sql`, operations `*.*` (incluye `opportunity.updated` **sin**
filtro de stage).

Los emisores viejos están **apagados**:
- `dhwqS9oW3qfvq6Y4` — *Clinera — SQL desde CRM (Twenty)*
- `rWZDSfi8RJ780q76` — *CRM · SQL+ → Meta CAPI* (`SQL_Plus`)

### Mapeo `stage` → evento CAPI → value (USD)

Fuente versionada: `crm-etapas-meta-capi.mapeo.js` (nodo `Mapear etapa y
cifrar datos`). Tabla vigente 2026-09-12 (Ricardo). Cinco etapas.
Cualquier otra no emite: se loguea el valor recibido y se omite.

| stage | event_name | value | condición |
|---|---|---|---|
| `NEW` | `Lead` | 1 | rellenó el formulario; también si lo escribió n8n |
| `MQL` | `MQL` | 10 | closer verifica que es real |
| `MEETING` | `SQL` | 100 | calificado (la demo ocurrió) |
| `CUSTOMER` | `Purchase` | `planClinera`: VORTEX 279 / ATLAS 379 / SUMMIT 479; vacío → 279 | |
| `NQL` | `NQL` | 0 | no responde |

`custom_data.currency = "USD"`. `event_id` = `{opportunityId}_{stage}`.

W1 emite **solo la etapa actual**. No rellena peldaños anteriores ni
inventa un evento para una etapa que no está en la tabla.

**Contrato de salida del nodo (no romperlo otra vez).** Los tres nodos que
siguen no se tocan y leen claves fijas: «Corresponde enviar?» filtra por
`$json.omitido`; «Enviar evento a Meta CAPI» manda
`JSON.stringify($json.payload)`; «Confirmar y auditar» lee `ledgerKey`,
`event_id`, `evento`, `leadgen_id`, `opportunity_id` y escribe el ledger
sólo si Meta devuelve `events_received ≥ 1`. La primera versión del jsCode
del 09-sep devolvía `ok` + `event_name` sin `payload` ni `omitido`: el
filtro dejaba pasar todo y el HTTP fallaba con «JSON Body is not valid
JSON» (`events_received: 0`) — W1 no mandó nada a Meta desde el PUT de
las 16:38Z hasta el arreglo (auditoría 09-sep, H8). `ledgerKey` =
`{evento}:{opportunityId}`. Guardián: `tests/crm-etapas-meta-capi.spec.ts`
(bloque «nodo completo»). **Arreglo aplicado el 09-sep 19:44Z**; prueba
funcional (09-sep): `Lead` 1 → `events_received: 1`. El 12-sep el
mismo contrato, con `Lead` 1.

**El IF «Corresponde enviar?» tiene que estar en formato v2.** Es
`typeVersion: 2`; con parámetros en forma v1 (`conditions.boolean`) no
define ninguna condición y deja pasar todo al HTTP (H9). Hoy la condición
es `$json.omitido` es false → enviar (`aplicar_w1_filtro.py`). Si alguien
lo edita en la UI y n8n lo reescribe, revisar que los ítems omitidos
salgan por la rama «false».
`user_data.lead_id` = `leadgenId` (entero, sin hash) si existe.
`action_source` = `system_generated`. Dedup: ledger del workflow (28 d) +
`event_id`.

El export `crm-sql-twenty.workflow.json` de este repo es el **grafo
histórico** (solo SQL, agosto 2026); ya no es el runtime. Bajar el vivo
por API antes de tocar nodos.

## crm-sql-twenty.workflow.json

El segundo evento del embudo histórico: **SQL** (hoy US$ 10), cuando el
closer marca el lead como calificado en **crm.oacg.cl** (Twenty).
Este JSON es el grafo de agosto 2026, no el runtime.

Webhook: `POST https://n8n.oacg.cl/webhook/crm-sql`

Se configura en Twenty: **Settings → APIs & Webhooks → New webhook**, apuntando
a esa URL y suscrito a `opportunity.updated` / `opportunity.created`.

### Qué cuenta como SQL

Twenty manda en el webhook el **valor** del enum de etapa, no la etiqueta que
se ve en el tablero. El mapa del workspace OACG es:

| Valor en el webhook | Etiqueta en el tablero | CAPI (canónico) |
|---|---|---|
| `NEW` | Nuevo | `Nuevo` / 0 |
| `MQL` | MQL | `MQL` / 10 |
| `MEETING` | SQL | `SQL` / 100 |
| `CUSTOMER` | Customer | `Purchase` / planClinera |
| `NQL` | NQL · No responde | `NQL` / 0 |

**Estado real al 09-sep-2026 (tarde).** El 07-sep se habían cruzado las
etiquetas para calzar con el W1 viejo: el valor `SCREENING` decía «PQL» y
el valor `PQL` decía «MQL». Los datos decían lo contrario (130 negocios en
SCREENING eran leads que agendaron, 86 con fecha de demo). Ese día se creó
la opción `MQL`, se re-etiquetó `PQL` como «PQL» y se movieron los 131
SCREENING a `MQL`. A las 19:46Z se aplicó `aplicar_etapa_mql.py` (Wizard,
Meet y Sub A escriben/comparan `MQL`, escalera
`NEW < PQL < MQL < MEETING < PROPOSAL < CUSTOMER`) y a las 19:48Z se
**borró la opción SCREENING** del campo `stage`. Trampa que ya costó un
susto: al editar las opciones de un SELECT en Twenty hay que conservar el
`id` de cada opción; quitar la opción que llevaba el valor `MQL` (aunque
otra opción tomara el mismo valor) mandó los 130 negocios a `NEW` y hubo
que volver a moverlos por id.

`ETAPAS_SQL` acepta `meeting` y `proposal` (y también las etiquetas `sql` /
`sql+`, por si el webhook llegara desde otra vista).

### Filtros antes de mandar la conversión

1. **Solo oportunidades.** El webhook del CRM está abierto a todos los objetos;
   notas, personas y empresas responden `objeto_no_es_oportunidad`.
2. **Solo si cambió la etapa.** Editar el monto de un negocio que ya está en
   SQL responde `no_cambio_la_etapa` (se mira `updatedFields`).
3. **Solo si lo movió una persona.** El SQL es una calificación humana: si la
   etapa la movió una automatización (`updatedBy.source = API`, que es como
   escribe n8n) responde `etapa_movida_por_automatizacion`. Por eso agendar
   deja el negocio en **MQL** y no lo sube solo a SQL.
4. **Anti-duplicado por negocio durante 90 días**, con el `id` del registro
   como clave. Mover SQL → SQL+ cuenta una sola vez.

### De dónde salen el contacto y los identificadores de Meta

La oportunidad de Twenty **sí** lleva teléfono de cara al tablero
(`telefonoContacto`, tipo PHONES, label «Teléfono del contacto»): n8n lo
copia desde la Persona al crear o refrescar el negocio, para que la vista
de Negocios lo muestre junto al contacto. El email **no** se denormaliza.
El nodo "Validar SQL" sigue resolviendo la persona con
`GET crm.oacg.cl/rest/people/{id}` (token en `$env.TWENTY_API_KEY`) y de ahí
saca email, teléfono y nombre para hashearlos — la columna de la tabla no
es la fuente del CAPI.

Es una conversión **offline**: va con `action_source: system_generated` y el
match lo hace Meta por email y teléfono hasheados (SHA-256). El `fbc` / `fbp`
de la landing sube mucho la calidad de ese match, y Twenty no tiene dónde
guardarlos — así que el nodo **"Baserow - Meta ids"** los busca en la tabla 152
(columnas `Meta fbc` / `Meta fbp`), que es donde el Wizard los deja al capturar
el lead. Si no hay fila o vienen vacíos, el evento sale igual sin ellos.

Valor y moneda salen de `VALOR_SQL` / `MONEDA` en el mismo nodo.

> [!IMPORTANT]
> **Este workflow NO manda el SQL+.** `ETAPAS_SQL` acepta `proposal`, pero el
> anti-duplicado usa el id del negocio como clave, así que un negocio que ya
> mandó su SQL responde `sql_ya_enviado` al subir a SQL+. El SQL+ lo emite otro
> workflow, y ese **no vive en este repo** — ver la sección siguiente. No sumarle
> el SQL+ acá sin apagar el otro primero: serían dos conversiones por el mismo
> salto.

## Lo que NO está versionado: dos workflows más sobre el mismo pixel

Descubierto el 2026-08-19 leyendo la instancia con la API. Los tres apuntan al
pixel `1104567405156111`. Se anotan acá para que nadie vuelva a diseñar el
embudo mirando solo este repo.

| Workflow en n8n | Id | Evento | Valor | Disparo | Estado |
|---|---|---|---|---|---|
| `Clinera \| Twenty etapas → Meta CAPI` | `W1SybZZSEZqAItIt` | `crm-etapas-meta-capi.mapeo.js` (aplicado 2026-09-09) | ver tabla arriba | webhook Twenty `crm-sql` | **activo** |
| `Clinera — SQL desde CRM (Twenty)` | `dhwqS9oW3qfvq6Y4` | `SQL` | US$ 100 | webhook (reemplazado por W1) | **apagado** |
| `CRM · SQL+ → Meta CAPI` | `rWZDSfi8RJ780q76` | ~~`SQL_Plus`~~ | US$ 300 | sondeo PROPOSAL | **apagado** (`SQL_Plus` no se tocó; `HOT` ya no se emite) |
| `OACG TECH \| SQL Conversión Alto Valor` | `1erGwPkeneXUkqzG` | `SQL` | US$ 100 | Baserow tabla 152 + backstop 24 h | activo (Baserow, no Twenty) |

Los dos últimos siguen sin exportarse completos —siguen siendo grafos que sólo
existen en n8n—, pero el 2026-08-21 se les agregó lógica para Google Ads (ver
sección siguiente), y esas piezas nuevas **sí** quedaron versionadas, como
código suelto, en el repo `baserow` (`sales/n8n/nodo-sqlplus-*.js` y el
`jsonBody` de "Baserow - Marcar SQL enviado", documentado en
`sales/HANDOFF.md`). Bajarlos por la API antes de tocar cualquier nodo sigue
siendo obligatorio — la regla de esta sección no cambió, sólo hay más piezas
sueltas que antes.

**`CRM · SQL+ → Meta CAPI`** sondea en vez de escuchar el webhook porque nació
antes de que se confirmara que Twenty emite `opportunity.updated`. Lleva su
propio ledger en la static data, que **solo confirma el nodo posterior al POST**:
si Meta rechaza el evento, el negocio no queda marcado y se reintenta. El valor
sale de `META_CAPI_VALUE_SQL_PLUS`, con 300 como default en el código — si esa
variable está declarada en el entorno de n8n, **gana sobre el código**.

**Doble conteo, resuelto el 2026-08-19.** El primero y el tercero mandan los dos
el evento `SQL` con valor 100. Cada uno usaba el id de su propio sistema
(`sql_<opportunityId de Twenty>` vs `sql_<row.id de Baserow 152>`), y como Meta
deduplica por (`event_name`, `event_id`) esos ids **nunca colisionaban**: un lead
que existía en los dos lados se contaba —y se cobraba— dos veces.

Ahora los dos arman el `event_id` con **el contacto hasheado**, que es lo único
que ambos sistemas comparten:

```
event_id = 'sql_' + sha256( email en minúsculas y sin espacios
                            || teléfono en dígitos, si no hay correo )
```

Dos cosas que hay que respetar al tocar cualquiera de los dos:

1. **La normalización va IDÉNTICA en los dos.** Un `trim()` de más en uno rompe
   la colisión en silencio: los eventos siguen saliendo, Meta sigue aceptándolos,
   y el doble conteo vuelve sin ningún error visible.
2. **No confundir el `event_id` con el anti-duplicado propio de cada workflow.**
   El de Twenty sigue llevando su ledger en la static data por id de negocio, y
   el de Baserow su columna `🎯 Evento SQL enviado` por fila. Esos evitan que
   CADA workflow reenvíe lo suyo; el `event_id` compartido es lo que evita que
   los DOS cuenten el mismo lead.

`SQL` (US$ 100) es el evento de `MEETING`.
`SQL_Plus` ya no se emite.

Además de los placeholders del workflow de reserva, este archivo lleva
`__BASEROW_TOKEN__` en el nodo "Baserow - Meta ids" **y** en el nodo nuevo
"Marcar SQL Google" (ver abajo).

### Google Ads entró al mismo embudo (2026-08-21)

Ricardo pidió alinear Google Ads al mismo vocabulario y montos que Meta ya usa
acá (Lead=1 / MQL=10 / SQL=100 / NQL=0 USD; Customer = plan; SQL+ 200 sin cambio).
El feed de Baserow 152 hay que realinear en el repo `baserow`. Google Ads no tiene un camino de push
por evento sin developer token — a diferencia de Meta CAPI — así que en vez de
un envío paralelo, los workflows de SQL y SQL+ de esta página (no el de MQL) ahora **además**
marcan en Baserow 152 (`🎯 SQL a Google` / `🎯 SQL+ a Google`) justo después
de mandar el evento a Meta. Un
feed nuevo en el repo `baserow` (`sales/n8n/gads-conversiones-sql-csv.js`) lee
esas marcas y se las sirve a Google Ads Data Manager por HTTPS.

Este archivo ganó el nodo **"Marcar SQL Google"**, colgado de "GA4 - SQL":
reusa la fila que "Baserow - Meta ids" ya había buscado por email, sin una
segunda consulta. El detalle completo (por qué Data Manager y no push, el
diseño de las dos columnas, los tres workflows, la verificación) vive en
`baserow/sales/HANDOFF.md`, sección "SQL y SQL+ en Google Ads" — **no se
copia acá** para no desincronizar los dos.

## Cambios en "OACG TECH | Wizard" (no vive en este repo)

El workflow `A3wOPmhQjit8VswM` recibe el formulario de `/ventas` y `/agenda` y
es el que escribe en Baserow y en Twenty. No se versiona acá porque lleva
credenciales inline y sirve a más flujos, pero `/agenda` depende de cuatro
cosas suyas:

- **Un solo MQL.** El nodo "No es booking confirmado?" ahora exige además que
  `landing_url` **no** contenga `/agenda`. En `/agenda` el MQL lo emite el
  workflow de reserva en el momento del agendamiento, con el mismo `event_id`
  que el Pixel; sin este filtro el lead contaba dos MQL con `event_id`
  distintos y Meta no los deduplicaba. `/ventas` sigue igual.
- **Fecha de la demo.** "Prepare Sales Lead Data" ahora deriva `fecha` / `hora`
  de `cal_date` / `cal_start_time` cuando el formulario no las trae. La reserva
  nativa manda la hora local de Chile sin zona (`2026-08-17T13:00:00`) y
  Cal.com la manda en UTC; las dos se normalizan a hora local antes de la
  conversión a UTC que ya existía. Sin esto, "Fecha demo" quedaba vacía en
  Baserow y en Twenty.
- **Responsable = quien atiende.** "Twenty - Crear Lead" toma el profesional de
  `cal_organizer_name` y pone el negocio a su nombre (Rebeca, Nohelymar), en
  vez del sorteo de encargada. Se aplica también cuando el negocio ya existía;
  si no hay profesional, no se reasigna a nadie.
- **Todo lead que agenda entra como MQL.** "Twenty - Crear Lead" y "Twenty - Agendó
  (Cal.com)" deben dejar el negocio en `MQL`, no en `SCREENING` (esa etapa
  se elimina). Subirlo a SQL o HOT es decisión de ventas en el CRM: ni el
  formulario ni el agendamiento lo hacen solos. Antes el agendamiento subía a `MEETING` (SQL)
  y el embudo se saltaba el paso del closer.
- **Teléfono en la vista de Negocios.** "Twenty - Crear Lead" (Wizard y Sub A)
  y "Twenty - Agendó (Meet)" escriben `telefonoContacto` en la Opportunity,
  copiado del número de la Persona. Sin eso la tabla de negocios no tiene
  columna de teléfono: Twenty no proyecta el de `pointOfContact`. Aplicador:
  `integrations/n8n/aplicar_telefono_contacto.py`.
- **Qué cambia cuando un lead que ya existe agenda.** Solo la fecha de la demo y
  el responsable (el profesional con quien quedó el Meet). La etapa no baja
  nunca y tampoco sube: si ventas ya lo había marcado SQL, ahí se queda.
- **Lead que vuelve a completar el formulario (09-sep-2026).** "Twenty - Crear
  Lead" le agrega la etiqueta `VOLVIO_A_COTIZAR` («Volvió a cotizar», opción
  nueva del multi-select `etiquetas`) sin pisar las que tenía, pone la nota
  «🔁 Volvió a cotizar» y refresca `horaRegistro` (sube a «Leads del día»).
  La etapa no se toca. Vive dentro del guard `booking_status !== 'confirmed'`:
  el `booking_confirmed` del mismo lead pasa por la misma rama y no es un
  lead que volvió. Aplicador: `integrations/n8n/aplicar_wizard_volvio_a_cotizar.py`.
