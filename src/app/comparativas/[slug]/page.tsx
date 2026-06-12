import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { CrossComparativa } from "@/components/comparativas/CrossComparativa";
import MigrationCompareBanner, {
  type CompetitorApiPricing,
} from "@/components/comparativas/MigrationCompareBanner";
import { cruzadas, getCruzadasForCompetitor } from "@/content/comparativas-cross";

type Slug =
  | "reservo"
  | "agendapro"
  | "medilink"
  | "manual"
  | "dentalink"
  | "sacmed"
  | "medifolios"
  | "saludtools"
  | "doctocliq";

type Row = {
  feature: string;
  clinera: string; // "yes" | "no" | "partial" | text
  them: string;
  themNote?: string; // small footnote shown under the cell, e.g. "anunciado, no activo"
  clineraHighlight?: boolean; // true = only Clinera has it (used for marketing diff rows)
};

type Dimension = {
  title: string;
  body: string;
};

type FaqItem = { q: string; a: string };

type Competitor = {
  name: string;
  siteLabel: string;
  title: string;
  intro: string;
  tldr: { clinera: string; them: string };
  clineraWins: string[]; // Long list — always heavier than themWins
  themWins: string[]; // Short list — honest acknowledgement
  table: Row[];
  dimensions: Dimension[];
  faqs: FaqItem[];
};

/**
 * Precios públicos del plan más completo (con API) por competidor.
 * Verificado en vivo abril 2026. Los que no publican precios se marcan
 * priceIsConsulta:true → el banner muestra "USD 574+ (lo que pagues por X)"
 * sumando solo Vambe.ai Advanced (USD 574/mes verificado).
 *
 * "manual" y "sacmed" no tienen banner: la narrativa "API + IA por separado"
 * no aplica a "hacerlo manual" y Sacmed quedó fuera del scope inicial.
 */
const COMPETITOR_API_PRICING: Partial<Record<Slug, CompetitorApiPricing>> = {
  agendapro: {
    name: "AgendaPro",
    plan: "Plan Pro (con API)",
    price: "USD 270",
    priceUsd: 270,
    priceUrl: "https://www.agendapro.com/planes",
    priceLabel: "agendapro.com/planes",
  },
  reservo: {
    name: "Reservo",
    plan: "Plan Empresarial (con API)",
    price: "USD 220",
    priceUsd: 220,
    priceUrl: "https://www.reservo.cl",
    priceLabel: "reservo.cl",
  },
  medilink: {
    name: "Medilink",
    plan: "Plan Enterprise (con API)",
    price: "USD 245",
    priceUsd: 245,
    priceUrl: "https://medilink.cl",
    priceLabel: "medilink.cl",
  },
  dentalink: {
    name: "Dentalink",
    plan: "Plan Titanium (incluye API)",
    price: "USD 245",
    priceUsd: 245,
    priceUrl: "https://www.softwaredentalink.com",
    priceLabel: "softwaredentalink.com",
  },
  medifolios: {
    name: "Medifolios",
    plan: "IPS Alta Complejidad (con API)",
    price: "USD 295",
    priceUsd: 295,
    priceUrl: "https://medifolios.net",
    priceLabel: "medifolios.net (COP $14.188.500/año)",
  },
  saludtools: {
    name: "Saludtools",
    plan: "Plan Premium (con API)",
    price: "USD 180",
    priceUsd: 180,
    priceIsEstimated: true,
    priceUrl: "https://www.saludtools.com/precios",
    priceLabel: "saludtools.com/precios",
  },
  doctocliq: {
    name: "Doctocliq",
    plan: "Plan Avanzado (con API)",
    price: "USD 49",
    priceUsd: 49,
    priceUrl: "https://www.doctocliq.com/planes",
    priceLabel: "doctocliq.com/planes",
  },
  sacmed: {
    name: "Sacmed",
    plan: "Plan Premium (con API)",
    price: "USD 180",
    priceUsd: 180,
    priceUrl: "https://sacmed.cl",
    priceLabel: "sacmed.cl",
  },
};

const competitors: Record<Slug, Competitor> = {
  reservo: {
    name: "Reservo",
    siteLabel: "reservo.cl",
    title: "Clinera vs Reservo: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "Reservo es un software chileno tradicional para gestionar agenda, ficha clínica y finanzas. Clinera es un software con IA conversacional que atiende WhatsApp 24/7. Aquí la comparativa honesta, con tabla, precios y casos de migración.",
    tldr: {
      clinera:
        "Clinera es mejor si el cuello de botella de tu clínica es contestar WhatsApp a tiempo. AURA responde, agenda y confirma pacientes 24/7 sin que tú muevas un dedo.",
      them:
        "Reservo es mejor si ya tienes una recepción que cubre tus horas hábiles y solo necesitas un sistema sólido de agenda + ficha + cobros, sin IA.",
    },
    clineraWins: [
      "IA conversacional AURA que responde tu WhatsApp 24/7 con memoria contextual LangChain.",
      "Coexistencia nativa con WhatsApp Business — opera en el mismo número que ya usa tu clínica.",
      "Difusiones masivas de WhatsApp marketing desde el mismo panel.",
      "Landing pages de conversión con analítica medible incluidas.",
      "Atribución de ventas a campañas (Meta/Google → conversación → cita → venta).",
      "IA integrable con tu agenda actual vía API y MCP (no obliga a migrar).",
      "Derivación automática a humano cuando la conversación lo requiere.",
      "Precios públicos desde USD 129/mes, sin permanencia.",
      "Setup en menos de 1 hora, sin programador.",
      "Reducción típica de no-shows del 30% al 5-10% en el primer mes.",
    ],
    themWins: [
      "Reservo tiene más años en el mercado chileno (500+ clínicas, +1M citas históricas) y una marca muy reconocida.",
      "Su módulo de ficha clínica es maduro: odontograma dental y plantillas por especialidad.",
      "Módulo financiero robusto con facturación electrónica DTE y comisiones para equipos.",
    ],
    table: [
      // Differentiators (marketing + IA + coexistencia)
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "IA integrable con agenda externa (Reservo/Dentalink/otros)", clinera: "yes", them: "no", clineraHighlight: true },
      // Core capabilities
      { feature: "Memoria contextual (LangChain)", clinera: "yes", them: "no" },
      { feature: "Integración MCP", clinera: "yes", them: "no" },
      { feature: "Derivación automática a humano", clinera: "yes", them: "partial" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Reserva online 24/7", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Odontograma dental", clinera: "partial", them: "yes" },
      { feature: "Consentimientos informados", clinera: "yes", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Facturación electrónica", clinera: "partial", them: "yes" },
      { feature: "Módulo de comisiones", clinera: "partial", them: "yes" },
      { feature: "App móvil nativa", clinera: "yes", them: "no" },
      { feature: "Panel de ventas / trazabilidad", clinera: "yes", them: "partial" },
      { feature: "Precios públicos", clinera: "yes", them: "no" },
      { feature: "Plan desde USD", clinera: "$129", them: "consulta" },
    ],
    dimensions: [
      {
        title: "IA y automatización",
        body:
          "Aquí está la mayor diferencia. Clinera nació con IA conversacional: AURA entiende intención, ofrece horarios, agenda, confirma y deriva a humano cuando hace falta — todo por WhatsApp, 24/7, con memoria contextual entre conversaciones. Reservo, en cambio, trata WhatsApp como un canal de envío manual: tú o tu recepción escriben, Reservo no responde por ti. Si tu flujo depende de que alguien conteste cada mensaje, Reservo no te libera tiempo.",
      },
      {
        title: "Agendamiento y calendario",
        body:
          "Los dos tienen agenda multi-profesional con reserva online, bloqueos por disponibilidad y visualización por profesional o por sede. Reservo tiene una experiencia más pulida en la gestión manual (drag-and-drop, bloques recurrentes, recursos). Clinera pone el énfasis en que AURA agenda sola sin pasar por la recepción — y sincroniza con Google Calendar y WhatsApp en tiempo real.",
      },
      {
        title: "Comunicación con paciente",
        body:
          "Clinera: WhatsApp como canal principal, IA que responde siempre, recordatorios y confirmaciones automáticas. Reservo: recordatorios por email/SMS y envío manual de WhatsApp desde el panel. Si tu paciente escribe fuera de horario, Reservo no responde; Clinera sí.",
      },
      {
        title: "Ficha clínica",
        body:
          "Reservo tiene ventaja histórica acá: plantillas por especialidad bien maduras, odontograma para dental y un flujo de consulta muy completo. Clinera cubre ficha clínica digital, firma, consentimientos y telemedicina, pero sabemos que nuestro foco principal ha sido la capa de IA y WhatsApp. Si tu prioridad absoluta es la ficha, Reservo sigue siendo fuerte.",
      },
      {
        title: "Precio y planes",
        body:
          "Clinera publica sus precios: Conect USD 129/mes, Advanced USD 179/mes, MAX USD 279/mes, sin permanencia. Reservo no publica precios — atiende por formulario o teléfono con un plan único ajustado al tamaño del centro. Si valoras saber cuánto pagas antes de llamar, Clinera tiene la transparencia.",
      },
      {
        title: "Soporte y onboarding",
        body:
          "Clinera ofrece setup en menos de 1 hora, soporte en español y (en Advanced) onboarding dedicado. Reservo tiene equipo de soporte local en Chile con fama de responder bien, y es un estándar en varias redes de clínicas chilenas. Ambas empresas son sólidas en este aspecto.",
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar mis datos desde Reservo a Clinera?",
        a: "Sí. Clinera exporta pacientes, agenda y fichas desde Reservo vía API o CSV. Te acompañamos en la migración sin costo durante el onboarding.",
      },
      {
        q: "¿Reservo tiene IA conversacional como AURA?",
        a: "A abril 2026, según materiales públicos de Reservo, no. Reservo ofrece envío manual de WhatsApp desde el panel, no un agente IA autónomo que responda 24/7.",
      },
      {
        q: "¿Puedo mantener Reservo y sumar Clinera solo para la IA?",
        a: "Sí. El plan Conect de Clinera está diseñado justo para eso: clínicas que ya tienen software y solo quieren sumar la capa de mensajería con IA. Conectamos vía API o MCP.",
      },
      {
        q: "¿Cuánto cuesta Reservo vs Clinera?",
        a: "Reservo no publica precios (cotización por tamaño de clínica). Clinera publica USD 129/179/279 por mes, sin permanencia.",
      },
      {
        q: "¿Reservo cubre dental?",
        a: "Sí, con un módulo fuerte de odontograma. Clinera cubre dental también pero su fortaleza principal está en la capa de IA y WhatsApp; si dental es tu único vertical, evalúa ambos.",
      },
    ],
  },

  agendapro: {
    name: "AgendaPro",
    siteLabel: "agendapro.com",
    title: "Clinera vs AgendaPro: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "AgendaPro es el software de agendamiento más grande de LATAM (20.000+ negocios en 10+ países, US$35M levantados en 2025). Clinera está enfocada 100% en clínicas con IA conversacional. Esta es la comparativa honesta.",
    tldr: {
      clinera:
        "Clinera es mejor si necesitas profundidad clínica real (ficha médica, consentimientos, memoria contextual en WhatsApp) y precios transparentes desde USD 129/mes.",
      them:
        "AgendaPro es mejor si tu negocio mezcla varios verticales (estética + spa + peluquería + gym) y necesitas escala comprobada con apps móviles nativas y pasarela de pagos pulida.",
    },
    clineraWins: [
      "IA conversacional WhatsApp activa en producción (no un anuncio) — AURA responde 24/7 hoy.",
      "Memoria contextual LangChain: AURA recuerda al paciente entre conversaciones.",
      "Coexistencia nativa con WhatsApp Business en el mismo número.",
      "Difusiones masivas de WhatsApp marketing desde el panel.",
      "Landing pages de conversión con analítica medible.",
      "Atribución de ventas a campañas de marketing (campaña → cita → venta).",
      "Foco 100% clínico: ficha por especialidad, consentimientos, telemedicina.",
      "Precio plano USD 129/mes con 3 usuarios incluidos (sin sumar por usuario).",
      "Integración MCP con cualquier stack existente.",
      "Setup en menos de 1 hora y onboarding asistido en el plan Advanced.",
    ],
    themWins: [
      "Escala enorme: 20.000+ negocios, 135.000+ profesionales, 100M+ citas históricas.",
      "US$35M levantados con Riverwood Capital (2025); lanzó Julia como recepcionista IA.",
      "Apps móviles nativas iOS/Android más pulidas, precio de entrada USD 19/usuario.",
      "Cubre verticales amplios: spa, peluquería, gym, yoga, pilates, además de salud.",
    ],
    table: [
      // Differentiators (marketing + IA + coexistencia)
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "partial", themNote: "Julia (2025) — recepcionista IA, WhatsApp no documentado", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "partial", themNote: "tracking básico Meta/Google", clineraHighlight: true },
      { feature: "IA integrable con agenda externa", clinera: "yes", them: "no", clineraHighlight: true },
      // Core capabilities
      { feature: "IA con memoria contextual (LangChain)", clinera: "yes", them: "no" },
      { feature: "Integración MCP", clinera: "yes", them: "no" },
      { feature: "Enfoque 100% clínico", clinera: "yes", them: "no" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Reserva online 24/7", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Consentimientos informados", clinera: "yes", them: "partial" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Pasarela de pagos online", clinera: "partial", them: "yes" },
      { feature: "Apps móviles nativas iOS/Android", clinera: "partial", them: "yes" },
      { feature: "Recordatorios automáticos", clinera: "yes", them: "yes" },
      { feature: "Cobertura LATAM", clinera: "yes", them: "yes" },
      { feature: "Precio publicado", clinera: "yes", them: "partial" },
      { feature: "Plan base (USD/mes)", clinera: "$129 · 3 usuarios", them: "$19/usuario" },
    ],
    dimensions: [
      {
        title: "IA y automatización",
        body:
          "AgendaPro lanzó Julia en agosto 2025 — una recepcionista IA que cubre respuestas fuera de horario y fines de semana. Es un paso real, pero sus materiales públicos no mencionan memoria contextual LangChain ni MCP: está más posicionada como un chatbot de respuestas rápidas que como un agente conversacional con razonamiento contextual. Clinera (AURA) incorpora LangChain con memoria entre conversaciones y soporta MCP, lo que le permite recordar al paciente, entender el contexto de consultas previas y conectarse a tu stack sin integraciones custom.",
      },
      {
        title: "Agendamiento y calendario",
        body:
          "Ambos cubren agenda multi-profesional, reserva online, recordatorios por múltiples canales. AgendaPro tiene ventaja en polish móvil (apps nativas) y en integraciones con Google/Meta. Clinera apunta a que el agendamiento pase por AURA — el paciente agenda conversando, no navegando una UI.",
      },
      {
        title: "Comunicación con paciente",
        body:
          "AgendaPro: recordatorios por email, SMS y teléfono; Julia responde consultas fuera de horario. Clinera: WhatsApp como canal principal, AURA responde 24/7 con memoria contextual, deriva a humano cuando hace falta. Si WhatsApp es tu canal crítico, Clinera tiene más profundidad en ese canal específico.",
      },
      {
        title: "Ficha clínica",
        body:
          "AgendaPro cubre ficha digital pero su enfoque horizontal (belleza + salud + wellness) significa menos profundidad en lo estrictamente médico. Clinera se enfoca en clínicas: ficha por especialidad, consentimientos informados firmados, telemedicina. Si eres spa, AgendaPro te queda mejor; si eres clínica médica, Clinera va más alineado.",
      },
      {
        title: "Precio y planes",
        body:
          "AgendaPro arranca en USD 19/usuario/mes (plus add-ons de pagos y recepcionista). Clinera publica Conect USD 129/mes con 3 usuarios incluidos, Advanced USD 179/mes con 5 usuarios, MAX USD 279/mes con 15 usuarios. Para equipos pequeños AgendaPro suele salir más barato; desde 6-7 usuarios Clinera empareja o queda más barato, y con la ventaja de IA conversacional incluida.",
      },
      {
        title: "Soporte y onboarding",
        body:
          "AgendaPro tiene presencia corporativa enorme y equipo regional. Clinera apuesta por setup en menos de 1 hora y soporte en español con onboarding dedicado en el plan Advanced.",
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar de AgendaPro a Clinera?",
        a: "Sí. Exportamos tus pacientes y agenda vía API o CSV, y migramos conversaciones recientes de WhatsApp para que AURA arranque con contexto. Sin costo durante el onboarding.",
      },
      {
        q: "¿Julia (AgendaPro) y AURA (Clinera) hacen lo mismo?",
        a: "Se parecen en el objetivo (responder fuera de horario) pero son distintas en profundidad. AURA incluye memoria contextual LangChain y soporta MCP; Julia, según los materiales públicos a abril 2026, se comunica como recepcionista IA sin memoria contextual explícita.",
      },
      {
        q: "¿Cuál es más barato para mi clínica?",
        a: "Depende del tamaño. Con equipos chicos, AgendaPro (USD 19/usuario) suele salir más barato en precio nominal. Desde 6-7 usuarios, Clinera Conect USD 129/mes con 3 usuarios incluidos empareja o queda más barato, e incluye IA conversacional.",
      },
      {
        q: "¿Clinera sirve si tengo spa además de mi clínica?",
        a: "Clinera está enfocada 100% en clínicas. Si tu negocio mezcla clínica + spa + peluquería + gym, AgendaPro cubre todo en un solo sistema y probablemente te queda mejor.",
      },
      {
        q: "¿Clinera tiene apps nativas como AgendaPro?",
        a: "Clinera tiene apps móviles pero AgendaPro las tiene más pulidas y con más años de iteración. Si la experiencia móvil es tu prioridad #1, es un punto a favor de AgendaPro.",
      },
    ],
  },

  medilink: {
    name: "Medilink",
    siteLabel: "softwaremedilink.com",
    title: "Clinera vs Medilink: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "Medilink tiene uno de los relatos IA más fuertes en Chile pero su agente conversacional aún no está en producción generalizada. Clinera ya opera 24/7 con AURA, memoria contextual LangChain, coexistencia nativa con WhatsApp Business y precios públicos. Acá la comparativa honesta.",
    tldr: {
      clinera:
        "Clinera es mejor si quieres IA conversacional que YA está operando en producción, con coexistencia con WhatsApp Business, difusiones masivas, landing pages de conversión y atribución de ventas — todo en un mismo panel. Precios desde USD 129/mes.",
      them:
        "Medilink es mejor si necesitas ecosistema profundo en Chile (integraciones con BSale, Nubox, Kame, DTE completo) y llamadas telefónicas con IA, y no te importa esperar a que su agente WhatsApp entre en producción general.",
    },
    clineraWins: [
      "IA conversacional WhatsApp activa en producción hoy — Medilink lo anunció pero no está disponible generalizado.",
      "Coexistencia nativa con WhatsApp Business en el mismo número.",
      "Difusiones masivas de WhatsApp marketing — no disponible en Medilink.",
      "Landing pages de conversión con analítica medible.",
      "Atribución de ventas a campañas de marketing.",
      "Memoria contextual LangChain documentada y operativa.",
      "IA integrable con agendas externas (Reservo, Dentalink, etc.) vía MCP + API.",
      "Precios públicos: Conect $129, Advanced $179, MAX $279 USD/mes.",
      "Contratación self-service sin cotización telefónica.",
      "Setup en menos de 1 hora.",
      "Derivación automática a humano con trazabilidad completa.",
    ],
    themWins: [
      "Contact Center IA de Medilink cubre llamadas telefónicas además de WhatsApp.",
      "Integraciones nativas con el stack chileno (BSale, Nubox, Kame, Optimuz, Woxi).",
      "Notas Clínicas IA (voz a texto) y ContralorIA (supervisor clínico) — funciones más maduras.",
      "Telemedicina incluida de fábrica; presencia en 20+ países + España.",
    ],
    table: [
      // Differentiators (marketing + IA + coexistencia)
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "partial", themNote: "anunciado, no disponible en producción generalizada", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "IA integrable con agenda externa", clinera: "yes", them: "no", clineraHighlight: true },
      // Core capabilities
      { feature: "Llamadas telefónicas con IA", clinera: "no", them: "yes" },
      { feature: "Memoria contextual (LangChain)", clinera: "yes", them: "partial" },
      { feature: "Integración MCP", clinera: "yes", them: "no" },
      { feature: "Derivación automática a humano", clinera: "yes", them: "yes" },
      { feature: "Notas clínicas por voz", clinera: "partial", them: "yes" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica por especialidad", clinera: "yes", them: "yes" },
      { feature: "Telemedicina", clinera: "partial", them: "yes" },
      { feature: "Facturación electrónica DTE Chile", clinera: "partial", them: "yes" },
      { feature: "Integración BSale / Nubox / Kame", clinera: "partial", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Panel ventas y trazabilidad", clinera: "yes", them: "yes" },
      { feature: "Precios públicos", clinera: "yes", them: "no" },
      { feature: "Plan base (USD/mes)", clinera: "$129", them: "consulta" },
    ],
    dimensions: [
      {
        title: "IA y automatización",
        body:
          "Los dos juegan en la misma categoría IA-first. Medilink gana en amplitud: cubre llamadas + WhatsApp + notas clínicas por voz + ContralorIA. Clinera gana en profundidad conversacional: AURA usa LangChain con memoria contextual explícita, lo que significa que recuerda conversaciones previas del mismo paciente y mantiene contexto entre mensajes. Medilink comunica su Contact Center IA como orientación por prompts, sin detallar memoria contextual ni MCP en materiales públicos.",
      },
      {
        title: "Agendamiento y calendario",
        body:
          "Prácticamente empate. Ambas tienen reserva online 24/7, multi-profesional, multi-sede, recordatorios automáticos y confirmaciones. Medilink lleva más años puliendo la UI de agenda; Clinera apuesta por que el agendamiento pase por conversación con AURA más que por navegación.",
      },
      {
        title: "Comunicación con paciente",
        body:
          "Medilink cubre WhatsApp + llamada telefónica 24/7 — si tus pacientes llaman mucho, es una ventaja real. Clinera cubre WhatsApp 24/7 con memoria contextual y derivación a humano, pero no responde llamadas telefónicas. Si tu flujo es principalmente WhatsApp, los dos te sirven; si llamadas son críticas, Medilink adelanta.",
      },
      {
        title: "Ficha clínica",
        body:
          "Medilink es fuerte: plantillas por especialidad, firma digital, Vademecum, telemedicina incluida, fichas estéticas faciales, Notas Clínicas IA (voz a texto). Clinera cubre lo esencial pero Notas por voz está en roadmap, no en producto actual. Si la ficha es crítica y la usas intensivamente durante la consulta, Medilink es más profundo.",
      },
      {
        title: "Precio y planes",
        body:
          "Medilink no publica precios (cotización por clínica). Clinera publica Conect USD 129, Advanced USD 179, MAX USD 279, sin permanencia. Si valoras transparencia total y precio predecible, Clinera tiene ventaja clara.",
      },
      {
        title: "Soporte y onboarding",
        body:
          "Medilink se pitchea como no-contrato, actualizaciones gratis y soporte local. Clinera ofrece setup en menos de 1 hora y onboarding dedicado en Advanced. Los dos son sólidos en este frente — la diferencia está en el modelo comercial (Medilink: contacto y cotización; Clinera: autoservicio con activación instantánea).",
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar de Medilink a Clinera?",
        a: "Sí. Exportamos pacientes y fichas desde Medilink vía CSV/API. La mayoría de los datos críticos (paciente, historial, agenda) se mueven sin fricción durante el onboarding.",
      },
      {
        q: "¿Cuál IA es más inteligente: AURA o Contact Center IA de Medilink?",
        a: "Son diferentes. Contact Center IA de Medilink cubre llamadas + WhatsApp; AURA de Clinera cubre WhatsApp con memoria contextual LangChain y soporte MCP. Si llamadas telefónicas son importantes para ti, Medilink adelanta. Si priorizas profundidad conversacional y arquitectura abierta, AURA.",
      },
      {
        q: "¿Clinera se integra con BSale o Nubox como Medilink?",
        a: "Clinera conecta vía API y MCP con cualquier sistema que exponga integración. A abril 2026, Medilink tiene integraciones nativas más maduras con el stack chileno tradicional (BSale, Nubox, Kame). Clinera suele requerir una integración inicial por API.",
      },
      {
        q: "¿Cuánto cuesta Medilink vs Clinera?",
        a: "Medilink no publica precios — cotización telefónica. Clinera publica USD 129/179/279 por mes, sin permanencia.",
      },
      {
        q: "¿Clinera tiene telemedicina?",
        a: "Clinera cubre teleconsulta básica. Medilink incluye telemedicina como módulo más maduro. Si teleconsulta es central para tu operación, revisa ambos.",
      },
    ],
  },

  manual: {
    name: "hacerlo manual",
    siteLabel: "recepción manual",
    title: "Clinera vs hacerlo manual: ¿cuánto te cuesta realmente no automatizar?",
    intro:
      "La decisión más cara que muchas clínicas toman es no decidir nada — seguir con una recepción manual contestando mensajes y llamando pacientes. Aquí los números reales de lo que cuesta quedarse así.",
    tldr: {
      clinera:
        "Clinera se paga sola en menos de un mes: recupera revenue perdido por no-shows, libera 2h diarias de recepción y responde a pacientes fuera de horario. Precio USD 129-279/mes.",
      them:
        "Seguir manual tiene sentido solo si atiendes menos de 30 citas al mes, no piensas crecer y tu recepción tiene capacidad sobrada. Para el resto, los números no dan.",
    },
    clineraWins: [
      "AURA responde WhatsApp 24/7 sin contratar más recepción.",
      "Reducción típica de no-shows del 30% al 5-10% en los primeros 30 días.",
      "Ahorro de 2-4 horas diarias en recepción dedicadas a mensajes.",
      "Respuesta a pacientes fines de semana, noches y feriados.",
      "Confirmaciones y recordatorios automáticos por WhatsApp.",
      "Seguimiento automatizado post-cita (reagenda, post-operatorio, reviews).",
      "Trazabilidad completa: campaña → conversación → cita → venta.",
      "Landing pages y difusiones masivas incluidas — marketing medible.",
      "Escalas sin aumentar costo operativo proporcional.",
      "Datos centralizados en la nube (sin Excel ni cuadernos).",
      "ROI típico en menos de 30 días (USD 129/mes vs USD 2.000+ recuperados).",
    ],
    themWins: [
      "Cero costo de software mensual (pero pagas con tiempo y revenue perdido).",
      "Control humano total sobre cada mensaje.",
      "Sin curva de aprendizaje de una plataforma nueva.",
    ],
    table: [
      // Differentiators vs manual
      { feature: "IA conversacional WhatsApp activa en producción", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas de WhatsApp marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Landing pages de conversión con analítica medible", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas de marketing", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "IA integrable con agenda externa", clinera: "yes", them: "no", clineraHighlight: true },
      // Operational reality
      { feature: "Costo mensual directo", clinera: "$129-279 USD", them: "$0 (aparente)" },
      { feature: "Horas/día de recepción en mensajes", clinera: "< 30 min", them: "2-4 horas" },
      { feature: "Tasa de no-shows típica", clinera: "5-10%", them: "25-35%" },
      { feature: "Tiempo medio de primera respuesta", clinera: "< 1 min", them: "30 min – 2 h" },
      { feature: "Respuesta fuera de horario", clinera: "yes", them: "no" },
      { feature: "Respuesta fines de semana", clinera: "yes", them: "no" },
      { feature: "Confirmación automática de citas", clinera: "yes", them: "no" },
      { feature: "Seguimiento automatizado post-cita", clinera: "yes", them: "no" },
      { feature: "Panel de métricas de conversión", clinera: "yes", them: "no" },
      { feature: "Trazabilidad campaña → cita → venta", clinera: "yes", them: "no" },
      { feature: "Escala sin contratar más recepción", clinera: "yes", them: "no" },
      { feature: "Riesgo humano (licencias, rotación)", clinera: "bajo", them: "alto" },
      { feature: "Capacidad 24/7 real", clinera: "yes", them: "no" },
    ],
    dimensions: [
      {
        title: "El costo real de no automatizar",
        body:
          "El número más importante: la tasa de no-shows promedio en clínicas LATAM es ~30%. Si facturas USD 10.000/mes en citas agendadas, estás perdiendo ~USD 3.000/mes por citas que no llegan. Clinera baja eso típicamente a 5-10% — recuperas USD 2.000/mes solo en reducción de no-shows. El plan Conect cuesta USD 129/mes. El retorno es obvio.",
      },
      {
        title: "Tiempo de recepción",
        body:
          "Estudios internos con clínicas chilenas y mexicanas muestran que una recepcionista gasta entre 2 y 4 horas al día respondiendo mensajes de WhatsApp y llamando para confirmar. Al mes son 40-80 horas. Al año, 480-960 horas — el equivalente a media recepción adicional. Clinera hace ese trabajo por ti y libera a la recepción para atender al paciente que sí está en la clínica.",
      },
      {
        title: "Mensajes fuera de horario",
        body:
          "El 40-60% de los mensajes entrantes a clínicas ocurren fuera del horario hábil (tarde, noche, fin de semana). Cada mensaje sin responder es un paciente que se va a la competencia. AURA responde 24/7 con memoria contextual. Manual, no.",
      },
      {
        title: "Ficha clínica y trazabilidad",
        body:
          "Manual implica agendas en cuaderno o Excel, fichas en papel o Drive, y cero trazabilidad de de dónde vino cada paciente. Clinera te da trazabilidad campaña → conversación → cita → venta en un solo panel. Si corres Meta Ads, esa trazabilidad define qué campaña funciona y cuál tirar.",
      },
      {
        title: "Riesgo operacional",
        body:
          "Tu recepción se enferma, sale de vacaciones, se va. Cada transición manual cuesta. Con Clinera, AURA no falta nunca; la recepción humana se enfoca en casos complejos y experiencia presencial del paciente.",
      },
      {
        title: "Crecimiento",
        body:
          "Manual no escala linealmente — cada 50% más de pacientes exige contratar más recepción. Clinera sí: subir de Conect a Advanced o MAX cuesta USD 50-100/mes más y soporta 3-10× el volumen.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto me ahorro pasando de manual a Clinera?",
        a: "Depende del tamaño. Clínicas típicas de 1-3 profesionales recuperan USD 1.500-3.000/mes solo en reducción de no-shows + horas de recepción recuperadas. El plan Conect cuesta USD 129/mes. El payback suele ser de semanas, no meses.",
      },
      {
        q: "¿Qué pasa si mis pacientes prefieren hablar con una persona?",
        a: "AURA deriva automáticamente a humano cuando la conversación lo requiere. La mayoría de los casos simples (agendar, reagendar, preguntar horarios, precios) los resuelve AURA; los casos sensibles los toma tu equipo.",
      },
      {
        q: "¿Es difícil pasar de manual a Clinera?",
        a: "No. Setup en menos de 1 hora, sin programador. Conectas WhatsApp, cargas tus servicios y horarios, y AURA empieza a responder. Si tienes datos en Excel, los subimos nosotros.",
      },
      {
        q: "¿Y si mi volumen es muy bajo? ¿Me sirve igual?",
        a: "Si haces menos de 20-30 citas al mes y tu recepción tiene capacidad sobrada, quizás no justifique aún — ahí manual sigue siendo viable. Desde ~50 citas/mes, Clinera ya te paga sola.",
      },
      {
        q: "¿Qué mide la trazabilidad campaña → cita → venta?",
        a: "Sabes exactamente de qué campaña (Meta Ads, Google, referido) vino cada conversación, si agendó, si llegó a la cita y si convirtió en venta. Es lo que manual no puede darte.",
      },
    ],
  },

  dentalink: {
    name: "Dentalink",
    siteLabel: "softwaredentalink.com",
    title: "Clinera vs Dentalink: ¿cuál es mejor para tu clínica en 2026?",
    intro:
      "Dentalink es el software dental más usado en LATAM (15.000+ clientes), 100% vertical en odontología, con odontograma maduro, agenda y asistente IA propio. Clinera es agnóstico de vertical, con AURA atendiendo WhatsApp 24/7 e integrable con cualquier agenda. Comparativa honesta para una clínica que considera ambos.",
    tldr: {
      clinera:
        "Clinera es mejor si tu clínica atiende más de una vertical (estética + odontología, médico + dental, etc.) y quieres un agente IA que opere por WhatsApp con tu agenda actual sin migrar.",
      them:
        "Dentalink es mejor si tu clínica es 100% odontológica y necesitas odontograma + periodontograma + módulo de ortodoncia con la profundidad que solo da un sistema vertical especializado.",
    },
    clineraWins: [
      "Agnóstico de vertical: si abres una sucursal estética junto a la dental, Clinera la cubre sin pagar otro software.",
      "AURA opera por WhatsApp Business con coexistencia (mismo número que ya usa tu clínica).",
      "Integración MCP + API abierta: Clinera puede operar el WhatsApp encima de Dentalink sin migrar la ficha clínica.",
      "Atribución real de ventas a campañas Meta y Google Ads — Dentalink no tiene panel de marketing.",
      "Memoria contextual entre conversaciones (LangChain).",
      "Difusiones masivas de WhatsApp marketing desde el panel.",
      "Precios públicos desde USD 129/mes con 3 usuarios incluidos, sin permanencia.",
      "Setup en menos de 1 hora.",
    ],
    themWins: [
      "Líder absoluto en dental LATAM con 15.000+ clientes — la marca y la confianza están consolidadas.",
      "Odontograma + periodontograma + módulo de ortodoncia diseñados específicamente para odontología.",
      "Asistente IA propio especializado en flujos dentales (análisis de RX, reportes IA).",
      "Financiamiento de pacientes y control de caja maduros, integrados al flujo dental.",
    ],
    table: [
      // Diferenciadores Clinera
      { feature: "Agnóstico de vertical (estética, médico, dental)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "partial", clineraHighlight: true },
      { feature: "Integración MCP / API para que IA opere encima", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas Meta/Google", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas WhatsApp marketing", clinera: "yes", them: "partial", clineraHighlight: true },
      // Capabilities core
      { feature: "IA conversacional WhatsApp 24/7", clinera: "yes", them: "yes" },
      { feature: "Memoria contextual entre conversaciones", clinera: "yes", them: "partial" },
      { feature: "Derivación automática a humano", clinera: "yes", them: "partial" },
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Reserva online 24/7", clinera: "yes", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Odontograma dental nativo", clinera: "partial", them: "yes" },
      { feature: "Periodontograma", clinera: "no", them: "yes" },
      { feature: "Módulo de ortodoncia especializado", clinera: "no", them: "yes" },
      { feature: "Análisis IA de imágenes radiológicas", clinera: "no", them: "yes" },
      { feature: "Pagos online integrados", clinera: "yes", them: "yes" },
      { feature: "Financiamiento de pacientes", clinera: "partial", them: "yes" },
      { feature: "Telemedicina integrada", clinera: "partial", them: "yes" },
      { feature: "Precios públicos en web", clinera: "yes", them: "no" },
      { feature: "Plan inicial USD/mes", clinera: "$129 (3 usuarios)", them: "consultar" },
    ],
    dimensions: [
      {
        title: "Especialización vertical vs cobertura horizontal",
        body:
          "La pregunta no es cuál es mejor en abstracto, sino qué necesita tu clínica. Si atiendes solo dental, Dentalink es referente: odontograma, periodontograma y ortodoncia están diseñados como producto principal, no como módulo complementario. Si tu clínica abre o ya tiene una vertical adicional (estética facial, medicina general), Clinera te cubre todo el portafolio sin pagar dos sistemas distintos.",
      },
      {
        title: "IA conversacional — ambos la tienen, qué cambia",
        body:
          "Dentalink incorporó asistente IA propio, especializado en flujos dentales. Clinera (con AURA) opera con LangChain + MCP, integrable a cualquier sistema de agenda externo. Si quieres mantener Dentalink como núcleo dental y agregar AURA como capa WhatsApp encima — sin migrar la ficha — Clinera lo soporta vía API. Si quieres todo en un mismo proveedor 100% dental, Dentalink lo da nativo.",
      },
      {
        title: "Atribución de marketing y trazabilidad de ventas",
        body:
          "Dentalink no tiene panel de marketing — vive en el módulo clínico-financiero. Clinera trazabiliza cada conversación desde la campaña Meta o Google que la originó, hasta la cita y la venta. Si tu cuello de botella es entender qué anuncios traen pacientes reales (no solo clicks), Clinera es la diferencia.",
      },
      {
        title: "Ficha clínica especializada",
        body:
          "Dentalink gana sin discusión en odontograma, periodontograma, módulo de ortodoncia y análisis IA de radiografías. Son features que solo construye un equipo enfocado 100% en dental. Clinera cubre ficha clínica digital con consentimientos y telemedicina, pero su odontograma es básico.",
      },
      {
        title: "Precio y transparencia",
        body:
          "Dentalink no publica precios — atiende por demo o cotización. Clinera publica Conect USD 129/mes (3 usuarios incluidos), Advanced USD 179/mes, MAX USD 279/mes, todos sin permanencia y con costo de implementación $0.",
      },
    ],
    faqs: [
      {
        q: "¿Puedo usar Clinera sin migrar de Dentalink?",
        a: "Sí. Clinera se integra vía API y MCP con Dentalink. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu Dentalink. Mantienes el odontograma, periodontograma y ficha en Dentalink, y agregas la capa de IA conversacional WhatsApp + atribución de marketing.",
      },
      {
        q: "¿Dentalink es solo para clínicas dentales?",
        a: "Sí, 100%. Si tienes una clínica que mezcla dental con otras verticales (estética, medicina general), Dentalink no cubre las otras y necesitarás un segundo sistema. Clinera es agnóstico y cubre todas las verticales en un solo lugar.",
      },
      {
        q: "¿Cuál tiene mejor IA conversacional?",
        a: "Distintos enfoques. Dentalink tiene IA especializada en flujos dentales (análisis de RX, asistente CRM dental). Clinera tiene IA agnóstica de vertical, con memoria contextual LangChain y derivación automática a humano. Si tu cuello de botella son los WhatsApps sin responder, Clinera está pensada para ese problema.",
      },
      {
        q: "¿Cuál es más caro?",
        a: "Dentalink no publica precios, así que es difícil comparar — la cotización depende del tamaño de la clínica y los módulos contratados. Clinera publica Conect USD 129/mes con 3 usuarios, sin permanencia. Para una clínica dental pequeña-mediana, ambos suelen estar en el rango USD 100-250/mes.",
      },
      {
        q: "¿Migrar de Dentalink a Clinera tiene sentido?",
        a: "Solo si tu clínica dejó de ser 100% dental. Si sigue siendo dental pura, Dentalink tiene odontograma y módulo de ortodoncia que Clinera no replica con la misma profundidad. Lo recomendado para clínicas dentales es: mantener Dentalink + agregar Clinera para la capa WhatsApp + marketing.",
      },
    ],
  },

  sacmed: {
    name: "Sacmed",
    siteLabel: "sacmed.cl",
    title: "Clinera vs Sacmed: ¿cuál es mejor para tu clínica médica en 2026?",
    intro:
      "Sacmed es un software médico chileno con telemedicina certificada por Fonasa, recetas electrónicas con QR y agenda. Clinera tiene AURA, agente IA que atiende WhatsApp 24/7, e integra con tu agenda actual. Comparativa honesta para clínicas médicas en Chile.",
    tldr: {
      clinera:
        "Clinera es mejor si tu cuello de botella son los WhatsApps sin responder y quieres AURA atendiendo, agendando y derivando 24/7 con memoria contextual.",
      them:
        "Sacmed es mejor si tu prioridad es telemedicina certificada por Fonasa con receta electrónica QR y necesitas un sistema médico chileno con precios bajos publicados.",
    },
    clineraWins: [
      "AURA, agente IA conversacional que atiende WhatsApp 24/7 con memoria contextual.",
      "Coexistencia con WhatsApp Business (mismo número que ya usa tu clínica).",
      "Integración MCP + API: Clinera puede operar el WhatsApp encima de Sacmed sin migrar la ficha.",
      "Atribución real de ventas a campañas Meta y Google Ads.",
      "Difusiones masivas de WhatsApp marketing desde el panel.",
      "Derivación automática a humano cuando la conversación lo requiere.",
      "Cobertura LATAM: CL, PE, CO, MX, AR, EC, UY, CR, PA.",
      "Setup en menos de 1 hora, sin programador.",
    ],
    themWins: [
      "Telemedicina certificada por Fonasa — diferenciador fuerte para clínicas médicas chilenas.",
      "Receta electrónica con QR integrada nativamente al flujo de telemedicina.",
      "Precios públicos desde $26.000 CLP/mes (~USD 27) — el más accesible de los chilenos.",
      "Agenda + ficha clínica + telemedicina en un solo sistema, pensado para Chile.",
    ],
    table: [
      // Diferenciadores Clinera
      { feature: "IA conversacional WhatsApp 24/7", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business", clinera: "yes", them: "partial", clineraHighlight: true },
      { feature: "Memoria contextual entre conversaciones", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas Meta/Google", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Integración MCP / API para que IA opere encima", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Difusiones masivas WhatsApp marketing", clinera: "yes", them: "partial", clineraHighlight: true },
      // Diferenciadores Sacmed
      { feature: "Telemedicina certificada por Fonasa", clinera: "no", them: "yes" },
      { feature: "Receta electrónica con QR", clinera: "partial", them: "yes" },
      // Capabilities comunes
      { feature: "Agenda multi-profesional", clinera: "yes", them: "yes" },
      { feature: "Reserva online 24/7", clinera: "yes", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Pagos online integrados", clinera: "yes", them: "yes" },
      { feature: "Facturación electrónica", clinera: "partial", them: "yes" },
      { feature: "Recordatorios automáticos", clinera: "yes", them: "yes" },
      { feature: "Cobertura LATAM (no solo Chile)", clinera: "yes", them: "no" },
      { feature: "Precios públicos en web", clinera: "yes", them: "yes" },
      { feature: "Plan inicial mensual", clinera: "$129 (3 usuarios)", them: "$26.000 CLP (~$27)" },
    ],
    dimensions: [
      {
        title: "Foco en lo que cada uno hace mejor",
        body:
          "Sacmed pone su énfasis en telemedicina nativa certificada por Fonasa con recetas electrónicas QR — diferenciador fuerte para clínicas médicas chilenas que hacen mucha consulta remota. Clinera pone el énfasis en AURA atendiendo WhatsApp 24/7 con IA conversacional — diferenciador para clínicas que se les acumulan los mensajes sin responder. La pregunta es cuál es tu cuello de botella real.",
      },
      {
        title: "Telemedicina y compliance Fonasa",
        body:
          "Sacmed tiene certificación Fonasa para telemedicina y receta electrónica con QR — eso significa que puedes facturar consultas remotas a Fonasa con cumplimiento normativo. Clinera no tiene esa certificación nativa; si tu modelo depende de telemedicina facturada a Fonasa, Sacmed encaja mejor.",
      },
      {
        title: "WhatsApp e IA conversacional — donde gana Clinera",
        body:
          "Sacmed integra WhatsApp como canal complementario (notificaciones, recordatorios, soporte). No tiene un agente IA que mantenga conversaciones reales con pacientes y agende solo. Clinera (AURA) opera 24/7 desde tu WhatsApp Business con memoria contextual y derivación automática a humano. Si tu volumen alto es chats sin responder, Clinera resuelve eso.",
      },
      {
        title: "Atribución de marketing",
        body:
          "Sacmed no tiene panel de marketing ni atribución de ventas a campañas Meta/Google. Clinera trazabiliza cada conversación desde la campaña que la originó hasta la cita y la venta. Si invertís en publicidad digital, Clinera te dice qué anuncios traen pacientes reales — no solo clicks.",
      },
      {
        title: "Precio y transparencia",
        body:
          "Sacmed publica desde $26.000 CLP/mes (~USD 27) en plan Starter. Clinera publica Conect USD 129/mes con 3 usuarios incluidos, Advanced USD 179/mes, MAX USD 279/mes. En precio bajo nominal, Sacmed gana; en valor por dólar para clínicas que invierten en marketing digital, Clinera tiene atribución que justifica el delta.",
      },
    ],
    faqs: [
      {
        q: "¿Puedo usar Clinera sin migrar de Sacmed?",
        a: "Sí. Clinera se integra vía API y MCP con Sacmed. AURA opera el canal WhatsApp por encima y sincroniza la agenda con tu Sacmed. Mantienes la telemedicina y la receta electrónica QR en Sacmed, y agregas la capa de IA conversacional WhatsApp + atribución de marketing.",
      },
      {
        q: "¿Sacmed tiene IA conversacional como AURA?",
        a: "No. Sacmed integra WhatsApp como canal complementario (notificaciones, soporte) pero no tiene un agente IA que conteste, agende y derive en conversaciones reales con pacientes. AURA es la diferencia categórica.",
      },
      {
        q: "¿Cuál es más caro?",
        a: "En precio nominal, Sacmed es más barato (~USD 27/mes vs USD 129 de Clinera Conect). Clinera incluye 3 usuarios, IA conversacional, atribución de marketing y difusiones WhatsApp. Para clínicas que invierten en marketing digital, el delta se paga solo con la atribución.",
      },
      {
        q: "¿Sacmed cubre clínicas fuera de Chile?",
        a: "Sacmed es chileno y su foco principal es Chile, con compliance Fonasa específico. Si tu clínica opera en otros países LATAM (PE, CO, MX, AR, etc.), Clinera tiene cobertura nativa multi-país.",
      },
      {
        q: "¿Vale la pena combinar Sacmed + Clinera?",
        a: "Es la decisión común para clínicas médicas chilenas que quieren mantener telemedicina Fonasa pero suman IA WhatsApp. Sacmed sigue siendo el sistema clínico/telemedicina; Clinera opera el canal WhatsApp y el marketing por encima vía API.",
      },
    ],
  },
  medifolios: {
    name: "Medifolios",
    siteLabel: "medifolios.net",
    title: "Clinera vs Medifolios: ¿cuál es mejor para tu clínica o IPS en Colombia 2026?",
    intro:
      "Medifolios es el software clínico colombiano líder (13 años, +900 IPS, +13.000 médicos). Clinera es un software con IA conversacional que atiende WhatsApp 24/7. Aquí la comparativa honesta para clínicas e IPS en Colombia, con tabla, precios en COP y casos de uso reales.",
    tldr: {
      clinera:
        "Clinera es mejor si el cuello de botella es contestar WhatsApp 24/7, atribuir ventas a campañas digitales (Meta/Google) y operar marketing por encima del sistema clínico.",
      them:
        "Medifolios es mejor si tu IPS necesita RIPS automáticos, facturación electrónica DIAN y un módulo clínico maduro para múltiples especialidades. Pueden combinarse vía API.",
    },
    clineraWins: [
      "AURA: agente IA conversacional autónomo que cierra agendamientos por WhatsApp 24/7 (Medifolios tiene chatbot de tareas específicas, no agente).",
      "Coexistencia con WhatsApp Business — opera en el mismo número que ya usa la clínica.",
      "Atribución end-to-end campaña Meta/Google → conversación → cita → venta.",
      "Setup en menos de 1 hora, sin programador.",
      "Precios públicos en USD, sin permanencia, costo de implementación $0.",
      "Memoria contextual LangChain entre conversaciones.",
      "Integración MCP + API: puede operar sobre Medifolios sin obligar a migrar.",
    ],
    themWins: [
      "Líder colombiano con 13 años: conoce profundamente el mercado regulado local.",
      "RIPS automáticos + facturación electrónica DIAN nativos (compliance MinSalud).",
      "Cubre desde consultorio individual hasta IPS de alta complejidad (50-500+ usuarios).",
      "Validación pre-facturación con IA y dictado de voz para HC.",
      "Precios públicos en COP: Consultorio desde $1.670.000/año (~USD 35/mes año 1).",
    ],
    table: [
      { feature: "IA conversacional WhatsApp autónoma (cierra agendamientos)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas Meta/Google", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Memoria contextual entre conversaciones (LangChain)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Setup en menos de 1 hora", clinera: "yes", them: "no" },
      { feature: "RIPS automáticos", clinera: "no", them: "yes" },
      { feature: "Facturación electrónica DIAN", clinera: "no", them: "yes" },
      { feature: "Módulo IPS alta complejidad", clinera: "partial", them: "yes" },
      { feature: "Validación pre-facturación con IA", clinera: "no", them: "yes" },
      { feature: "Recordatorios automáticos WhatsApp", clinera: "yes", them: "yes" },
      { feature: "Chatbot WhatsApp 24/7", clinera: "yes", them: "yes", themNote: "tareas específicas, no agente autónomo" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Multi-sede", clinera: "yes", them: "yes" },
      { feature: "Precios públicos", clinera: "yes", them: "yes" },
      { feature: "Plan desde", clinera: "USD 129/mes", them: "COP $1.670.000/año (~USD 35/mes)" },
      { feature: "Permanencia", clinera: "no", them: "anual (precio año 1 vs año 2+)" },
    ],
    dimensions: [
      {
        title: "Foco del producto: IA conversacional vs ERP médico colombiano",
        body:
          "Esta es la diferencia clave. Medifolios resuelve la operación clínica regulada de Colombia: RIPS, DIAN, MinSalud, IPS multi-complejidad, contabilidad médica. Es un ERP médico maduro. Clinera resuelve el otro extremo: contestar WhatsApp 24/7 con IA conversacional autónoma y atribuir ventas a campañas digitales. Si tu clínica/IPS pierde pacientes porque nadie contesta el WhatsApp fuera de horario, Medifolios no resuelve eso (su chatbot es para tareas específicas, no agente IA). Si tu clínica/IPS necesita RIPS automáticos para sobrevivir auditorías MinSalud, Clinera no lo cubre. La combinación más común en clínicas colombianas con marketing activo: Medifolios para la capa clínica regulada + Clinera vía API/MCP para WhatsApp y atribución.",
      },
      {
        title: "Precio y modelo comercial",
        body:
          "Medifolios publica precios en COP con modelo anual decreciente: año 1 más caro (incluye onboarding), año 2+ baja considerablemente. Consultorio: $1.670.000 año 1 / $840.000 año 2+ (~USD 35/USD 17/mes). Clinera publica precios en USD con modelo mensual sin permanencia: Conect USD 129/mes (3 usuarios), Advanced USD 179/mes (5 usuarios), MAX USD 279/mes (15 usuarios). Costo de implementación $0 en todos los planes. Para clínicas que recién arrancan en digital, Medifolios año 1 es más caro upfront pero año 2+ se vuelve más barato. Clinera es predecible mes a mes sin compromiso.",
      },
      {
        title: "Combinar ambos: Medifolios + Clinera",
        body:
          "La integración vía API/MCP permite que Medifolios siga siendo el sistema clínico/RIPS/DIAN y Clinera opere encima la capa WhatsApp + marketing + atribución. AURA consulta la agenda de Medifolios, agenda en su nombre, registra la cita y dispara los recordatorios. El equipo de la IPS sigue trabajando en la interfaz Medifolios para todo lo clínico-administrativo. Para clínicas en Bogotá/Medellín que ya tienen Medifolios y quieren sumar IA conversacional sin migrar, esta es la decisión correcta.",      },
    ],
    faqs: [
      {
        q: "¿Medifolios y Clinera son competidores directos?",
        a: "Parcialmente. Compiten en el mismo dueño/decisor (gerente de clínica o IPS) pero resuelven cuellos de botella distintos: Medifolios la operación clínica regulada (RIPS, DIAN, MinSalud), Clinera la conversación con pacientes vía WhatsApp 24/7 y la atribución de marketing. La pregunta correcta no es 'Medifolios o Clinera' sino 'Medifolios solo, Clinera solo, o ambos integrados vía API'.",
      },
      {
        q: "¿Clinera cumple con la Ley 1581 (Habeas Data) colombiana?",
        a: "Cifrado en reposo y en tránsito, hosting AWS São Paulo, acuerdos de confidencialidad y minimización de datos según buenas prácticas internacionales. Para auditoría formal de Habeas Data te entregamos toda la documentación técnica al activar el plan. Para RIPS/DIAN el sistema autoritativo sigue siendo Medifolios (o equivalente).",
      },
      {
        q: "¿Pierdo mis datos si migro de Medifolios a Clinera?",
        a: "No es necesario migrar — la integración por API permite que ambos sistemas convivan. Si igual quisieras consolidar todo en Clinera, Medifolios exporta a CSV; el acompañamiento de migración es parte del onboarding sin costo adicional. Pero la decisión común no es migrar, es sumar Clinera por encima vía API.",
      },
      {
        q: "¿En qué ciudades de Colombia opera Clinera hoy?",
        a: "Clinera opera nacional en Colombia (Bogotá, Medellín, Cali, Barranquilla, Cartagena y resto). El producto es 100% en español con soporte en horario LATAM. No requiere número telefónico colombiano: opera con tu WhatsApp Business actual desde el primer día.",
      },
    ],
  },
  saludtools: {
    name: "Saludtools",
    siteLabel: "saludtools.com",
    title: "Clinera vs Saludtools: ¿cuál es mejor para tu consultorio o clínica en Colombia 2026?",
    intro:
      "Saludtools es software médico colombiano nativo (+7.000 médicos) con foco en consultorios independientes y clínicas pequeñas/medianas, RIPS y DIAN nativos, IA en plan Premium. Clinera es software con IA conversacional autónoma para WhatsApp 24/7. Aquí la comparativa honesta.",
    tldr: {
      clinera:
        "Clinera es mejor si tu cuello de botella es contestar WhatsApp 24/7 con IA real (no solo recordatorios) y necesitas atribución de ventas a campañas Meta/Google.",
      them:
        "Saludtools es mejor si necesitas HC + RIPS + facturación DIAN como prioridad #1 y la IA aplicada al dictado clínico te suma valor (plan Premium). Pueden combinarse vía API.",
    },
    clineraWins: [
      "AURA: agente IA conversacional autónomo (no solo asistente de triaje como el de Saludtools).",
      "IA conversacional disponible en todos los planes desde USD 129/mes (vs Premium-only en Saludtools).",
      "Coexistencia con WhatsApp Business — mismo número que ya usa la clínica.",
      "Atribución end-to-end campaña Meta/Google → conversación → cita → venta.",
      "Memoria contextual LangChain entre conversaciones.",
      "Precios públicos en USD, sin permanencia, costo de implementación $0.",
      "Setup en menos de 1 hora, sin programador.",
    ],
    themWins: [
      "Colombiano nativo, RIPS y DIAN nativos sin parches.",
      "+7.000 médicos colombianos activos en la plataforma.",
      "IA aplicada a HC en Premium: dictado de voz, transcripción de exámenes, resúmenes inteligentes.",
      "Asistente de triaje IA por WhatsApp para filtrar consultas iniciales.",
      "3 planes (Estándar/Plus/Premium) con flexibilidad para distintos tamaños.",
    ],
    table: [
      { feature: "IA conversacional WhatsApp autónoma (cierra agendamientos)", clinera: "yes", them: "partial", themNote: "asistente de triaje, no agente autónomo", clineraHighlight: true },
      { feature: "IA disponible en plan de entrada", clinera: "yes", them: "no", themNote: "solo Premium", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas Meta/Google", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Memoria contextual entre conversaciones", clinera: "yes", them: "no" },
      { feature: "RIPS automáticos", clinera: "no", them: "yes" },
      { feature: "Facturación electrónica DIAN", clinera: "no", them: "yes" },
      { feature: "IA dictado a HC", clinera: "no", them: "yes", themNote: "Premium" },
      { feature: "Transcripción de exámenes con IA", clinera: "no", them: "yes", themNote: "Premium" },
      { feature: "Recordatorios automáticos WhatsApp", clinera: "yes", them: "yes" },
      { feature: "Auto-agendamiento por paciente", clinera: "yes", them: "yes" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Multi-especialidad", clinera: "yes", them: "yes" },
      { feature: "Precios públicos en home", clinera: "yes", them: "no", themNote: "ver /precios" },
      { feature: "Plan desde", clinera: "USD 129/mes", them: "consulta /precios" },
      { feature: "Permanencia", clinera: "no", them: "consulta" },
    ],
    dimensions: [
      {
        title: "IA conversacional autónoma vs IA aplicada al backoffice clínico",
        body:
          "Saludtools usa IA donde realmente brilla para el médico: dictar la consulta y que se transcriba a HC, leer un examen y resumirlo, hacer triaje básico antes de derivar a un humano. Es IA de productividad clínica. Clinera usa IA donde realmente brilla para la operación: AURA es agente conversacional autónomo que entiende intención del paciente, ofrece horarios reales, agenda, confirma, deriva — sin que un humano intervenga. Es IA de cierre de agendamientos. Las dos son IAs útiles, resuelven cosas distintas. Para clínicas con marketing activo + alto volumen WhatsApp, Clinera mueve la aguja. Para consultorios médicos individuales que viven de la calidad de su HC, Saludtools Premium suma más.",
      },
      {
        title: "Precio y modelo comercial",
        body:
          "Saludtools tiene 3 planes (Estándar/Plus/Premium) sin precios visibles en home (hay que ir a /precios o contactar comercial). La IA está reservada al plan Premium, que es el más caro. Clinera tiene 3 planes con precios públicos en USD: Conect USD 129/mes, Advanced USD 179/mes, MAX USD 279/mes. La IA conversacional está en TODOS los planes, no escalonada por tier. Costo de implementación $0 en todos los planes Clinera; Saludtools no especifica setup en home.",
      },
      {
        title: "Combinar ambos: Saludtools + Clinera",
        body:
          "Si ya usas Saludtools y te cierra el módulo clínico/RIPS, sumar Clinera por encima vía API/MCP es la jugada típica. Saludtools sigue siendo tu sistema clínico (HC, RIPS, DIAN, IA dictado en Premium); Clinera opera la capa WhatsApp con AURA + atribución de marketing + difusiones. AURA consulta la agenda de Saludtools, agenda en su nombre, registra la cita en la HC. El consultorio sigue trabajando en Saludtools para todo lo clínico.",
      },
    ],
    faqs: [
      {
        q: "¿Saludtools y Clinera son competidores directos?",
        a: "Solo en la capa WhatsApp/agendamiento. Saludtools es un software médico colombiano completo (HC, RIPS, DIAN, IA clínica). Clinera es agente IA WhatsApp + atribución de marketing. Compiten en quién contesta el primer WhatsApp del paciente, pero el resto del stack lo cubre Saludtools. Lo común: combinarlos vía API.",
      },
      {
        q: "¿La IA de Saludtools en Premium reemplaza a AURA?",
        a: "No. La IA Premium de Saludtools es para el médico (dictado a HC, transcripción, resúmenes, asistente de triaje básico). AURA es para el paciente: entiende lo que pregunta, ofrece horarios reales, cierra el agendamiento sin humano. Son dos IAs distintas resolviendo lados opuestos del flujo.",
      },
      {
        q: "¿Clinera cumple con Habeas Data colombiano?",
        a: "Cifrado en reposo y en tránsito, hosting AWS São Paulo, acuerdos de confidencialidad y minimización de datos. Para auditoría formal te entregamos la documentación técnica al activar el plan. Para RIPS/DIAN el sistema autoritativo sigue siendo Saludtools (o equivalente).",
      },
      {
        q: "¿En qué planes de Clinera está la IA?",
        a: "En todos. AURA (agente IA WhatsApp 24/7) viene en Conect (USD 129/mes), Advanced (USD 179/mes) y MAX (USD 279/mes). No es feature de tier alto: es el core del producto.",
      },
    ],
  },
  doctocliq: {
    name: "Doctocliq",
    siteLabel: "doctocliq.com",
    title: "Clinera vs Doctocliq: ¿cuál es mejor para tu clínica dental, médica o estética en LATAM 2026?",
    intro:
      "Doctocliq es plataforma multi-país (foco fuerte Perú, alianza con el Colegio Odontológico del Perú) con plan gratis real y plan pago desde USD 19/mes. Clinera es software con IA conversacional autónoma para WhatsApp 24/7. Comparativa honesta para clínicas dentales, médicas y estéticas.",
    tldr: {
      clinera:
        "Clinera es mejor si tu cuello de botella es contestar WhatsApp 24/7 con IA real (no solo recordatorios) y necesitas atribuir cada cita a su campaña de marketing.",
      them:
        "Doctocliq es mejor si recién empiezas a digitalizar y quieres probar sin pagar nada, o si tu clínica es 100% dental con presupuesto bajo. Pueden combinarse vía API.",
    },
    clineraWins: [
      "AURA: agente IA conversacional autónomo que cierra agendamientos (Doctocliq tiene asistente IA + recordatorios, no agente autónomo).",
      "Coexistencia con WhatsApp Business — opera en el mismo número que ya usa la clínica.",
      "Atribución end-to-end campaña Meta/Google → conversación → cita → venta.",
      "Memoria contextual LangChain entre conversaciones.",
      "Integración MCP + API: puede operar sobre Doctocliq sin obligar a migrar.",
      "Setup en menos de 1 hora, sin programador.",
      "Foco multi-vertical (dental, médico, estético, fisio, etc) sin sesgos.",
    ],
    themWins: [
      "Plan GRATIS real (sin tarjeta) — punto de entrada cero costo.",
      "Plan pago desde USD 19/mes — el más barato del mercado LATAM.",
      "Cobertura en 20+ países con foco Perú/México/Uruguay.",
      "Certificado Meta Business Partners (WhatsApp API oficial).",
      "Alianza fuerte con el Colegio Odontológico del Perú: presencia dental fuerte.",
    ],
    table: [
      { feature: "IA conversacional WhatsApp autónoma (cierra agendamientos)", clinera: "yes", them: "partial", themNote: "asistente IA + recordatorios", clineraHighlight: true },
      { feature: "Coexistencia con WhatsApp Business (mismo número)", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Atribución de ventas a campañas Meta/Google", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Memoria contextual entre conversaciones", clinera: "yes", them: "no", clineraHighlight: true },
      { feature: "Plan gratis", clinera: "no", them: "yes" },
      { feature: "Recordatorios automáticos WhatsApp", clinera: "yes", them: "yes" },
      { feature: "Asistente IA en producto", clinera: "yes", them: "yes", themNote: "asistente, no agente" },
      { feature: "Ficha clínica digital", clinera: "yes", them: "yes" },
      { feature: "Multi-vertical (dental, médico, estética)", clinera: "yes", them: "yes" },
      { feature: "Cobertura LATAM", clinera: "yes", them: "yes", themNote: "20+ países" },
      { feature: "Setup en menos de 1 hora", clinera: "yes", them: "yes" },
      { feature: "Precios públicos", clinera: "yes", them: "yes" },
      { feature: "Plan desde", clinera: "USD 129/mes", them: "USD 0 (gratis) / USD 19/mes" },
      { feature: "Permanencia", clinera: "no", them: "no" },
    ],
    dimensions: [
      {
        title: "Plan gratis + USD 19/mes vs USD 129/mes con IA conversacional autónoma",
        body:
          "La diferencia de precio es real: Doctocliq tiene plan gratis y plan pago desde USD 19/mes; Clinera arranca en USD 129/mes. Pero lo que cambia entre los dos no es 'más features por más precio' — es **agente vs asistente**. Doctocliq tiene asistente IA que ayuda con recordatorios y tareas específicas. Clinera tiene AURA: agente IA conversacional autónomo que entiende lo que el paciente quiere, ofrece horarios reales de la agenda, cierra el agendamiento, confirma, deriva si es necesario. Para una clínica que paga publicidad en Meta/Google y pierde pacientes porque nadie contesta el WhatsApp a las 22:00, AURA cierra el ROI en menos de 1 mes. Para una clínica que recién empieza y solo necesita ordenar la agenda + recordatorios, Doctocliq gratis es el punto de entrada correcto.",
      },
      {
        title: "Foco dental fuerte vs multi-vertical sin sesgo",
        body:
          "Doctocliq nació con foco dental fuerte (alianza con el Colegio Odontológico del Perú, casos visibles de clínicas dentales) aunque ya cubre médico, estético y terapia. Clinera es multi-vertical desde el día 1 (estética, dental, médico, fisio, dermatología, ginecología, traumatología, medicina general) sin sesgo a un solo vertical. Para clínicas dentales puras buscando lo más económico, Doctocliq tiene ventaja. Para clínicas multi-vertical, estéticas o médicas con marketing activo, Clinera está mejor diseñado.",
      },
      {
        title: "Combinar ambos: Doctocliq + Clinera vía API",
        body:
          "Si ya usas Doctocliq por su precio y te cierra para la capa básica, sumar Clinera por encima vía API/MCP es la jugada para escalar. Doctocliq sigue siendo el sistema clínico (agenda, ficha, recordatorios); Clinera opera AURA en el WhatsApp + atribución de marketing + difusiones. Cuando AURA cierra una cita, la registra en Doctocliq. La clínica sigue trabajando en Doctocliq para todo lo clínico.",
      },
    ],
    faqs: [
      {
        q: "¿Doctocliq y Clinera son competidores directos?",
        a: "Parcialmente. Compiten en agenda + recordatorios + asistente IA, pero resuelven cuellos de botella distintos: Doctocliq es la entrada económica para digitalización clínica básica; Clinera es la capa premium de IA conversacional + atribución de marketing. Pueden combinarse vía API.",
      },
      {
        q: "¿Vale la pena pagar USD 129/mes en Clinera si tengo el plan gratis de Doctocliq?",
        a: "Solo si tu clínica paga publicidad y pierde pacientes por no contestar WhatsApp a tiempo. En ese caso Clinera se paga sola en menos de 1 mes (1-2 pacientes nuevos cubiertos = ROI positivo). Si la clínica recién arranca y no invierte en marketing aún, el plan gratis de Doctocliq es el punto correcto y volves a Clinera cuando empieces a pautar.",
      },
      {
        q: "¿Clinera funciona en Perú?",
        a: "Sí. Clinera opera en 9 países LATAM incluyendo Perú. Soporte en español, planes en USD, no requiere número telefónico local — opera con tu WhatsApp Business actual desde el primer día.",
      },
      {
        q: "¿Puedo migrar mis datos de Doctocliq a Clinera?",
        a: "Sí, Doctocliq exporta a CSV. La migración manual de pacientes y agenda toma 1-2 horas con acompañamiento de Clinera, sin costo adicional (incluido en el costo de implementación $0).",      },
    ],
  },
};

export function generateStaticParams() {
  return [
    ...Object.keys(competitors).map((slug) => ({ slug })),
    ...Object.keys(cruzadas).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Cruzada (A vs B)
  const cross = cruzadas[slug];
  if (cross) {
    return {
      title: cross.title,
      description: cross.description,
      alternates: { canonical: `https://www.clinera.io/comparativas/${slug}` },
      openGraph: {
        type: "website",
        locale: "es_CL",
        url: `https://www.clinera.io/comparativas/${slug}`,
        title: cross.title,
        description: cross.description,
        images: ["/images/og-banner.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: cross.title,
        description: cross.description,
        images: ["/images/og-banner.png"],
      },
    };
  }

  // Directa (Clinera vs X)
  const data = competitors[slug as Slug];
  if (!data) return {};
  return {
    title: `Clinera vs ${data.name} 2026 — Comparativa completa`,
    description: `Comparamos Clinera con ${data.name}: IA, agenda, WhatsApp, ficha clínica, precio, soporte y casos de migración. Guía honesta para decidir en 2026.`,
    alternates: { canonical: `https://www.clinera.io/comparativas/${slug}` },
    openGraph: {
      url: `https://www.clinera.io/comparativas/${slug}`,
      title: `Clinera vs ${data.name} 2026 — Comparativa completa`,
      description: `Tabla, análisis por dimensión, precios y casos reales de migración desde ${data.name} a Clinera.`,
    },
  };
}

function Mark({ value }: { value: string }) {
  if (value === "yes")
    return (
      <span
        aria-label="Sí"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#009FE3,#7C3AED,#C850C0)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        ✓
      </span>
    );
  if (value === "no")
    return (
      <span
        aria-label="No"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#F5F6F8",
          color: "#8B92A5",
          fontSize: 14,
        }}
      >
        ✕
      </span>
    );
  if (value === "partial")
    return (
      <span
        aria-label="Parcial"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(245,166,35,0.12)",
          color: "#B57B00",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        ◐
      </span>
    );
  return (
    <span style={{ fontFamily: "var(--font-tech)", fontSize: "0.85rem", color: "var(--ink-primary)", fontWeight: 500 }}>
      {value}
    </span>
  );
}

export default async function ComparativaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Cruzada (renderer separado, layout más simple)
  const cross = cruzadas[slug];
  if (cross) {
    const breadcrumbCrossLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
        { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://www.clinera.io/comparativas" },
        {
          "@type": "ListItem",
          position: 3,
          name: `${cross.competitorA.name} vs ${cross.competitorB.name}`,
          item: `https://www.clinera.io/comparativas/${slug}`,
        },
      ],
    };
    const faqCrossLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: cross.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbCrossLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqCrossLd) }}
        />
        <CrossComparativa data={cross} />
      </>
    );
  }

  // Directa (Clinera vs X) — render existente
  const data = competitors[slug as Slug];
  if (!data) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
      { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://www.clinera.io/comparativas" },
      {
        "@type": "ListItem",
        position: 3,
        name: `Clinera vs ${data.name}`,
        item: `https://www.clinera.io/comparativas/${slug}`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // Testimonio asignado por slug (citas EXACTAS de /ventas, sección 7.5 del plan SEO).
  // Sacmed queda sin testimonio inline por ahora — TODO Ricardo: asignar uno real.
  const testimoniosBySlug: Partial<
    Record<Slug, { author: string; clinic: string; quote: string }>
  > = {
    agendapro: {
      author: "Dr. Flavio Rojas",
      clinic: "Infiltracion.cl",
      quote: "Clinera me permite crecer sin pagar de más.",
    },
    reservo: {
      author: "Dra. Stefani Michailiszen",
      clinic: "Dermaclinic · Las Condes",
      quote: "Clinera es el corazón de mi clínica.",
    },
    medilink: {
      author: "Dra. Yasna Vásquez",
      clinic: "Estética Facial · Talca",
      quote: "Clinera me ayuda a organizar todo.",
    },
    manual: {
      author: "Tamara Oyarzún",
      clinic: "Estética Corporal · Vitacura",
      quote: "Clinera nos simplificó las comunicaciones.",
    },
    dentalink: {
      author: "Katherine Meza",
      clinic: "@km_estetica_avanzada",
      quote: "Clinera me libera de responder mensajes.",
    },
  };
  const t = testimoniosBySlug[slug as Slug];
  const reviewLd = t
    ? {
        "@context": "https://schema.org",
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        author: { "@type": "Person", name: t.author, affiliation: t.clinic },
        reviewBody: t.quote,
        itemReviewed: { "@id": "https://www.clinera.io/#software" },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {reviewLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
        />
      )}
      <NavV3 />
      <main>
        {/* HERO */}
        <section className="hero-v2">
          <div className="hero-v2__halo" aria-hidden />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <span className="hero-v2__eyebrow" style={{ background: "rgba(0,159,227,0.08)", borderColor: "rgba(0,159,227,0.2)", color: "var(--brand-cyan)" }}>
                COMPARATIVA · 2026
              </span>
              <h1 className="hero-v2__title" style={{ fontSize: "2.75rem" }}>
                {data.title}
              </h1>
              <p className="hero-v2__sub">{data.intro}</p>
              <div className="hero-v2__actions">
                <Link href="/hablar-con-ventas" className="hero-v2__primary">
                  Hablar con ventas
                </Link>
                <a href="#tabla" className="hero-v2__secondary">
                  Ver tabla comparativa ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TL;DR */}
        <section className="section" style={{ paddingTop: 40 }} id="tldr">
          <div className="container">
            <div
              style={{
                maxWidth: 860,
                margin: "0 auto",
                background: "#fff",
                border: "1px solid rgba(0,159,227,0.25)",
                borderRadius: 20,
                padding: "36px 40px",
                boxShadow: "0 8px 32px -12px rgba(0,159,227,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--brand-cyan)",
                  marginBottom: 16,
                }}
              >
                TL;DR
              </div>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--ink-primary)", marginBottom: 16 }}>
                <strong>Clinera es mejor si…</strong> {data.tldr.clinera}
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--ink-primary)" }}>
                <strong>
                  {data.name.charAt(0).toUpperCase() + data.name.slice(1)} es mejor si…
                </strong>{" "}
                {data.tldr.them}
              </p>
            </div>
          </div>
        </section>

        {/* Banner migración — ahorro */}
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="container">
            <Link
              href="/migracion"
              aria-label="Migra a Clinera y ahorra hasta USD 600 al mes"
              style={{
                display: "block",
                textDecoration: "none",
                maxWidth: 1040,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 18,
                  padding: "22px 28px",
                  background:
                    "linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #D946EF 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                  boxShadow: "0 12px 40px -12px rgba(124,58,237,.45)",
                }}
                className="mig-banner"
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(255,255,255,.18) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 0% 100%, rgba(255,255,255,.12) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 280 }}>
                  <span
                    aria-hidden
                    style={{
                      flex: "0 0 44px",
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(255,255,255,.16)",
                      border: "1px solid rgba(255,255,255,.24)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    💰
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.25 }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,.78)",
                      }}
                    >
                      Migra a Clinera.io
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter",
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                        color: "#fff",
                      }}
                    >
                      Ahorra hasta <span style={{ background: "rgba(255,255,255,.18)", padding: "2px 10px", borderRadius: 999 }}>USD 600 / mes</span> con todo en una sola plataforma.
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fff",
                    color: "#0A0A0A",
                    fontFamily: "Inter",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "10px 18px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  ¿Por qué migrar? <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Banner ANTES vs DESPUÉS — comparativa de costos por competidor */}
        {COMPETITOR_API_PRICING[slug as Slug] && (
          <MigrationCompareBanner
            competitor={COMPETITOR_API_PRICING[slug as Slug]!}
          />
        )}

        {/* Dónde gana cada uno — 2 cajas */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 1040, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.7rem", marginBottom: 28, color: "var(--ink-primary)", textAlign: "center" }}>
                Dónde gana cada uno
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: 24,
                }}
                className="wins-grid"
              >
                {/* Clinera wins — loaded heavier */}
                <article
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,159,227,0.3)",
                    borderRadius: 20,
                    padding: "32px 32px 36px",
                    boxShadow: "0 16px 48px -16px rgba(0,159,227,0.18)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: -12,
                      left: 32,
                      background: "linear-gradient(135deg,#009FE3,#7C3AED,#C850C0)",
                      color: "#fff",
                      fontFamily: "var(--font-tech)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(0,159,227,0.3)",
                    }}
                  >
                    Recomendado
                  </span>
                  <h3 style={{ fontSize: "1.4rem", margin: "4px 0 8px", color: "var(--ink-primary)" }}>
                    Dónde gana Clinera
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--ink-secondary)", marginBottom: 22, lineHeight: 1.5 }}>
                    {data.clineraWins.length} ventajas reales para tu clínica.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.clineraWins.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "0.98rem",
                          color: "var(--ink-primary)",
                          paddingLeft: 28,
                          position: "relative",
                          lineHeight: 1.55,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 2,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#009FE3,#C850C0)",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                {/* Them wins — honest but shorter */}
                <article
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--divider-subtle)",
                    borderRadius: 20,
                    padding: "32px 28px 36px",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", margin: "4px 0 8px", color: "var(--ink-primary)" }}>
                    Dónde gana {data.name}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--ink-tertiary)", marginBottom: 22, lineHeight: 1.5 }}>
                    Ventajas reconocidas (honesto — datos públicos a abril 2026).
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.themWins.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--ink-secondary)",
                          paddingLeft: 22,
                          position: "relative",
                          lineHeight: 1.55,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 7,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "rgba(245,166,35,0.18)",
                            border: "2px solid #F5A623",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* TABLA COMPARATIVA */}
        <section className="section" style={{ paddingTop: 40 }} id="tabla">
          <div className="container">
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 20, color: "var(--ink-primary)" }}>
                Tabla comparativa completa
              </h2>
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: 16,
                  border: "1px solid var(--divider-subtle)",
                  background: "#fff",
                  boxShadow: "0 8px 24px -12px rgba(17,19,24,0.08)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-1)" }}>
                      <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "var(--ink-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-tech)" }}>
                        Característica
                      </th>
                      <th style={{ textAlign: "center", padding: "14px 20px", fontWeight: 700, color: "var(--brand-cyan)" }}>
                        Clinera
                      </th>
                      <th style={{ textAlign: "center", padding: "14px 20px", fontWeight: 600, color: "var(--ink-secondary)" }}>
                        {data.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.map((row, idx) => (
                      <tr
                        key={row.feature}
                        style={{
                          borderTop: idx === 0 ? "none" : "1px solid var(--divider-subtle)",
                          background: row.clineraHighlight ? "rgba(0,159,227,0.035)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "14px 20px", color: "var(--ink-primary)" }}>
                          {row.feature}
                          {row.clineraHighlight && (
                            <span
                              style={{
                                fontFamily: "var(--font-tech)",
                                fontSize: "0.7rem",
                                color: "var(--brand-cyan)",
                                marginLeft: 8,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Único
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <Mark value={row.clinera} />
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <Mark value={row.them} />
                          {row.themNote && (
                            <div
                              style={{
                                fontSize: "0.72rem",
                                color: "var(--ink-tertiary)",
                                marginTop: 4,
                                fontStyle: "italic",
                              }}
                            >
                              {row.themNote}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-tertiary)", marginTop: 12, textAlign: "right" }}>
                Datos tomados de materiales públicos a abril 2026.
              </p>
            </div>
          </div>
        </section>

        {/* DIMENSIONES */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 28, color: "var(--ink-primary)" }}>
                Análisis por dimensión
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {data.dimensions.map((d) => (
                  <article key={d.title}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: 10, color: "var(--ink-primary)" }}>
                      {d.title}
                    </h3>
                    <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--ink-secondary)" }}>
                      {d.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 20, color: "var(--ink-primary)" }}>
                Preguntas frecuentes
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {data.faqs.map((f) => (
                  <details
                    key={f.q}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      padding: "18px 24px",
                    }}
                  >
                    <summary
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--ink-primary)",
                        cursor: "pointer",
                        listStyle: "none",
                      }}
                    >
                      {f.q}
                    </summary>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--ink-secondary)",
                        lineHeight: 1.6,
                        marginTop: 10,
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Internal linking — otras comparativas y recursos */}
        <section className="section" style={{ paddingTop: 60, paddingBottom: 20 }}>
          <div className="container">
            <div style={{ maxWidth: 1040, margin: "0 auto" }}>
              <h2
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-tertiary)",
                  textAlign: "center",
                  margin: "0 0 18px",
                }}
              >
                Seguir comparando
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 10,
                }}
              >
                {/* Otras 3 directas */}
                {(Object.keys(competitors) as Slug[])
                  .filter((s) => s !== slug)
                  .map((otherSlug) => (
                    <li key={otherSlug}>
                      <Link
                        href={`/comparativas/${otherSlug}`}
                        style={{
                          display: "block",
                          padding: "14px 18px",
                          background: "#fff",
                          border: "1px solid var(--divider-subtle)",
                          borderRadius: 12,
                          textDecoration: "none",
                          color: "var(--ink-primary)",
                          fontSize: "0.93rem",
                          fontWeight: 500,
                        }}
                      >
                        Clinera vs {competitors[otherSlug].name} →
                      </Link>
                    </li>
                  ))}
                {/* Cruzadas que incluyen este competidor */}
                {(slug === "agendapro" ||
                  slug === "reservo" ||
                  slug === "medilink" ||
                  slug === "dentalink" ||
                  slug === "sacmed") &&
                  getCruzadasForCompetitor(slug).map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/comparativas/${c.slug}`}
                        style={{
                          display: "block",
                          padding: "14px 18px",
                          background: "#fff",
                          border: "1px solid var(--divider-subtle)",
                          borderRadius: 12,
                          textDecoration: "none",
                          color: "var(--ink-primary)",
                          fontSize: "0.93rem",
                          fontWeight: 500,
                        }}
                      >
                        {c.competitorA.name} vs {c.competitorB.name} →
                      </Link>
                    </li>
                  ))}
                {/* Recursos relacionados */}
                <li>
                  <Link
                    href="/migracion"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,.06), rgba(124,58,237,.06), rgba(217,70,239,.06))",
                      border: "1px solid #DDD6FE",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 600,
                    }}
                  >
                    ¿Por qué migrar a Clinera? →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/efectividad"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Estudio de efectividad: 100% en ≤3 intentos →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/efectividad"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Cómo medimos la efectividad (metodología) →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planes"
                    style={{
                      display: "block",
                      padding: "14px 18px",
                      background: "#fff",
                      border: "1px solid var(--divider-subtle)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                      fontSize: "0.93rem",
                      fontWeight: 500,
                    }}
                  >
                    Ver planes desde USD 129/mes →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Final DARK */}
        <section className="section-dark">
          <div className="dark-halo-bottom-right" aria-hidden />
          <div className="container">
            <div className="cta-final-dark">
              <h2 className="cta-final-dark__title">
                Activa Clinera{" "}
                <span className="gt-neon">hoy</span>
              </h2>
              <p className="cta-final-dark__sub">
                Sin permanencia. Cancela cuando quieras. Simple.
              </p>
              <div className="cta-final-dark__actions">
                <Link href="/hablar-con-ventas" className="cta-final-dark__primary">
                  Hablar con ventas
                </Link>
                <Link href="/demo" className="cta-final-dark__secondary">
                  Ver demo del software
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
