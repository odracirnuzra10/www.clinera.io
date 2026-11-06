import { PLANES_TRIAL_FAQ } from "@/content/planes-trial";

// Fuente única del FAQ del home: la consume la sección <Faq /> de
// home-v3/sections.tsx y el JSON-LD FAQPage de src/app/page.tsx.
// Ricardo, 7-nov-2026: el home vende la prueba gratis con Flux, Hex y Xcale
// (antes, Vortex y Ecosistema). Las preguntas de planes salen de `planes-trial.ts`.
export const HOME_FAQ = [
  ...PLANES_TRIAL_FAQ.slice(0, 3),
  {
    q: "¿Qué es Clinera Intelligence?",
    a: "Es el agente interno de tu clínica. Le preguntas cuánto vendiste, cómo va tu agenda o quién te debe, y te responde con los datos de tu clínica. Viene en los tres planes.",
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
