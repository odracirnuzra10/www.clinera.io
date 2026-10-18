// Fuente única del FAQ de /planes: la consume <PlanesFaq /> en
// interior-v3/PlanesV3.tsx y el JSON-LD FAQPage de src/app/planes/page.tsx.
// Modelo nuevo (Ricardo, 18-oct-2026): Vortex y Ecosistema. Los números
// salen de `planes.ts`. Sin anual, sin MXN y sin cupón. Los extras (profesional, conversaciones, créditos) son
// parte del software y sí llevan precio (`EXTRAS` en planes.ts).
import { VERTEX_IA_MODELS_PROSE } from "@/content/ia-stack";
import { EXTRAS, IMPLEMENTACION_USD, MARKETING_BLOQUES, PLANES } from "@/content/planes";

const [vortex, ecosistema] = PLANES;

/** Marcador visible: lo que Ricardo no ha confirmado no se inventa (AGENTS.md). */
export const PENDIENTE_INVERSION =
  "[PENDIENTE: confirmar con Ricardo] La suposición es que el presupuesto de anuncios lo paga la clínica aparte, directo a Meta y Google.";

export const PLANES_FAQ = [
  {
    q: "¿Qué diferencia hay entre Vortex y Ecosistema?",
    a: `Vortex (US$ ${vortex.monthlyUsd}/mes) es el software con IA: agenda, fichas, bandeja de WhatsApp, Instagram y Facebook, y el agente AURA que responde y agenda. Ecosistema (US$ ${ecosistema.monthlyUsd}/mes) es el ecosistema completo: todo lo de Vortex más marketing de performance, para que además te traigamos los pacientes.`,
  },
  {
    q: "¿Qué incluye el marketing de performance?",
    a: `Tres cosas: ${MARKETING_BLOQUES.map((b) => b.titulo.charAt(0).toLowerCase() + b.titulo.slice(1)).join("; ")}.`,
  },
  {
    q: "¿La inversión en publicidad está incluida?",
    a: PENDIENTE_INVERSION,
  },
  {
    q: "¿Qué es la implementación de USD 450?",
    a: `Es un pago único, igual para las dos opciones, que va en el primer cobro junto con el primer mes. Incluye el onboarding asistido por una persona: configuramos tu cuenta, conectamos tus canales y migramos tus pacientes y tratamientos (USD ${IMPLEMENTACION_USD}).`,
  },
  {
    q: "¿Puedo empezar solo con el software y sumar marketing después?",
    a: "Sí. Puedes partir con Vortex y pasar a Ecosistema cuando quieras. Lo coordinamos contigo en la videollamada.",
  },
  {
    q: "¿Qué pasa si necesito más profesionales, conversaciones o créditos de IA?",
    a: `Son extras del software y los compras cuando los necesitas: profesional extra US$ ${EXTRAS[0].precioUsd} al mes, 500 conversaciones extra US$ ${EXTRAS[1].precioUsd} y 5.000 créditos de IA extra US$ ${EXTRAS[2].precioUsd}.`,
  },
  {
    q: "¿Ya soy cliente, mi plan cambia?",
    a: "No, tu plan actual se mantiene.",
  },
  {
    q: "¿Cómo parto?",
    a: "Con «Agendar videollamada»: nos cuentas de tu clínica, eliges qué servicio te interesa y reservas una videollamada de 30 minutos con el equipo.",
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
