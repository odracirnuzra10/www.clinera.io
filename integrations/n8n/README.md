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

El embudo tiene tres eventos, y cada uno se dispara desde donde realmente
ocurre:

| Evento | Cuándo | Dónde vive | Valor |
|---|---|---|---|
| **MQL** | alguien agenda en `www.clinera.io/agenda` | este workflow | — |
| **SQL** | el closer lo marca calificado en `crm.oacg.cl` | `crm-sql-twenty.workflow.json` | US$ 100 |
| **SQL_Plus** | el closer lo sube a propuesta en `crm.oacg.cl` | **solo en n8n**, ver abajo | US$ 300 |

Al crear la cita, el workflow dispara **en paralelo** a la respuesta del
navegador (nunca la demora ni la rompe):

| Nodo | Destino | Evento |
|---|---|---|
| `Meta CAPI - MQL` | Pixel `1104567405156111` | `MQL` |
| `GA4 - MQL` | `G-FB5YV66KKJ` (Measurement Protocol) | `mql` |

**Dedupe con el Pixel del navegador**: `/agenda` genera el `event_id` *antes*
de llamar al webhook, lo manda en el body y usa el mismo en
`fbq('track','Schedule', …, { eventID })`. Meta deduplica por
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

Para **hoy**, la API de Clinera arma la grilla desde la hora **UTC** actual en
vez del horario de atención del profesional. Chile va cuatro horas atrás, así
que a las 16:30 de la tarde el servidor ya está en 20:30 y devuelve cero horas
aunque queden bloques libres; más temprano devuelve horas que no corresponden.
Por eso el picker parte en mañana. Cuando Clinera lo corrija se puede volver a
incluir el día en curso.

## clinera-meet-por-profesional.workflow.json

Crea un **Google Meet en el calendario de la persona con la que se agendó**.
Hoy mapea a Nohe y Rebe; sumar a alguien más es agregar una línea al array
`CALENDARIOS` del nodo "Normalizar Reserva".

| Profesional (match por nombre, sin acentos) | Calendario donde cae el evento |
|---|---|
| contiene `nohe` | `nohelymar.sanchez@oacg.cl` |
| contiene `rebe` | `rebeca@oacg.cl` |

Webhook: `POST https://n8n.oacg.cl/webhook/clinera-meet`

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

## clinera-vigia-disponibilidad.workflow.json

Avisa a Google Chat cuando `/agenda` se queda **sin ninguna hora que ofrecer**.

Es la clase de falla que no se nota sola: la página no se cae, muestra "sin
horas disponibles" y el visitante se va. Con campaña activa eso es pagar por
tráfico que rebota. Pasó dos veces el 14 de agosto — una porque el profesional
quedó desasignado del tratamiento en app.clinera.io, otra por el desfase UTC
del día en curso.

- Corre **cada 30 minutos entre las 8 y las 21** (hora de Chile).
- Pide el resumen `?desde=<mañana>&dias=14`. **Empieza en mañana a propósito**:
  la página no ofrece el día en curso, así que incluirlo daría una alarma falsa
  todas las tardes.
- Cuenta rota cuando ningún día hábil de la ventana tiene hora, o cuando todos
  vuelven como desconocidos (`-1`).
- **Avisa en los bordes**: cuando se rompe y cuando se recupera, con las horas
  que estuvo caída. Mientras siga rota repite el aviso una vez cada dos horas,
  no en cada corrida.

El mensaje incluye los conteos de los próximos días y las dos causas probables
por orden, para que quien lo lea sepa dónde mirar sin abrir n8n.

Placeholder de secreto: `__GOOGLE_CHAT_WEBHOOK__`.

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

## crm-sql-twenty.workflow.json

El segundo evento del embudo: **SQL** (US$ 100), cuando el closer marca el
lead como calificado en **crm.oacg.cl** (Twenty).

Webhook: `POST https://n8n.oacg.cl/webhook/crm-sql`

Se configura en Twenty: **Settings → APIs & Webhooks → New webhook**, apuntando
a esa URL y suscrito a `opportunity.updated` / `opportunity.created`.

### Qué cuenta como SQL

Twenty manda en el webhook el **valor** del enum de etapa, no la etiqueta que
se ve en el tablero. El mapa del workspace OACG es:

| Valor en el webhook | Etiqueta en el tablero |
|---|---|
| `NEW` | Nuevo |
| `SCREENING` | **MQL** |
| `PQL` | PQL · No contesta |
| `MEETING` | **SQL** |
| `PROPOSAL` | **SQL+** |
| `CUSTOMER` | Contrata |
| `NQL` | NQL · No califica |

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

La oportunidad de Twenty no lleva email ni teléfono encima: solo
`pointOfContactId`. El nodo "Validar SQL" resuelve la persona con
`GET crm.oacg.cl/rest/people/{id}` (token en `$env.TWENTY_API_KEY`) y de ahí
saca email, teléfono y nombre para hashearlos.

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

| Workflow en n8n | Id | Evento | Valor | Disparo |
|---|---|---|---|---|
| `Clinera — SQL desde CRM (Twenty)` | `dhwqS9oW3qfvq6Y4` | `SQL` | US$ 100 | webhook de Twenty (este archivo) |
| `CRM · SQL+ → Meta CAPI` | `rWZDSfi8RJ780q76` | `SQL_Plus` | US$ 300 | sondeo cada 5 min a `stage=PROPOSAL` |
| `OACG TECH \| SQL Conversión Alto Valor` | `1erGwPkeneXUkqzG` | `SQL` | US$ 100 | Baserow tabla 152 + backstop 24 h |

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

`SQL` (US$ 100) y `SQL_Plus` (US$ 300) son eventos distintos a propósito y no se
deduplican entre sí: son dos peldaños del embudo, no el mismo hecho contado dos
veces.

Además de los placeholders del workflow de reserva, este archivo lleva
`__BASEROW_TOKEN__` en el nodo "Baserow - Meta ids" **y** en el nodo nuevo
"Marcar SQL Google" (ver abajo).

### Google Ads entró al mismo embudo (2026-08-21)

Ricardo pidió alinear Google Ads al mismo vocabulario y montos que Meta ya usa
acá (MQL=10 / SQL=100 / SQL+=300 USD). Google Ads no tiene un camino de push
por evento sin developer token — a diferencia de Meta CAPI — así que en vez de
un envío paralelo, los TRES workflows de esta página (este archivo y los dos
"sólo en n8n" de abajo) ahora **además** marcan en Baserow 152 (`🎯 SQL a
Google` / `🎯 SQL+ a Google`) justo después de mandar el evento a Meta. Un
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
- **Todo lead entra como MQL.** "Twenty - Crear Lead" y "Twenty - Agendó
  (Cal.com)" dejan el negocio en `SCREENING` (MQL), siempre. Subirlo a SQL o
  SQL+ es decisión de ventas (Nohe, Rebe o Cheul) en el CRM: ni el formulario ni
  el agendamiento lo hacen solos. Antes el agendamiento subía a `MEETING` (SQL)
  y el embudo se saltaba el paso del closer.
- **Qué cambia cuando un lead que ya existe agenda.** Solo la fecha de la demo y
  el responsable (el profesional con quien quedó el Meet). La etapa no baja
  nunca y tampoco sube: si ventas ya lo había marcado SQL, ahí se queda.
