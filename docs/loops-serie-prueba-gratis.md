# Serie de correos de la prueba gratis (Loops)

Ricardo, 7-nov-2026. Para todo el que crea su cuenta gratis en app.clinera.io.
Objetivo: que conecte WhatsApp, Instagram y Facebook, cargue a sus profesionales y aproveche los 7 días,
sabiendo que puede pedir ayuda o una reunión cuando quiera.

## Cómo se arma en Loops

- **Disparador del loop:** evento `trial_iniciado`, que manda n8n cuando app.clinera.io avisa `account_created`.
- **Propiedades del contacto** (las manda n8n): `firstName`, `clinica`, `telefono`, `plan`, `trialInicio`,
  `whatsappConectado`, `primeraConversacion`, `planContratado`.
- **Filtros:** cada correo tiene uno. Así no le pides conectar WhatsApp a quien ya lo hizo, y se corta todo si contrata.
- **Remitente:** Ricardo de Clinera. Responder a: el correo de ventas.
- **Links:**
  - App: https://app.clinera.io
  - Asistencia: https://wa.me/56985581524?text=necesito%20asistencia
  - Reunión: https://www.clinera.io/agenda
  - Planes: https://www.clinera.io/planes

| # | Cuándo | Filtro (además de `planContratado` ≠ true) | Asunto |
|---|---|---|---|
| 1 | Al tiro | — | Bienvenido a Clinera |
| 2 | Día 1 | `whatsappConectado` ≠ true | Conecta tu WhatsApp en 3 minutos |
| 3 | Día 2 | — | Carga a tus profesionales y sus horarios |
| 4 | Día 3 | — | Suma Instagram y Facebook |
| 5 | Día 4 | `primeraConversacion` ≠ true | Mira a la IA responder por ti |
| 6 | Día 6 | — | Te queda 1 día de prueba |
| 7 | Día 8 | — | ¿Necesitas más tiempo? |

---

## 1 · Al tiro · «Bienvenido a Clinera»

Hola {firstName},

Bienvenido a Clinera. Ya creaste la cuenta de {clinica} y tienes 7 días gratis con acceso completo.

Para que la IA empiece a agendar pacientes, completa tu clínica en app.clinera.io:

> **1. Conecta tus activos:** el WhatsApp de tu clínica, Instagram y Facebook. Ahí llegan los mensajes de tus pacientes.
> **2. Carga tus tratamientos:** nombre, duración y precio de cada uno. La IA solo ofrece lo que tú cargues.
> **3. Agrega a tus profesionales** con los días y horas en que atienden.

[Completar mi clínica] → https://app.clinera.io

Con eso listo, la IA responde, ofrece horas reales y agenda pacientes por ti.

Si te trabas en algo, escríbeme por WhatsApp y te ayudamos al tiro.
[Solicita asistencia] → wa.me

Ricardo
Fundador de Clinera

---

## 2 · Día 1 · «Conecta tu WhatsApp en 3 minutos»

Hola {firstName},

Tus pacientes ya te escriben por WhatsApp. Cuando lo conectas a Clinera, cada mensaje queda en un solo lugar y la IA puede responder y agendar.

> **Son 3 minutos:** entra a Clinera, abre Canales y conecta WhatsApp con tu número de siempre. No cambias de número.

[Conectar WhatsApp] → https://app.clinera.io

¿Prefieres hacerlo con nosotros? Te acompañamos por WhatsApp.
[Solicita asistencia] → wa.me

Ricardo

---

## 3 · Día 2 · «Carga a tus profesionales y sus horarios»

Hola {firstName},

La agenda funciona por profesional: cada uno con sus horarios y sus tratamientos. Así la IA solo ofrece horas reales.

> **Hoy:** agrega a tus profesionales y marca los días y horas en que atienden.

[Cargar profesionales] → https://app.clinera.io

Si tienes muchos datos en otro sistema, nuestro equipo te ayuda a migrarlos.
[Agendar una reunión] → https://www.clinera.io/agenda

Ricardo

---

## 4 · Día 3 · «Suma Instagram y Facebook»

Hola {firstName},

Muchos pacientes escriben primero por Instagram o Facebook. Con Clinera esos mensajes llegan al mismo lugar que WhatsApp y terminan en una hora agendada.

> **Conecta tus redes** desde Canales, en la misma pantalla donde conectaste WhatsApp.

[Conectar redes] → https://app.clinera.io

Ricardo

---

## 5 · Día 4 · «Mira a la IA responder por ti»

Hola {firstName},

Todavía no vemos conversaciones en tu cuenta. La mejor forma de probarlo es simple:

> **Escríbele a tu clínica** desde tu celular personal, como si fueras paciente, y pide una hora.

Vas a ver cómo la IA responde, ofrece horarios y deja la cita en tu agenda.

[Ir a Clinera] → https://app.clinera.io

¿Algo no funciona? [Solicita asistencia] → wa.me

Ricardo

---

## 6 · Día 6 · «Te queda 1 día de prueba»

Hola {firstName},

Mañana termina tu prueba gratis. Para seguir, eliges tu plan dentro de Clinera:

> **Flux** US$ 49 · **Hex** US$ 129 · **Xcale** US$ 149 (recomendado, con onboarding humano). Sin costo de implementación.

[Ver planes] → https://www.clinera.io/planes

Si quieres que te ayudemos a elegir, agenda 30 minutos con el equipo o escríbenos por WhatsApp.
[Agendar una reunión] → https://www.clinera.io/agenda

Ricardo

---

## 7 · Día 8 · «¿Necesitas más tiempo?»

Hola {firstName},

Terminó tu prueba y no quiero que te quedes a medio camino. Si no alcanzaste a probar todo, cuéntame qué te faltó y lo vemos juntos.

> **Responde este correo** o escríbenos por WhatsApp. Te respondemos el mismo día.

[Solicita asistencia] → wa.me
[Agendar una reunión] → https://www.clinera.io/agenda

Ricardo
