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
    | "software-para-clinicas"
    | "recordatorios-citas-whatsapp"
    | "crm-para-clinicas"
    | "software-kinesiologia"
    | "software-psicologia"
    | "software-nutricion"
    | "agendamiento-whatsapp-ia";
  leadSource:
    | "software_medico_landing"
    | "software_dental_landing"
    | "software_estetica_landing"
    | "software_para_clinicas_landing"
    | "recordatorios_citas_whatsapp_landing"
    | "crm_para_clinicas_landing"
    | "software_kinesiologia_landing"
    | "software_psicologia_landing"
    | "software_nutricion_landing"
    | "agendamiento_whatsapp_ia_landing";
  contentCategory:
    | "landing_software_medico"
    | "landing_software_dental"
    | "landing_software_estetica"
    | "landing_software_para_clinicas"
    | "landing_recordatorios_citas_whatsapp"
    | "landing_crm_para_clinicas"
    | "landing_software_kinesiologia"
    | "landing_software_psicologia"
    | "landing_software_nutricion"
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

export const CLINICAS: SoftwareVerticalContent = {
  slug: "software-para-clinicas",
  leadSource: "software_para_clinicas_landing",
  contentCategory: "landing_software_para_clinicas",
  breadcrumbName: "Software para clínicas",
  applicationName: "Clinera — software y sistema de gestión para clínicas",
  applicationSubCategory: "Clinic Management",
  eyebrow: "Software para clínicas · agenda, ficha y agente IA",
  h1Lead: "El ",
  h1Accent: "software para clínicas",
  h1Rest: " que agenda, ficha y atiende tu WhatsApp con IA",
  thesis:
    "Clinera es el software, o programa de gestión, con el que opera una clínica médica o estética: agenda por profesional, ficha clínica electrónica, módulo de pagos, CRM y un agente de IA (AURA) que atiende y agenda por WhatsApp 24/7. Migramos tus datos en el onboarding.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. Un solo sistema de gestión, sin integrar agendas de terceros. Un solo modo de agendamiento: Agentic.`,
  heroViews: ["ficha", "aura", "intelligence"],
  includesH2: "Qué incluye un programa de gestión para clínicas",
  includes: [
    {
      title: "Agenda por profesional",
      body: "Disponibilidad real por profesional, box y duración. AURA crea, reagenda y cancela dentro de WhatsApp, sin mandar links.",
    },
    {
      title: "Ficha clínica electrónica",
      body: "Historial, evolución y consentimientos del paciente en un solo lugar. Más sobre la normativa en https://www.clinera.io/ley20584.",
    },
    {
      title: "Módulo de pagos",
      body: "Cobros, planes de tratamiento y abonos dentro del mismo sistema que la agenda y la ficha.",
    },
    {
      title: "Agente IA (AURA)",
      body: "Atiende el WhatsApp de la clínica 24/7: responde, califica y agenda sobre tu agenda real. En vivo en todos los planes. CAMILA (llamadas con IA) disponible solo en Summit.",
    },
    {
      title: "Recordatorios y confirmación",
      body: "El agente confirma las citas y reagenda por WhatsApp para bajar los no-shows. Cómo hacerlo: https://www.clinera.io/blog/como-reducir-no-shows-clinica-estetica.",
    },
    {
      title: "CRM y Clinera Intelligence",
      body: "Seguimiento de leads y atribución de campañas Meta y Google en el mismo software. Pregunta en lenguaje natural por ventas, asistencia y no-shows.",
    },
  ],
  deepDive: {
    eyebrow: "Un solo sistema",
    h2: "Un sistema de gestión, no cuatro programas pegados",
    body: "Muchas clínicas arman su operación con una agenda, una ficha, un Excel de pagos y un WhatsApp aparte. Clinera junta todo en un sistema: lo que el paciente escribe por WhatsApp queda en la agenda, en la ficha y en el CRM, sin copiar datos a mano.",
    bullets: [
      "Agenda, ficha, pagos y CRM en el mismo sistema",
      "WhatsApp con IA conectado a la agenda real del equipo",
      "Migración de tus datos incluida en el onboarding",
    ],
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA responde y agenda cuando la clínica no puede.",
    body: "Atiende consultas fuera de horario, agenda y confirma sobre la agenda del equipo, y deriva a una persona cuando la conversación lo pide. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — agente IA de WhatsApp para clínicas",
  },
  crm: {
    eyebrow: "CRM para clínicas",
    h2: "¿Buscabas un CRM para tu clínica? Viene dentro del software",
    body: "Pipeline de pacientes, seguimiento y atribución de campañas en el mismo sistema que la agenda y la ficha. No conectas dos sistemas: es el módulo de ventas del software con el que opera la clínica.",
  },
  finalH2: "Te mostramos tu clínica dentro de Clinera.",
  faqs: [
    {
      q: "¿Qué es un software o programa para clínicas?",
      a: "Es el sistema con el que opera una clínica: agenda, ficha clínica, pagos y CRM en un solo lugar. Clinera suma un agente de IA que atiende y agenda por WhatsApp, así que no es un bot al lado de otro programa.",
    },
    {
      q: "¿Para qué tipo de clínica sirve Clinera?",
      a: "Para clínicas médicas y estéticas. Hay páginas con el detalle de cada una: https://www.clinera.io/software-medico, https://www.clinera.io/software-dental y https://www.clinera.io/software-estetica.",
    },
    {
      q: "¿Sirve para una clínica de una sola sucursal?",
      a: `Sí. Vortex (USD ${vortex.monthlyPrice}/mes) es el plan de entrada: ${vortex.credits.toLocaleString("es-CL")} créditos/mes, ${vortex.consumptionReference}. Agenda, ficha y AURA van incluidos.`,
    },
    {
      q: "¿Se integra con la agenda que usamos hoy?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿Cómo se compara con otros programas de gestión?",
      a: "Clinera opera en un solo sistema y suma IA conversacional por WhatsApp. Puedes ver las comparativas por herramienta en https://www.clinera.io/comparativas y el ranking en https://www.clinera.io/mejor-software-clinicas.",
    },
    {
      q: "¿Cuánto cuesta el software para clínicas?",
      a: PRICE_FAQ,
    },
    {
      q: "¿Cómo agenda el agente IA?",
      a: "AURA (en vivo) conversa por WhatsApp, consulta la disponibilidad real del equipo y deja la cita creada. Reagenda y cancela en la misma conversación. CAMILA, el agente de voz, está disponible solo en Summit.",
    },
  ],
  meta: {
    title: "Software para clínicas: agenda, ficha y agente IA | Clinera",
    description: `Software y programa de gestión para clínicas: agenda, ficha clínica electrónica, pagos, CRM y agente IA que agenda por WhatsApp 24/7. Desde USD ${vortex.monthlyPrice}/mes. Migramos tus datos.`,
    keywords: [
      "software para clínicas",
      "programa para clínicas",
      "sistema de gestión para clínicas",
      "software de gestión clínica",
      "CRM para clínicas",
      "agenda para clínicas",
    ],
  },
};

export const RECORDATORIOS: SoftwareVerticalContent = {
  slug: "recordatorios-citas-whatsapp",
  leadSource: "recordatorios_citas_whatsapp_landing",
  contentCategory: "landing_recordatorios_citas_whatsapp",
  breadcrumbName: "Recordatorios de citas por WhatsApp",
  applicationName: "Clinera AURA — recordatorios y confirmación de citas por WhatsApp",
  applicationSubCategory: "Appointment Reminders",
  eyebrow: "Recordatorios de citas por WhatsApp · confirmación automática",
  h1Lead: "",
  h1Accent: "Recordatorios de citas por WhatsApp",
  h1Rest: " para clínicas: confirma y reagenda sin llamar uno por uno",
  thesis:
    "Clinera envía recordatorios de citas por WhatsApp y pide la confirmación del paciente de forma automática. Si el paciente no puede asistir, AURA, el agente de IA, reagenda en la misma conversación sobre la agenda real de la clínica, para que el horario libre se vuelva a llenar.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. Sin llamar paciente por paciente. Un solo modo de agendamiento: Agentic.`,
  heroViews: ["aura", "ficha", "intelligence"],
  includesH2: "Qué hacen los recordatorios de citas de Clinera",
  includes: [
    {
      title: "Recordatorio antes de la cita",
      body: "El paciente recibe un mensaje de WhatsApp con día, hora y profesional, usando una plantilla aprobada por Meta.",
    },
    {
      title: "Confirmación automática",
      body: "El paciente responde en el mismo chat y la cita queda confirmada en la agenda, sin que nadie de recepción la marque a mano.",
    },
    {
      title: "Reagenda en la conversación",
      body: "Si no puede ir, AURA ofrece horarios libres reales y deja la cita movida. Sin links ni formularios.",
    },
    {
      title: "Libera el horario cancelado",
      body: "Una cancelación avisada a tiempo deja el hueco disponible para otro paciente en vez de convertirse en un no-show.",
    },
    {
      title: "Deriva lo que requiere criterio",
      body: "Si el paciente tiene una duda clínica o un reclamo, AURA pasa el caso a tu equipo con el historial a la vista.",
    },
    {
      title: "Sobre la agenda y la ficha",
      body: "Los recordatorios salen de la misma agenda donde viven las citas y la ficha del paciente, sin sincronizar dos programas.",
    },
  ],
  deepDive: {
    eyebrow: "Plantillas de WhatsApp",
    h2: "Recordar una cita es un mensaje transaccional",
    body: "Un recordatorio o una confirmación de una cita que el paciente ya pidió se envía como plantilla Utility, no como Marketing. Si el mensaje agrega promociones, Meta lo clasifica distinto. Por eso los recordatorios de Clinera solo informan la cita. El detalle está en https://www.clinera.io/blog/las-plantillas-para-confirmar-citas-en-whatsapp-api-deben-ser-marketing-o-utility.",
    bullets: [
      "Plantilla de recordatorio y de confirmación, sin promociones",
      "Respuesta del paciente en el mismo hilo",
      "Cita actualizada en la agenda al instante",
    ],
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA confirma y reagenda cuando la recepción no alcanza.",
    body: "Escribe el recordatorio, recibe la respuesta y mueve la cita si hace falta. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — recordatorios y confirmación de citas por WhatsApp",
  },
  crm: {
    eyebrow: "Menos no-shows",
    h2: "¿Buscabas bajar los no-shows? Empieza por confirmar cada cita",
    body: "El recordatorio es la parte visible. Lo que cambia el resultado es que la confirmación, la reagenda y el seguimiento vivan en el mismo sistema que la agenda y el CRM. Guía completa: https://www.clinera.io/blog/como-reducir-no-shows-clinica-estetica.",
  },
  finalH2: "Te mostramos los recordatorios corriendo en tu WhatsApp.",
  faqs: [
    {
      q: "¿Cómo funcionan los recordatorios de citas por WhatsApp?",
      a: "Clinera envía al paciente un mensaje con los datos de su cita antes de la fecha y le pide confirmar. La respuesta queda registrada en la agenda y, si no puede asistir, AURA le ofrece reagendar en la misma conversación.",
    },
    {
      q: "¿Qué pasa si el paciente no confirma?",
      a: "Tu equipo decide qué hacer con ese horario, por ejemplo contactarlo o reofrecerlo. Ideas para este caso en https://www.clinera.io/blog/pacientes-no-confirman-cita-que-hacer.",
    },
    {
      q: "¿Los recordatorios usan mi número de WhatsApp?",
      a: "Sí. Conectas el número de tu clínica con Meta Embedded Signup y la cuenta queda a nombre de tu clínica. Una cuenta de Clinera trabaja con 1 número de WhatsApp, 1 cuenta de Instagram y 1 de Facebook. Más números o perfiles son más cuentas.",
    },
    {
      q: "¿Se integra con la agenda que usamos hoy?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿Cuánto cuesta?",
      a: PRICE_FAQ,
    },
    {
      q: "¿Cuántos créditos consume una conversación de recordatorio?",
      a: "Una conversación que no termina en cita consume 30 créditos y una que agenda, reagenda o cancela, 195. Una confirmación que se resuelve con una respuesta corta se mide con esas mismas tarifas. La calculadora te dice qué plan te calza.",
    },
    {
      q: "¿Los recordatorios reemplazan a mi recepcionista?",
      a: "Toman el trabajo repetitivo de confirmar y reagendar, y dejan a tu equipo lo que requiere criterio. Para entender el agente completo, mira https://www.clinera.io/agendamiento-whatsapp-ia.",
    },
  ],
  meta: {
    title: "Recordatorios de citas por WhatsApp para clínicas | Clinera",
    description: `Recordatorios y confirmación automática de citas por WhatsApp para clínicas. AURA confirma y reagenda en la conversación, sobre tu agenda real. Desde USD ${vortex.monthlyPrice}/mes.`,
    keywords: [
      "recordatorios de citas por whatsapp",
      "confirmación automática de citas",
      "recordatorio de citas clínica",
      "reducir no-shows clínica",
      "confirmar citas por whatsapp",
    ],
  },
};

export const CRM: SoftwareVerticalContent = {
  slug: "crm-para-clinicas",
  leadSource: "crm_para_clinicas_landing",
  contentCategory: "landing_crm_para_clinicas",
  breadcrumbName: "CRM para clínicas",
  applicationName: "Clinera — CRM para clínicas",
  applicationSubCategory: "Clinic CRM",
  eyebrow: "CRM para clínicas · leads, pacientes y atribución de campañas",
  h1Lead: "El ",
  h1Accent: "CRM para clínicas",
  h1Rest: " que vive dentro de tu agenda, tu ficha y tu WhatsApp",
  thesis:
    "Clinera incluye un CRM para clínicas dentro del mismo software de la agenda y la ficha clínica: sigue a cada lead desde el primer mensaje de WhatsApp hasta la cita, conserva el historial del paciente y atribuye las campañas de Meta y Google. No conectas dos sistemas: es un solo programa.",
  sub: `Desde USD ${vortex.monthlyPrice}/mes. CRM incluido en todos los planes, sin integrar agendas de terceros. Un solo modo de agendamiento: Agentic.`,
  heroViews: ["aura", "ficha", "intelligence"],
  includesH2: "Qué incluye el CRM para clínicas de Clinera",
  includes: [
    {
      title: "Seguimiento de leads",
      body: "Cada persona que escribe por WhatsApp queda registrada con su conversación, para que tu equipo sepa en qué etapa está y qué falta para agendarla.",
    },
    {
      title: "Del lead al paciente",
      body: "Cuando AURA agenda la cita, el contacto pasa a ser paciente en la misma base, con su ficha clínica y su historial. Sin exportar ni copiar datos.",
    },
    {
      title: "Planes de tratamiento",
      body: "El seguimiento de cada paciente incluye su plan de tratamiento y lo que falta por agendar o cerrar.",
    },
    {
      title: "Atribución de campañas",
      body: "Ves qué campañas de Meta y Google traen pacientes que agendan, no solo clics. Cómo se mide: https://www.clinera.io/blog/mide-conversiones-meta-google-clinera.",
    },
    {
      title: "WhatsApp con IA conectado",
      body: "AURA conversa, califica y agenda sobre el mismo CRM. Lo que dice el paciente queda en su registro sin que nadie lo tipee.",
    },
    {
      title: "Webhooks y API pública",
      body: "En Atlas y Summit conectas el CRM con n8n, Make o Zapier. Esto no es integración con agendas de terceros: Clinera sigue operando sobre su propia agenda.",
    },
  ],
  deepDive: {
    eyebrow: "Un solo sistema",
    h2: "Un CRM separado de la agenda se desactualiza",
    body: "Cuando el CRM vive en una herramienta y la agenda en otra, alguien tiene que pasar los datos a mano y siempre queda un lado atrasado. En Clinera el lead, la cita, la ficha y el pago comparten la misma base, así que el seguimiento refleja lo que realmente pasó en la clínica.",
    bullets: [
      "Lead, cita, ficha y pago en la misma base",
      "WhatsApp con IA que registra la conversación sola",
      "Atribución de campañas Meta y Google",
    ],
  },
  aura: {
    eyebrow: "Agente IA · en vivo",
    headline: "AURA alimenta el CRM mientras atiende el WhatsApp.",
    body: "Responde, califica y agenda sobre la agenda real, y deriva a una persona cuando hace falta. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
    imageAlt: "AURA — agente IA de WhatsApp conectado al CRM de la clínica",
  },
  crm: {
    eyebrow: "Más que una base de datos",
    h2: "¿Buscabas un CRM aparte? No necesitas otro programa",
    body: "Un CRM útil para una clínica no es una lista de contactos: es saber qué pasó con cada consulta. Por eso en Clinera es un módulo del mismo software de la agenda. Más sobre el tema: https://www.clinera.io/blog/crm-para-clinicas-como-la-mensajeria-omnicanal-aumenta-la-fidelizacion.",
  },
  finalH2: "Te mostramos el CRM con los datos de tu clínica.",
  faqs: [
    {
      q: "¿Qué es un CRM para clínicas?",
      a: "Es el sistema que registra a cada persona que contacta a la clínica, qué conversó y en qué etapa está hasta que agenda y se atiende. En Clinera viene dentro del mismo software que la agenda y la ficha clínica.",
    },
    {
      q: "¿Necesito contratar un CRM aparte?",
      a: "No. El CRM está incluido en todos los planes de Clinera y comparte base con la agenda, la ficha y los pagos. Si prefieres otra herramienta, en Atlas y Summit tienes Webhooks y API pública.",
    },
    {
      q: "¿Sirve para una clínica estética?",
      a: "Sí. Funciona igual para clínicas médicas y estéticas. El detalle de la ficha estética está en https://www.clinera.io/software-estetica.",
    },
    {
      q: "¿Se integra con la agenda que usamos hoy?",
      a: INTEGRATION_FAQ,
    },
    {
      q: "¿Puedo saber qué campañas me traen pacientes?",
      a: "Sí. Clinera atribuye las campañas de Meta y Google a los pacientes que agendan, no solo a los clics. Cómo funciona la medición: https://www.clinera.io/blog/mide-conversiones-meta-google-clinera.",
    },
    {
      q: "¿Cuánto cuesta el CRM para clínicas?",
      a: PRICE_FAQ,
    },
    {
      q: "¿El agente de WhatsApp escribe en el CRM?",
      a: "Sí. AURA conversa con el paciente sobre la agenda real y la conversación queda registrada en su contacto. Más sobre el agente: https://www.clinera.io/agendamiento-whatsapp-ia.",
    },
  ],
  meta: {
    title: "CRM para clínicas: leads, pacientes y campañas | Clinera",
    description: `CRM para clínicas incluido en el software de agenda y ficha: seguimiento de leads por WhatsApp, pacientes y atribución de campañas Meta y Google. Desde USD ${vortex.monthlyPrice}/mes.`,
    keywords: [
      "CRM para clínicas",
      "CRM para clínicas estéticas",
      "CRM médico",
      "seguimiento de pacientes",
      "atribución de campañas clínica",
    ],
  },
};

type EspecialidadOpts = {
  slug: SoftwareVerticalContent["slug"];
  leadSource: SoftwareVerticalContent["leadSource"];
  contentCategory: SoftwareVerticalContent["contentCategory"];
  profesional: string; // "kinesiólogos"
  centro: string; // "centro de kinesiología"
  accent: string; // "software para kinesiólogos"
  thesis: string;
  tratamiento: string; // "sesiones de rehabilitación"
  keywords: string[];
};

function especialidad(o: EspecialidadOpts): SoftwareVerticalContent {
  return {
    slug: o.slug,
    leadSource: o.leadSource,
    contentCategory: o.contentCategory,
    breadcrumbName: `Software para ${o.profesional}`,
    applicationName: `Clinera — software para ${o.profesional}`,
    applicationSubCategory: "Practice Management",
    eyebrow: `Software para ${o.profesional} · agenda, ficha y agente IA`,
    h1Lead: "El ",
    h1Accent: o.accent,
    h1Rest: " que agenda, ficha y confirma por WhatsApp",
    thesis: o.thesis,
    sub: `Desde USD ${vortex.monthlyPrice}/mes. Agenda, ficha y CRM en un solo sistema, sin integrar agendas de terceros. Un solo modo de agendamiento: Agentic.`,
    heroViews: ["ficha", "aura", "intelligence"],
    includesH2: `Qué incluye el software para ${o.profesional}`,
    includes: [
      {
        title: "Agenda por profesional",
        body: "Disponibilidad real por profesional y duración de la atención. AURA crea, reagenda y cancela dentro de WhatsApp, sin mandar links.",
      },
      {
        title: "Ficha clínica",
        body: `Historial, evolución y consentimientos de cada paciente en un solo lugar, para seguir las ${o.tratamiento} sin papeles sueltos.`,
      },
      {
        title: "Agente IA (AURA)",
        body: "Atiende el WhatsApp de la consulta 24/7: responde, califica y agenda sobre tu agenda real. En vivo en todos los planes. CAMILA (llamadas con IA) disponible solo en Summit.",
      },
      {
        title: "Recordatorios y confirmación",
        body: "El agente confirma las citas y reagenda por WhatsApp. Más en https://www.clinera.io/recordatorios-citas-whatsapp.",
      },
      {
        title: "Pagos",
        body: "Cobros y abonos dentro del mismo sistema que la agenda y la ficha.",
      },
      {
        title: "CRM, dentro",
        body: "Seguimiento de quienes escriben y de tus pacientes en el mismo software. Detalle en https://www.clinera.io/crm-para-clinicas.",
      },
    ],
    deepDive: {
      eyebrow: "Un solo sistema",
      h2: `Menos herramientas sueltas en tu ${o.centro}`,
      body: `Muchos ${o.profesional} arman su operación con una agenda, una planilla, un WhatsApp personal y carpetas de fichas. Clinera junta todo en un sistema: lo que el paciente escribe por WhatsApp queda en la agenda, en la ficha y en el CRM.`,
      bullets: [
        "Agenda, ficha, pagos y CRM en el mismo sistema",
        "WhatsApp con IA conectado a tu agenda real",
        "Migración de tus datos incluida en el onboarding",
      ],
    },
    aura: {
      eyebrow: "Agente IA · en vivo",
      headline: "AURA responde y agenda cuando tú estás atendiendo.",
      body: "Atiende consultas fuera de horario, agenda y confirma sobre tu agenda, y deriva a una persona cuando la conversación lo pide. CAMILA (llamadas con IA) disponible solo en Summit; LIA disponible en Summit.",
      imageAlt: `AURA — agente IA de WhatsApp para ${o.profesional}`,
    },
    crm: {
      eyebrow: `CRM para ${o.profesional}`,
      h2: "¿Buscabas un CRM aparte? Viene dentro del software",
      body: "Seguimiento de pacientes y de nuevas consultas en el mismo sistema que la agenda y la ficha. No conectas dos programas.",
    },
    finalH2: `Te mostramos Clinera con tu ${o.centro}.`,
    faqs: [
      {
        q: `¿Sirve Clinera para ${o.profesional}?`,
        a: `Sí. Tiene agenda por profesional, ficha clínica, pagos, CRM y un agente de IA que atiende el WhatsApp. Es el sistema con el que opera la consulta, no un bot al lado de otro programa.`,
      },
      {
        q: "¿Sirve para un profesional que trabaja solo?",
        a: `Sí. Vortex (USD ${vortex.monthlyPrice}/mes) es el plan de entrada: ${vortex.credits.toLocaleString("es-CL")} créditos/mes, ${vortex.consumptionReference}. Agenda, ficha y AURA van incluidos.`,
      },
      {
        q: "¿Se integra con la agenda que usamos hoy?",
        a: INTEGRATION_FAQ,
      },
      {
        q: "¿Cómo agenda el agente IA?",
        a: "AURA (en vivo) conversa por WhatsApp, consulta la disponibilidad real y deja la cita creada. Reagenda y cancela en la misma conversación. CAMILA, el agente de voz, está disponible solo en Summit.",
      },
      {
        q: "¿Tiene fichas con campos propios de mi especialidad?",
        a: "La ficha clínica de Clinera concentra el historial, la evolución y los consentimientos del paciente. Si necesitas campos específicos de tu especialidad, consúltalo en la demo antes de decidir.",
      },
      {
        q: `¿Cuánto cuesta el software para ${o.profesional}?`,
        a: PRICE_FAQ,
      },
    ],
    meta: {
      title: `Software para ${o.profesional}: agenda, ficha y agente IA | Clinera`,
      description: `Software para ${o.profesional}: agenda, ficha clínica, CRM y agente IA que agenda por WhatsApp 24/7. Desde USD ${vortex.monthlyPrice}/mes. Migramos tus datos.`,
      keywords: o.keywords,
    },
  };
}

export const KINESIOLOGIA = especialidad({
  slug: "software-kinesiologia",
  leadSource: "software_kinesiologia_landing",
  contentCategory: "landing_software_kinesiologia",
  profesional: "kinesiólogos",
  centro: "centro de kinesiología",
  accent: "software para kinesiólogos",
  tratamiento: "sesiones de rehabilitación",
  thesis:
    "Clinera es un software para kinesiólogos con agenda por profesional, ficha clínica para seguir cada sesión de rehabilitación, pagos y un agente de IA (AURA) que agenda y confirma por WhatsApp 24/7. Opera sobre su propia agenda: migramos tus datos en el onboarding, sin integrar agendas de terceros.",
  keywords: ["software para kinesiólogos", "software kinesiología", "agenda para kinesiólogos", "ficha clínica kinesiología", "programa para centro de kinesiología"],
});

export const PSICOLOGIA = especialidad({
  slug: "software-psicologia",
  leadSource: "software_psicologia_landing",
  contentCategory: "landing_software_psicologia",
  profesional: "psicólogos",
  centro: "consulta psicológica",
  accent: "software para psicólogos",
  tratamiento: "sesiones de terapia",
  thesis:
    "Clinera es un software para psicólogos con agenda por profesional, ficha clínica para llevar el historial de cada paciente y sus sesiones, pagos y un agente de IA (AURA) que agenda y confirma por WhatsApp 24/7. Opera sobre su propia agenda: migramos tus datos en el onboarding, sin integrar agendas de terceros.",
  keywords: ["software para psicólogos", "software psicología", "agenda para psicólogos", "ficha clínica psicología", "programa para consulta psicológica"],
});

export const NUTRICION = especialidad({
  slug: "software-nutricion",
  leadSource: "software_nutricion_landing",
  contentCategory: "landing_software_nutricion",
  profesional: "nutricionistas",
  centro: "consulta de nutrición",
  accent: "software para nutricionistas",
  tratamiento: "consultas y controles",
  thesis:
    "Clinera es un software para nutricionistas con agenda por profesional, ficha clínica para seguir las consultas y controles de cada paciente, pagos y un agente de IA (AURA) que agenda y confirma por WhatsApp 24/7. Opera sobre su propia agenda: migramos tus datos en el onboarding, sin integrar agendas de terceros.",
  keywords: ["software para nutricionistas", "software nutrición", "agenda para nutricionistas", "ficha clínica nutrición", "programa para consulta de nutrición"],
});
