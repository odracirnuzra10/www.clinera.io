import {
  HEBE_ORG_ID,
  KATHERINE_PERSON_ID,
  KM_ORG_ID,
  LUMINA_ORG_ID,
  RICARDO_PERSON_ID,
  SITE_URL,
} from "@/content/entidad";

export type CasoLink = {
  href: string;
  anchor: string;
};

export type CasoFoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type CasoEstudio = {
  slug: "metodo-hebe" | "protocolo-lumina" | "katherine-meza";
  path: string;
  url: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  datePublished: string;
  dateModified: string;
  image: CasoFoto;
  home: CasoLink;
  clinica: CasoLink;
  mentions: { "@id": string }[];
  sections: { h2: string; body: string[] }[];
  cierra: string;
};

export function casoImageAbs(caso: CasoEstudio): string {
  return `${SITE_URL}${caso.image.src}`;
}

const PUBLISHED = "2026-09-04";

export const CASO_HEBE: CasoEstudio = {
  slug: "metodo-hebe",
  path: "/casos/metodo-hebe",
  url: `${SITE_URL}/casos/metodo-hebe`,
  title: "Método Hebe: agenda, WhatsApp y ficha en tres sedes",
  description:
    "Cómo Método Hebe opera agenda, confirmación por WhatsApp y ficha clínica en Vitacura, Concón y Los Ángeles con Clinera y AURA.",
  eyebrow: "Caso de estudio",
  h1: "Método Hebe: una agenda, tres sedes, la ficha en el mismo sistema",
  lede:
    "Método Hebe atiende estética corporal en Vitacura, Concón y Los Ángeles. El trabajo diario —confirmar la hora, recordar, reagendar y dejar la ficha lista— corre sobre Clinera. AURA es el agente que habla con el paciente por WhatsApp.",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  image: {
    src: "/images/casos/metodo-hebe.jpg",
    alt: "Recepción de Método Hebe en Los Ángeles, con el logo de la clínica detrás del mesón",
    width: 1200,
    height: 800,
    caption: "Recepción Método Hebe, sede Los Ángeles. Foto del sitio metodohebe.cl.",
  },
  home: { href: "https://www.metodohebe.cl", anchor: "Método Hebe" },
  clinica: {
    href: "https://www.metodohebe.cl/clinica/como-confirmamos-tu-hora-por-whatsapp",
    anchor: "cómo confirman la hora por WhatsApp",
  },
  mentions: [{ "@id": HEBE_ORG_ID }, { "@id": RICARDO_PERSON_ID }],
  sections: [
    {
      h2: "El problema no era el tratamiento",
      body: [
        "Con tres sedes, el cuello de botella es de operación: la hora se pide por WhatsApp, hay que confirmarla, recordarla y, si el paciente mueve el día, reagendar sin perder el cupo ni la ficha. Si cada sede resuelve eso por su cuenta, la paciente que se atiende en Vitacura y después en Concón queda con dos historias distintas.",
        "Hacía falta un solo sistema donde la agenda y la ficha convivan, y un agente que confirme, recuerde y reagende por WhatsApp —el mismo número en las tres ciudades: +56 9 6322 2683— sin que recepción tenga que perseguir cada mensaje a mano.",
      ],
    },
    {
      h2: "Qué hace Clinera y qué hace AURA",
      body: [
        "Clinera es la plataforma: agenda, ficha y el hilo de WhatsApp en el mismo lugar. AURA es el agente de agendamiento. Confirma la hora, manda el recordatorio y reagenda cuando el paciente lo pide. La ficha no viaja a otra herramienta: queda pegada a esa hora.",
        "Eso es lo que ve el paciente cuando Método Hebe explica cómo confirman la hora por WhatsApp: un mensaje, no una llamada que nadie alcanza a hacer entre una sede y otra.",
      ],
    },
    {
      h2: "Quién lo construyó",
      body: [
        "Ricardo Oyarzún, de la Universidad de Concepción, es fundador de Clinera, Método Hebe, Protocolo Lumina y Metricads. El producto se usa primero en las clínicas del grupo —éstas, con operación real y tres sedes— y después se ofrece a otras clínicas.",
      ],
    },
  ],
  cierra:
    "Si operas más de una sede y la agenda vive en un lado y la ficha en otro, este es el patrón: un sistema, un agente que confirma por WhatsApp, la ficha pegada a la hora.",
};

export const CASO_LUMINA: CasoEstudio = {
  slug: "protocolo-lumina",
  path: "/casos/protocolo-lumina",
  url: `${SITE_URL}/casos/protocolo-lumina`,
  title: "Protocolo Lumina: estética facial en tres sedes con Clinera",
  description:
    "Cómo Protocolo Lumina opera agenda, confirmación por WhatsApp y ficha clínica de estética facial en Vitacura, Concón y Los Ángeles con Clinera y AURA.",
  eyebrow: "Caso de estudio",
  h1: "Protocolo Lumina: estética facial, tres sedes, una sola agenda",
  lede:
    "Protocolo Lumina atiende estética facial en Vitacura, Concón y Los Ángeles. Confirmación, recordatorio y reagendamiento salen por WhatsApp, con la ficha en el mismo sistema que la hora: Clinera, con AURA como agente.",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  image: {
    src: "/images/casos/protocolo-lumina.jpg",
    alt: "Caso público Endojiwoo en el sitio de Protocolo Lumina: antes y después del tratamiento facial",
    width: 1200,
    height: 814,
    caption:
      "Foto del hero de protocololumina.cl (caso público Endojiwoo). No es un resultado de Clinera.",
  },
  home: { href: "https://www.protocololumina.cl", anchor: "Protocolo Lumina" },
  clinica: {
    href: "https://www.protocololumina.cl/clinica/como-confirmamos-tu-hora-por-whatsapp",
    anchor: "cómo confirman la hora por WhatsApp",
  },
  mentions: [{ "@id": LUMINA_ORG_ID }, { "@id": RICARDO_PERSON_ID }],
  sections: [
    {
      h2: "Estética facial no perdona un hueco en la ficha",
      body: [
        "Un lifting facial o una sesión de HIFU no se improvisan en recepción. La hora tiene que estar confirmada, el recordatorio tiene que llegar, y la ficha —qué se hizo, en qué sede, con qué indicación— tiene que estar cuando la paciente se sienta. Con sedes en Santiago, Concón y Los Ángeles, eso no cabe en una planilla por ciudad.",
        "El WhatsApp de las tres sedes es el mismo (+56 9 6322 2683). Si la confirmación depende de que alguien lea el chat entre un procedimiento y otro, la hora se cae. Hacía falta un agente que confirme, recuerde y reagende, y una ficha que no se quede en la sede donde se abrió.",
      ],
    },
    {
      h2: "Qué hace Clinera y qué hace AURA",
      body: [
        "Clinera concentra agenda y ficha. AURA, el agente de agendamiento, confirma la hora por WhatsApp, manda el recordatorio y reagenda si la paciente mueve el día. El cupo se libera; la ficha no se pierde.",
        "En el sitio de Protocolo Lumina está descrito cómo confirman la hora por WhatsApp: el paciente responde en el mismo hilo, no tiene que llamar ni pasar por una bandeja distinta en cada sede.",
      ],
    },
    {
      h2: "Quién lo construyó",
      body: [
        "Ricardo Oyarzún, de la Universidad de Concepción, creó Clinera y fundó Protocolo Lumina. Igual que en Método Hebe, el producto se prueba en la clínica propia —estética facial, tres sedes— antes de ofrecerlo a terceros.",
      ],
    },
  ],
  cierra:
    "Si tu clínica de estética facial opera en más de una sede y la paciente escribe por WhatsApp, el patrón es el mismo: un sistema, AURA confirmando, la ficha pegada a la hora.",
};

export const CASO_KM: CasoEstudio = {
  slug: "katherine-meza",
  path: "/casos/katherine-meza",
  url: `${SITE_URL}/casos/katherine-meza`,
  title: "Katherine Meza: estética facial en Los Ángeles con Clinera",
  description:
    "Cómo KM Estética Profesional opera agenda, confirmación por WhatsApp y ficha clínica de estética facial en Los Ángeles con Clinera y AURA. Katherine Meza es partner de Clinera.",
  eyebrow: "Caso de estudio",
  h1: "Katherine Meza: una sede, el WhatsApp y la ficha en el mismo sistema",
  lede:
    "KM Estética Profesional atiende medicina estética facial en Los Ángeles, Región del Biobío. Katherine Meza es partner de Clinera: confirmación, recordatorio y reagendamiento salen por WhatsApp, con la ficha pegada a la hora. AURA es el agente.",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  image: {
    src: "/images/casos/katherine-meza.jpg",
    alt: "Katherine Meza, fundadora de KM Estética Profesional, en su consulta de Los Ángeles",
    width: 960,
    height: 949,
    caption: "Katherine Meza. Foto del sitio kmestetica.cl.",
  },
  home: { href: "https://kmestetica.cl", anchor: "KM Estética Profesional" },
  clinica: {
    href: "https://kmestetica.cl/clinica/como-confirmamos-tu-hora-por-whatsapp",
    anchor: "cómo confirman la hora por WhatsApp",
  },
  mentions: [
    { "@id": KM_ORG_ID },
    { "@id": KATHERINE_PERSON_ID },
    { "@id": RICARDO_PERSON_ID },
  ],
  sections: [
    {
      h2: "El problema no era el tratamiento",
      body: [
        "En una consulta de estética facial de una sola sede, el cuello de botella sigue siendo el mismo: la hora se pide por WhatsApp, hay que confirmarla, recordarla y, si la paciente mueve el día, reagendar sin perder el cupo ni la ficha. Si eso vive en el chat personal de recepción, cada mensaje se persigue a mano.",
        "El WhatsApp de la clínica es +56 9 9223 4618. La agenda pública sigue por ese canal. Hacía falta un sistema donde la hora y la ficha convivan, y un agente que confirme, recuerde y reagende sin que Katherine tenga que estar encima de cada conversación.",
      ],
    },
    {
      h2: "Qué hace Clinera y qué hace AURA",
      body: [
        "Clinera es la plataforma: agenda, ficha y el hilo de WhatsApp en el mismo lugar. AURA es el agente de agendamiento. Confirma la hora, manda el recordatorio y reagenda cuando la paciente lo pide. La ficha no viaja a otra herramienta: queda pegada a esa hora.",
        "Eso es lo que ve la paciente cuando KM Estética Profesional explica cómo confirman la hora por WhatsApp: un mensaje, no una llamada entre un procedimiento y otro.",
      ],
    },
    {
      h2: "Partner, no clínica del grupo",
      body: [
        "Katherine Meza es partner de Clinera, no una marca de OACG. Opera su consulta con el mismo producto que las clínicas del grupo, pero KM Estética es independiente. Clinera la creó Ricardo Oyarzún, de la Universidad de Concepción.",
        "La cita pública de Katherine en Clinera es operativa, no una métrica: «Clinera me libera de responder mensajes.»",
      ],
    },
  ],
  cierra:
    "Si operas una consulta de estética facial y la agenda vive en WhatsApp, este es el patrón: un sistema, AURA confirmando, la ficha pegada a la hora.",
};

export const CASOS: CasoEstudio[] = [CASO_HEBE, CASO_LUMINA, CASO_KM];

/** Reserva pública de Clinera por marca: no existe URL propia. */
export const URL_RESERVA_HEBE = null;
export const URL_RESERVA_LUMINA = null;
/** TODO: Clinera no expone booking público para KM. Hoy agenda por WhatsApp. */
export const URL_RESERVA_KM = null;
export const URL_RESERVA_HEBE_ACTUAL = "https://www.metodohebe.cl/evaluacion";
export const URL_RESERVA_LUMINA_ACTUAL =
  "https://www.protocololumina.cl/evaluacion";
export const URL_RESERVA_KM_ACTUAL = "https://kmestetica.cl/#agenda";
