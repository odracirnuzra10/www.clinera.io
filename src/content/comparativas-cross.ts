// Pilar B.3 — Comparativas cruzadas (sección 3.x del plan SEO).
// Capturan tráfico de búsquedas tipo "AgendaPro vs Reservo": el usuario YA está
// comparando entre dos competidores; entramos como tercera opción.

export type CrossCell = "yes" | "no" | "partial";

export type CrossRow = {
  feature: string;
  A: CrossCell | string;
  B: CrossCell | string;
  clinera: CrossCell | string;
};

export type CrossDimension = {
  title: string;
  body: string;
};

export type CompetitorKey = "agendapro" | "reservo" | "medilink" | "doctocliq" | "dentalink" | "sacmed";

export type Cruzada = {
  slug: string;
  competitorA: { key: CompetitorKey; name: string; siteLabel: string };
  competitorB: { key: CompetitorKey; name: string; siteLabel: string };
  title: string;
  description: string;
  h1: string;
  intro: string;
  tldr: { A: string; B: string; clinera: string };
  table: CrossRow[];
  dimensions: CrossDimension[];
  faqs: { q: string; a: string }[];
  publishedAt: string;
  updatedAt?: string;
};

const COMPETITORS = {
  agendapro: { key: "agendapro" as const, name: "AgendaPro", siteLabel: "agendapro.com" },
  reservo: { key: "reservo" as const, name: "Reservo", siteLabel: "reservo.cl" },
  medilink: { key: "medilink" as const, name: "Medilink", siteLabel: "medilink.cl" },
  doctocliq: { key: "doctocliq" as const, name: "Doctocliq", siteLabel: "doctocliq.com" },
  dentalink: { key: "dentalink" as const, name: "Dentalink", siteLabel: "softwaredentalink.com" },
  sacmed: { key: "sacmed" as const, name: "Sacmed", siteLabel: "sacmed.cl" },
};

// Filas comunes de la tabla — solo varían los cell-values entre cruzadas.
// Todas las cruzadas comparten el patrón: A | B | Clinera (3 columnas).

export const cruzadas: Record<string, Cruzada> = {
  // ============================================================
  // 1. AgendaPro vs Reservo
  // ============================================================
  "agendapro-vs-reservo": {
    slug: "agendapro-vs-reservo",
    competitorA: COMPETITORS.agendapro,
    competitorB: COMPETITORS.reservo,
    title: "AgendaPro vs Reservo 2026: comparativa completa (+ alternativa con IA)",
    description:
      "AgendaPro y Reservo comparados feature por feature: agenda, ficha clínica, WhatsApp, integraciones, precio. Más una tercera alternativa con IA conversacional para tu clínica.",
    h1: "AgendaPro vs Reservo 2026: ¿cuál conviene a tu clínica?",
    intro:
      "AgendaPro tiene escala regional con 20.000+ negocios en LATAM y atiende múltiples verticales (salud, spa, gym). Reservo es chileno, enfocado en clínicas médicas, con 500+ clínicas activas. Ambos resuelven agenda + cobros, pero ninguno tiene IA conversacional en producción para responder WhatsApp 24/7. Si ese es tu cuello de botella, evalúa Clinera como tercera opción.",
    tldr: {
      A: "AgendaPro es mejor si tienes negocio multi-vertical (no sólo clínica) y quieres una marca consolidada en toda LATAM con muchas integraciones de pagos.",
      B: "Reservo es mejor si tu prioridad es ficha clínica madura (odontograma, plantillas por especialidad) y facturación electrónica DTE en Chile.",
      clinera:
        "Clinera es mejor si tu cuello de botella son los WhatsApps sin responder. AURA atiende, agenda y confirma 24/7 con IA conversacional, y se integra con tu agenda actual.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", A: "no", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp marketing", A: "partial", B: "partial", clinera: "yes" },
      { feature: "Integración MCP / API abierta para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Atribución de ventas a campañas (Meta/Google)", A: "partial", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Consentimientos informados", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Facturación electrónica DTE Chile", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Pagos online integrados", A: "yes", B: "yes", clinera: "yes" },
      { feature: "App móvil nativa", A: "yes", B: "no", clinera: "yes" },
      { feature: "Precios públicos en web", A: "yes", B: "no", clinera: "yes" },
      { feature: "Sin permanencia", A: "no", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "$19/usuario", B: "consultar", clinera: "$279 (VORTEX)" },
    ],
    dimensions: [
      {
        title: "Origen, escala y foco",
        body:
          "AgendaPro nació en 2014 en Chile y hoy opera en 9 países de LATAM con más de 20.000 negocios. Su foco es horizontal: sirve a clínicas, spas, gimnasios y centros estéticos por igual. Reservo es chileno, fundado más recientemente, con foco vertical en clínicas médicas (500+ activas) y un módulo de ficha clínica históricamente más maduro que el de AgendaPro.",
      },
      {
        title: "Agenda y reserva online",
        body:
          "Ambos tienen agenda multi-profesional, reserva online 24/7, multi-sede y bloqueos de horarios. AgendaPro suma una app móvil nativa con buena UX para que el equipo gestione la agenda desde el celular. Reservo no tiene app nativa pero su web responsive es sólida en escritorio.",
      },
      {
        title: "Ficha clínica",
        body:
          "Ventaja Reservo: plantillas por especialidad, odontograma dental nativo, consentimientos informados con firma digital. AgendaPro cubre lo básico de ficha clínica pero el flujo completo es más liviano que el de Reservo, especialmente para verticales muy específicas (dental, medicina estética).",
      },
      {
        title: "WhatsApp e IA — donde gana Clinera",
        body:
          "Esta es la dimensión que ninguno de los dos cubre bien. AgendaPro y Reservo tratan WhatsApp como un canal de envío manual (recordatorios, confirmaciones simples) o como integración para que TÚ escribas los mensajes. Ninguno tiene un agente IA que responda al paciente, agende solo y derive a humano sólo cuando hace falta. Clinera, con AURA, atiende 24/7 desde el WhatsApp Business de tu clínica con memoria contextual y derivación a humano automática.",
      },
      {
        title: "Precio y transparencia",
        body:
          "AgendaPro publica USD 19/usuario/mes (te puede subir rápido si tienes 5+ profesionales). Reservo no publica precios — atiende por formulario o teléfono. Clinera tiene VORTEX USD 279/mes, ATLAS USD 379/mes y SUMMIT USD 479/mes (bolsa de créditos: 28.000/37.000/46.000), todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿AgendaPro o Reservo es más caro?",
        a: "AgendaPro publica USD 19/usuario/mes — para una clínica de 4 profesionales son USD 76/mes solo en agenda. Reservo no publica precios pero suele cotizarse en el rango de USD 60-120/mes para clínicas pequeñas-medianas en Chile. Ambos cobran extras por SMS, recordatorios y módulos avanzados.",
      },
      {
        q: "¿Cuál soporta multi-sede?",
        a: "Los dos. AgendaPro tiene panel multi-sede consolidado y Reservo permite gestionar varias sedes con permisos por sucursal. Clinera también soporta multi-sede en todos los planes.",
      },
      {
        q: "¿Puedo migrar de AgendaPro a Reservo (o viceversa) sin perder datos?",
        a: "En teoría sí: ambos exportan pacientes, agenda histórica y fichas a CSV o vía API. La migración manual de notas de evolución suele ser la parte más delicada y puede tomar 1-2 semanas con acompañamiento del proveedor receptor.",
      },
      {
        q: "¿Hay alternativas con IA conversacional?",
        a: "Sí: Clinera (con AURA) responde, agenda y confirma pacientes 24/7 desde tu WhatsApp Business, con memoria contextual entre conversaciones e integración MCP. Es la única opción de las tres con IA en producción para clínicas en LATAM.",
      },
      {
        q: "¿Tengo que elegir solo uno?",
        a: "No necesariamente. Clinera puede convivir con AgendaPro o Reservo: tú mantenés tu agenda donde está y AURA opera el canal WhatsApp + analítica de marketing por encima vía API. Es la decisión típica de clínicas que ya invirtieron mucho tiempo en su sistema actual.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 2. AgendaPro vs Medilink
  // ============================================================
  "agendapro-vs-medilink": {
    slug: "agendapro-vs-medilink",
    competitorA: COMPETITORS.agendapro,
    competitorB: COMPETITORS.medilink,
    title: "AgendaPro vs Medilink 2026: comparativa (+ alternativa con WhatsApp IA)",
    description:
      "AgendaPro vs Medilink: agenda multi-vertical vs Contact Center IA por voz para clínicas. Más una tercera opción que opera por WhatsApp 24/7 con IA conversacional.",
    h1: "AgendaPro vs Medilink 2026: ¿cuál conviene a tu clínica?",
    intro:
      "AgendaPro es la solución de agenda más usada en LATAM (20.000+ negocios, multi-vertical). Medilink es chileno y tiene IA pero por canal de voz (Contact Center). Si tu paciente prefiere WhatsApp antes que llamada, ninguno cubre eso bien — Clinera es la tercera opción.",
    tldr: {
      A: "AgendaPro es mejor si quieres escala regional, app móvil sólida y precios por usuario claros, sin foco IA.",
      B: "Medilink es mejor si tu cuello de botella son las llamadas perdidas y quieres un Contact Center IA por voz integrado a tu agenda.",
      clinera:
        "Clinera es mejor si tus pacientes hablan por WhatsApp (no llaman). AURA atiende, agenda y confirma 24/7 desde tu WhatsApp Business.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "IA por canal de voz (llamadas)", A: "no", B: "yes", clinera: "no" },
      { feature: "Coexistencia con WhatsApp Business", A: "no", B: "partial", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "yes", clinera: "yes" },
      { feature: "Memoria contextual entre conversaciones", A: "no", B: "partial", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Pagos online integrados", A: "yes", B: "partial", clinera: "yes" },
      { feature: "App móvil nativa", A: "yes", B: "partial", clinera: "yes" },
      { feature: "Atribución de ventas a campañas", A: "partial", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "partial", clinera: "yes" },
      { feature: "Precios públicos en web", A: "yes", B: "no", clinera: "yes" },
      { feature: "Setup en menos de 1 hora", A: "yes", B: "no", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "$19/usuario", B: "consultar", clinera: "$279 (VORTEX)" },
    ],
    dimensions: [
      {
        title: "Estrategia de canal: voz vs chat",
        body:
          "Medilink apostó por IA en el canal de voz: tiene un Contact Center que recibe llamadas, agenda y deriva. Es buena opción si tu clínica recibe muchas llamadas que no logra contestar. AgendaPro no tiene IA y trata WhatsApp como canal manual. Clinera apostó por IA en WhatsApp porque, en estética y medicina ambulatoria en LATAM, el canal dominante hoy es chat — no llamada. La elección depende de cómo se comunica tu paciente.",
      },
      {
        title: "Foco vertical",
        body:
          "AgendaPro es horizontal (clínica + spa + gym + estética + barbería). Medilink es 100% clínico, con foco en clínicas médicas chilenas. Clinera es 100% clínico también (médica + estética). Si tienes negocio mixto, AgendaPro encaja; si es solo clínica, Medilink y Clinera son más específicos.",
      },
      {
        title: "Ficha clínica",
        body:
          "Medilink tiene ficha clínica robusta, plantillas por especialidad y telemedicina integrada. AgendaPro tiene ficha clínica liviana, suficiente para clínicas estéticas pero corta para especialidades muy técnicas (dental complejo, neurología, etc).",
      },
      {
        title: "Precio y transparencia",
        body:
          "AgendaPro publica USD 19/usuario/mes. Medilink no publica precios — atiende por demo/cotización. Clinera publica VORTEX USD 279/mes, ATLAS USD 379 y SUMMIT USD 479 (bolsa de créditos 28.000/37.000/46.000), sin permanencia; implementación USD 450 (pago único) con onboarding asistido — operando el mismo día.",
      },
    ],
    faqs: [
      {
        q: "¿Medilink es mejor que AgendaPro para una clínica médica?",
        a: "Medilink suele ser mejor si tu volumen alto es de llamadas telefónicas y quieres que IA las conteste. AgendaPro es mejor si tu prioridad es agenda + cobros + multi-vertical y no necesitas IA. Para WhatsApp con IA, ninguno — ahí Clinera tiene ventaja.",
      },
      {
        q: "¿Cuál tiene mejor app móvil?",
        a: "AgendaPro tiene la app móvil más pulida de los tres (iOS + Android). Medilink tiene web responsive sólida pero app más limitada. Clinera tiene app móvil nativa y panel web completo.",
      },
      {
        q: "¿Cuál es más caro?",
        a: "Depende del tamaño. AgendaPro es USD 19/usuario, así que para 5 profesionales son USD 95/mes. Medilink suele cotizarse en USD 100-200/mes para clínicas pequeñas-medianas. Clinera VORTEX es USD 279/mes.",
      },
      {
        q: "¿Hay alternativas con IA conversacional WhatsApp 24/7?",
        a: "Clinera es la única de las tres con IA conversacional WhatsApp en producción (con AURA, basada en LangChain + MCP, memoria contextual y derivación automática a humano).",
      },
      {
        q: "¿Puedo combinar Medilink (voz) con WhatsApp IA?",
        a: "Sí. Clinera puede operar el canal WhatsApp encima de Medilink vía API/MCP. Tus llamadas siguen entrando a Medilink y los chats van a AURA. Es una arquitectura común en clínicas que recién están migrando hacia IA.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 3. Reservo vs Medilink
  // ============================================================
  "reservo-vs-medilink": {
    slug: "reservo-vs-medilink",
    competitorA: COMPETITORS.reservo,
    competitorB: COMPETITORS.medilink,
    title: "Reservo vs Medilink 2026: comparativa para clínicas chilenas (+ alternativa IA)",
    description:
      "Reservo vs Medilink: ficha clínica robusta vs Contact Center IA por voz. Más una alternativa con IA WhatsApp 24/7 que se integra con tu agenda actual.",
    h1: "Reservo vs Medilink 2026: ¿cuál conviene a tu clínica chilena?",
    intro:
      "Ambos son chilenos, los dos tienen ficha clínica madura y los dos están enfocados 100% en clínicas médicas. La diferencia está en IA: Reservo no tiene, Medilink tiene IA por canal de voz. Si tus pacientes prefieren WhatsApp, evalúa Clinera como tercera opción.",
    tldr: {
      A: "Reservo es mejor si tu prioridad absoluta es ficha clínica madura, odontograma, DTE, y no necesitas IA conversacional.",
      B: "Medilink es mejor si te pierdes muchas llamadas y quieres un Contact Center IA que las atienda 24/7.",
      clinera:
        "Clinera es mejor si tu canal principal es WhatsApp y quieres IA que responda, agende y derive a humano sin recepción humana detrás.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "IA por canal de voz", A: "no", B: "yes", clinera: "no" },
      { feature: "Coexistencia WhatsApp Business", A: "no", B: "partial", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "yes", clinera: "yes" },
      { feature: "Memoria contextual IA", A: "no", B: "partial", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital madura", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Telemedicina integrada", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Facturación electrónica DTE Chile", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Atribución de ventas a campañas", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "partial", clinera: "yes" },
      { feature: "App móvil nativa", A: "no", B: "partial", clinera: "yes" },
      { feature: "Precios públicos en web", A: "no", B: "no", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "consultar", B: "consultar", clinera: "$279 (VORTEX)" },
    ],
    dimensions: [
      {
        title: "Foco y trayectoria en Chile",
        body:
          "Los dos son fuertes en Chile y tienen reputación sólida. Reservo es referente histórico en agenda + ficha (500+ clínicas, +1M citas históricas). Medilink se posicionó más recientemente con su Contact Center IA por voz. Ambos tienen soporte local en Chile.",
      },
      {
        title: "Estrategia IA",
        body:
          "Reservo no tiene IA conversacional en producción. Medilink sí, pero por canal de voz (llamadas). Si tu paciente promedio prefiere chat, ninguno te resuelve el problema; Clinera, con AURA, opera 24/7 sobre WhatsApp Business.",
      },
      {
        title: "Ficha clínica",
        body:
          "Empate técnico. Los dos tienen ficha madura, plantillas por especialidad, odontograma dental, consentimientos informados con firma digital. Para clínicas que priorizan la capa clínica sobre la operativa, cualquiera de los dos resuelve.",
      },
      {
        title: "WhatsApp",
        body:
          "Ambos tratan WhatsApp como canal complementario: envío manual de recordatorios, confirmaciones simples. Ninguno tiene un agente IA que mantenga conversaciones reales con pacientes y agende sin intervención humana. Esa es la categoría donde Clinera juega solo entre los chilenos.",
      },
      {
        title: "Precio",
        body:
          "Ni Reservo ni Medilink publican precios — atienden por cotización. Clinera tiene VORTEX USD 279/mes, ATLAS USD 379 y SUMMIT USD 479 (bolsa de créditos 28.000/37.000/46.000), todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿Reservo o Medilink tiene mejor ficha clínica?",
        a: "Empate técnico. Reservo tiene más años de iteración en plantillas por especialidad y odontograma dental. Medilink tiene un flujo más moderno con telemedicina integrada. La elección depende del peso que le des a la antigüedad vs la modernidad de la UX.",
      },
      {
        q: "¿Cuál soporta DTE / facturación electrónica chilena?",
        a: "Los dos tienen DTE integrado para clínicas chilenas. Reservo tiene módulo financiero más detallado (comisiones por profesional, reportes contables). Medilink cumple lo básico de DTE.",
      },
      {
        q: "¿Cuál atiende llamadas 24/7?",
        a: "Medilink tiene Contact Center IA por voz que atiende llamadas fuera de horario. Reservo no — depende de tu recepción humana o de un servicio externo.",
      },
      {
        q: "¿Hay alternativa con WhatsApp IA en Chile?",
        a: "Clinera. Es chilena (OACG SpA), opera con IA conversacional WhatsApp 24/7 (AURA, basada en LangChain + MCP), tiene atribución de ventas a campañas Meta/Google, y publica precios desde USD 279/mes.",
      },
      {
        q: "¿Puedo usar Clinera sin migrar de Reservo o Medilink?",
        a: "Sí. Clinera se integra vía API y MCP con Reservo, Medilink y otros. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu sistema actual. Es la decisión común de clínicas que ya tienen mucha data en su software.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 4. AgendaPro vs Doctocliq
  // ============================================================
  "agendapro-vs-doctocliq": {
    slug: "agendapro-vs-doctocliq",
    competitorA: COMPETITORS.agendapro,
    competitorB: COMPETITORS.doctocliq,
    title: "AgendaPro vs Doctocliq 2026: comparativa para clínicas (+ alternativa con IA)",
    description:
      "AgendaPro vs Doctocliq: agenda LATAM multi-vertical vs telemedicina + agenda mexicana. Más una alternativa con IA conversacional WhatsApp 24/7.",
    h1: "AgendaPro vs Doctocliq 2026: ¿cuál conviene a tu clínica?",
    intro:
      "AgendaPro es la opción de agenda más usada en LATAM con 20.000+ negocios y foco multi-vertical. Doctocliq es mexicana, especializada en telemedicina + agenda con foco en consulta médica. Ninguno tiene IA conversacional en producción para responder pacientes por WhatsApp 24/7 — ahí entra Clinera como tercera opción.",
    tldr: {
      A: "AgendaPro es mejor si quieres agenda multi-vertical (clínica + spa + gym), app móvil pulida y escala regional consolidada.",
      B: "Doctocliq es mejor si tu volumen alto es telemedicina y necesitas un flujo de videoconsulta integrado a la agenda.",
      clinera:
        "Clinera es mejor si tu canal de captación principal es WhatsApp y quieres IA que atienda, agende y derive 24/7.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "Telemedicina / videoconsulta integrada", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Coexistencia WhatsApp Business", A: "no", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "no", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Receta médica electrónica", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Pagos online integrados", A: "yes", B: "yes", clinera: "yes" },
      { feature: "App móvil nativa", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Atribución de ventas a campañas", A: "partial", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "no", clinera: "yes" },
      { feature: "Precios públicos en web", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Cobertura LATAM", A: "yes", B: "partial", clinera: "yes" },
      { feature: "Sin permanencia", A: "no", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "$19/usuario", B: "$25/profesional", clinera: "$279 (VORTEX)" },
    ],
    dimensions: [
      {
        title: "Origen y cobertura",
        body:
          "AgendaPro nació en Chile (2014) y opera en 9 países LATAM. Doctocliq es mexicana, fuerte en México y con presencia creciente en otros países hispanohablantes. Si tu clínica está en CL/PE/CO, AgendaPro tiene más casos locales; si estás en MX, Doctocliq tiene ventaja territorial.",
      },
      {
        title: "Telemedicina",
        body:
          "Doctocliq nació pensando en consulta médica y tiene videoconsulta integrada como funcionalidad central, con receta médica electrónica y firma digital. AgendaPro cubre telemedicina como módulo opcional pero no es su foco. Para una clínica 100% telemedicina, Doctocliq encaja mejor.",
      },
      {
        title: "Multi-vertical vs especialización médica",
        body:
          "AgendaPro sirve por igual a clínicas, spas, gym, barberías y centros estéticos. Doctocliq es 100% médico. Si tienes operación mixta o quieres un único proveedor para varios negocios, AgendaPro encaja; si es solo clínica médica, Doctocliq y Clinera son más específicos.",
      },
      {
        title: "WhatsApp e IA — donde gana Clinera",
        body:
          "Ninguno de los dos tiene IA conversacional en producción para WhatsApp. AgendaPro permite enviar mensajes manuales y recordatorios automáticos básicos. Doctocliq tiene confirmaciones automáticas pero no IA que mantenga conversaciones reales. Clinera, con AURA, atiende, agenda y deriva 24/7 con memoria contextual entre conversaciones.",
      },
      {
        title: "Precio",
        body:
          "AgendaPro USD 19/usuario/mes (escala con el equipo). Doctocliq desde USD 25/profesional/mes. Clinera VORTEX USD 279/mes, ATLAS USD 379, SUMMIT USD 479 (bolsa de créditos 28.000/37.000/46.000) — todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿AgendaPro o Doctocliq es mejor para telemedicina?",
        a: "Doctocliq tiene mejor flujo nativo de videoconsulta + receta médica electrónica integrada. AgendaPro la cubre como módulo pero no es su foco principal.",
      },
      {
        q: "¿Cuál tiene mejor cobertura en México?",
        a: "Doctocliq es mexicana y tiene mayor base instalada en MX. AgendaPro también opera en México pero su base más grande está en Chile, Colombia y Perú.",
      },
      {
        q: "¿Cuál es más caro?",
        a: "Depende del tamaño del equipo. AgendaPro es USD 19/usuario, Doctocliq desde USD 25/profesional. Para una clínica de 4 personas: AgendaPro ~USD 76, Doctocliq ~USD 100. Clinera VORTEX USD 279/mes fijo, con IA conversacional incluida.",
      },
      {
        q: "¿Hay opción con IA conversacional WhatsApp?",
        a: "Sí: Clinera. Es la única de las tres opciones con AURA, agente IA en producción que atiende WhatsApp 24/7 con memoria contextual e integración MCP.",
      },
      {
        q: "¿Puedo combinar AgendaPro o Doctocliq con Clinera?",
        a: "Sí. Clinera se integra vía API/MCP con ambos. Mantenés tu agenda donde está y AURA opera el canal WhatsApp + analítica de campañas por encima. No hay que migrar para empezar.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 5. Reservo vs Doctocliq
  // ============================================================
  "reservo-vs-doctocliq": {
    slug: "reservo-vs-doctocliq",
    competitorA: COMPETITORS.reservo,
    competitorB: COMPETITORS.doctocliq,
    title: "Reservo vs Doctocliq 2026: comparativa para clínicas (+ alternativa con IA)",
    description:
      "Reservo (Chile) vs Doctocliq (México): ambos enfocados en clínicas médicas. Comparativa de ficha clínica, telemedicina, precio. Más alternativa con IA WhatsApp.",
    h1: "Reservo vs Doctocliq 2026: ¿cuál conviene a tu clínica?",
    intro:
      "Reservo es chileno, fuerte en agenda + ficha clínica + DTE local (500+ clínicas). Doctocliq es mexicano, fuerte en telemedicina + receta médica electrónica. Ambos son 100% médicos. Si quieres agregar IA conversacional WhatsApp, Clinera es la tercera opción.",
    tldr: {
      A: "Reservo es mejor si tu clínica está en Chile y necesitas DTE + ficha clínica madura + odontograma dental.",
      B: "Doctocliq es mejor si tu clínica está en México o tu volumen alto es telemedicina con receta médica electrónica.",
      clinera:
        "Clinera es mejor si quieres WhatsApp con IA conversacional 24/7 y atribución real de ventas a tus campañas Meta/Google.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "Coexistencia WhatsApp Business", A: "no", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "no", B: "no", clinera: "yes" },
      { feature: "Telemedicina integrada", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Receta médica electrónica", A: "partial", B: "yes", clinera: "partial" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital madura", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Odontograma dental nativo", A: "yes", B: "partial", clinera: "partial" },
      { feature: "Facturación electrónica local", A: "yes (CL DTE)", B: "yes (MX CFDI)", clinera: "partial" },
      { feature: "Atribución de ventas a campañas", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "no", clinera: "yes" },
      { feature: "App móvil nativa", A: "no", B: "yes", clinera: "yes" },
      { feature: "Precios públicos en web", A: "no", B: "yes", clinera: "yes" },
      { feature: "Sin permanencia", A: "partial", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "consultar", B: "$25/profesional", clinera: "$279 (VORTEX)" },
    ],
    dimensions: [
      {
        title: "Geografía y compliance fiscal",
        body:
          "Reservo está hecho para Chile y tiene DTE integrado (SII). Doctocliq está hecho para México y tiene CFDI integrado (SAT). Si tu clínica opera en uno solo de esos países, la elección es directa por compliance fiscal local.",
      },
      {
        title: "Telemedicina y receta electrónica",
        body:
          "Doctocliq tiene videoconsulta + receta médica electrónica integrada como funcionalidad central. Reservo cubre telemedicina como módulo complementario, con menos énfasis en receta digital firmada.",
      },
      {
        title: "Ficha clínica",
        body:
          "Reservo tiene odontograma dental maduro y plantillas por especialidad muy completas (referente en dental en Chile). Doctocliq tiene ficha clínica sólida con foco en consulta médica general y telemedicina.",
      },
      {
        title: "WhatsApp e IA",
        body:
          "Ninguno tiene IA conversacional WhatsApp. Reservo tiene envío manual de mensajes desde el panel. Doctocliq tiene confirmaciones automáticas pero no IA que mantenga conversación. Clinera (AURA) atiende 24/7 con memoria contextual e integración MCP.",
      },
      {
        title: "Precio y transparencia",
        body:
          "Reservo no publica precios — atiende por cotización. Doctocliq publica desde USD 25/profesional. Clinera publica VORTEX USD 279/mes, ATLAS USD 379, SUMMIT USD 479 (bolsa de créditos 28.000/37.000/46.000), sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿Reservo o Doctocliq es mejor para una clínica dental?",
        a: "Reservo tiene odontograma dental nativo más maduro y plantillas dentales muy completas. Doctocliq cubre dental pero no es su foco principal.",
      },
      {
        q: "¿Cuál tiene mejor receta médica electrónica?",
        a: "Doctocliq tiene receta médica electrónica con firma digital integrada al flujo de telemedicina, pensada para México. Reservo tiene receta como parte del flujo de consulta pero menos énfasis en firma electrónica.",
      },
      {
        q: "¿Cuál es más adecuado fuera de Chile y México?",
        a: "Para clínicas en Perú, Colombia, Argentina o Ecuador, ambos requieren validar el cumplimiento fiscal local. AgendaPro suele tener mejor cobertura LATAM general que Reservo o Doctocliq.",
      },
      {
        q: "¿Hay alternativa con WhatsApp IA?",
        a: "Sí: Clinera. AURA es agente IA en producción que atiende, agenda y deriva por WhatsApp Business 24/7. Disponible en CL, PE, CO, MX, AR, EC, UY, CR, PA.",
      },
      {
        q: "¿Puedo combinar Reservo o Doctocliq con Clinera?",
        a: "Sí. Clinera se integra vía API y MCP con ambos. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu sistema actual. No hace falta migrar.",
      },
    ],
    publishedAt: "2026-04-25",
  },

  // ============================================================
  // 6. Medilink vs Doctocliq
  // ============================================================
  "medilink-vs-doctocliq": {
    slug: "medilink-vs-doctocliq",
    competitorA: COMPETITORS.medilink,
    competitorB: COMPETITORS.doctocliq,
    title: "Medilink vs Doctocliq 2026: IA por voz vs telemedicina (+ alternativa WhatsApp IA)",
    description:
      "Medilink (Contact Center IA por voz) vs Doctocliq (telemedicina + agenda mexicana). Más una alternativa con IA conversacional WhatsApp 24/7.",
    h1: "Medilink vs Doctocliq 2026: ¿cuál conviene a tu clínica?",
    intro:
      "Medilink es chileno y tiene IA por canal de voz (Contact Center). Doctocliq es mexicano y se especializa en telemedicina + agenda. Ambos cubren clínica médica pero por canales muy distintos. Si tu paciente prefiere WhatsApp, Clinera es la tercera opción que ninguno tiene.",
    tldr: {
      A: "Medilink es mejor si te pierdes muchas llamadas y quieres un Contact Center IA por voz que atienda 24/7 desde Chile.",
      B: "Doctocliq es mejor si tu volumen alto es telemedicina y necesitas videoconsulta + receta electrónica integrada (México).",
      clinera:
        "Clinera es mejor si tu canal principal es WhatsApp y quieres IA que atienda, agende y derive 24/7 con memoria contextual.",
    },
    table: [
      { feature: "IA conversacional WhatsApp en producción", A: "no", B: "no", clinera: "yes" },
      { feature: "IA por canal de voz (llamadas)", A: "yes", B: "no", clinera: "no" },
      { feature: "Telemedicina / videoconsulta integrada", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Receta médica electrónica", A: "yes", B: "yes", clinera: "partial" },
      { feature: "Coexistencia WhatsApp Business", A: "partial", B: "no", clinera: "yes" },
      { feature: "Atención 24/7 sin recepción humana", A: "yes", B: "no", clinera: "yes" },
      { feature: "Memoria contextual IA", A: "partial", B: "no", clinera: "yes" },
      { feature: "Integración MCP / API para IA", A: "no", B: "no", clinera: "yes" },
      { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Reserva online 24/7", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Ficha clínica digital madura", A: "yes", B: "yes", clinera: "yes" },
      { feature: "Atribución de ventas a campañas", A: "no", B: "no", clinera: "yes" },
      { feature: "Difusiones masivas WhatsApp", A: "partial", B: "no", clinera: "yes" },
      { feature: "App móvil nativa", A: "partial", B: "yes", clinera: "yes" },
      { feature: "Precios públicos en web", A: "no", B: "yes", clinera: "yes" },
      { feature: "Sin permanencia", A: "no", B: "partial", clinera: "yes" },
      { feature: "Plan inicial USD/mes", A: "consultar", B: "$25/profesional", clinera: "$279 (VORTEX)" },
    ],
    dimensions: [
      {
        title: "Estrategia de canal: voz vs telemedicina vs chat",
        body:
          "Medilink apostó por IA en voz (llamadas). Doctocliq apostó por videoconsulta integrada (telemedicina). Clinera apostó por IA en chat (WhatsApp). Las tres son válidas pero apuntan a comportamientos distintos del paciente: paciente que llama, paciente que necesita consulta remota, paciente que escribe.",
      },
      {
        title: "Foco geográfico",
        body:
          "Medilink es chileno, fuerte en CL. Doctocliq es mexicano, fuerte en MX. Clinera opera en CL, PE, CO, MX, AR, EC, UY, CR, PA. Si tu clínica está fuera de CL o MX, valida la cobertura local de Medilink y Doctocliq antes de cotizar.",
      },
      {
        title: "Telemedicina y receta electrónica",
        body:
          "Empate. Los dos cubren videoconsulta y receta médica electrónica con firma digital. Doctocliq tiene foco más fuerte en telemedicina pura (es su producto central). Medilink la suma como funcionalidad complementaria a su Contact Center IA.",
      },
      {
        title: "WhatsApp e IA conversacional",
        body:
          "Ninguno tiene IA conversacional WhatsApp en producción. Medilink puede integrar WhatsApp como canal complementario a su Contact Center pero no tiene agente IA específico para chat. Doctocliq trata WhatsApp como envío de recordatorios. Clinera, con AURA, opera el canal WhatsApp con IA real, memoria contextual y derivación a humano.",
      },
      {
        title: "Precio y transparencia",
        body:
          "Medilink no publica precios. Doctocliq desde USD 25/profesional. Clinera VORTEX USD 279/mes, ATLAS USD 379, SUMMIT USD 479 (bolsa de créditos 28.000/37.000/46.000), todos sin permanencia.",
      },
    ],
    faqs: [
      {
        q: "¿Medilink o Doctocliq es mejor para telemedicina?",
        a: "Doctocliq tiene flujo más maduro de telemedicina pura (videoconsulta + receta + firma). Medilink la cubre pero su foco principal es el Contact Center IA por voz.",
      },
      {
        q: "¿Cuál atiende llamadas 24/7 con IA?",
        a: "Medilink: tiene IA en voz que atiende llamadas fuera de horario, agenda y deriva. Doctocliq no tiene Contact Center IA por voz.",
      },
      {
        q: "¿Cuál tiene mejor app móvil?",
        a: "Doctocliq tiene app nativa más completa (iOS + Android) con foco en consulta médica. Medilink tiene web responsive sólida pero app más limitada.",
      },
      {
        q: "¿Hay alternativa con IA conversacional WhatsApp?",
        a: "Clinera. AURA es agente IA en producción que atiende WhatsApp 24/7 con memoria contextual entre conversaciones, integración MCP y derivación automática a humano.",
      },
      {
        q: "¿Puedo combinar Medilink (voz) + Doctocliq (telemedicina) + Clinera (WhatsApp)?",
        a: "En teoría sí — Clinera se integra vía API/MCP. La práctica recomendada es elegir una sola plataforma como núcleo y agregar otra solo para canales complementarios. Tener tres sistemas exige sincronización rigurosa de la agenda.",
      },
    ],
    publishedAt: "2026-04-25",
  },
};

// ============================================================
// 7. Dentalink vs Reservo  (dental especializado vs general chileno)
// ============================================================
cruzadas["dentalink-vs-reservo"] = {
  slug: "dentalink-vs-reservo",
  competitorA: COMPETITORS.dentalink,
  competitorB: COMPETITORS.reservo,
  title: "Dentalink vs Reservo 2026: ¿software dental especializado o agenda general?",
  description:
    "Dentalink (15.000+ clientes, 100% dental con odontograma + IA) vs Reservo (chileno, multi-vertical clínico con DTE). Más una alternativa con IA WhatsApp 24/7.",
  h1: "Dentalink vs Reservo 2026: ¿cuál conviene a tu clínica dental?",
  intro:
    "Dentalink es el software dental líder en LATAM (15.000+ clientes), 100% vertical, con odontograma, periodontograma, módulo de ortodoncia y asistente IA dental. Reservo es chileno, vertical clínico médico-dental, con DTE y ficha clínica madura. Si tu cuello de botella es WhatsApp, Clinera entra como tercera opción.",
  tldr: {
    A: "Dentalink es mejor si tu clínica es 100% dental y necesitas odontograma + ortodoncia + análisis IA de RX con la profundidad del líder vertical.",
    B: "Reservo es mejor si tu clínica mezcla dental con otras especialidades médicas y necesitas DTE chileno con ficha clínica multi-especialidad.",
    clinera:
      "Clinera es mejor si tu cuello de botella son los WhatsApps sin responder. AURA atiende 24/7 e integra encima de Dentalink o Reservo vía API.",
  },
  table: [
    { feature: "IA conversacional WhatsApp 24/7 (paciente real)", A: "yes", B: "no", clinera: "yes" },
    { feature: "Coexistencia con WhatsApp Business", A: "partial", B: "no", clinera: "yes" },
    { feature: "Memoria contextual entre conversaciones", A: "partial", B: "no", clinera: "yes" },
    { feature: "Integración MCP / API para IA externa", A: "no", B: "no", clinera: "yes" },
    { feature: "Atribución de ventas a campañas Meta/Google", A: "no", B: "no", clinera: "yes" },
    { feature: "Difusiones masivas WhatsApp marketing", A: "partial", B: "partial", clinera: "yes" },
    { feature: "Foco vertical 100% dental", A: "yes", B: "partial", clinera: "no" },
    { feature: "Odontograma + periodontograma nativo", A: "yes", B: "yes", clinera: "partial" },
    { feature: "Módulo de ortodoncia especializado", A: "yes", B: "partial", clinera: "no" },
    { feature: "Análisis IA de imágenes radiológicas", A: "yes", B: "no", clinera: "no" },
    { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
    { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
    { feature: "Pagos online + financiamiento de pacientes", A: "yes", B: "partial", clinera: "partial" },
    { feature: "Facturación electrónica DTE Chile", A: "partial", B: "yes", clinera: "partial" },
    { feature: "Cobertura LATAM (no solo Chile)", A: "yes", B: "no", clinera: "yes" },
    { feature: "Precios públicos en web", A: "no", B: "no", clinera: "yes" },
    { feature: "Plan inicial USD/mes", A: "consultar", B: "consultar", clinera: "$279 (VORTEX)" },
  ],
  dimensions: [
    {
      title: "Especialización dental vs cobertura clínica",
      body:
        "Dentalink es referente absoluto dental: odontograma, periodontograma, ortodoncia y análisis IA de RX están diseñados como producto principal. Reservo es vertical clínico amplio (médico, dental, estética) con módulos sólidos pero sin la profundidad dental de Dentalink. Si tu clínica es 100% dental, gana Dentalink; si es mixta, Reservo cubre más escenarios.",
    },
    {
      title: "IA — los tres tienen una propuesta distinta",
      body:
        "Dentalink incorporó IA especializada en flujos dentales (asistente CRM, análisis de RX). Reservo no tiene IA conversacional. Clinera (con AURA) opera con IA agnóstica de vertical, integrable encima de cualquier sistema vía API/MCP. Para clínica dental: Dentalink + Clinera es una arquitectura común (clínica en Dentalink, WhatsApp en AURA).",
    },
    {
      title: "Geografía",
      body:
        "Dentalink es LATAM (CL, MX, CO, AR, PE, EC, etc.). Reservo es 100% Chile con DTE y módulo financiero local. Para clínicas dentales fuera de Chile, Dentalink tiene mejor cobertura nativa.",
    },
    {
      title: "Marketing y atribución de ventas",
      body:
        "Ni Dentalink ni Reservo tienen panel de marketing con atribución a campañas Meta/Google. Clinera trazabiliza cada conversación desde la campaña hasta la cita y la venta. Si invertís en publicidad digital, ese delta lo paga Clinera sola.",
    },
    {
      title: "Precio y transparencia",
      body:
        "Ni Dentalink ni Reservo publican precios — atienden por demo o cotización. Clinera publica VORTEX USD 279/mes, sin permanencia; implementación USD 450 (pago único) con onboarding asistido — operando el mismo día.",
    },
  ],
  faqs: [
    {
      q: "¿Dentalink o Reservo es mejor para una clínica dental?",
      a: "Dentalink, sin duda, si la clínica es 100% dental. Reservo cubre dental pero no con la misma profundidad de odontograma + periodontograma + ortodoncia que un sistema vertical especializado.",
    },
    {
      q: "¿Cuál tiene mejor IA?",
      a: "Distintas IAs. Dentalink tiene IA especializada en RX y CRM dental. Clinera tiene AURA, IA conversacional WhatsApp 24/7 agnóstica de vertical. Reservo no tiene IA conversacional. Para una clínica dental: combinar Dentalink + Clinera vía API es la arquitectura más común.",
    },
    {
      q: "¿Reservo cubre dental con la misma profundidad que Dentalink?",
      a: "No. Reservo tiene odontograma y módulo dental sólido, pero Dentalink construyó 15 años enfocado solo en dental. Para clínicas dentales puras, Dentalink gana en profundidad.",
    },
    {
      q: "¿Se puede usar Clinera con Dentalink o Reservo al mismo tiempo?",
      a: "Sí. Clinera se integra vía API/MCP con ambos. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu Dentalink o Reservo. Mantienes la ficha clínica donde está y agregas la capa de IA conversacional + atribución de marketing.",
    },
    {
      q: "¿Cuál es más caro?",
      a: "Ni Dentalink ni Reservo publican precios. Para clínicas pequeñas-medianas suelen estar en USD 80-200/mes según módulos. Clinera VORTEX es USD 279/mes fijo.",
    },
  ],
  publishedAt: "2026-04-25",
};

// ============================================================
// 8. Sacmed vs Medilink  (médico chileno vs IA por voz)
// ============================================================
cruzadas["sacmed-vs-medilink"] = {
  slug: "sacmed-vs-medilink",
  competitorA: COMPETITORS.sacmed,
  competitorB: COMPETITORS.medilink,
  title: "Sacmed vs Medilink 2026: telemedicina Fonasa vs Contact Center IA por voz",
  description:
    "Sacmed (telemedicina Fonasa con receta QR, desde $26.000 CLP) vs Medilink (Contact Center IA por voz). Más una alternativa con IA conversacional WhatsApp 24/7.",
  h1: "Sacmed vs Medilink 2026: ¿cuál conviene a tu clínica médica chilena?",
  intro:
    "Ambos son chilenos y enfocados en clínica médica. Sacmed apuesta por telemedicina certificada por Fonasa con receta QR y precios bajos publicados (~USD 27/mes). Medilink apuesta por IA en canal de voz (Contact Center). Si tu paciente prefiere WhatsApp, evalúa Clinera como tercera opción.",
  tldr: {
    A: "Sacmed es mejor si tu clínica hace mucha telemedicina y necesita certificación Fonasa + receta QR + precio bajo publicado.",
    B: "Medilink es mejor si te pierdes muchas llamadas y necesitas un Contact Center IA por voz que conteste 24/7.",
    clinera:
      "Clinera es mejor si tu canal principal es WhatsApp y quieres AURA atendiendo, agendando y derivando 24/7 con memoria contextual e integración a tu sistema actual.",
  },
  table: [
    { feature: "IA conversacional WhatsApp 24/7", A: "no", B: "no", clinera: "yes" },
    { feature: "IA por canal de voz (llamadas)", A: "no", B: "yes", clinera: "no" },
    { feature: "Telemedicina certificada por Fonasa", A: "yes", B: "partial", clinera: "no" },
    { feature: "Receta electrónica con QR", A: "yes", B: "yes", clinera: "partial" },
    { feature: "Coexistencia WhatsApp Business (mismo número)", A: "partial", B: "partial", clinera: "yes" },
    { feature: "Atención 24/7 sin recepción humana", A: "no", B: "yes", clinera: "yes" },
    { feature: "Memoria contextual IA entre conversaciones", A: "no", B: "partial", clinera: "yes" },
    { feature: "Integración MCP / API para IA externa", A: "no", B: "no", clinera: "yes" },
    { feature: "Atribución de ventas a campañas Meta/Google", A: "no", B: "no", clinera: "yes" },
    { feature: "Difusiones masivas WhatsApp marketing", A: "partial", B: "partial", clinera: "yes" },
    { feature: "Agenda multi-profesional", A: "yes", B: "yes", clinera: "yes" },
    { feature: "Multi-sede", A: "yes", B: "yes", clinera: "yes" },
    { feature: "Ficha clínica digital", A: "yes", B: "yes", clinera: "yes" },
    { feature: "Pagos online integrados", A: "yes", B: "partial", clinera: "yes" },
    { feature: "Facturación electrónica DTE Chile", A: "yes", B: "yes", clinera: "partial" },
    { feature: "Cobertura LATAM (no solo Chile)", A: "no", B: "no", clinera: "yes" },
    { feature: "Precios públicos en web", A: "yes", B: "no", clinera: "yes" },
    { feature: "Plan inicial mensual", A: "$26.000 CLP (~$27)", B: "consultar", clinera: "$279 (VORTEX)" },
  ],
  dimensions: [
    {
      title: "Estrategia de canal — voz, telemedicina o chat",
      body:
        "Sacmed apuesta por telemedicina Fonasa: el paciente toma consulta remota con receta electrónica QR. Medilink apuesta por voz: IA atiende llamadas 24/7. Clinera apuesta por chat: AURA opera WhatsApp con IA conversacional. La elección depende del comportamiento real de tus pacientes — qué canal usan más para agendar y consultar.",
    },
    {
      title: "Compliance Fonasa y receta electrónica",
      body:
        "Sacmed tiene certificación Fonasa nativa para telemedicina con receta QR — eso significa cumplimiento normativo para facturar consultas remotas. Medilink cubre receta electrónica pero su foco principal es Contact Center IA, no telemedicina certificada. Clinera no tiene certificación Fonasa nativa.",
    },
    {
      title: "WhatsApp e IA conversacional",
      body:
        "Sacmed integra WhatsApp como canal complementario (notificaciones). Medilink puede integrar WhatsApp como canal anexo a su Contact Center. Ninguno tiene un agente IA que mantenga conversaciones reales en chat. Clinera (AURA) opera 24/7 desde tu WhatsApp Business con memoria contextual y derivación a humano automática.",
    },
    {
      title: "Marketing y atribución de ventas",
      body:
        "Ni Sacmed ni Medilink tienen panel de atribución a campañas Meta/Google. Clinera trazabiliza la conversación desde la campaña hasta la venta. Para clínicas que invierten en publicidad digital, esa atribución justifica el delta de precio.",
    },
    {
      title: "Precio",
      body:
        "Sacmed publica desde $26.000 CLP/mes (~USD 27) en plan Starter — el más accesible de los chilenos. Medilink no publica precios. Clinera publica VORTEX desde USD 279/mes. Sacmed gana en precio nominal; Clinera gana en valor por dólar para clínicas con marketing digital.",
    },
  ],
  faqs: [
    {
      q: "¿Sacmed o Medilink es mejor para telemedicina?",
      a: "Sacmed, claramente. Tiene certificación Fonasa nativa con receta electrónica QR diseñada para telemedicina facturable. Medilink la cubre pero su foco principal es el Contact Center IA por voz.",
    },
    {
      q: "¿Cuál atiende llamadas 24/7?",
      a: "Medilink. Tiene Contact Center IA por voz que atiende llamadas fuera de horario, agenda y deriva. Sacmed no — depende de tu recepción humana.",
    },
    {
      q: "¿Cuál es más barato?",
      a: "Sacmed publica desde $26.000 CLP/mes (~USD 27) en plan Starter. Medilink no publica precios pero suele cotizarse en USD 100-200/mes. Sacmed gana en precio nominal.",
    },
    {
      q: "¿Hay alternativa con IA conversacional WhatsApp?",
      a: "Clinera. Es chilena, opera AURA 24/7 sobre WhatsApp Business con memoria contextual LangChain + integración MCP. Cobertura LATAM completa.",
    },
    {
      q: "¿Puedo combinar Sacmed (telemedicina) + Clinera (WhatsApp)?",
      a: "Sí. Clinera se integra vía API/MCP con Sacmed. Mantienes telemedicina Fonasa y receta QR en Sacmed, y AURA opera el canal WhatsApp + atribución de marketing por encima.",
    },
  ],
  publishedAt: "2026-04-25",
};

// ============================================================
// 9. Dentalink vs Sacmed  (vertical dental vs vertical médico, ambos en CL)
// ============================================================
cruzadas["dentalink-vs-sacmed"] = {
  slug: "dentalink-vs-sacmed",
  competitorA: COMPETITORS.dentalink,
  competitorB: COMPETITORS.sacmed,
  title: "Dentalink vs Sacmed 2026: ¿software dental especializado o médico con telemedicina?",
  description:
    "Comparativa entre Dentalink (líder dental LATAM, 15.000+ clientes) y Sacmed (chileno, telemedicina Fonasa). Para decidir según el vertical real de tu clínica.",
  h1: "Dentalink vs Sacmed 2026: ¿cuál encaja con tu clínica?",
  intro:
    "Esta comparativa solo aplica si tu clínica está decidiendo entre dos verticales: dental u otra especialidad médica. Dentalink es 100% dental y referente regional. Sacmed es 100% médico, chileno, con telemedicina Fonasa. Si tu clínica mezcla verticales, Clinera es la tercera opción que cubre ambas.",
  tldr: {
    A: "Dentalink es mejor si tu clínica es 100% odontológica — odontograma, periodontograma, ortodoncia y análisis IA de RX dentales.",
    B: "Sacmed es mejor si tu clínica es médica general (no dental) y necesitas telemedicina certificada por Fonasa con receta QR.",
    clinera:
      "Clinera es mejor si tu clínica atiende dental + médico + estética (multi-vertical) o quieres IA WhatsApp 24/7 encima de cualquiera de los dos sistemas.",
  },
  table: [
    { feature: "IA conversacional WhatsApp 24/7", A: "yes", B: "no", clinera: "yes" },
    { feature: "Coexistencia WhatsApp Business", A: "partial", B: "partial", clinera: "yes" },
    { feature: "Memoria contextual IA entre conversaciones", A: "partial", B: "no", clinera: "yes" },
    { feature: "Foco 100% dental", A: "yes", B: "no", clinera: "no" },
    { feature: "Foco 100% médico (no dental)", A: "no", B: "yes", clinera: "no" },
    { feature: "Multi-vertical (dental + médico + estética)", A: "no", B: "no", clinera: "yes" },
    { feature: "Odontograma + periodontograma nativo", A: "yes", B: "no", clinera: "partial" },
    { feature: "Módulo de ortodoncia especializado", A: "yes", B: "no", clinera: "no" },
    { feature: "Telemedicina certificada por Fonasa", A: "no", B: "yes", clinera: "no" },
    { feature: "Receta electrónica con QR", A: "no", B: "yes", clinera: "partial" },
    { feature: "Análisis IA de imágenes radiológicas", A: "yes", B: "no", clinera: "no" },
    { feature: "Atribución de ventas a campañas Meta/Google", A: "no", B: "no", clinera: "yes" },
    { feature: "Integración MCP / API para IA externa", A: "no", B: "no", clinera: "yes" },
    { feature: "Cobertura LATAM (no solo Chile)", A: "yes", B: "no", clinera: "yes" },
    { feature: "Precios públicos en web", A: "no", B: "yes", clinera: "yes" },
    { feature: "Plan inicial mensual", A: "consultar", B: "$26.000 CLP (~$27)", clinera: "$279 (VORTEX)" },
  ],
  dimensions: [
    {
      title: "Vertical real de tu clínica",
      body:
        "Esta comparativa raramente es honesta entre los dos: Dentalink y Sacmed sirven a verticales muy distintos. Dentalink es 100% dental; Sacmed es médico general. Si dudas entre los dos, probablemente tu clínica está en transición de vertical o atiende mixto. Clinera es agnóstica y cubre todas las verticales en un solo sistema.",
    },
    {
      title: "Profundidad de ficha por vertical",
      body:
        "Dentalink construyó 15 años de profundidad dental: odontograma, periodontograma, ortodoncia con seguimiento, análisis IA de RX. Sacmed construyó profundidad médica con telemedicina Fonasa, receta electrónica QR y compliance chileno. Ambos son referentes en su vertical.",
    },
    {
      title: "Telemedicina y compliance",
      body:
        "Sacmed gana sin discusión en telemedicina certificada Fonasa con receta QR — está diseñado para clínicas médicas chilenas que facturan consulta remota. Dentalink cubre telemedicina como módulo complementario, no como producto principal.",
    },
    {
      title: "WhatsApp e IA conversacional",
      body:
        "Dentalink incorporó asistente IA dental especializado. Sacmed integra WhatsApp como canal complementario sin agente IA. Clinera (AURA) opera con IA conversacional WhatsApp 24/7 agnóstica de vertical, integrable encima de cualquiera de los dos vía API/MCP.",
    },
    {
      title: "Cobertura geográfica",
      body:
        "Dentalink opera en toda LATAM (CL, MX, CO, AR, PE, EC, etc.). Sacmed es 100% Chile con compliance Fonasa específico. Si tu clínica está en otro país de LATAM, Sacmed no aplica; Dentalink sí (si es dental) o Clinera (si es multi-vertical).",
    },
  ],
  faqs: [
    {
      q: "¿Dentalink o Sacmed cubre mejor mi clínica?",
      a: "Si es 100% dental: Dentalink, sin duda. Si es médica general (no dental): Sacmed. Si es mixta o no estás en Chile: Clinera, que cubre ambas verticales en un solo sistema.",
    },
    {
      q: "¿Cuál tiene mejor IA?",
      a: "Dentalink tiene asistente IA especializado en flujos dentales (CRM, análisis RX). Sacmed no tiene IA conversacional. Clinera (AURA) tiene IA conversacional agnóstica de vertical, operando 24/7 sobre WhatsApp Business.",
    },
    {
      q: "¿Cuál es más caro?",
      a: "Sacmed publica desde $26.000 CLP/mes (~USD 27) en plan Starter — el más barato. Dentalink no publica precios. Clinera VORTEX es USD 279/mes.",
    },
    {
      q: "¿Sirve fuera de Chile?",
      a: "Dentalink opera en toda LATAM. Sacmed es 100% Chile (compliance Fonasa local). Clinera tiene cobertura nativa en CL, PE, CO, MX, AR, EC, UY, CR, PA.",
    },
    {
      q: "¿Puedo combinar Clinera con Dentalink o Sacmed?",
      a: "Sí. Clinera se integra vía API/MCP con ambos. Mantienes la ficha clínica especializada en Dentalink (dental) o Sacmed (médico) y AURA opera el canal WhatsApp + atribución de marketing por encima.",
    },
  ],
  publishedAt: "2026-04-25",
};

export const allCruzadas = Object.values(cruzadas);

// Mapeo: dado un slug directo (reservo, agendapro, dentalink, etc.), ¿qué cruzadas lo incluyen?
// Útil para internal-linking desde la página de comparativa directa.
export function getCruzadasForCompetitor(competitorKey: CompetitorKey): Cruzada[] {
  return allCruzadas.filter(
    (c) => c.competitorA.key === competitorKey || c.competitorB.key === competitorKey,
  );
}
