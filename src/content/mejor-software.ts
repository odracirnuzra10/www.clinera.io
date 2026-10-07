export type PaisSlug = "latam" | "chile" | "mexico" | "colombia";

export type SoftwareRanked = {
  nombre: string;
  resumen: string;
  fortalezas: string[];
  debilidades: string[];
  idealPara: string;
  esClinera?: boolean;
  url?: string;
  comparativaUrl?: string;
  precioMensual?: string;
};

export type RankingPais = {
  pais: PaisSlug;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
  intro: string;
  criterios: string[];
  software: SoftwareRanked[];
  faqs: { q: string; a: string }[];
  checklist: string[];
  cityLinks?: { label: string; href: string }[];
  relatedComparativas?: { label: string; href: string }[];
};

const UPDATED = "2026-08-25";

const clineraBase: SoftwareRanked = {
  nombre: "Clinera",
  esClinera: true,
  url: "https://www.clinera.io",
  resumen:
    "Clinera es software clínico con empleados digitales (AURA por WhatsApp, CAMILA por voz, LIA como orquestador) que ejecutan tareas reales —agendar, confirmar, cobrar— sobre agenda y ficha propias. Precios públicos desde USD 279/mes.",
  fortalezas: [
    "AURA contesta WhatsApp 24/7 con memoria contextual y cierra agendamientos.",
    "Llamadas con IA (CAMILA) y LIA (orquestador) disponibles en el plan Summit; Facebook e Instagram desde Atlas.",
    "Atribución de ventas: trazabilidad desde campaña Meta/Google hasta la cita.",
    "Precios públicos (Vortex USD 279 / Atlas USD 379 / Summit USD 479).",
    "Datos clínicos en Google Cloud región Santiago de Chile (southamerica-west1).",
  ],
  debilidades: [
    "No es marketplace de pacientes nuevos (complementa con Doctoralia u otros).",
    "Odontograma sólido pero no al nivel de un PMS 100% dental como Dentalink.",
    "No es ERP hospitalario para redes de 100+ profesionales.",
  ],
  idealPara:
    "Clínicas que pierden pacientes por WhatsApp sin responder, invierten en marketing digital o necesitan automatización real —no solo recordatorios.",
  precioMensual: "Desde USD 279/mes (Vortex) · implementación USD 450 mes 1.",
  comparativaUrl: "/empleado-digital",
};

export const RANKINGS: Record<PaisSlug, RankingPais> = {
  latam: {
    pais: "latam",
    h1: "Mejor software para clínicas en LATAM 2026: ranking honesto",
    metaTitle: "Mejor software para clínicas LATAM 2026 — comparativa real",
    metaDescription:
      "Ranking honesto del mejor software para clínicas en LATAM: Medilink, AgendaPro, Reservo, Doctoralia, Huli, Clinera y más. Fortalezas, debilidades y criterios de evaluación.",
    updatedAt: UPDATED,
    intro:
      "El mejor software para clínicas en LATAM depende del cuello de botella real: si pierdes pacientes por WhatsApp sin responder, necesitas IA que ejecute; si tu prioridad es ficha clínica madura o cumplimiento local, otro sistema puede ganar. Este ranking compara las plataformas más usadas en la región con fortalezas y debilidades reales — no un listado de features genéricas.",
    criterios: [
      "Fichas clínicas por especialidad y profundidad del módulo clínico.",
      "WhatsApp nativo y capacidad de IA que ejecuta (agenda, reagenda, cobra) — no solo responde.",
      "Cumplimiento normativo local (Chile, México, Colombia, Perú).",
      "Multi-sede y escalabilidad operativa.",
      "Modelo de precio transparente para clínicas de 1 a 30 profesionales.",
      "Onboarding documentado en español LATAM.",
    ],
    software: [
      clineraBase,
      {
        nombre: "AgendaPro",
        url: "https://www.agendapro.com",
        comparativaUrl: "/comparativas/agendapro",
        resumen:
          "AgendaPro es la plataforma de agenda más extendida en LATAM (20.000+ negocios), horizontal: clínicas, spas, gyms y centros estéticos. Referente regional con app móvil sólida.",
        fortalezas: [
          "Escala regional con presencia en Chile, Colombia, Perú y México.",
          "App móvil nativa pulida (iOS + Android).",
          "Integraciones de pago locales en cada país.",
          "Precios públicos por usuario.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Ficha clínica liviana para especialidades técnicas.",
          "El precio escala por usuario (USD 19/usuario/mes).",
        ],
        idealPara:
          "Clínicas multi-vertical (estética + spa) o negocios que priorizan app móvil sobre automatización conversacional.",
        precioMensual: "Desde USD 19/usuario/mes.",
      },
      {
        nombre: "Reservo",
        url: "https://www.reservo.cl",
        comparativaUrl: "/comparativas/reservo",
        resumen:
          "Reservo es el software clínico chileno tradicional (500+ clínicas). Fuerte en ficha clínica madura, odontograma dental y módulo financiero con DTE chileno.",
        fortalezas: [
          "Ficha clínica muy madura con plantillas por especialidad.",
          "Odontograma dental nativo + DTE chileno integrado.",
          "Marca consolidada en Chile con soporte local.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Sin precios públicos — cotización privada.",
          "Cobertura geográfica concentrada en Chile.",
        ],
        idealPara:
          "Clínicas cuya prioridad es ficha clínica + facturación chilena y que ya tienen recepción humana en horario hábil.",
        precioMensual: "Sin precios públicos (cotización).",
      },
      {
        nombre: "Medilink",
        url: "https://medilink.cl",
        comparativaUrl: "/comparativas/medilink",
        resumen:
          "Medilink es chileno con Contact Center IA por voz integrado a la agenda. Referente en Chile para clínicas que pierden llamadas telefónicas.",
        fortalezas: [
          "IA por canal de voz que atiende llamadas 24/7.",
          "Ficha clínica robusta con telemedicina integrada.",
          "Integraciones locales (BSale, Nubox, Kame).",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Sin precios públicos.",
          "Cobertura geográfica concentrada en Chile.",
        ],
        idealPara:
          "Clínicas cuyo cuello de botella son las llamadas perdidas, no los WhatsApps fuera de horario.",
        precioMensual: "Sin precios públicos.",
      },
      {
        nombre: "Doctoralia",
        url: "https://www.doctoralia.com",
        resumen:
          "Doctoralia es el marketplace de pacientes más conocido en LATAM. Genera demanda nueva conectando pacientes con profesionales — no es un PMS completo.",
        fortalezas: [
          "Marketplace con tráfico de pacientes que buscan profesional.",
          "Perfil público del médico con reseñas y reserva online.",
          "Presencia multi-país en español.",
        ],
        debilidades: [
          "No reemplaza ficha clínica ni operación interna de la clínica.",
          "Sin IA conversacional autónoma para la operación diaria.",
          "Modelo de comisión o suscripción por visibilidad.",
        ],
        idealPara:
          "Profesionales o clínicas que necesitan captar pacientes nuevos — complementa, no sustituye, un software de operación.",
        precioMensual: "Modelo marketplace (varía por plan y país).",
      },
      {
        nombre: "Huli",
        url: "https://www.huli.io",
        resumen:
          "Huli es software clínico con presencia en Colombia y México, orientado a consultorios y clínicas medianas con agenda, ficha y facturación local.",
        fortalezas: [
          "Presencia en Colombia y México con soporte en español.",
          "Agenda + ficha clínica + facturación en un solo flujo.",
          "Orientado a consultorios y clínicas medianas.",
        ],
        debilidades: [
          "Sin empleados digitales que ejecuten WhatsApp de forma autónoma.",
          "Menor profundidad en IA conversacional vs plataformas especializadas.",
        ],
        idealPara:
          "Consultorios en Colombia o México que buscan un PMS local sin priorizar automatización conversacional avanzada.",
        precioMensual: "Consultar con el proveedor.",
      },
      {
        nombre: "Medesk",
        url: "https://www.medesk.net",
        resumen:
          "Medesk es software clínico en la nube con presencia en LATAM, orientado a consultorios con agenda, ficha y recordatorios.",
        fortalezas: [
          "Operación en la nube con acceso web.",
          "Agenda y ficha clínica integradas.",
          "Recordatorios automáticos.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp 24/7.",
          "Menor foco en atribución de marketing digital.",
        ],
        idealPara:
          "Consultorios pequeños que buscan digitalizar agenda y ficha sin automatización conversacional avanzada.",
        precioMensual: "Consultar con el proveedor.",
      },
    ],
    faqs: [
      {
        q: "¿Cuál es el mejor software para clínicas en LATAM?",
        a: "No hay un único ganador. Si tu cuello de botella es WhatsApp sin responder y marketing digital, Clinera con empleados digitales (AURA, CAMILA, LIA) es la opción más sólida en IA ejecutiva. Si necesitas ficha clínica madura en Chile, Reservo o Medilink compiten fuerte. Si buscas captar pacientes nuevos, Doctoralia complementa cualquier PMS.",
      },
      {
        q: "¿Clinera reemplaza a Reservo o AgendaPro?",
        a: "Clinera opera sobre su propia agenda, ficha y pagos — no se integra permanentemente con agendas de terceros. La migración de datos se hace en el onboarding. Si ya tienes Reservo o AgendaPro y quieres mantenerlos, la decisión es migrar la operación o evaluar si el cuello de botella justifica el cambio.",
      },
      {
        q: "¿Qué software tiene IA para WhatsApp en LATAM?",
        a: "Clinera (AURA) es el referente en IA conversacional autónoma por WhatsApp con memoria contextual y cierre de agendamientos. Medilink tiene IA por voz. AgendaPro, Reservo y Huli tienen recordatorios o chatbots de tareas, no agentes que ejecuten el flujo completo.",
      },
      {
        q: "¿Cuánto cuesta el software para clínicas en LATAM?",
        a: "Los rangos van desde USD 19/usuario/mes (AgendaPro) hasta USD 479/mes (Clinera Summit con empleados digitales completos). Clinera publica precios desde USD 279/mes con implementación USD 450 en el mes 1. Reservo y Medilink no publican precios.",
      },
      {
        q: "¿Doctoralia es un software de clínica?",
        a: "No es un PMS completo. Es un marketplace que conecta pacientes con profesionales. Muchas clínicas lo usan junto a su software de operación (Clinera, Reservo, Huli) para captar demanda nueva.",
      },
      {
        q: "¿Cómo actualizan este ranking?",
        a: "Revisamos este ranking trimestralmente. La fecha visible al inicio indica la última actualización. Si un competidor cambia precios o funcionalidades, actualizamos fortalezas y debilidades en consecuencia.",
      },
    ],
    checklist: [
      "Identifica tu cuello de botella principal: WhatsApp, llamadas, ficha clínica, cumplimiento local o captación de pacientes.",
      "Pide demo de 30-45 minutos con tu flujo real — no una presentación genérica.",
      "Verifica precios públicos vs cotización privada antes de decidir.",
      "Confirma cumplimiento normativo de tu país (Ley 21.719 Chile, NOM-024 México, RIPS Colombia).",
      "Evalúa si necesitas IA que ejecuta o solo recordatorios automáticos.",
      "Pide export CSV de tu sistema actual antes de migrar.",
    ],
    cityLinks: [
      { label: "Santiago", href: "/recursos/mejor-software-clinicas-santiago-2026" },
      { label: "Concepción", href: "/recursos/mejor-software-clinicas-concepcion-2026" },
      { label: "Viña del Mar", href: "/recursos/mejor-software-clinicas-vina-del-mar-2026" },
      { label: "Lima", href: "/recursos/mejor-software-clinicas-lima-2026" },
      { label: "Bogotá", href: "/recursos/mejor-software-clinicas-bogota-2026" },
      { label: "Medellín", href: "/recursos/mejor-software-clinicas-medellin-2026" },
    ],
    relatedComparativas: [
      { label: "Clinera vs AgendaPro", href: "/comparativas/agendapro" },
      { label: "Clinera vs Reservo", href: "/comparativas/reservo" },
      { label: "Clinera vs Medilink", href: "/comparativas/medilink" },
      { label: "Clinera vs Dentalink", href: "/comparativas/dentalink" },
    ],
  },

  chile: {
    pais: "chile",
    h1: "Mejor software para clínicas en Chile 2026: ranking honesto",
    metaTitle: "Mejor software para clínicas Chile 2026 — comparativa real",
    metaDescription:
      "Ranking del mejor software para clínicas en Chile: Reservo, Medilink, AgendaPro, Dentalink, Sacmed, Encuadrado y Clinera. Ley 21.719, SII y datos en Chile.",
    updatedAt: UPDATED,
    intro:
      "El mejor software para clínicas en Chile en 2026 depende de si tu prioridad es cumplimiento local (Ley 20.584, Ley 21.719, boletas SII), profundidad clínica o automatización por WhatsApp. Este ranking compara los sistemas más usados en el mercado chileno con fortalezas y debilidades reales. Clinera destaca cuando el cuello de botella es conversación con pacientes y marketing digital — con datos clínicos residentes en Chile (GCP Santiago).",
    criterios: [
      "Cumplimiento Ley 19.628, Ley 20.584 y Ley 21.719 (protección de datos clínicos).",
      "Integración con facturación chilena (DTE, boletas SII).",
      "Ficha clínica por especialidad y profundidad del módulo.",
      "WhatsApp nativo e IA que ejecuta agendamientos — no solo recordatorios.",
      "Residencia de datos clínicos en Chile.",
      "Precio accesible para clínicas de 1 a 15 profesionales.",
    ],
    software: [
      {
        ...clineraBase,
        resumen:
          "Clinera es software clínico chileno con empleados digitales (AURA, CAMILA, LIA) que ejecutan sobre agenda y ficha propias. Diferenciador local: datos clínicos residentes en Google Cloud región Santiago de Chile (southamerica-west1), alineado a Ley 21.719.",
        fortalezas: [
          ...clineraBase.fortalezas.slice(0, 4),
          "Datos clínicos residentes en Chile (GCP southamerica-west1) — cumple Ley 21.719.",
        ],
      },
      {
        nombre: "Reservo",
        url: "https://www.reservo.cl",
        comparativaUrl: "/comparativas/reservo",
        resumen:
          "Reservo es el PMS chileno tradicional (500+ clínicas, +1M citas). Referente en ficha clínica madura, odontograma y DTE chileno.",
        fortalezas: [
          "Ficha clínica muy madura con plantillas por especialidad.",
          "Odontograma dental nativo + módulo financiero con DTE.",
          "500+ clínicas en Chile — soporte local consolidado.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Sin precios públicos.",
          "Sin app móvil nativa.",
        ],
        idealPara:
          "Clínicas cuya prioridad absoluta es ficha clínica + DTE y que tienen recepción humana en horario hábil.",
        precioMensual: "Sin precios públicos (cotización).",
      },
      {
        nombre: "Medilink",
        url: "https://medilink.cl",
        comparativaUrl: "/comparativas/medilink",
        resumen:
          "Medilink es chileno con Contact Center IA por voz. Fuerte en ficha clínica, telemedicina e integraciones locales (BSale, Nubox, Kame).",
        fortalezas: [
          "IA por voz que atiende llamadas 24/7.",
          "Ficha clínica robusta con notas clínicas asistidas por IA.",
          "Stack chileno integrado (facturación, pagos).",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Sin precios públicos.",
        ],
        idealPara:
          "Clínicas que pierden llamadas telefónicas — no WhatsApps — como canal principal.",
        precioMensual: "Sin precios públicos.",
      },
      {
        nombre: "AgendaPro",
        url: "https://www.agendapro.com",
        comparativaUrl: "/comparativas/agendapro",
        resumen:
          "AgendaPro es la plataforma de agenda más usada en LATAM (20.000+ negocios), con fuerte presencia en Chile. Horizontal: clínicas, spas, gyms.",
        fortalezas: [
          "Escala regional con app móvil nativa pulida.",
          "Precios públicos por usuario.",
          "Integraciones de pago locales.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Ficha clínica liviana para especialidades técnicas.",
        ],
        idealPara:
          "Clínicas multi-vertical o que priorizan app móvil sobre automatización conversacional.",
        precioMensual: "Desde USD 19/usuario/mes.",
      },
      {
        nombre: "Dentalink",
        url: "https://www.softwaredentalink.com",
        comparativaUrl: "/comparativas/dentalink",
        resumen:
          "Dentalink es el líder dental LATAM (15.000+ clientes). 100% vertical odontológico con odontograma, periodontograma y ortodoncia.",
        fortalezas: [
          "Odontograma + periodontograma + ortodoncia nativos.",
          "IA propia para flujos dentales.",
          "Financiamiento de pacientes y control de caja maduros.",
        ],
        debilidades: [
          "Solo dental — no cubre verticales médicas o estéticas.",
          "Sin precios públicos.",
        ],
        idealPara:
          "Clínicas dentales puras que necesitan profundidad odontológica. Combina con Clinera para WhatsApp + marketing.",
        precioMensual: "Sin precios públicos.",
      },
      {
        nombre: "Sacmed",
        url: "https://www.sacmed.cl",
        comparativaUrl: "/comparativas/sacmed",
        resumen:
          "Sacmed es chileno, especializado en telemedicina certificada por Fonasa con receta QR. Desde ~USD 27/mes.",
        fortalezas: [
          "Telemedicina certificada Fonasa con receta QR.",
          "Precio accesible (~USD 27/mes).",
          "Chileno con soporte local.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Foco en telemedicina — no en operación completa multi-vertical.",
        ],
        idealPara:
          "Clínicas Fonasa que necesitan telemedicina certificada. Combina con Clinera para WhatsApp y marketing.",
        precioMensual: "Desde ~USD 27/mes.",
      },
      {
        nombre: "Encuadrado",
        url: "https://www.encuadrado.com",
        resumen:
          "Encuadrado es plataforma chilena orientada a profesionales independientes: reserva online, pago y operación liviana.",
        fortalezas: [
          "Reserva online simple para independientes.",
          "Integración de pagos.",
          "Operación liviana sin curva de aprendizaje alta.",
        ],
        debilidades: [
          "Corto para clínicas multi-profesional con ficha clínica compleja.",
          "Sin empleados digitales ni IA conversacional avanzada.",
        ],
        idealPara:
          "Profesionales independientes o servicios que priorizan reserva + pago sobre gestión clínica completa.",
        precioMensual: "Consultar con el proveedor.",
      },
    ],
    faqs: [
      {
        q: "¿Cuál es el mejor software para clínicas en Chile?",
        a: "Depende del cuello de botella. Para WhatsApp 24/7 con IA y datos en Chile: Clinera. Para ficha clínica madura + DTE: Reservo. Para dental puro: Dentalink. Para telemedicina Fonasa: Sacmed. Para independientes: Encuadrado.",
      },
      {
        q: "¿Dónde se alojan los datos clínicos en Clinera?",
        a: "En Google Cloud Platform, región Santiago de Chile (southamerica-west1). Los datos clínicos residen en Chile, alineado a Ley 21.719.",
      },
      {
        q: "¿Reservo o Clinera para una clínica en Santiago?",
        a: "Reservo gana en ficha clínica madura y DTE chileno. Clinera gana en WhatsApp IA 24/7, atribución de marketing y precios públicos. Si pierdes pacientes por no contestar mensajes, Clinera resuelve eso; si tu dolor es la capa clínica-administrativa, Reservo compite fuerte.",
      },
      {
        q: "¿Dentalink o Clinera para clínica dental?",
        a: "Dentalink gana en odontograma + periodontograma + ortodoncia profunda. Clinera cierra el circuito agenda + ficha + odontograma FDI + WhatsApp con empleados digitales. Muchas clínicas dentales evalúan Dentalink para la capa clínica dental y Clinera para la operación conversacional.",
      },
      {
        q: "¿Cumple el software con la Ley 21.719?",
        a: "Clinera aloja datos clínicos en Chile (GCP Santiago). Reservo, Medilink y Sacmed son proveedores chilenos con trayectoria local. Verifica con cada proveedor su DPA y política de subencargados antes de contratar.",
      },
      {
        q: "¿Cuánto cuesta el software para clínicas en Chile?",
        a: "Rangos: Sacmed ~USD 27/mes, AgendaPro desde USD 19/usuario, Clinera desde USD 279/mes (precios públicos). Reservo, Medilink y Dentalink no publican precios — cotización privada.",
      },
    ],
    checklist: [
      "Confirma residencia de datos en Chile (Ley 21.719).",
      "Verifica integración DTE/boletas SII si facturas en Chile.",
      "Identifica si tu canal principal es WhatsApp, llamadas o presencial.",
      "Para dental puro, evalúa profundidad de odontograma vs operación conversacional.",
      "Pide export CSV de pacientes antes de cualquier migración.",
      "Compara precios públicos vs cotización privada.",
    ],
    cityLinks: [
      { label: "Santiago", href: "/recursos/mejor-software-clinicas-santiago-2026" },
      { label: "Concepción", href: "/recursos/mejor-software-clinicas-concepcion-2026" },
      { label: "Viña del Mar", href: "/recursos/mejor-software-clinicas-vina-del-mar-2026" },
      { label: "Temuco", href: "/recursos/mejor-software-clinicas-temuco-2026" },
      { label: "La Serena", href: "/recursos/mejor-software-clinicas-la-serena-2026" },
      { label: "Antofagasta", href: "/recursos/mejor-software-clinicas-antofagasta-2026" },
    ],
    relatedComparativas: [
      { label: "Clinera vs Reservo", href: "/comparativas/reservo" },
      { label: "Clinera vs Medilink", href: "/comparativas/medilink" },
      { label: "Clinera vs Dentalink", href: "/comparativas/dentalink" },
      { label: "Clinera vs Sacmed", href: "/comparativas/sacmed" },
    ],
  },

  mexico: {
    pais: "mexico",
    h1: "Mejor software para clínicas en México 2026: ranking honesto",
    metaTitle: "Mejor software para clínicas México 2026 — comparativa real",
    metaDescription:
      "Ranking del mejor software para clínicas en México: SaludTotal, Huli, Doctoralia, Nimbo, Clinera y más. NOM-024, CFDI y WhatsApp como canal dominante.",
    updatedAt: UPDATED,
    intro:
      "El mejor software para clínicas en México en 2026 debe cumplir NOM-004/NOM-024, emitir CFDI y operar WhatsApp como canal dominante. Este ranking compara las plataformas más usadas en el mercado mexicano con fortalezas y debilidades reales. SaludTotal destaca en cumplimiento NOM-024 certificado; Clinera destaca en empleados digitales que ejecutan por WhatsApp y voz.",
    criterios: [
      "Cumplimiento NOM-004 (historia clínica) y NOM-024 (expediente clínico electrónico).",
      "Facturación CFDI integrada.",
      "WhatsApp como canal principal de comunicación con pacientes.",
      "IA que ejecuta agendamientos — no solo recordatorios.",
      "Soporte en español mexicano y onboarding documentado.",
      "Precio accesible para consultorios y clínicas de 1 a 15 profesionales.",
    ],
    software: [
      {
        ...clineraBase,
        resumen:
          "Clinera opera en México con empleados digitales (AURA, CAMILA, LIA) sobre agenda y ficha propias. Partner local Clustourmed. CAMILA habla con acento mexicano. Precios públicos desde USD 279/mes.",
        fortalezas: [
          "AURA contesta WhatsApp 24/7 con memoria contextual.",
          "CAMILA con acento mexicano para confirmaciones telefónicas.",
          "Atribución de ventas Meta/Google end-to-end.",
          "Precios públicos (Vortex USD 279 / Atlas USD 379 / Summit USD 479).",
          "Partner local Clustourmed para implementación en México.",
        ],
      },
      {
        nombre: "SaludTotal",
        url: "https://www.saludtotal.com.mx",
        resumen:
          "SaludTotal es referente mexicano con certificación NOM-024. Fuerte en cumplimiento normativo y expediente clínico electrónico para consultorios y clínicas.",
        fortalezas: [
          "Certificación NOM-024 — referente en cumplimiento normativo mexicano.",
          "Expediente clínico electrónico maduro.",
          "Presencia consolidada en el mercado mexicano.",
        ],
        debilidades: [
          "Sin empleados digitales que ejecuten WhatsApp de forma autónoma.",
          "Menor foco en atribución de marketing digital.",
        ],
        idealPara:
          "Clínicas cuya prioridad absoluta es cumplimiento NOM-024 y expediente clínico regulado.",
        precioMensual: "Consultar con el proveedor.",
      },
      {
        nombre: "Huli",
        url: "https://www.huli.io",
        resumen:
          "Huli tiene presencia en México con agenda, ficha clínica y facturación para consultorios y clínicas medianas.",
        fortalezas: [
          "Presencia en México y Colombia.",
          "Agenda + ficha + facturación integradas.",
          "Soporte en español.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp 24/7.",
        ],
        idealPara:
          "Consultorios mexicanos que buscan PMS local sin priorizar automatización conversacional avanzada.",
        precioMensual: "Consultar con el proveedor.",
      },
      {
        nombre: "Doctoralia",
        url: "https://www.doctoralia.com.mx",
        resumen:
          "Doctoralia es el marketplace de pacientes más conocido en México. Genera demanda nueva con perfiles públicos y reserva online.",
        fortalezas: [
          "Marketplace con tráfico de pacientes.",
          "Perfil público con reseñas.",
          "Reserva online integrada.",
        ],
        debilidades: [
          "No reemplaza ficha clínica ni operación interna.",
          "Sin IA conversacional para operación diaria.",
        ],
        idealPara:
          "Profesionales que necesitan captar pacientes nuevos — complementa un PMS de operación.",
        precioMensual: "Modelo marketplace.",
      },
      {
        nombre: "AgendaPro",
        url: "https://www.agendapro.com",
        comparativaUrl: "/comparativas/agendapro",
        resumen:
          "AgendaPro tiene presencia en México como plataforma horizontal de agenda para clínicas, spas y centros estéticos.",
        fortalezas: [
          "Presencia regional con app móvil nativa.",
          "Precios públicos por usuario.",
          "Multi-vertical.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp.",
          "Ficha clínica liviana.",
        ],
        idealPara:
          "Clínicas multi-vertical que priorizan app móvil.",
        precioMensual: "Desde USD 19/usuario/mes.",
      },
      {
        nombre: "Nimbo",
        url: "https://www.nimbo.net",
        resumen:
          "Nimbo es software clínico en la nube con presencia en México, orientado a consultorios con agenda y ficha clínica.",
        fortalezas: [
          "Operación en la nube.",
          "Agenda y ficha integradas.",
        ],
        debilidades: [
          "Sin empleados digitales ni IA conversacional avanzada.",
        ],
        idealPara:
          "Consultorios pequeños que buscan digitalización básica.",
        precioMensual: "Consultar con el proveedor.",
      },
    ],
    faqs: [
      {
        q: "¿Cuál es el mejor software para clínicas en México?",
        a: "Para cumplimiento NOM-024: SaludTotal es referente certificado. Para WhatsApp 24/7 con IA: Clinera con empleados digitales. Para captar pacientes: Doctoralia complementa. Para consultorios básicos: Huli o Nimbo.",
      },
      {
        q: "¿Clinera cumple NOM-024 en México?",
        a: "Clinera opera ficha clínica digital con consentimientos y expediente. Para auditorías formales de NOM-024 verifica el alcance específico de tu especialidad con el equipo comercial — SaludTotal es el referente certificado en ese rubro.",
      },
      {
        q: "¿WhatsApp es el canal principal en México?",
        a: "Sí. La mayoría de clínicas mexicanas reciben consultas y agendamientos por WhatsApp. Un software que solo tenga recordatorios automáticos no resuelve el cuello de botella de mensajes sin responder fuera de horario.",
      },
      {
        q: "¿Qué es Clustourmed?",
        a: "Partner local de Clinera en México para implementación y soporte en el mercado mexicano.",
      },
      {
        q: "¿Doctoralia reemplaza un software de clínica?",
        a: "No. Es marketplace de pacientes. Complementa tu software de operación (Clinera, Huli, SaludTotal) para captar demanda nueva.",
      },
      {
        q: "¿Cuánto cuesta Clinera en México?",
        a: "Precios públicos en USD: Vortex USD 279/mes, Atlas USD 379/mes, Summit USD 479/mes. Implementación USD 450 mes 1. Sin precio mayor a USD 479/mes publicado.",
      },
    ],
    checklist: [
      "Verifica cumplimiento NOM-004 y NOM-024 para tu especialidad.",
      "Confirma emisión CFDI integrada si facturas en México.",
      "Evalúa WhatsApp como canal — ¿pierdes mensajes fuera de horario?",
      "Compara precios públicos vs cotización privada.",
      "Pide demo con flujo real mexicano (acento, horarios, pagos).",
      "Pide export de pacientes antes de migrar.",
    ],
    relatedComparativas: [
      { label: "Clinera vs AgendaPro", href: "/comparativas/agendapro" },
      { label: "Empleados digitales", href: "/empleado-digital" },
    ],
  },

  colombia: {
    pais: "colombia",
    h1: "Mejor software para clínicas en Colombia 2026: ranking honesto",
    metaTitle: "Mejor software para clínicas Colombia 2026 — comparativa real",
    metaDescription:
      "Ranking del mejor software para clínicas en Colombia: Medifolios, Huli, Doctocliq, Medesk y Clinera. RIPS, Ley 1581 y habeas data.",
    updatedAt: UPDATED,
    intro:
      "El mejor software para clínicas en Colombia en 2026 debe manejar RIPS, facturación DIAN y Ley 1581 (habeas data). Medifolios es el referente local en RIPS (+900 IPS); Clinera destaca en empleados digitales que ejecutan por WhatsApp y voz para clínicas con marketing activo.",
    criterios: [
      "RIPS automáticos según resolución MinSalud.",
      "Facturación electrónica DIAN integrada.",
      "Cumplimiento Ley 1581 (habeas data).",
      "WhatsApp como canal de comunicación con pacientes.",
      "IA que ejecuta agendamientos — no solo recordatorios.",
      "Precio accesible para consultorios e IPS pequeñas.",
    ],
    software: [
      clineraBase,
      {
        nombre: "Medifolios",
        url: "https://www.medifolios.com",
        comparativaUrl: "/comparativas/medifolios",
        resumen:
          "Medifolios es el software clínico colombiano líder: 13 años, +900 IPS, +13.000 médicos. RIPS, DIAN y MinSalud nativos.",
        fortalezas: [
          "+900 IPS y +13.000 médicos activos.",
          "RIPS automáticos + facturación DIAN nativa.",
          "Desde consultorio individual hasta IPS alta complejidad.",
        ],
        debilidades: [
          "Chatbot de tareas — no agente IA conversacional autónomo como AURA.",
          "Sin atribución de ventas Meta/Google end-to-end.",
        ],
        idealPara:
          "IPS y clínicas cuya prioridad es RIPS + DIAN + operación clínica regulada.",
        precioMensual: "Desde ~USD 35/mes (Consultorio, año 1).",
      },
      {
        nombre: "Huli",
        url: "https://www.huli.io",
        resumen:
          "Huli tiene fuerte presencia en Colombia con agenda, ficha clínica y facturación para consultorios y clínicas.",
        fortalezas: [
          "Presencia consolidada en Colombia.",
          "Agenda + ficha + facturación integradas.",
          "Soporte en español colombiano.",
        ],
        debilidades: [
          "Sin empleados digitales que ejecuten WhatsApp de forma autónoma.",
        ],
        idealPara:
          "Consultorios colombianos que buscan PMS local sin automatización conversacional avanzada.",
        precioMensual: "Consultar con el proveedor.",
      },
      {
        nombre: "Doctocliq",
        url: "https://www.doctocliq.com",
        comparativaUrl: "/comparativas/doctocliq",
        resumen:
          "Doctocliq es plataforma multi-país con presencia en Colombia. Plan gratuito + planes pagos desde USD 19/mes.",
        fortalezas: [
          "Plan GRATIS real + planes desde USD 19/mes.",
          "Certificado Meta Business Partners (WhatsApp API).",
          "Multi-vertical (dental, médico, estético).",
        ],
        debilidades: [
          "Asistente IA de recordatorios — no agente conversacional autónomo.",
          "Sin atribución de ventas a campañas digitales.",
        ],
        idealPara:
          "Clínicas pequeñas que empiezan a digitalizarse con presupuesto limitado.",
        precioMensual: "Plan gratis + desde USD 19/mes.",
      },
      {
        nombre: "Medesk",
        url: "https://www.medesk.net",
        resumen:
          "Medesk es software clínico en la nube con presencia en Colombia, orientado a consultorios con agenda y ficha.",
        fortalezas: [
          "Operación en la nube.",
          "Agenda y ficha integradas.",
          "Recordatorios automáticos.",
        ],
        debilidades: [
          "Sin IA conversacional autónoma para WhatsApp 24/7.",
          "RIPS no es su foco principal.",
        ],
        idealPara:
          "Consultorios pequeños sin requisitos RIPS complejos.",
        precioMensual: "Consultar con el proveedor.",
      },
    ],
    faqs: [
      {
        q: "¿Cuál es el mejor software para clínicas en Colombia?",
        a: "Para RIPS + DIAN: Medifolios es el referente local. Para WhatsApp 24/7 con IA: Clinera. Para empezar gratis: Doctocliq. Para consultorios básicos: Huli o Medesk.",
      },
      {
        q: "¿Medifolios o Clinera para una IPS en Bogotá?",
        a: "Medifolios gana en RIPS + DIAN + operación clínica regulada. Clinera gana en WhatsApp IA 24/7 y atribución de marketing. Clinera no se sincroniza con Medifolios: la decisión es cuál de los dos cuellos de botella pesa más en tu operación.",
      },
      {
        q: "¿Clinera maneja RIPS en Colombia?",
        a: "Clinera no es ERP médico colombiano — su fuerte es WhatsApp 24/7 y marketing. Para RIPS el sistema autoritativo sigue siendo Medifolios o equivalente local.",
      },
      {
        q: "¿Cumple con la Ley 1581?",
        a: "Clinera aplica cifrado, minimización de datos y DPA. Para auditoría formal de habeas data solicita documentación al activar el plan.",
      },
      {
        q: "¿Cuánto cuesta el software para clínicas en Colombia?",
        a: "Doctocliq desde USD 19/mes (plan gratis disponible). Medifolios Consultorio ~USD 35/mes año 1. Clinera desde USD 279/mes con precios públicos.",
      },
      {
        q: "¿Cómo elijo entre Huli y Medifolios?",
        a: "Medifolios si necesitas RIPS + DIAN + IPS. Huli si eres consultorio pequeño sin requisitos regulatorios complejos y buscas operación simple.",
      },
    ],
    checklist: [
      "Confirma manejo de RIPS si eres IPS o clínica con facturación a EPS.",
      "Verifica facturación DIAN integrada.",
      "Evalúa WhatsApp como canal — ¿pierdes mensajes fuera de horario?",
      "Para IPS, prioriza cumplimiento local sobre automatización conversacional.",
      "Para clínicas con marketing activo, evalúa atribución de ventas.",
      "Pide export de pacientes antes de migrar.",
    ],
    cityLinks: [
      { label: "Bogotá", href: "/recursos/mejor-software-clinicas-bogota-2026" },
      { label: "Medellín", href: "/recursos/mejor-software-clinicas-medellin-2026" },
    ],
    relatedComparativas: [
      { label: "Clinera vs Medifolios", href: "/comparativas/medifolios" },
      { label: "Clinera vs Doctocliq", href: "/comparativas/doctocliq" },
      { label: "Empleados digitales", href: "/empleado-digital" },
    ],
  },
};

export const PAISES: PaisSlug[] = ["latam", "chile", "mexico", "colombia"];

export const PAISES_CON_RUTA = PAISES.filter((p) => p !== "latam");

export function getRanking(pais: PaisSlug): RankingPais {
  return RANKINGS[pais];
}

export function getRankingBySlug(slug: string): RankingPais | undefined {
  if (slug === "latam") return undefined;
  const pais = slug as PaisSlug;
  return RANKINGS[pais];
}
