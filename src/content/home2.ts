// ============================================================================
// /home2 — borrador del home «historia + casos» (Ricardo, 26-oct-2026)
// ----------------------------------------------------------------------------
// Ideas tomadas de sacamedi.com/casos: cifras arriba, tarjetas con UNA cifra
// grande por caso, honestidad sobre lo que todavía no hay y un solo CTA.
// Reglas de contenido:
// - Ninguna cifra inventada. Las de la red son las que Ricardo dio para el
//   deck (`public/presentacion-tecnica/index.html`, 20-oct-2026).
// - Ricardo (26-oct-2026): la red propia se nombra sólo como «nuestra red de
//   clínicas», sin marcas. Si alguien pregunta cuáles son, lo dicen los closers.
// - Sin precio en el titular: la tarea de Todoist dice «menos de US$ 500», pero
//   el Ecosistema se publica a US$ 529 (planes.ts). Pendiente de Ricardo.
// - No se indexa: es un borrador al lado del home real.
// ============================================================================

export const HOME2_HERO = {
  eyebrow: "Clinera Ecosistema · Software + Marketing",
  titulo: "El ecosistema que hace que tu clínica médica o estética",
  tituloAcento: "venda, sea rentable y cobre la evaluación por adelantado.",
  bajada:
    "Software con IA, marketing de performance y un método comercial probado primero en nuestra red de clínicas.",
  // Ricardo, 27-oct-2026: que se vea de una que se compra un ecosistema (software + marketing).
  formula: ["Software con IA", "Marketing de performance"],
  formulaResultado: "un solo ecosistema para tu clínica",
} as const;

export const HOME2_CIFRAS = [
  { valor: "+1.500", texto: "clínicas trabajadas en los últimos 10 años" },
  { valor: "3 sedes", texto: "propias operan todos los días sobre Clinera" },
  { valor: "Prepago", texto: "la paciente paga su evaluación antes de llegar" },
] as const;

export const HOME2_HISTORIA = {
  eyebrow: "Cómo nace",
  titulo: "No lo inventamos en una oficina.",
  tituloAcento: "Lo construimos para nuestras clínicas.",
  pasos: [
    {
      marca: "2017",
      titulo: "Metricads",
      texto:
        "Una agencia de marketing digital para clínicas. Años midiendo qué anuncio trae pacientes y cuál solo trae mensajes.",
    },
    {
      marca: "Después",
      titulo: "Nuestra red de clínicas",
      texto:
        "Clínicas propias de estética corporal y facial. Ahí aprendimos lo que ninguna agencia ve: qué pasa cuando el paciente llega a la consulta.",
    },
    {
      marca: "2025",
      titulo: "Clinera",
      texto:
        "El sistema que armamos para que nuestras sedes vendan sin depender de una persona pegada al WhatsApp. Funcionó, y lo abrimos a otras clínicas.",
    },
  ],
} as const;

export const HOME2_FUNDADOR = {
  eyebrow: "Quién está detrás",
  nombre: "Ricardo Oyarzún",
  cargo: "Fundador de Clinera, Metricads y una red de clínicas estéticas",
  foto: "/images/home2/ricardo-obra-concepcion.webp",
  fotoAlt:
    "Ricardo Oyarzún revisando los planos en la apertura de la sucursal de Vitacura, 2025",
  fotoPie: "Ricardo Oyarzún en la apertura de la sucursal de Vitacura, 2025.",
  parrafos: [
    "Titulado de la Universidad de Concepción. Construyó las cuatro empresas en más de una década, sin socios ni inversionistas externos.",
    "Clinera no es una idea de software buscando clientes: es la herramienta que usa en sus propias clínicas, todos los días, con su propia plata en los anuncios.",
  ],
  credenciales: [
    "+12 años en el canal de YouTube Metricads Marketing",
    "Meta y Google partner",
  ],
  // Ricardo, 27-oct-2026: dos fotos de prensa y del canal. La miniatura de
  // YouTube se recortó sin la landing de la clínica que salía al lado (red sin marcas).
  medios: [
    {
      id: "youtube",
      src: "/images/home2/metricads-youtube.webp",
      alt: "Ricardo Oyarzún grabando un video del canal Metricads Marketing en su oficina",
      titulo: "Canal Metricads Marketing",
      texto: "Marketing para clínicas, explicado en videos cortos.",
      href: "https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ",
    },
    {
      id: "cnn",
      src: "/images/home2/clinera-cnn-chile.webp",
      alt: "Ricardo Oyarzún en el set de CNN Chile conversando sobre IA para clínicas",
      titulo: "Clinera en CNN Chile",
      texto: "IA para la gestión de clínicas, en Agenda Económica.",
      href: "/prensa",
    },
  ],
} as const;

// PMFC en el orden y con las palabras de Ricardo (26 y 27-oct-2026). Cada letra
// lleva su visual en Home2.tsx. Un solo ejemplo recorre las cuatro letras: el
// «Facial 360» (botox, vitaminas, HIFU y masaje) a US$ 1.800, vendido desde una
// evaluación prepagada de US$ 20. Valores de referencia, igual que en /presentacion.
export const HOME2_PMFC = {
  eyebrow: "Metodología PMFC",
  titulo: "Cuatro piezas, en este orden.",
  tituloAcento: "Cada una depende de la anterior.",
  bajada:
    "Lo que hace crecer a una clínica es el margen. Por eso no partimos por el software: partimos por lo que vendes. Un ejemplo de punta a punta: el Facial 360.",
  piezas: [
    {
      letra: "P",
      titulo: "Propuesta de valor",
      texto:
        "Algo que te distinga. Por ejemplo, un «Facial 360» que junta botox, vitaminas, HIFU y masaje y vale US$ 1.800, en vez de un botox suelto que vende cualquier clínica.",
    },
    {
      letra: "M",
      titulo: "Marketing de captación",
      texto:
        "Nadie compra US$ 1.800 desde un anuncio. Por eso las campañas venden evaluaciones prepagadas de US$ 20: la paciente paga antes de llegar, y el Facial 360 se vende en la consulta.",
    },
    {
      letra: "F",
      titulo: "Framework de venta",
      texto:
        "En la evaluación que la paciente ya pagó (US$ 20), tu equipo vende el Facial 360 (US$ 1.800). Capacitamos a tus especialistas en técnicas para cerrar ventas de alto valor.",
    },
    {
      letra: "C",
      titulo: "Clinera, el software",
      texto:
        "El ecosistema con IA que soporta toda la operación: AURA responde por WhatsApp, Instagram y Facebook y deja la cita en tu agenda, con la ficha y el cobro en el mismo lugar.",
    },
  ],
  propuesta: {
    filas: [
      {
        nombre: "Botox suelto",
        detalle: "Lo vende cualquier clínica",
        vende: "US$ 180",
        pct: 10,
      },
      {
        nombre: "Facial 360",
        detalle: "Botox · vitaminas · HIFU · masaje",
        vende: "US$ 1.800",
        pct: 100,
      },
    ],
    nota: "Valores de referencia.",
  },
  marketing: [
    "Ve el anuncio",
    "Paga su evaluación · US$ 20",
    "Llega a la consulta",
    "Compra el Facial 360 · US$ 1.800",
  ],
  framework: {
    foto: "/presentacion/assets/framework-consulta.webp",
    pasos: [
      "Diagnóstico antes del precio",
      "Casos reales de antes y después",
      "Un rango, no un número suelto",
      "El cierre en la misma consulta",
    ],
  },
} as const;

export type Home2Caso = {
  id: string;
  cifra: string;
  cifraNota: string;
  clinica: string;
  detalle: string;
  queCambio: string;
  cita?: { texto: string; autor: string };
  foto?: { src: string; alt: string; credito: string };
  href?: string;
};

export const HOME2_CASOS: Home2Caso[] = [
  {
    id: "hebe",
    cifra: "23x",
    cifraNota:
      "el ticket promedio (US$ 2.250) es 23 veces el costo por venta (US$ 98)",
    clinica: "Clínica corporal de nuestra red",
    detalle: "Estética corporal · Chile",
    queCambio:
      "La paciente paga su evaluación antes de entrar a la agenda. El anuncio trae la evaluación; la venta ocurre en la consulta.",
  },
  {
    id: "lumina",
    cifra: "31x",
    cifraNota:
      "el ticket promedio (US$ 2.449) es 31 veces el costo por venta (US$ 78)",
    clinica: "Clínica facial de nuestra red",
    detalle: "Estética facial · Chile",
    queCambio:
      "Un protocolo propio en vez de un tratamiento genérico: la consulta deja de competir por precio.",
  },
  {
    id: "km",
    cifra: "Partner",
    cifraNota:
      "no es clínica del grupo: opera su consulta con el mismo producto",
    clinica: "KM Estética Profesional",
    detalle: "Estética facial · Los Ángeles",
    queCambio:
      "Confirmación, recordatorio y reagendamiento por WhatsApp, con la ficha pegada a la hora.",
    cita: {
      texto: "Clinera me libera de responder mensajes.",
      autor: "Katherine Meza, fundadora",
    },
    foto: {
      src: "/images/casos/katherine-meza.jpg",
      alt: "Katherine Meza en su consulta de Los Ángeles",
      credito: "Foto: kmestetica.cl",
    },
    href: "/casos/katherine-meza",
  },
  {
    id: "sucursal",
    cifra: "US$ 220.000",
    cifraNota: "vendidos con US$ 35.000 en anuncios: 6,3 veces la inversión",
    clinica: "Una sucursal de nuestra red",
    detalle: "Estética · Chile",
    queCambio:
      "Toda la película: anuncio, evaluación pagada, venta en la consulta y la agenda llevada por AURA.",
  },
];

// Convenio Alta Qualità (Ricardo, 26-oct-2026): contratar cualquier plan de
// Clinera da descuentos especiales en máquinas de estética. Sin porcentaje
// publicado hasta que Ricardo lo fije (la tarea de Todoist decía 20%).
export const HOME2_ALTA_QUALITA = {
  eyebrow: "Convenio",
  titulo: "Contrata cualquier plan y accede a",
  tituloAcento: "descuentos especiales en máquinas de estética.",
  texto:
    "Clinera tiene convenio con Alta Qualità, importadora chilena de equipos de estética profesional: HIFU, ultrasonido focalizado, endoláser, carboxiterapia y criolipólisis, con garantía y repuestos en Chile.",
  href: "https://alta-qualita.cl",
  link: "Ver equipos en alta-qualita.cl",
} as const;

export const HOME2_CASOS_TEXTO = {
  eyebrow: "Casos",
  titulo: "Los números salen de",
  tituloAcento: "nuestras propias campañas.",
  bajada:
    "Cifras reales de nuestras clínicas, en dólares. No son proyecciones. Más abajo, lo que dicen otras clínicas.",
} as const;

export const HOME2_CIERRE = {
  titulo: "¿Tu clínica podría ser la próxima?",
  texto:
    "En una reunión revisamos tus números y te decimos con honestidad si el ecosistema le sirve a tu clínica.",
} as const;
