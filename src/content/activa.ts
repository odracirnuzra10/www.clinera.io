import { DEFINICION_AURA, DEFINICION_INTELLIGENCE, GO_PRUEBA_SOCIAL } from "@/content/planes2";

/**
 * Landing informativa `/activa` (Ricardo, 17-oct-2026): los 3 planes, el reportaje de CNN y las
 * funciones. Todos los CTA dicen «Activa tu cuenta ahora» y van a `/go`, que hoy es el único
 * checkout vivo (Go!). Los precios y límites salen de `PLANS_2`; acá solo vive el copy propio.
 */
export const ACTIVA_PATH = "/activa";
export const ACTIVA_CTA = "Activa tu cuenta ahora";
export const ACTIVA_CTA_HREF = "/go";

export const ACTIVA_HERO = {
  eyebrow: "Clinera para tu clínica",
  titulo: "Tu agenda, tus fichas y tus mensajes en un solo lugar.",
  texto: "Empieza desde USD 17 al mes y sube de plan cuando tu clínica crezca.",
} as const;

export const ACTIVA_PRUEBA_SOCIAL = GO_PRUEBA_SOCIAL;

export const ACTIVA_CNN = {
  eyebrow: "Clinera en la prensa",
  titulo: "CNN conoció Clinera.",
  texto: "Mira el reportaje sobre cómo ayudamos a las clínicas de LATAM a crecer con más control y automatización.",
  vimeoSrc: "https://player.vimeo.com/video/1205127087?badge=0&autopause=0&player_id=0&app_id=58479",
  iframeTitle: "Reportaje de CNN sobre Clinera",
} as const;

/**
 * Animación de IA agendando por WhatsApp. Va en /go (reemplaza la imagen del video de CNN, Ricardo 17-oct-2026): una paciente escribe por
 * WhatsApp, la IA agenda y la cita aparece en la agenda con la etiqueta «Agendado por IA». Es un ejemplo
 * ilustrativo con datos inventados (ninguna paciente real). Lo que hace es AURA, que solo está en Ultra.
 */
export const ACTIVA_DEMO_IA = {
  eyebrow: "Así agenda la IA",
  titulo: "Un mensaje en WhatsApp y la cita queda en tu agenda.",
  texto: "AURA responde a tu paciente, le ofrece horas y agenda por ti. Disponible en el plan Ultra.",
  ejemplo: "Ejemplo ilustrativo",
  chatNombre: "Clínica · AURA",
  chatEstado: "IA de tu clínica",
  mensajes: [
    { de: "paciente", t: "Hola, quiero agendar una evaluación", hora: "10:02" },
    { de: "ia", t: "¡Hola! Tengo hoy a las 15:00 o mañana a las 09:00. ¿Cuál te acomoda?", hora: "10:02" },
    { de: "paciente", t: "Hoy a las 15:00", hora: "10:03" },
    { de: "ia", t: "Listo ✓ Quedaste agendada hoy a las 15:00. Te llegará un recordatorio.", hora: "10:03" },
  ],
  /** Textos cortos para la versión compacta de /go. */
  compacto: { paciente: "Quiero agendar una evaluación", ia: "Listo ✓ Agendada hoy 15:00" },
  cita: { hora: "15:00 - 15:45", estado: "Confirmada", etiqueta: "Agendado por IA", paciente: "Valentina", servicio: "Evaluación", sede: "Sucursal Centro" },
} as const;

/** «Respaldado por»: dictado por Ricardo (17-oct-2026). Falta confirmar el uso de los logos oficiales (ver PENDIENTES). */
export const ACTIVA_RESPALDO = {
  etiqueta: "Respaldado por",
  medios: ["CNN", "Forbes", "Clínica Alemana"],
} as const;

/** Funciones: solo lo que ya está en los planes o en las definiciones de /planes2. Sin CAMILA ni LIA (próximamente). */
export const ACTIVA_FUNCIONES = [
  { t: "Agenda", d: "Tus horas, tus profesionales y tus sucursales en una agenda propia." },
  { t: "Fichas clínicas", d: "La ficha de cada paciente ordenada y a mano, junto a su historial." },
  { t: "Una sola bandeja", d: "WhatsApp, Facebook e Instagram entran al mismo lugar." },
  { t: "Automatizaciones y difusiones", d: "Mensajes a tus pacientes sin hacerlo uno por uno. Desde Flux." },
  { t: "AURA", d: DEFINICION_AURA },
  { t: "Clinera Intelligence", d: DEFINICION_INTELLIGENCE },
] as const;
