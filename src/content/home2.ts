// ============================================================================
// /home2 — borrador del home «historia + casos» (Ricardo, 26-oct-2026)
// ----------------------------------------------------------------------------
// Ideas tomadas de sacamedi.com/casos: cifras arriba, tarjetas con UNA cifra
// grande por caso, honestidad sobre lo que todavía no hay y un solo CTA.
// Reglas de contenido:
// - Ninguna cifra inventada. Las de Hebe y Lumina son las que Ricardo dio para el
//   deck (`public/presentacion-tecnica/index.html`, 20-oct-2026).
// - «Una sucursal del grupo» y no «de Hebe»: la marca de esa sucursal no está
//   confirmada (ver AGENTS.md, sección /presentacion).
// - Sin precio en el titular: la tarea de Todoist dice «menos de US$ 500», pero
//   el Ecosistema se publica a US$ 529 (planes.ts). Pendiente de Ricardo.
// - No se indexa: es un borrador al lado del home real.
// ============================================================================

export const HOME2_HERO = {
  eyebrow: "Clinera · Hecho por dueños de clínicas",
  titulo: "El ecosistema que hace que tu clínica médica o estética",
  tituloAcento: "venda, sea rentable y cobre la evaluación por adelantado.",
  bajada:
    "Software con IA, marketing de performance y un método comercial probado primero en nuestras propias clínicas: Método Hebe y Protocolo Lumina.",
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
      titulo: "Método Hebe y Protocolo Lumina",
      texto:
        "Clínicas propias de estética corporal y facial, en Vitacura, Concón y Los Ángeles. Ahí aprendimos lo que ninguna agencia ve: qué pasa cuando el paciente llega a la consulta.",
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
  cargo: "Fundador de Clinera, Método Hebe, Protocolo Lumina y Metricads",
  foto: "/images/home2/ricardo-obra-concepcion.webp",
  fotoAlt:
    "Ricardo Oyarzún revisando con una ingeniera los planos de una nueva sucursal",
  parrafos: [
    "Titulado de la Universidad de Concepción. Construyó las cuatro empresas en más de una década, sin socios ni inversionistas externos.",
    "Clinera no es una idea de software buscando clientes: es la herramienta que usa en sus propias clínicas, todos los días, con su propia plata en los anuncios.",
  ],
  credenciales: [
    "+12 años en el canal de YouTube Metricads Marketing",
    "Meta y Google partner",
  ],
} as const;

// PMFC en el orden y con las palabras de Ricardo (26-oct-2026). Cada letra
// lleva su visual en Home2.tsx. Los montos de P son «valores de referencia»
// (los mismos del deck /presentacion-tecnica, caso Lumina Face).
export const HOME2_PMFC = {
  eyebrow: "Metodología PMFC",
  titulo: "Cuatro piezas, en este orden.",
  tituloAcento: "Cada una depende de la anterior.",
  bajada:
    "Lo que hace crecer a una clínica es el margen. Por eso no partimos por el software: partimos por lo que vendes.",
  piezas: [
    {
      letra: "P",
      titulo: "Propuesta de valor",
      texto:
        "Un protocolo propio que la competencia no tiene. Deja de competir por precio y te permite cobrar lo que vale tu trabajo.",
    },
    {
      letra: "M",
      titulo: "Marketing de captación",
      texto:
        "Campañas que consiguen evaluaciones prepagadas: la paciente paga su evaluación antes de llegar. Llega quien ya decidió, no el curioso.",
    },
    {
      letra: "F",
      titulo: "Framework de venta",
      texto:
        "Técnicas para cerrar negocios de alto valor en la consulta. Capacitamos a tus doctores y especialistas para vender sin regalar tratamientos.",
    },
    {
      letra: "C",
      titulo: "Clinera, el software",
      texto:
        "AURA, una secretaria con IA, responde por WhatsApp, Instagram y Facebook y deja la cita en tu agenda, con la ficha y el cobro en el mismo lugar.",
    },
  ],
  propuesta: {
    filas: [
      {
        nombre: "Tratamiento genérico",
        vende: "US$ 180",
        deja: "US$ 50",
        pct: 2.5,
      },
      {
        nombre: "Protocolo propio",
        vende: "US$ 2.500",
        deja: "US$ 2.000",
        pct: 100,
      },
    ],
    nota: "Valores de referencia.",
  },
  marketing: [
    "Ves el anuncio",
    "Conversa con AURA",
    "Paga su evaluación",
    "Llega a la consulta",
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
    clinica: "Método Hebe",
    detalle: "Estética corporal · Vitacura, Concón y Los Ángeles",
    queCambio:
      "La paciente paga su evaluación antes de entrar a la agenda. El anuncio trae la evaluación; la venta ocurre en la consulta.",
    foto: {
      src: "/images/casos/metodo-hebe.jpg",
      alt: "Recepción de Método Hebe en Los Ángeles",
      credito: "Foto: metodohebe.cl",
    },
    href: "/casos/metodo-hebe",
  },
  {
    id: "lumina",
    cifra: "31x",
    cifraNota:
      "el ticket promedio (US$ 2.449) es 31 veces el costo por venta (US$ 78)",
    clinica: "Protocolo Lumina",
    detalle: "Estética facial · Vitacura, Concón y Los Ángeles",
    queCambio:
      "Un protocolo propio en vez de un tratamiento genérico: la consulta deja de competir por precio.",
    foto: {
      src: "/images/casos/protocolo-lumina.jpg",
      alt: "Antes y después de un caso público en el sitio de Protocolo Lumina",
      credito: "Foto: protocololumina.cl",
    },
    href: "/casos/protocolo-lumina",
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
    clinica: "Una sucursal del grupo",
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
