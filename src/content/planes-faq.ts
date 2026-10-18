// Fuente única del FAQ de /planes: la consume <PlanesFaq /> en
// interior-v3/PlanesV3.tsx y el JSON-LD FAQPage de src/app/planes/page.tsx.
// Planes Flux · Hurricane · Vortex (Ricardo, 18-oct-2026): los números salen de
// `planes.ts`. Sin anual, sin MXN y sin bolsa de créditos de los planes viejos.
import { VERTEX_IA_MODELS_PROSE } from "@/content/ia-stack";
import { EXTRAS, PLANES, PLAN_IA_DESDE } from "@/content/planes";

const n = (v: number) => v.toLocaleString("es-CL");
const [extraConv, extraCreditos, extraProf] = EXTRAS;

export const PLANES_FAQ = [
  {
    q: "¿Qué diferencia a Flux, Hurricane y Vortex?",
    a: `Los tres traen ficha estética facial y corporal personalizada, evoluciones, presupuestos, WhatsApp, Facebook, Instagram, email marketing y Clinera Intelligence. Cambian el tamaño del equipo, las conversaciones, los créditos y la IA: ${PLANES.map((p) => `${p.name} (US$ ${p.monthlyUsd}/mes) hasta ${p.professionals} profesionales, ${n(p.conversations)} conversaciones y ${n(p.ciCredits)} créditos de Clinera Intelligence, ${p.agenteIA ? `con agente IA y ${n(p.iaCredits)} créditos de IA` : "sin agente IA"}`).join("; ")}.`,
  },
  {
    q: "¿Qué plan trae el agente IA que responde y agenda?",
    a: `Desde ${PLAN_IA_DESDE.name}. Flux es sin IA. El agente responde a tus pacientes por WhatsApp, Facebook e Instagram y agenda sobre tu agenda real.`,
  },
  {
    q: "¿Qué es Clinera Intelligence?",
    a: `Es el agente IA dentro del software: le preguntas por tus ventas, tu agenda y tus pacientes. Créditos al mes: ${PLANES.map((p) => `${p.name} ${n(p.ciCredits)}`).join(", ")}.`,
  },
  {
    q: "¿Qué pasa si se me acaban las conversaciones?",
    a: `Sumas un paquete de ${extraConv.label} por US$ ${extraConv.usd} sin cambiar de plan, o subes de plan. También puedes sumar ${extraCreditos.label} por US$ ${extraCreditos.usd}.`,
  },
  {
    q: "¿Puedo sumar profesionales sin cambiar de plan?",
    a: `Sí. Cada profesional extra cuesta US$ ${extraProf.usd} al mes.`,
  },
  {
    q: "¿Cómo contrato?",
    a: "Dos caminos: activas tu plan acá mismo con el botón de pago (con el cupón CUKI tienes 50% el primer mes), o hablas con ventas: eliges una hora en clinera.io/agenda y en 45 minutos por videollamada te mostramos Clinera con el caso de tu clínica.",
  },
  {
    q: "¿Puedo cambiar de plan después?",
    a: "Sí. Puedes subir o bajar de plan cuando lo necesites. El cambio se aplica en tu próximo ciclo de facturación.",
  },
  {
    q: "¿Puedo elegir el modelo de IA?",
    a: `Clinera opera con ${VERTEX_IA_MODELS_PROSE} en Vertex AI (Google Cloud) y selecciona el modelo óptimo por tarea. No hay selección manual de modelos: el stack está fijado para que la IA ejecute con consistencia.`,
  },
  {
    q: "¿Se integra con mi software actual?",
    a: "No. Clinera no se conecta a sistemas de agenda externos: opera sobre su propia agenda, sus propias fichas clínicas y su propio módulo de pagos. Por eso la IA puede agendar sola dentro del chat, sin mandar links ni depender de la disponibilidad de un tercero. En el onboarding migramos tus pacientes, tratamientos y datos históricos desde tu sistema actual.",
  },
];
