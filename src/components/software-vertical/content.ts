import type { HeroViewId } from "@/components/plataforma/HeroCarousel";
import {
  ANNUAL_DISCOUNT_PERCENT,
  CLINERA_PLANS,
  SETUP_FEE_NUMBER,
} from "@/content/pricing";

const vortex = CLINERA_PLANS[0];
const atlas = CLINERA_PLANS[1];
const summit = CLINERA_PLANS[2];

export type SoftwareVerticalContent = {
  slug: "software-medico" | "software-dental";
  leadSource: "software_medico_landing" | "software_dental_landing";
  contentCategory: "landing_software_medico" | "landing_software_dental";
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

const PRICE_FAQ = `Vortex desde USD ${vortex.monthlyPrice}/mes, Atlas USD ${atlas.monthlyPrice}, Summit USD ${summit.monthlyPrice}. Permanencia mínima 6 meses. Semestral y anual traen ${ANNUAL_DISCOUNT_PERCENT}% de descuento y la implementación de USD ${SETUP_FEE_NUMBER} incluida; en mensual la implementación se paga al inicio y el plan después.`;

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
      body: "Atiende por WhatsApp 24/7: califica, agenda y confirma sobre tu agenda. En vivo en todos los planes. CAMILA (voz) disponible desde Atlas.",
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
    body: "Responde precios y horarios, agenda en tu calendario y confirma la cita. Trabaja sobre la agenda de todo el equipo, 24/7. CAMILA (voz) disponible desde Atlas; LIA disponible en Summit.",
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
      a: "Agenda, ficha clínica (facial y corporal), agente IA por WhatsApp (AURA), Clinera Intelligence y un módulo de ventas/seguimiento. En Atlas y Summit se suman Webhooks + API. CAMILA (voz) disponible desde Atlas; LIA disponible en Summit.",
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
      a: "AURA (en vivo, todos los planes) atiende por WhatsApp, califica y agenda sola sobre tu calendario. CAMILA llama por teléfono desde Atlas. LIA fiscaliza la operación en Summit.",
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
      body: "Atiende el WhatsApp de la clínica 24/7, confirma y llena huecos. En vivo. CAMILA (voz) disponible desde Atlas.",
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
    body: "Confirma, reagenda y recupera pacientes sobre la agenda real de tus profesionales. Sin mandar links. CAMILA (voz) disponible desde Atlas; LIA disponible en Summit.",
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
      a: "AURA (en vivo) conversa por WhatsApp, consulta la disponibilidad real de tus sillones y deja la cita creada. Reagenda y cancela en la misma conversación. CAMILA, el agente de voz, está disponible desde Atlas.",
    },
    {
      q: "¿Cómo es la implementación y la migración?",
      a: `Onboarding asistido: importamos pacientes, tratamientos y agenda. Costo único de USD ${SETUP_FEE_NUMBER} sólo en mensual; en semestral y anual va incluida. No hay sincronización permanente con Dentalink ni con otras agendas: operas en Clinera.`,
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
