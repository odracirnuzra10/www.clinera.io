import type { HeroViewId } from "@/components/plataforma/HeroCarousel";
import {
  CLINERA_PLANS,
  SETUP_FEE_NUMBER,
} from "@/content/pricing";

const vortex = CLINERA_PLANS[0];
const atlas = CLINERA_PLANS[1];
const summit = CLINERA_PLANS[2];

export type SoftwareVerticalContent = {
  slug:
    | "software-medico"
    | "software-dental"
    | "software-estetica"
    | "agendamiento-whatsapp-ia";
  leadSource:
    | "software_medico_landing"
    | "software_dental_landing"
    | "software_estetica_landing"
    | "agendamiento_whatsapp_ia_landing";
  contentCategory:
    | "landing_software_medico"
    | "landing_software_dental"
    | "landing_software_estetica"
    | "landing_agendamiento_whatsapp_ia";
  breadcrumbName: string;
  applicationName: string;
  applicationSubCategory: string;
  eyebrow: string;
  h1Lead: string;
  h1Accent: string;
  h1Rest: string;
  thesis: string;
  sub: string;
  heroViews: readonly HeroViewId[];
  includesH2: string;
  includes: readonly { title: string; body: string }[];
  deepDive: {
    eyebrow: string;
    h2: string;
    body: string;
    bullets: readonly string[];
    imageSrc?: string;
    imageAlt?: string;
  };
  aura: {
    eyebrow: string;
    headline: string;
    body: string;
    imageAlt: string;
  };
  crm: { eyebrow: string; h2: string; body: string };
  finalH2: string;
  faqs: { q: string; a: string }[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
};

const PRICE_FAQ = `El plan anual va primero, a valor mensual con 20% OFF: Vortex USD ${Math.round(vortex.annualMonthly)}/mes (frente a USD ${vortex.monthlyPrice}/mes), Atlas USD ${Math.round(atlas.annualMonthly)}/mes, Summit USD ${Math.round(summit.annualMonthly)}/mes. El mensual queda después: Vortex USD ${vortex.monthlyPrice}/mes, Atlas USD ${atlas.monthlyPrice}, Summit USD ${summit.monthlyPrice}. Permanencia mínima 6 meses. El primer cobro suma implementación USD ${SETUP_FEE_NUMBER}. El catálogo está en USD; en la web puedes ver MXN a un tipo de cambio fijo.`;

const INTEGRATION_FAQ =
  "No. Clinera no se sincroniza con Reservo, AgendaPro, Medilink ni Dentalink: opera sobre su propia agenda, ficha clínica y módulo de pagos, y migramos tus datos en el onboarding. Para conectar otras herramientas tienes Webhooks y API pública (n8n, Make, Zapier) en Atlas y Summit.";

export const MEDICO: SoftwareVerticalContent = {
  slug: "software-medico",
  leadSource: "software_medico_landing",
  contentCategory: "landing_software_medico",
  breadcrumbName: "Software médico",
  applicationName: "Clinera — software médico para clínicas",
  applicationSubCategory: "Medical Practice Management",
  eyebrow: "Software médico · agenda, ficha y agente IA",
  h1Lead: "El ",
  h1Accent: "software médico",
  h1Rest: " que atiende, agenda y ordena toda tu clínica",
  thesis:
    "No es un chatbot: es el sistema con el que opera tu consultorio. Agenda, ficha facial y corporal, agente IA por WhatsApp y Clinera Intelligence en un solo lugar.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. Migramos tus datos en el onboarding. Un solo modo de agendamiento: Agentic.`,
  heroViews: ["ficha", "corporal", "aura", "intelligence"],
  includesH2: "Qué incluye el software clínico",
  includes: [
    {
      title: "Agenda médica",
      body: "Disponibilidad real por profesional, sala y duración. AURA crea, reagenda y cancela dentro de WhatsApp, sin mandar links.",
    },
    {
      title: "Ficha facial",
      body: "Historial clínico con seguimiento visual del rostro: evaluaciones, tratamientos y consentimientos en la misma ficha.",
    },
    {
      title: "Ficha corporal",
      body: "Evaluación por zonas, plan de tratamiento y evolución. La foto de la consulta queda atada al paciente, no a un Drive.",
    },
    {
      title: "Agente IA (AURA)",
      body: "Atiende por WhatsApp 24/7: califica, agenda y confirma sobre tu agenda. En vivo en todos los planes. CAMILA (llamadas con IA) disponible solo en Summit.",
    },
    {
      title: "Clinera Intelligence",
      body: "El agente interno: pregunta en lenguaje natural y te responde con citas, asistencia y ventas reales de tu clínica.",
    },
    {
      title: "CRM médico, dentro",
      body: "Seguimiento de leads, tratamientos y atribución de campañas. No es un CRM aparte: vive en el mismo software.",
    },
  ],
  deepDive: {
    eyebrow: "Ficha clínica",
    h2: "Ficha facial y corporal, no una planilla con fotos",
    body: "La ficha del paciente concentra historia, evaluaciones y el plan. Lo que ves en la consulta —rostro o cuerpo— queda en el software, listo para la siguiente sesión y para el presupuesto.",
    bullets: [
      "Evaluación facial y corporal atada al paciente",
      "Consentimientos y seguimiento visual en la misma ficha",
      "El profesional ve el historial antes de entrar a sala",
    ],
    imageSrc: "/presentacion/eval-corporal.jpg",
    imageAlt: "Evaluación corporal en la ficha clínica de Clinera",
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA atiende el WhatsApp de tu consultorio.",
    body: "Responde precios y horarios, agenda en tu calendario y confirma la cita. Trabaja sobre la agenda de todo el equipo, 24/7. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — agente IA de WhatsApp para clínicas médicas",
  },
  crm: {
    eyebrow: "CRM médico",
    h2: "¿Buscabas un CRM médico? Viene dentro del software",
    body: "Pipeline de tratamientos, seguimiento de pacientes y atribución de campañas Meta y Google. No pagas un CRM aparte ni conectas dos sistemas: es un módulo del software con el que opera la clínica.",
  },
  finalH2: "Te mostramos tu consultorio dentro de Clinera.",
  faqs: [
    {
      q: "¿Qué incluye el software médico de Clinera?",
      a: "Agenda, ficha clínica (facial y corporal), agente IA por WhatsApp (AURA), Clinera Intelligence y un módulo de ventas/seguimiento. En Atlas y Summit se suman Webhooks + API. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    },
    {
      q: "¿Sirve para un consultorio chico?",
      a: `Sí. Vortex (USD ${vortex.monthlyPrice}/mes) es el plan de entrada: ${vortex.credits.toLocaleString("es-CL")} créditos/mes, ${vortex.consumptionReference}. Un solo profesional o un equipo chico operan igual: agenda, ficha y AURA incluidos.`,
    },
    {
      q: "¿Se integra con Reservo, AgendaPro o Medilink?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿Clinera es un CRM médico?",
      a: "Tiene el módulo de CRM dentro: seguimiento de leads, tratamientos y atribución de ads. No es un CRM suelto — es el software con el que opera la clínica, con la capa de ventas incluida.",
    },
    {
      q: "¿La ficha cubre facial y corporal?",
      a: "Sí. Ficha facial con seguimiento visual y ficha corporal por zonas, ambas atadas al paciente, con consentimientos e historial de tratamientos.",
    },
    {
      q: "¿Cuánto cuesta?",
      a: PRICE_FAQ,
    },
    {
      q: "¿Qué hace el agente IA?",
      a: "AURA (en vivo, todos los planes) atiende por WhatsApp, califica y agenda sola sobre tu calendario. CAMILA llama por teléfono solo en Summit. LIA fiscaliza la operación en Summit.",
    },
  ],
  meta: {
    title: "Software médico para clínicas: agenda, ficha clínica y agente IA",
    description: `Software médico para clínicas: agenda, ficha facial y corporal, y agente IA por WhatsApp. Desde USD ${vortex.monthlyPrice}/mes. Sin integrar agendas de terceros: migramos tus datos.`,
    keywords: [
      "software médico",
      "software clínico",
      "software para clínicas",
      "sistema para consultorio médico",
      "CRM médico",
      "ficha clínica digital",
      "agenda médica",
    ],
  },
};

export const DENTAL: SoftwareVerticalContent = {
  slug: "software-dental",
  leadSource: "software_dental_landing",
  contentCategory: "landing_software_dental",
  breadcrumbName: "Software dental",
  applicationName: "Clinera — software dental para clínicas",
  applicationSubCategory: "Dental Practice Management",
  eyebrow: "Software dental · agenda, odontograma y agente IA",
  h1Lead: "El ",
  h1Accent: "software dental",
  h1Rest: " que llena tus sillones y ordena tu clínica",
  thesis:
    "Agenda, odontograma FDI, ficha del paciente y un agente IA que confirma por WhatsApp. Clinera es el software con el que opera la clínica dental — no un bot al lado de Dentalink.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. Odontograma por pieza y cara, presupuesto por WhatsApp. Migración en el onboarding.`,
  heroViews: ["odonto", "ficha", "aura", "intelligence"],
  includesH2: "Qué incluye el software para clínicas dentales",
  includes: [
    {
      title: "Agenda de sillones",
      body: "Cupos por profesional y duración real. AURA agenda y reagenda dentro de WhatsApp, sin links ni doble digitación.",
    },
    {
      title: "Odontograma FDI",
      body: "Hallazgos por pieza y por cara. Caries, obturado, corona, ausente. El presupuesto sale de lo que marcaste, no de una planilla aparte.",
    },
    {
      title: "Ficha del paciente",
      body: "Odontograma integrado a la ficha: historial, consentimientos y tratamientos en el mismo lugar.",
    },
    {
      title: "Agente IA (AURA)",
      body: "Atiende el WhatsApp de la clínica 24/7, confirma y llena huecos. En vivo. CAMILA (llamadas con IA) disponible solo en Summit.",
    },
    {
      title: "Clinera Intelligence",
      body: "Pregunta por ocupación de sillones, no-shows y presupuestos enviados. Te responde con los datos de tu clínica.",
    },
    {
      title: "CRM dental, dentro",
      body: "Seguimiento de presupuestos y atribución de campañas. El cierre comercial vive en el mismo software que la ficha.",
    },
  ],
  deepDive: {
    eyebrow: "Odontograma",
    h2: "Odontograma FDI, por pieza y por cara",
    body: "Marcas el hallazgo en la pieza, armas el presupuesto y lo mandas por WhatsApp. El odontograma vive en la ficha del paciente — no es un módulo suelto ni un PDF escaneado.",
    imageSrc: "/presentacion/odontograma.webp",
    imageAlt: "Odontograma de Clinera: arcadas, hallazgos por pieza y por cara",
    bullets: [
      "Nomenclatura FDI, hallazgos por pieza y cara",
      "Presupuesto generado desde lo marcado",
      "Envío y seguimiento del presupuesto por WhatsApp",
    ],
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA llena los sillones por WhatsApp.",
    body: "Confirma, reagenda y recupera pacientes sobre la agenda real de tus profesionales. Sin mandar links. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — agente IA de WhatsApp para clínicas dentales",
  },
  crm: {
    eyebrow: "CRM dental",
    h2: "¿Buscabas un CRM para clínicas dentales? Viene dentro del software",
    body: "Presupuestos, seguimiento y atribución de ads en el mismo sistema que el odontograma. No es un CRM pegado con integraciones: es el módulo de ventas del software dental.",
  },
  finalH2: "Te mostramos tu clínica dental dentro de Clinera.",
  faqs: [
    {
      q: "¿Clinera tiene odontograma?",
      a: "Sí. Odontograma FDI con hallazgos por pieza y por cara (caries, obturado, corona, ausente) e integrado a la ficha. Desde ahí sales al presupuesto por WhatsApp. Detalle del presupuestador, la evolución y el permiso de IA: https://www.clinera.io/blog/odontograma-digital-presupuesto-diagnostico-evolucion. No tiene periodontograma ni módulo de ortodoncia a la profundidad de Dentalink — esa comparativa está en /comparativas/dentalink.",
    },
    {
      q: "¿Reemplaza a Dentalink?",
      a: "Si operas la clínica en un solo software —agenda, odontograma FDI, WhatsApp con IA y ficha— sí: migramos en el onboarding y no sincronizamos dos sistemas. Si tu prioridad es periodontograma u ortodoncia a nivel de sistema 100% dental, lee la comparativa honesta en https://www.clinera.io/comparativas/dentalink.",
    },
    {
      q: "¿Se integra con la agenda que usamos hoy?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿Es un CRM dental?",
      a: "Tiene el CRM dentro: presupuestos, seguimiento y atribución. No vendemos un CRM suelto — es el software con el que opera la clínica dental.",
    },
    {
      q: "¿Cuánto cuesta el software dental?",
      a: PRICE_FAQ,
    },
    {
      q: "¿Cómo agenda el agente IA?",
      a: "AURA (en vivo) conversa por WhatsApp, consulta la disponibilidad real de tus sillones y deja la cita creada. Reagenda y cancela en la misma conversación. CAMILA, el agente de voz, está disponible solo en Summit.",
    },
    {
      q: "¿Cómo es la implementación y la migración?",
      a: `Onboarding asistido: importamos pacientes, tratamientos y agenda. Costo único de USD ${SETUP_FEE_NUMBER} con el primer mes del plan. No hay sincronización permanente con Dentalink ni con otras agendas: operas en Clinera.`,
    },
  ],
  meta: {
    title: "Software dental para clínicas: agenda, odontograma y agente IA",
    description: `Software dental para clínicas: agenda, odontograma FDI y agente IA por WhatsApp. Desde USD ${vortex.monthlyPrice}/mes. Migración en el onboarding, sin integrar agendas de terceros.`,
    keywords: [
      "software dental",
      "software para clínicas dentales",
      "software para dentistas",
      "CRM para clínicas dentales",
      "odontograma",
      "agenda dental",
    ],
  },
};

export const ESTETICA: SoftwareVerticalContent = {
  slug: "software-estetica",
  leadSource: "software_estetica_landing",
  contentCategory: "landing_software_estetica",
  breadcrumbName: "Software para clínicas estéticas",
  applicationName: "Clinera — software para clínicas estéticas",
  applicationSubCategory: "Aesthetic Clinic Management",
  eyebrow: "Software para clínicas estéticas · agenda, ficha y agente IA",
  h1Lead: "El ",
  h1Accent: "software para clínicas estéticas",
  h1Rest: " que agenda, ficha y confirma por WhatsApp",
  thesis:
    "Clinera es un software para clínicas estéticas con agenda, ficha facial y corporal con consentimientos y fotos del paciente, y un agente de IA (AURA) que agenda y confirma por WhatsApp 24/7. Opera sobre su propia agenda: migramos tus datos en el onboarding.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. CRM incluido, sin integrar agendas de terceros. Un solo modo de agendamiento: Agentic.`,
  heroViews: ["corporal", "ficha", "aura", "intelligence"],
  includesH2: "Qué incluye el software para clínicas estéticas",
  includes: [
    {
      title: "Agenda por profesional y cabina",
      body: "Disponibilidad real por profesional, sala y duración del tratamiento. AURA crea, reagenda y cancela dentro de WhatsApp, sin mandar links.",
    },
    {
      title: "Ficha facial",
      body: "Evaluación, tratamientos y consentimientos en la misma ficha, con seguimiento visual del rostro entre sesiones.",
    },
    {
      title: "Ficha corporal",
      body: "Evaluación por zonas, plan de tratamiento y evolución. Las fotos quedan atadas al paciente, no a un Drive ni al celular de la clínica.",
    },
    {
      title: "Agente IA (AURA)",
      body: "Atiende el WhatsApp de la clínica 24/7: responde, califica y agenda sobre tu agenda real. En vivo en todos los planes. CAMILA (llamadas con IA) disponible solo en Summit.",
    },
    {
      title: "Clinera Intelligence",
      body: "Pregunta en lenguaje natural por ventas por tratamiento, asistencia y no-shows. Te responde con los datos de tu clínica.",
    },
    {
      title: "CRM, dentro",
      body: "Seguimiento de leads, planes de tratamiento y atribución de campañas Meta y Google en el mismo software que la ficha.",
    },
  ],
  deepDive: {
    eyebrow: "Ficha estética",
    h2: "Ficha pensada para tratamientos por sesiones",
    body: "Una clínica estética trabaja en ciclos: evaluación, sesiones, control. La ficha concentra el historial, el consentimiento de cada procedimiento y las fotos de cada etapa, para que el profesional vea todo antes de entrar a sala.",
    bullets: [
      "Evaluación facial y corporal atada al paciente",
      "Consentimiento informado de cada procedimiento en la ficha",
      "Seguimiento visual entre sesiones",
    ],
    imageSrc: "/presentacion/eval-corporal.jpg",
    imageAlt: "Evaluación corporal en la ficha clínica de Clinera",
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA responde y agenda cuando la clínica no puede.",
    body: "Atiende consultas fuera de horario, agenda y confirma sobre la agenda del equipo, y deriva a una persona cuando la conversación lo pide. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — agente IA de WhatsApp para clínicas estéticas",
  },
  crm: {
    eyebrow: "CRM para clínicas estéticas",
    h2: "¿Buscabas un CRM para tu clínica estética? Viene dentro del software",
    body: "Pipeline de tratamientos, seguimiento de pacientes y atribución de campañas en el mismo sistema que la ficha. No conectas dos sistemas: es el módulo de ventas del software con el que opera la clínica.",
  },
  finalH2: "Te mostramos tu clínica estética dentro de Clinera.",
  faqs: [
    {
      q: "¿Qué es Clinera para una clínica estética?",
      a: "Un software con agenda, ficha facial y corporal con consentimientos, CRM y un agente de IA por WhatsApp (AURA). Es el sistema con el que opera la clínica, no un bot al lado de otro programa.",
    },
    {
      q: "¿Sirve para una clínica de una sola sucursal?",
      a: `Sí. Vortex (USD ${vortex.monthlyPrice}/mes) es el plan de entrada: ${vortex.credits.toLocaleString("es-CL")} créditos/mes, ${vortex.consumptionReference}. Agenda, ficha y AURA van incluidos.`,
    },
    {
      q: "¿Reemplaza a AgendaPro o a Reservo?",
      a: "Si quieres operar la clínica en un solo software —agenda, ficha, WhatsApp con IA y CRM— sí: migramos tus datos en el onboarding. Si tu negocio mezcla estética con spa o peluquería y necesitas apps nativas para todo, revisa la comparativa honesta en https://www.clinera.io/comparativas/agendapro.",
    },
    {
      q: "¿Se integra con la agenda que usamos hoy?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿La ficha incluye consentimientos y fotos?",
      a: "Sí. Ficha facial y corporal con consentimientos informados e historial de tratamientos, y las fotos de cada etapa quedan atadas al paciente. Para entender las diferencias entre una ficha estética y una médica, lee https://www.clinera.io/blog/ficha-clinica-estetica-vs-medica.",
    },
    {
      q: "¿Cuánto cuesta el software para clínicas estéticas?",
      a: PRICE_FAQ,
    },
    {
      q: "¿Cómo agenda el agente IA?",
      a: "AURA (en vivo) conversa por WhatsApp, consulta la disponibilidad real del equipo y deja la cita creada. Reagenda y cancela en la misma conversación. CAMILA, el agente de voz, está disponible solo en Summit.",
    },
  ],
  meta: {
    title: "Software para clínicas estéticas: agenda, ficha y agente IA",
    description: `Software para clínicas estéticas: agenda, ficha facial y corporal, CRM y agente IA que agenda por WhatsApp 24/7. Desde USD ${vortex.monthlyPrice}/mes. Migramos tus datos, sin integrar agendas de terceros.`,
    keywords: [
      "software para clínicas estéticas",
      "software clínica estética",
      "CRM clínica estética",
      "CRM clínica",
      "ficha clínica estética",
      "agenda para clínica estética",
    ],
  },
};

export const WHATSAPP_IA: SoftwareVerticalContent = {
  slug: "agendamiento-whatsapp-ia",
  leadSource: "agendamiento_whatsapp_ia_landing",
  contentCategory: "landing_agendamiento_whatsapp_ia",
  breadcrumbName: "Agendamiento por WhatsApp con IA",
  applicationName: "Clinera AURA — agendamiento por WhatsApp con IA para clínicas",
  applicationSubCategory: "Appointment Scheduling",
  eyebrow: "Agendamiento por WhatsApp con IA · AURA",
  h1Lead: "",
  h1Accent: "Agendamiento por WhatsApp con IA",
  h1Rest: " para clínicas: AURA agenda, reagenda y confirma por ti",
  thesis:
    "AURA es el agente de IA de Clinera que atiende el WhatsApp de tu clínica 24/7: consulta la disponibilidad real, agenda, reagenda y cancela dentro de la conversación, sin links. Trabaja sobre la agenda y la ficha de Clinera, con tu número conectado vía Meta.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. En vivo en todos los planes. Un solo modo de agendamiento: Agentic.`,
  heroViews: ["aura", "ficha", "intelligence"],
  includesH2: "Qué hace el agendamiento por WhatsApp con IA de Clinera",
  includes: [
    {
      title: "Agenda dentro de la conversación",
      body: "El paciente escribe, AURA consulta la disponibilidad real del equipo y deja la cita creada. Sin links ni formularios.",
    },
    {
      title: "Reagenda y cancela",
      body: "Cambios y cancelaciones en el mismo hilo, con la agenda actualizada al instante.",
    },
    {
      title: "Atiende fuera de horario",
      body: "Responde precios, horarios y dudas a cualquier hora y agenda sin que nadie de la clínica tenga que estar conectado.",
    },
    {
      title: "Deriva a una persona",
      body: "Cuando la conversación lo requiere, pasa el caso a tu equipo con el historial a la vista.",
    },
    {
      title: "Sobre la ficha del paciente",
      body: "AURA trabaja sobre la agenda y la ficha de Clinera: el contexto del paciente está en el mismo sistema, sin sincronizar dos programas.",
    },
    {
      title: "Número propio vía Meta",
      body: "Conectas tu WhatsApp con Meta Embedded Signup; la cuenta de WhatsApp Business es de tu clínica.",
    },
  ],
  deepDive: {
    eyebrow: "Cómo se cobra el consumo",
    h2: "Pagas por conversación, medida en créditos",
    body: "Conversar sin llegar a una cita consume 30 créditos; una conversación que agenda, reagenda o cancela, 195. Cada plan trae una bolsa mensual y la recarga está disponible. La calculadora te dice qué plan te calza según tu volumen.",
    bullets: [
      `Vortex: ${vortex.credits.toLocaleString("es-CL")} créditos, ${vortex.consumptionReference}`,
      `Atlas: ${atlas.credits.toLocaleString("es-CL")} créditos`,
      `Summit: ${summit.credits.toLocaleString("es-CL")} créditos`,
    ],
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA atiende tu WhatsApp las 24 horas.",
    body: "Agenda sobre la agenda real de tu equipo y confirma la cita. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — agendamiento por WhatsApp con IA para clínicas",
  },
  crm: {
    eyebrow: "Más que un chatbot",
    h2: "¿Buscabas un chatbot para clínicas? AURA viene dentro del software",
    body: "Un chatbot suelto responde, pero la cita vive en otro sistema. En Clinera el agente, la agenda, la ficha y el CRM son el mismo software: lo que agenda AURA queda en la ficha y en el seguimiento de ventas.",
  },
  finalH2: "Te mostramos AURA agendando en tu WhatsApp.",
  faqs: [
    {
      q: "¿Cómo agenda citas por WhatsApp un agente de IA?",
      a: "AURA conversa con el paciente, consulta la disponibilidad real de los profesionales en la agenda de Clinera y deja la cita creada. Reagenda y cancela en la misma conversación y avisa a tu equipo cuando hay que intervenir.",
    },
    {
      q: "¿Necesito cambiar mi número de WhatsApp?",
      a: "No. Conectas el número de tu clínica con Meta Embedded Signup y la cuenta queda a nombre de tu clínica. Una cuenta de Clinera trabaja con 1 número de WhatsApp, 1 cuenta de Instagram y 1 de Facebook. Más números o perfiles son más cuentas.",
    },
    {
      q: "¿Se integra con la agenda que usamos hoy?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿Cuánto cuesta el agendamiento por WhatsApp con IA?",
      a: PRICE_FAQ,
    },
    {
      q: "¿Cuántas conversaciones incluye cada plan?",
      a: `Una conversación que no termina en cita consume 30 créditos y una que agenda, reagenda o cancela, 195. Con eso, Vortex alcanza para ${vortex.consumptionReference}. Atlas y Summit traen bolsas mayores y la recarga está disponible.`,
    },
    {
      q: "¿AURA reemplaza a mi recepcionista?",
      a: "Toma el trabajo repetitivo —responder, agendar, confirmar, reagendar— y deriva a tu equipo lo que requiere criterio. Tu recepción se libera para atender a quien está en la clínica.",
    },
    {
      q: "¿Qué es un chatbot para clínicas y en qué se diferencia de AURA?",
      a: "Un chatbot clásico sigue un guion de respuestas. AURA es un empleado digital: entiende la conversación, consulta la agenda real y ejecuta la acción. Lee más en https://www.clinera.io/empleado-digital.",
    },
  ],
  meta: {
    title: "Agendamiento por WhatsApp con IA para clínicas | Clinera",
    description: `Agendamiento automático por WhatsApp con IA para clínicas: AURA agenda, reagenda y confirma 24/7 sobre la agenda y la ficha de Clinera. Desde USD ${vortex.monthlyPrice}/mes.`,
    keywords: [
      "agendamiento por whatsapp con IA",
      "agendamiento automático clínicas",
      "chatbot para clínicas",
      "agente IA whatsapp clínicas",
      "agendar citas por whatsapp",
    ],
  },
};
