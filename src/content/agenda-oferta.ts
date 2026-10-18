// ============================================================================
// /agenda: wizard de 3 pasos que termina en una videollamada (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Paso 1 datos (van al CRM) → paso 2 servicio de interés → paso 3 calendario.
// Reemplaza a la landing «Crea tu cuenta» con cupón: ya no hay cupón, ni
// Payment Links, ni compra desde la web. Copy y datos del wizard viven acá.
// ============================================================================

import type { ServicioId } from "@/content/planes";

export const SERVICIO_PARAM = "servicio";

/** Profesionales (mismos ids que /agenda ya mandaba en `boxes_profesionales`). */
export const PROFESIONALES = [
  { id: "1_3", label: "1–3" },
  { id: "4_6", label: "4–6" },
  { id: "7_10", label: "7–10" },
  { id: "10_plus", label: "Más de 10" },
] as const;

/**
 * Tipo de clínica del paso 1. `tipo_clinica` sigue siendo `estetica` o `medica`
 * para n8n; «Ambas» viaja como estética con `subtipo_clinica: "ambas"`.
 */
export const TIPOS_CLINICA = [
  { id: "estetica", label: "Estética", tipoClinica: "estetica", subtipo: null },
  { id: "medica", label: "Médica", tipoClinica: "medica", subtipo: null },
  { id: "ambas", label: "Ambas", tipoClinica: "estetica", subtipo: { id: "ambas", label: "Estética y médica" } },
] as const;
export type TipoClinicaId = (typeof TIPOS_CLINICA)[number]["id"];

/** Paso 2: el servicio que le interesa (selección única). */
export const SERVICIOS: readonly {
  id: ServicioId;
  titulo: string;
  texto: string;
  destacada: boolean;
  etiqueta: string;
}[] = [
  {
    id: "marketing",
    titulo: "Marketing de performance",
    texto: "Campañas de performance en Meta (Facebook e Instagram) y Google, creación y optimización de tu propuesta de valor, y técnicas de venta para cerrar más pacientes.",
    destacada: false,
    etiqueta: "",
  },
  {
    id: "software",
    titulo: "Software con IA",
    texto: "Clinera responde, agenda y confirma por WhatsApp, Instagram y Facebook.",
    destacada: false,
    etiqueta: "",
  },
  {
    id: "ambas",
    titulo: "Ambas",
    texto: "El ecosistema completo: traemos los pacientes y los atendemos.",
    destacada: true,
    etiqueta: "Recomendado",
  },
];

export function esServicio(v: string | null | undefined): v is ServicioId {
  return v === "marketing" || v === "software" || v === "ambas";
}

export const AGENDA_COPY = {
  eyebrow: "Software con IA y marketing para clínicas",
  h1: "Agenda una videollamada con el equipo.",
  sub: "Cuéntanos de tu clínica, elige qué servicio te interesa y reserva una videollamada de 30 minutos. Marketing que trae pacientes y software con IA que los atiende.",
} as const;

/** Lo que verás en la videollamada, al lado del wizard. */
export const AGENDA_PUNTOS = [
  "Campañas en Facebook, Instagram y Google que traen pacientes",
  "La IA responde cada lead, lo agenda y lo confirma por WhatsApp",
  "Agenda, fichas y presupuestos de tu clínica en un solo lugar",
  "Optimizamos tu propuesta de valor y cómo cierra tu equipo",
] as const;

/** «Cómo funciona el ecosistema», bajo el wizard. */
export const ECOSISTEMA_PASOS = [
  { n: "1", titulo: "Las campañas traen al paciente", texto: "Anuncios de performance en Facebook, Instagram y Google, con la propuesta de valor de tu clínica." },
  { n: "2", titulo: "El lead escribe por WhatsApp", texto: "Cada contacto llega a la bandeja de Clinera, junto con tus otros canales." },
  { n: "3", titulo: "La IA lo agenda en Clinera", texto: "AURA responde, ofrece horas y deja la cita creada en tu agenda." },
] as const;

/**
 * Una imagen por pantalla del wizard, en el panel izquierdo (Ricardo, 18-oct-2026):
 * paso 1 campañas, paso 2 software con IA, paso 3 reunión semanal de resultados.
 */
export const ECOSISTEMA_SLIDES: readonly { n: string; titulo: string; texto: string; img: string }[] = [
  {
    n: "1",
    titulo: "Nuestro equipo activa tus campañas de marketing digital para tu clínica estética.",
    texto: "",
    img: "/images/agenda/ecosistema-1-campanas.webp",
  },
  {
    n: "2",
    titulo: "Incorporamos el software de Clinera con su agente de inteligencia artificial para agendar pacientes.",
    texto: "",
    img: "/images/agenda/ecosistema-3-agenda-ia.webp",
  },
  {
    n: "3",
    titulo: "Nos reunimos semanalmente para ver los resultados.",
    texto: "",
    img: "/images/agenda/ecosistema-5-resultados.webp",
  },
] as const;
