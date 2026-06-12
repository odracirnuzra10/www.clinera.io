import { allClinics, type Clinic } from "@/content/clinics";
import type { Recurso, RecursoTopic } from "@/content/recursos";

// Estructura del contenido renderizado por el template.
// Cada topic usa la misma forma para que el page.tsx no necesite ramificar.
export type RecursoContent = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: RecursoSection[];
  faqs: { q: string; a: string }[];
  cta: {
    title: string;
    body: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
};

export type RecursoSection =
  | { type: "h2"; title: string }
  | { type: "p"; body: string }
  | { type: "list-criterios"; items: string[] }
  | { type: "software"; ranking: number; software: SoftwareCard }
  | { type: "clinicas-locales"; clinicas: Clinic[]; ciudad: string }
  | { type: "migracion"; pasos: { title: string; body: string }[] };

export type SoftwareCard = {
  nombre: string;
  url?: string;
  comparativaUrl?: string;
  resumen: string;
  fortalezas: string[];
  debilidades: string[];
  precioMensual: string;
  idealPara: string;
  ctaPrimaryHref: string;
  ctaPrimaryLabel: string;
};

// Slugs de comparativas a linkear según topic Y país.
// Para PE/CO el competidor #1 es distinto al chileno (research abril 2026).
const COMPARATIVAS_RELEVANTES: Record<
  RecursoTopic,
  Record<"CL" | "PE" | "CO", string>
> = {
  "mejor-software-clinicas": {
    CL: "agendapro",
    PE: "doctocliq",
    CO: "medifolios",
  },
  "agenda-online-clinicas": {
    CL: "reservo",
    PE: "doctocliq",
    CO: "medifolios",
  },
  "whatsapp-clinicas": {
    CL: "medilink",
    PE: "doctocliq",
    CO: "saludtools",
  },
  "sistema-fichas-clinicas": {
    CL: "dentalink",
    PE: "doctocliq",
    CO: "medifolios",
  },
};

export function generateRecursoContent(r: Recurso): RecursoContent {
  switch (r.topic) {
    case "mejor-software-clinicas":
      return mejorSoftwareTemplate(r);
    // Stubs por implementar en olas 2-5
    case "agenda-online-clinicas":
    case "whatsapp-clinicas":
    case "sistema-fichas-clinicas":
      throw new Error(
        `Template ${r.topic} no implementado todavía. Solo ola 1 (mejor-software-clinicas) está activa.`,
      );
  }
}

// ============================================================
// Template: mejor-software-clinicas
// ============================================================
function mejorSoftwareTemplate(r: Recurso): RecursoContent {
  const { ciudad, ciudadSlug, year, countryCode } = r;
  const clinicasLocales = allClinics.filter(
    (c) =>
      c.consentGranted &&
      c.ciudad.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") ===
        ciudad.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
  );

  const compliancePorPais: Record<"CL" | "PE" | "CO", string> = {
    CL: "Cumplen con confidencialidad de datos médicos (Ley 19.628 en Chile).",
    PE: "Cumplen con la Ley de Protección de Datos Personales (Ley 29733 Perú).",
    CO: "Cumplen con la Ley 1581 (Habeas Data) y manejo de RIPS según resolución MinSalud Colombia.",
  };

  const sections: RecursoSection[] = [
    { type: "h2", title: `Cómo elegimos los softwares de esta lista para ${ciudad}` },
    {
      type: "p",
      body: `Comparamos las plataformas que más se usan en clínicas médicas y estéticas de ${ciudad} a abril de ${year}, con foco en lo que cambia el día a día — no en listas de features genéricas. Estos son los criterios que aplicamos:`,
    },
    {
      type: "list-criterios",
      items: [
        `Activos en ${ciudad} con clientes verificables o cobertura LATAM con soporte en español.`,
        "Atención al castellano + onboarding documentado.",
        "Precio accesible para clínicas de 1 a 15 profesionales.",
        compliancePorPais[countryCode],
        "Permiten al paciente reservar sin recepción humana de por medio.",
      ],
    },

    { type: "h2", title: `Top 5 software para clínicas en ${ciudad} ${year}` },

    // 1. Clinera
    {
      type: "software",
      ranking: 1,
      software: {
        nombre: "Clinera — IA que agenda por WhatsApp 24/7",
        url: "https://www.clinera.io",
        comparativaUrl: "/efectividad",
        resumen: `Clinera es el software clínico chileno con AURA, agente de IA conversacional que atiende WhatsApp 24/7. Para clínicas de ${ciudad} que pierden pacientes por no contestar mensajes a tiempo, Clinera resuelve el cuello de botella sin sumar recepción humana.`,
        fortalezas: [
          "AURA contesta por WhatsApp Business 24/7 con memoria contextual (LangChain).",
          "Coexistencia nativa: opera en el mismo número de WhatsApp que ya usa la clínica.",
          "Atribución real de ventas: trazabiliza cada conversación desde la campaña Meta o Google hasta la cita.",
          "Integración MCP + API: opera encima de Reservo, AgendaPro, Dentalink u otros sin obligar a migrar.",
          "Setup en menos de 1 hora, sin programador.",
        ],
        debilidades: [
          "No es marketplace de pacientes (no genera demanda nueva por sí solo).",
          "Odontograma dental básico — para clínicas 100% odontológicas conviene combinar con Dentalink.",
        ],
        precioMensual: "USD 129/mes (Conect, 3 usuarios incluidos) — sin permanencia.",
        idealPara: `Clínicas en ${ciudad} que reciben WhatsApps fuera de horario o pierden pacientes por no contestar a tiempo. Clínicas con inversión en publicidad digital que necesitan saber qué anuncio trae pacientes reales.`,
        ctaPrimaryHref: "/planes",
        ctaPrimaryLabel: "Ver planes desde USD 129/mes",
      },
    },
    ...getCompetitorCards(countryCode, ciudad),
  ];

  // Sección "Clínicas locales" solo si hay seed
  if (clinicasLocales.length > 0) {
    sections.push(
      {
        type: "h2",
        title: `Clínicas de ${ciudad} que ya están automatizadas con Clinera`,
      },
      { type: "clinicas-locales", clinicas: clinicasLocales, ciudad },
    );
  } else {
    sections.push(
      {
        type: "h2",
        title: `¿Tu clínica en ${ciudad} todavía no está aquí?`,
      },
      {
        type: "p",
        body: `Aún no tenemos clínicas activas con Clinera publicadas en ${ciudad}. Sé la primera de tu ciudad y te dejamos un onboarding dedicado + acompañamiento técnico durante el primer mes. Hablamos por WhatsApp y te mostramos AURA con tu agenda real en menos de 30 minutos.`,
      },
    );
  }

  // Migración
  sections.push(
    {
      type: "h2",
      title: "Cómo migrar al software correcto sin paralizar tu agenda",
    },
    {
      type: "migracion",
      pasos: [
        {
          title: "1. Exporta tu agenda actual",
          body:
            "Casi todos los sistemas (Reservo, AgendaPro, Dentalink, Excel, hojas de cálculo) permiten exportar pacientes, citas históricas y notas a CSV. Pide ese export antes de cualquier demo — es el activo más importante que tienes.",
        },
        {
          title: "2. Pide demo en el sistema candidato",
          body:
            "Una buena demo dura 30-45 minutos y te muestra el flujo real de tu día — no una presentación genérica. Pide ver: agenda, ficha clínica, cómo se contesta un WhatsApp y cómo se ve el reporte de pacientes que llegaron vs. cancelaron.",
        },
        {
          title: "3. Setup técnico (menos de 1 hora si el proveedor sabe lo que hace)",
          body:
            "Conexión de WhatsApp Business, importación del CSV, configuración de servicios y horarios, y prueba con un paciente real. Si te dicen que el setup toma semanas o que necesitan un programador de tu lado, es bandera roja.",
        },
        {
          title: "4. Capacitación al equipo (90 minutos)",
          body:
            "Una sesión por Zoom con la recepción y los profesionales. Si el sistema es claro, esa única sesión basta. Si necesitan 5 capacitaciones, el sistema es complejo de operar y vas a perder tiempo todos los meses.",
        },
      ],
    },
  );

  // FAQ — la lista de competidores varía por país; el resto se mantiene
  const comparativaSlug = COMPARATIVAS_RELEVANTES[r.topic][countryCode];
  const competitorsLabelByCountry: Record<"CL" | "PE" | "CO", string> = {
    CL: "AgendaPro, Reservo, Medilink, Dentalink",
    PE: "Doctocliq, iMedical, AgendaPro, Medinet",
    CO: "Medifolios, Saludtools, AgendaPro, Reservo",
  };
  const faqs = getFaqs(countryCode, ciudad);

  // Meta SEO — competidores listados varían por país
  const competitorsLabel = competitorsLabelByCountry[countryCode];
  const metaTitle = `Mejor software para clínicas en ${ciudad} ${year}: comparativa real`;
  const metaDescription = `Comparamos los 5 mejores softwares para clínicas en ${ciudad}: ${competitorsLabel} y Clinera (con AURA, IA WhatsApp 24/7). Honest review con precios, fortalezas y debilidades.`;

  const introByCountry: Record<"CL" | "PE" | "CO", string> = {
    CL: `Si tienes una clínica en ${ciudad}, sabes que el cuello de botella ya no es la atención clínica — es la operación: WhatsApps sin responder, no-shows del 30%, fichas dispersas en hojas de cálculo y agendas que se llenan a medio gas. Este artículo compara los softwares clínicos más usados en ${ciudad} a ${year}, con foco honesto en lo que cambia tu día a día — no en listas infinitas de features genéricas. Cada uno gana en algo distinto y la elección correcta depende del cuello de botella real de tu clínica en ${ciudad}.`,
    PE: `Si tienes una clínica médica, dental o estética en ${ciudad}, ya viste que el mercado de software clínico peruano se mueve fuerte: Doctocliq con plan gratis y USD 19/mes, iMedical con IA y +80 instituciones LATAM, Medinet enterprise multi-país, AgendaPro regional. Este artículo compara los 5 softwares más usados por clínicas peruanas a ${year}, con foco honesto en lo que cambia tu día a día — no en listas infinitas de features. Cada uno gana en algo distinto y la elección correcta depende del cuello de botella real de tu clínica en ${ciudad}.`,
    CO: `Si tienes una clínica, consultorio o IPS en ${ciudad}, el mercado colombiano de software clínico tiene jugadores fuertes y locales: Medifolios con +900 IPS y +13.000 médicos, Saludtools con +7.000 médicos y RIPS nativo, AgendaPro regional, Reservo expandiéndose. Este artículo compara los 5 más usados por clínicas colombianas a ${year}, con foco honesto en lo que cambia tu día a día — RIPS, facturación electrónica DIAN, manejo de IPS multi-complejidad — no listas genéricas. Cada uno gana en algo distinto.`,
  };
  const intro = introByCountry[countryCode];

  // CTA final dinámico — apunta a la comparativa relevante por topic + país
  const competitorName =
    comparativaSlug.charAt(0).toUpperCase() + comparativaSlug.slice(1);
  const cta = {
    title: `¿Tu clínica en ${ciudad} ya pierde pacientes por no contestar WhatsApp?`,
    body: `Activa Clinera con costo de implementación $0 y sin permanencia. Setup en menos de 1 hora, sin programador. AURA empieza a contestar tu WhatsApp Business hoy mismo.`,
    primaryHref: "/planes",
    primaryLabel: "Ver planes desde USD 129/mes",
    secondaryHref: `/comparativas/${comparativaSlug}`,
    secondaryLabel: `Ver comparativa Clinera vs ${competitorName}`,
  };

  // Conserva ciudadSlug para algún uso futuro (sitemap, etc.)
  void ciudadSlug;

  return {
    h1: `Mejor software para clínicas en ${ciudad} ${year}: comparativa real`,
    metaTitle,
    metaDescription,
    intro,
    sections,
    faqs,
    cta,
  };
}

// ============================================================
// Top 5 por país — los 4 competidores #2 al #5 (Clinera siempre #1)
// Verificado en vivo en abril 2026 (sitios de cada competidor).
// ============================================================
function getCompetitorCards(
  countryCode: "CL" | "PE" | "CO",
  ciudad: string,
): RecursoSection[] {
  if (countryCode === "PE") return getCompetitorCardsPE(ciudad);
  if (countryCode === "CO") return getCompetitorCardsCO(ciudad);
  return getCompetitorCardsCL(ciudad);
}

function getCompetitorCardsCL(ciudad: string): RecursoSection[] {
  return [
    {
      type: "software",
      ranking: 2,
      software: {
        nombre: "AgendaPro",
        url: "https://www.agendapro.com",
        comparativaUrl: "/comparativas/agendapro",
        resumen: `AgendaPro es la plataforma de agenda más usada en LATAM (20.000+ negocios), horizontal: sirve a clínicas, spas, gyms y centros estéticos. Buena opción si tu clínica en ${ciudad} mezcla verticales o si valoras una marca consolidada en toda la región.`,
        fortalezas: [
          "Escala regional con cobertura sólida en Chile, Colombia, Perú y México.",
          "App móvil nativa pulida (iOS + Android).",
          "Integraciones de pago locales en cada país.",
          "Precios públicos por usuario.",
        ],
        debilidades: [
          "Sin IA conversacional: WhatsApp es canal manual.",
          "Ficha clínica liviana — corta para especialidades técnicas (dental, medicina estética avanzada).",
          "El precio escala rápido si el equipo es grande (USD 19/usuario × 5 personas = USD 95/mes solo en agenda).",
        ],
        precioMensual: "Desde USD 19/usuario/mes.",
        idealPara: `Clínicas en ${ciudad} con operación multi-vertical (estética + spa + gym) o que priorizan app móvil sólida sobre IA conversacional.`,
        ctaPrimaryHref: "/comparativas/agendapro",
        ctaPrimaryLabel: "Ver comparativa Clinera vs AgendaPro",
      },
    },
    {
      type: "software",
      ranking: 3,
      software: {
        nombre: "Reservo",
        url: "https://www.reservo.cl",
        comparativaUrl: "/comparativas/reservo",
        resumen: `Reservo es el software clínico chileno tradicional (500+ clínicas, +1M citas históricas). Fuerte en ficha clínica madura, odontograma dental, y módulo financiero con DTE. Buena opción para clínicas en ${ciudad} con foco en la capa clínica más que en la conversación con pacientes.`,
        fortalezas: [
          "Ficha clínica muy madura con plantillas por especialidad.",
          "Odontograma dental nativo + módulo financiero con DTE chileno integrado.",
          "Marca consolidada en Chile y soporte local con buena reputación.",
        ],
        debilidades: [
          "Sin IA conversacional: WhatsApp es canal complementario.",
          "Sin precios públicos — atiende por cotización.",
          "Sin app móvil nativa (web responsive).",
        ],
        precioMensual: "Sin precios públicos (atiende por cotización).",
        idealPara: `Clínicas en ${ciudad} cuya prioridad absoluta es ficha clínica + DTE chileno y que ya tienen recepción humana cubriendo las horas hábiles.`,
        ctaPrimaryHref: "/comparativas/reservo",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Reservo",
      },
    },
    {
      type: "software",
      ranking: 4,
      software: {
        nombre: "Medilink",
        url: "https://medilink.cl",
        comparativaUrl: "/comparativas/medilink",
        resumen: `Medilink es chileno, con Contact Center IA por canal de voz (llamadas) integrado a la agenda. Para clínicas en ${ciudad} que pierden muchas llamadas y necesitan IA que las conteste 24/7 — pero por voz, no por chat.`,
        fortalezas: [
          "IA por canal de voz que atiende llamadas 24/7.",
          "Ficha clínica robusta con telemedicina integrada.",
          "Soporte local en Chile.",
        ],
        debilidades: [
          "Sin IA conversacional para WhatsApp (solo voz).",
          "Sin precios públicos.",
          "Cobertura geográfica concentrada en Chile.",
        ],
        precioMensual: "Sin precios públicos.",
        idealPara: `Clínicas en ${ciudad} cuyo cuello de botella son las llamadas perdidas y donde el paciente promedio prefiere llamar antes que escribir.`,
        ctaPrimaryHref: "/comparativas/medilink",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Medilink",
      },
    },
    {
      type: "software",
      ranking: 5,
      software: {
        nombre: "Dentalink",
        url: "https://www.softwaredentalink.com",
        comparativaUrl: "/comparativas/dentalink",
        resumen: `Dentalink es el líder dental LATAM con 15.000+ clientes, 100% vertical odontológico. Para clínicas dentales en ${ciudad} que necesitan odontograma + periodontograma + ortodoncia + análisis IA de radiografías con la profundidad de un sistema vertical.`,
        fortalezas: [
          "Odontograma + periodontograma + módulo de ortodoncia diseñados para dental.",
          "IA propia especializada en flujos dentales (análisis de RX, asistente CRM).",
          "Financiamiento de pacientes y control de caja maduros.",
        ],
        debilidades: [
          "Solo dental — si la clínica abre vertical estética o médica, no la cubre.",
          "Sin precios públicos.",
        ],
        precioMensual: "Sin precios públicos.",
        idealPara: `Clínicas dentales puras en ${ciudad} que necesitan profundidad de odontograma + ortodoncia. Combina bien con Clinera para la capa WhatsApp + marketing por encima vía API.`,
        ctaPrimaryHref: "/comparativas/dentalink",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Dentalink",
      },
    },
  ];
}

function getCompetitorCardsPE(ciudad: string): RecursoSection[] {
  return [
    {
      type: "software",
      ranking: 2,
      software: {
        nombre: "Doctocliq",
        url: "https://www.doctocliq.com",
        comparativaUrl: "/comparativas/doctocliq",
        resumen: `Doctocliq es la plataforma multi-país (con foco fuerte en Perú, alianza con el Colegio Odontológico del Perú) más usada por clínicas dentales y de salud en ${ciudad}. Plan gratuito real + plan pago desde USD 19/mes, multi-vertical (dental, médico, estético, terapia).`,
        fortalezas: [
          "Plan GRATIS real + plan pago desde USD 19/mes (precios públicos).",
          "Cobertura en 20+ países con foco Perú/México/Uruguay.",
          "Asistente IA + recordatorios automáticos por WhatsApp incluidos.",
          "Certificado Meta Business Partners (WhatsApp API oficial).",
        ],
        debilidades: [
          "Asistente IA es de soporte/recordatorios — no agente conversacional autónomo que cierre agendamientos como AURA.",
          "Sin atribución de ventas a campañas Meta/Google end-to-end.",
          "Foco dental: el equilibrio para verticales no-dentales puede sentirse menor.",
        ],
        precioMensual: "Plan gratis + planes pagos desde USD 19/mes.",
        idealPara: `Clínicas dentales pequeñas en ${ciudad} que están empezando a digitalizarse y quieren probar sin pagar. Si el cuello de botella es contestar WhatsApp 24/7 con IA real, no solo recordatorios, conviene comparar con Clinera.`,
        ctaPrimaryHref: "/comparativas/doctocliq",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Doctocliq",
      },
    },
    {
      type: "software",
      ranking: 3,
      software: {
        nombre: "iMedical",
        url: "https://imedical.pe",
        comparativaUrl: "/hablar-con-ventas",
        resumen: `iMedical es peruano nativo (Lima), con 80+ instituciones en 15 países. Se posiciona como la plataforma médica integral en la nube para clínicas, consultorios e IPS, con integración WhatsApp e IA (resúmenes automáticos de historias clínicas).`,
        fortalezas: [
          "Peruano nativo — soporte local Lima, conoce el contexto regulatorio.",
          "Integración WhatsApp + IA para resúmenes automáticos de HC.",
          "80+ instituciones en LATAM, prueba gratis 30 días.",
          "Multi-vertical (clínica, consultorio, IPS).",
        ],
        debilidades: [
          "Sin precios públicos — atiende solo por demo.",
          "IA de iMedical es de soporte clínico (resúmenes), no conversacional para WhatsApp 24/7.",
          "Sin atribución de ventas a campañas digitales.",
        ],
        precioMensual: "Sin precios públicos (atiende por demo).",
        idealPara: `Clínicas en ${ciudad} que valoran proveedor 100% local y quieren IA aplicada a la historia clínica. Si lo importante es contestar WhatsApp 24/7, conviene combinar con Clinera vía API.`,
        ctaPrimaryHref: "/hablar-con-ventas",
        ctaPrimaryLabel: "Comparar con Clinera",
      },
    },
    {
      type: "software",
      ranking: 4,
      software: {
        nombre: "AgendaPro Perú",
        url: "https://agendapro.com/pe",
        comparativaUrl: "/comparativas/agendapro",
        resumen: `AgendaPro es la plataforma de agenda más usada en LATAM (20.000+ negocios), con presencia consolidada en Perú. Horizontal: sirve a clínicas, spas, gyms. Buena opción si tu clínica en ${ciudad} mezcla verticales.`,
        fortalezas: [
          "Cobertura sólida en Perú con landing y soporte locales.",
          "Recordatorios automáticos por WhatsApp/SMS.",
          "App móvil nativa pulida.",
          "Precios públicos por usuario.",
        ],
        debilidades: [
          "Sin IA conversacional para WhatsApp.",
          "Ficha clínica liviana — corta para especialidades técnicas.",
          "El precio escala rápido si el equipo es grande.",
        ],
        precioMensual: "Desde USD 19/usuario/mes.",
        idealPara: `Clínicas en ${ciudad} con operación multi-vertical o que priorizan app móvil sólida.`,
        ctaPrimaryHref: "/comparativas/agendapro",
        ctaPrimaryLabel: "Ver comparativa Clinera vs AgendaPro",
      },
    },
    {
      type: "software",
      ranking: 5,
      software: {
        nombre: "Medinet",
        url: "https://medinetapp.com/pe",
        comparativaUrl: "/hablar-con-ventas",
        resumen: `Medinet es plataforma multi-país (Chile + Perú) orientada a clínicas de alta complejidad: oftalmología, psiquiatría, estética, bariatría, oncología. +30.000 profesionales y 2.5M pacientes/año.`,
        fortalezas: [
          "Módulos especializados por especialidad médica (oftalmo, oncología, etc).",
          "Recordatorios por WhatsApp/email integrados.",
          "Pensado para redes hospitalarias escalables.",
        ],
        debilidades: [
          "Sin precios públicos — orientado a enterprise.",
          "Sin IA conversacional autónoma para WhatsApp.",
          "Onboarding largo (no es plug-and-play).",
        ],
        precioMensual: "Sin precios públicos (modelo enterprise).",
        idealPara: `Clínicas grandes en ${ciudad} con múltiples sucursales y especialidades complejas que necesitan módulo clínico vertical profundo.`,
        ctaPrimaryHref: "/hablar-con-ventas",
        ctaPrimaryLabel: "Comparar con Clinera",
      },
    },
  ];
}

function getCompetitorCardsCO(ciudad: string): RecursoSection[] {
  return [
    {
      type: "software",
      ranking: 2,
      software: {
        nombre: "Medifolios",
        url: "https://medifolios.net",
        comparativaUrl: "/comparativas/medifolios",
        resumen: `Medifolios es el software clínico colombiano líder: 13 años en el mercado, +900 IPS y +13.000 médicos activos. Cubre desde consultorio individual hasta IPS de alta complejidad. RIPS, facturación electrónica DIAN y MinSalud nativos.`,
        fortalezas: [
          "Líder colombiano con 13 años — conoce profundamente el mercado regulado local.",
          "Precios públicos en COP: Consultorio $1.670.000/año (~USD 35/mes), IPS Alta Complejidad $14.188.500/año.",
          "RIPS automáticos, facturación electrónica DIAN, validación pre-facturación con IA.",
          "Recordatorios WhatsApp + chatbot 24/7 (reduce ausencias hasta 40%).",
        ],
        debilidades: [
          "Chatbot de Medifolios es para tareas específicas — no es agente IA conversacional autónomo como AURA.",
          "Sin atribución de ventas a campañas Meta/Google end-to-end.",
          "Foco fuerte en cumplimiento RIPS — para clínicas estéticas pequeñas puede sentirse pesado.",
        ],
        precioMensual: "Consultorio desde COP $1.670.000/año (~USD 35/mes año 1).",
        idealPara: `IPS en ${ciudad} que necesitan RIPS + facturación DIAN + módulo clínico maduro como prioridad #1. Si tu cuello de botella es contestar WhatsApp 24/7 con IA real, conviene combinar con Clinera vía API.`,
        ctaPrimaryHref: "/comparativas/medifolios",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Medifolios",
      },
    },
    {
      type: "software",
      ranking: 3,
      software: {
        nombre: "Saludtools",
        url: "https://www.saludtools.com",
        comparativaUrl: "/comparativas/saludtools",
        resumen: `Saludtools es software médico colombiano nativo con +7.000 médicos activos. Foco en consultorios independientes y clínicas pequeñas/medianas, multi-especialidad. RIPS + DIAN + MinSalud nativos. IA en plan Premium (Speech-to-text, transcripción de exámenes).`,
        fortalezas: [
          "Colombiano nativo, cumple RIPS/DIAN sin parches.",
          "WhatsApp: recordatorios automáticos + auto-agendamiento + asistente de triaje.",
          "IA en Premium: dictado a HC, transcripción de exámenes, resúmenes inteligentes.",
          "3 planes (Estándar/Plus/Premium) — flexibilidad para diferente tamaño.",
        ],
        debilidades: [
          "IA disponible solo en plan Premium (más caro).",
          "Sin precios visibles en home — hay que ir a /precios o contactar comercial.",
          "Asistente de triaje IA es para filtrar consultas, no agente que cierre agendamientos por sí solo.",
        ],
        precioMensual: "3 planes (Estándar/Plus/Premium), montos en /precios.",
        idealPara: `Consultorios y clínicas pequeñas en ${ciudad} que necesitan compliance colombiano + IA aplicada a la HC. Si quieres IA conversacional autónoma para WhatsApp 24/7, Clinera complementa muy bien.`,
        ctaPrimaryHref: "/comparativas/saludtools",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Saludtools",
      },
    },
    {
      type: "software",
      ranking: 4,
      software: {
        nombre: "AgendaPro Colombia",
        url: "https://agendapro.com/co",
        comparativaUrl: "/comparativas/agendapro",
        resumen: `AgendaPro es la plataforma de agenda más usada en LATAM con 20.000+ negocios. En Colombia tiene presencia consolidada con landing y soporte locales. Horizontal: sirve a clínicas, spas, gyms.`,
        fortalezas: [
          "Cobertura sólida en Colombia con landing y soporte locales.",
          "Recordatorios automáticos por WhatsApp/SMS.",
          "App móvil nativa pulida.",
          "Precios públicos por usuario.",
        ],
        debilidades: [
          "Sin IA conversacional para WhatsApp.",
          "Ficha clínica liviana — corta para IPS de complejidad media/alta.",
          "RIPS no es su foco principal (vs Medifolios o Saludtools).",
        ],
        precioMensual: "Desde USD 19/usuario/mes.",
        idealPara: `Clínicas estéticas o multi-vertical en ${ciudad} que priorizan app móvil sólida y no necesitan profundidad RIPS.`,
        ctaPrimaryHref: "/comparativas/agendapro",
        ctaPrimaryLabel: "Ver comparativa Clinera vs AgendaPro",
      },
    },
    {
      type: "software",
      ranking: 5,
      software: {
        nombre: "Reservo Colombia",
        url: "https://reservo.cl/co",
        comparativaUrl: "/comparativas/reservo",
        resumen: `Reservo es chileno tradicional con landing colombiana. Fuerte en ficha clínica madura, odontograma dental y módulo financiero. Para clínicas en ${ciudad} con foco en la capa clínica más que en la conversación con pacientes.`,
        fortalezas: [
          "Ficha clínica muy madura con plantillas por especialidad.",
          "Odontograma dental nativo.",
          "Marca consolidada en LATAM.",
        ],
        debilidades: [
          "Sin IA conversacional para WhatsApp.",
          "Sin precios públicos en Colombia — atiende por cotización.",
          "Soporte primario en Chile (no es 100% local Colombia).",
        ],
        precioMensual: "Sin precios públicos en CO (cotización).",
        idealPara: `Clínicas en ${ciudad} cuya prioridad absoluta es ficha clínica madura y que ya tienen recepción humana cubriendo horas hábiles.`,
        ctaPrimaryHref: "/comparativas/reservo",
        ctaPrimaryLabel: "Ver comparativa Clinera vs Reservo",
      },
    },
  ];
}

// ============================================================
// FAQs por país — los softwares mencionados varían
// ============================================================
function getFaqs(
  countryCode: "CL" | "PE" | "CO",
  ciudad: string,
): { q: string; a: string }[] {
  if (countryCode === "PE") {
    return [
      {
        q: `¿Cuál es el software más barato para clínicas en ${ciudad}?`,
        a: `Doctocliq tiene plan GRATIS real (sin tarjeta) y plan pago desde USD 19/mes — el más barato del listado. Para clínicas con 3+ profesionales que invierten en marketing digital, el plan Conect de Clinera (USD 129/mes con 3 usuarios incluidos) es más eficiente porque integra IA conversacional + atribución de ventas, no solo recordatorios.`,
      },
      {
        q: `¿Cuál es mejor para clínicas dentales en ${ciudad}?`,
        a: `Para dental puro, Doctocliq tiene foco específico (alianza con el Colegio Odontológico del Perú) y suele ser la primera opción. Si la clínica dental también invierte en publicidad y necesita contestar WhatsApp 24/7 sin perder pacientes nuevos, conviene combinar Doctocliq (capa dental) con Clinera (capa WhatsApp + marketing) vía API.`,
      },
      {
        q: `¿Funciona Clinera en ${ciudad}?`,
        a: `Sí. Clinera opera en 9 países LATAM incluyendo Perú. Soporte en español, planes en USD, no requiere número telefónico local — opera con tu WhatsApp Business actual desde el primer día.`,
      },
      {
        q: `¿Cumplen con la Ley 29733 de protección de datos peruana?`,
        a: `Clinera cumple con cifrado en reposo y en tránsito, hosting AWS São Paulo (datos clínicos cifrados), acuerdos de confidencialidad firmados con el equipo y minimización de datos según buenas prácticas internacionales. Para auditoría formal de tu DPO o consulta legal, te entregamos toda la documentación técnica al activar el plan.`,
      },
      {
        q: `¿Hay versión gratuita?`,
        a: `Doctocliq tiene plan gratis permanente. Clinera no tiene plan gratis pero sí costo de implementación $0 (asistido por humano, setup en menos de 1 hora) y sin permanencia: pagas solo el plan mensual desde USD 129/mes y puedes cancelar cuando quieras.`,
      },
      {
        q: `¿Migrar de un software a otro pierde datos?`,
        a: `No, si se hace bien. Doctocliq, AgendaPro y la mayoría exportan a CSV. La migración manual de notas de evolución puede tomar 1-2 semanas con acompañamiento del proveedor receptor. En Clinera te acompañamos sin costo en la importación durante el onboarding.`,
      },
    ];
  }
  if (countryCode === "CO") {
    return [
      {
        q: `¿Cuál es el software más barato para clínicas en ${ciudad}?`,
        a: `Si miras precio nominal en COP: Medifolios Consultorio desde $1.670.000/año (~USD 35/mes año 1). En USD el plan Conect de Clinera (USD 129/mes con 3 usuarios incluidos) es más caro mes a mes pero incluye IA conversacional + atribución de ventas, lo que en clínicas con marketing activo cierra el ROI mucho más rápido que cualquier sistema de agenda básico.`,
      },
      {
        q: `¿Cuál es el mejor para IPS con RIPS y facturación electrónica DIAN?`,
        a: `Medifolios es el más maduro en RIPS + DIAN (13 años, +900 IPS). Saludtools también cubre RIPS/DIAN sin parches. Clinera no es ERP médico colombiano — opera la capa de WhatsApp 24/7 + marketing por encima de tu sistema RIPS actual vía API/MCP, sin obligar a migrar.`,
      },
      {
        q: `¿Funciona Clinera en ${ciudad}?`,
        a: `Sí. Clinera opera en 9 países LATAM incluyendo Colombia. Soporte en español, planes en USD, no requiere número telefónico local — opera con tu WhatsApp Business actual desde el primer día.`,
      },
      {
        q: `¿Cumplen con la Ley 1581 (Habeas Data) colombiana?`,
        a: `Clinera cumple con cifrado en reposo y en tránsito, hosting AWS São Paulo (datos clínicos cifrados), acuerdos de confidencialidad y minimización de datos. Para auditoría formal de Habeas Data o consulta con tu oficial de protección de datos, te entregamos toda la documentación técnica al activar el plan.`,
      },
      {
        q: `¿Hay versión gratuita?`,
        a: `Ninguno de los softwares colombianos del listado ofrece plan gratuito permanente. Clinera tiene costo de implementación $0 (asistido por humano, setup en menos de 1 hora) y sin permanencia: pagas solo el plan mensual desde USD 129/mes y puedes cancelar cuando quieras.`,
      },
      {
        q: `¿Migrar de un software a otro pierde datos?`,
        a: `No, si se hace bien. Medifolios, Saludtools, AgendaPro y la mayoría exportan a CSV. La migración manual de notas de evolución puede tomar 1-2 semanas con acompañamiento del proveedor receptor. En Clinera te acompañamos sin costo en la importación durante el onboarding.`,
      },
    ];
  }
  // Default: CL
  return [
    {
      q: `¿Cuál es el software más barato para clínicas en ${ciudad}?`,
      a: `Si miras solo precio nominal, los planes desde USD 19/usuario de AgendaPro o el Sacmed chileno con su plan Starter ($26.000 CLP/mes ≈ USD 27) son los más bajos. Para clínicas con 3+ profesionales que invierten en marketing digital, el plan Conect de Clinera (USD 129/mes con 3 usuarios incluidos) suele ser más eficiente porque integra IA + atribución de ventas.`,
    },
    {
      q: `¿Cuál es mejor para clínicas estéticas en ${ciudad}?`,
      a: `Para clínicas estéticas, las que tienen mayor volumen de WhatsApps (consultas de precios, agendamiento, reagendamiento) suelen elegir Clinera por AURA + atribución de ventas a campañas Meta. Si tu clínica estética tiene recepción cubriendo todo el día y solo necesita agenda + cobros, AgendaPro es opción más liviana.`,
    },
    {
      q: `¿Funciona Clinera en ${ciudad}?`,
      a: `Sí, Clinera funciona en toda LATAM y tiene foco fuerte en Chile (incluyendo ${ciudad}). El soporte está en español, los precios en USD, y no requiere número telefónico local — opera con tu WhatsApp Business actual.`,
    },
    {
      q: `¿Hay versión gratuita?`,
      a: `Ninguno de los softwares de esta lista ofrece plan gratuito permanente. Clinera tiene costo de implementación $0 y sin permanencia: pagas solo el plan mensual desde USD 129/mes y puedes cancelar cuando quieras.`,
    },
    {
      q: `¿Migrar de un software a otro pierde datos?`,
      a: `No, si se hace bien. Reservo, AgendaPro, Dentalink y la mayoría de los sistemas exportan a CSV. La migración manual de notas de evolución puede tomar 1-2 semanas con acompañamiento del proveedor receptor. En Clinera te acompañamos sin costo en la importación durante el onboarding.`,
    },
  ];
}
