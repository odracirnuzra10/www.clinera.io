// Fuente única del FAQ de /planes: la consume <PlanesFaq /> en
// interior-v3/PlanesV3.tsx y el JSON-LD FAQPage de src/app/planes/page.tsx.
// Planes Flux · Nexus · Summit (Ricardo, 18-oct-2026): los números salen de
// `planes.ts`. Sin anual, sin MXN y sin bolsa de créditos de los planes viejos.
import { VERTEX_IA_MODELS_PROSE } from "@/content/ia-stack";
import { EXTRAS, IMPLEMENTACION_USD, PLANES, PLAN_CON_AGENTE } from "@/content/planes";

const [flux, nexus, summit] = PLANES;
const n = (v: number) => v.toLocaleString("es-CL");
const [extraConv, extraCreditos, extraProf] = EXTRAS;

export const PLANES_FAQ = [
  {
    q: "¿Qué diferencia a Flux, Nexus y Summit?",
    a: `El tamaño del equipo y lo que automatizas. Flux (US$ ${flux.monthlyUsd}/mes) trae WhatsApp, Facebook e Instagram, ${flux.professionals} profesionales y hasta ${n(flux.conversations)} conversaciones. Nexus (US$ ${nexus.monthlyUsd}/mes) suma email marketing, automatizaciones y difusiones, ${nexus.professionals} profesionales y hasta ${n(nexus.conversations)} conversaciones. Summit (US$ ${summit.monthlyUsd}/mes) suma el agente IA de texto y voz, ${summit.professionals} profesionales, hasta ${n(summit.conversations)} conversaciones y onboarding humano dedicado.`,
  },
  {
    q: "¿Qué plan trae el agente IA que responde y agenda?",
    a: `${PLAN_CON_AGENTE.name}. Es el único con agente IA de texto y voz: responde a tus pacientes por WhatsApp, Facebook e Instagram, atiende llamadas y agenda sobre tu agenda real.`,
  },
  {
    q: `¿Qué incluye la implementación de US$ ${IMPLEMENTACION_USD}?`,
    a: `Es un pago único, en todos los planes. Cubre la configuración inicial de tu cuenta y la migración de tus pacientes y tratamientos desde tu sistema actual, para que partas con todo cargado.`,
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
    a: "Hablas con ventas: eliges una hora en clinera.io/agenda y en 45 minutos por videollamada te mostramos Clinera con el caso de tu clínica y te ayudamos a elegir el plan.",
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
