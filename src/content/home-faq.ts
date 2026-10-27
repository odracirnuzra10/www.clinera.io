import { PLANES } from "@/content/planes";

// Fuente única del FAQ del home: la consume la sección <Faq /> de
// home-v3/sections.tsx y el JSON-LD FAQPage de src/app/page.tsx.
// Ricardo, 20-oct-2026: el home habla de las dos opciones (Vortex y Ecosistema);
// las preguntas técnicas del software viven en /funciones y en el blog.
export const HOME_FAQ = [
  {
    q: "¿Qué diferencia hay entre Vortex y el Ecosistema?",
    a: `Vortex (US$ ${PLANES[0].monthlyUsd}/mes) es el software con IA: agenda, fichas, bandeja de WhatsApp, Instagram y Facebook, AURA que responde y agenda, y Clinera Intelligence. El Ecosistema (US$ ${PLANES[1].monthlyUsd}/mes${PLANES[1].promoHasta ? `, precio promocional ${PLANES[1].promoHasta}` : ""}) es todo Vortex más marketing de performance: campañas con creativos, propuesta de valor, framework comercial y una reunión de marketing cada semana.`,
  },
  {
    q: "¿La publicidad está incluida en el Ecosistema?",
    a: "No. La inversión en anuncios la paga la clínica aparte, directo a Meta y Google. El Ecosistema incluye la gestión de las campañas, los creativos y las reuniones semanales.",
  },
  {
    q: "¿Qué es Clinera Intelligence?",
    a: "Es el agente interno de Vortex. Le preguntas cuánto vendiste, cómo va tu agenda o qué campaña trajo pacientes, y te responde con los datos de tu clínica.",
  },
  {
    q: "¿Tiene costo de implementación?",
    a: "No. Pagas solo la mensualidad. Las dos opciones incluyen onboarding dedicado con un ejecutivo humano, que migra tus datos y configura la clínica contigo.",
  },
  {
    q: "¿Necesito cambiar mi número de WhatsApp?",
    a: "No. Clinera se conecta con tu número actual usando la API oficial de WhatsApp Business. Tus pacientes siguen escribiendo al mismo número de siempre.",
  },
  {
    q: "¿Dónde se guardan los datos de mis pacientes?",
    a: "En Google Cloud Platform, región Santiago de Chile (southamerica-west1): los datos clínicos residen en Chile, cifrados en tránsito y en reposo. Cumplimos la Ley N° 19.628 y la Ley N° 21.719 de protección de datos en Chile.",
  },
];
