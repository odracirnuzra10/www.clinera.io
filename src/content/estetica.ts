// ============================================================================
// Clinera para estética: el copy del nicho (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Clinera se enfoca en clínicas estéticas (enfermeras, médicos estéticos,
// clínicas y centros de estética) y, en segundo lugar, médicas. Es donde el
// producto brilla: Ricardo lo construyó para sus propias clínicas, Método Hebe
// (corporal) y Protocolo Lumina (facial).
//
// Lo consumen la sección «Hecho para estética» del home
// (`src/components/estetica/EsteticaSection.tsx`) y la landing de Google Ads
// `/clinica-estetica`. Una sola fuente para que las dos no se contradigan.
//
// Reglas del copy:
// - Los tratamientos precargados son los que nombró Ricardo. No agregues
//   marcas ni procedimientos sin que él lo confirme.
// - Sin cifras nuevas: la cifra pública de clínicas es +52 (AGENTS.md).
// - Clinera no se integra con agendas de terceros: opera sobre la suya.
// ============================================================================

/** Tratamientos de estética que vienen cargados en el catálogo de Clinera. */
export const TRATAMIENTOS_PRECARGADOS = [
  { nombre: "Sculptra", zona: "facial" },
  { nombre: "Radiesse", zona: "facial" },
  { nombre: "Rinolips", zona: "facial" },
  { nombre: "Endoláser", zona: "corporal" },
] as const;

export type BloqueEstetica = {
  id: "facial" | "corporal" | "presupuesto" | "tratamientos";
  meta: string;
  titulo: string;
  texto: string;
  puntos: string[];
};

export const ESTETICA_BLOQUES: BloqueEstetica[] = [
  {
    id: "facial",
    meta: "Ficha facial",
    titulo: "Evaluación facial con tercios y eje de simetría",
    texto:
      "La evaluación del rostro queda en la ficha del paciente, con el consentimiento de cada procedimiento y las fotos de cada sesión.",
    puntos: ["Tercios faciales y eje de simetría", "Fotos antes y después atadas al paciente", "Consentimiento informado en la ficha"],
  },
  {
    id: "corporal",
    meta: "Ficha corporal",
    titulo: "Evaluación corporal por zonas",
    texto:
      "Marca abdomen, flancos o muslos sobre el cuerpo, define el plan de sesiones y sigue la evolución. Las fotos no viven en el celular de la clínica.",
    puntos: ["Zonas marcadas de frente y espalda", "Plan de tratamiento por sesiones", "Evolución visible antes de entrar a box"],
  },
  {
    id: "presupuesto",
    meta: "Presupuestos",
    titulo: "Presupuesto facial o corporal desde la evaluación",
    texto:
      "Lo que evaluaste se convierte en presupuesto y sale por WhatsApp. El seguimiento queda en el CRM de la misma ficha, no en una planilla aparte.",
    puntos: ["Armado desde la evaluación", "Envío por WhatsApp", "Seguimiento hasta que el paciente agenda"],
  },
  {
    id: "tratamientos",
    meta: "Tratamientos precargados",
    titulo: "Tu catálogo de estética, listo desde el día uno",
    texto:
      "Los tratamientos de estética facial y corporal ya vienen cargados. Ajustas precios, duración y profesionales, y AURA los ofrece por WhatsApp.",
    puntos: TRATAMIENTOS_PRECARGADOS.map((t) => t.nombre),
  },
];

/** Por qué Clinera entiende estética: la historia del fundador, sin cifras nuevas. */
export const ESTETICA_ORIGEN = {
  meta: "Hecho por dueños de clínicas estéticas",
  titulo: "Lo construimos para nuestras propias clínicas.",
  texto:
    "Clinera nació dentro de Método Hebe (estética corporal) y Protocolo Lumina (estética facial). Cada ficha, cada presupuesto y cada respuesta de AURA se probó primero con nuestros pacientes.",
  casos: [
    { nombre: "Método Hebe", rubro: "Estética corporal", href: "/casos/metodo-hebe" },
    { nombre: "Protocolo Lumina", rubro: "Estética facial", href: "/casos/protocolo-lumina" },
  ],
} as const;

/**
 * Perfiles del wizard de `/clinica-estetica`. `tipoClinica` es el valor que
 * ya entiende n8n (`tipo_clinica`); el perfil exacto viaja aparte como
 * `subtipo_clinica` para que el closer sepa si habla con una enfermera
 * independiente o con una clínica.
 */
export const PERFILES_ESTETICA = [
  { id: "clinica_estetica", label: "Clínica estética", tipoClinica: "estetica" },
  { id: "centro_estetica", label: "Centro de estética", tipoClinica: "estetica" },
  { id: "medico_estetico", label: "Médico/a estético/a", tipoClinica: "estetica" },
  { id: "enfermera_estetica", label: "Enfermero/a estético/a", tipoClinica: "estetica" },
  { id: "clinica_medica", label: "Clínica médica", tipoClinica: "medica" },
] as const;

export type PerfilEsteticaId = (typeof PERFILES_ESTETICA)[number]["id"];

export const ESTETICA_LP_FAQ = [
  {
    q: "¿Clinera sirve para un centro de estética pequeño o para una enfermera independiente?",
    a: "Sí. La agenda, la ficha y los presupuestos funcionan igual para una profesional independiente que para una clínica con varios boxes.",
  },
  {
    q: "¿Tengo que cargar todos mis tratamientos?",
    a: "No. Los tratamientos de estética facial y corporal, como Sculptra, Radiesse, Endoláser y Rinolips, vienen cargados. Tú ajustas precios, duraciones y quién los realiza.",
  },
  {
    q: "¿Se conecta con Reservo o AgendaPro?",
    a: "No. Clinera opera sobre su propia agenda, ficha y pagos. Tus pacientes y tu historial se migran en el onboarding.",
  },
  {
    q: "¿Qué pasa en la reunión?",
    a: "Son 45 minutos por videollamada con el equipo. Te mostramos la ficha facial y corporal, los presupuestos y a AURA agendando por WhatsApp con el caso de tu clínica.",
  },
] as const;

/**
 * Fotos de la sección «Hecho para estética» con el copy de los anuncios de Ricardo
 * (18-oct-2026: «ocupa ese tipo de mensajes en el home y landing»). Generadas en
 * Higgsfield (Soul): no son clientas reales, así que no llevan nombre. El
 * contador y la etiqueta de tratamiento replican los anuncios.
 */
export const MODELOS_ESTETICA = {
  duena: {
    src: "/images/estetica/duena-clinica-mensajes.webp",
    alt: "Dueña de clínica estética sonriendo mientras revisa los mensajes de sus pacientes",
    etiqueta: "Radiesse · Sculptra · Hialurónico",
    meta: "Para dueñas de clínicas estéticas",
    titulo: "Diplomado en bioestimuladores.",
    acento: "Postgrado en contestar DMs a medianoche.",
    texto:
      "Una bandeja para WhatsApp, Instagram y Facebook, conectada a tu agenda. Tu equipo responde y agenda sin que tú estés pegada al celular.",
    cifra: 23,
    contador: "DMs sin responder",
  },
  enfermera: {
    src: "/images/estetica/enfermera-estetica-entre-pacientes.webp",
    alt: "Enfermera estética respondiendo consultas de pacientes en el celular",
    etiqueta: "Sculptra · Ácido poliláctico",
    meta: "Para enfermeras y médicos",
    titulo: "Te especializaste en Sculptra.",
    acento: "No en contestar «¿cuánto sale?» 40 veces al día.",
    texto:
      "Todas las consultas de WhatsApp, Instagram y Facebook en un solo lugar, con tu agenda al lado. Respondes rápido y la paciente queda agendada.",
    cifra: 40,
    contador: "«¿cuánto sale?»",
  },
} as const;

export type ModeloEsteticaId = keyof typeof MODELOS_ESTETICA;

/**
 * Prueba social bajo el hero de /activar-cuenta y /clinica-estetica (Ricardo,
 * 18-oct-2026: reemplaza «+52 clínicas activas · Hecho en Método Hebe y
 * Protocolo Lumina»). Cifras dictadas por él.
 */
export const PRUEBA_SOCIAL_ESTETICA = [
  "5/5 de calificación en Capterra",
  "Usado por más de 100 clínicas estéticas en Chile y México",
] as const;
