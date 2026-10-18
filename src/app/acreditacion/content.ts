/**
 * Contenido normativo de /acreditacion.
 *
 * REGLA QUE MANDA SOBRE TODO LO DEMÁS (decidida por Ricardo, agosto 2026):
 * la página afirma que Clinera cumple con los REQUISITOS TÉCNICOS que exigen
 * estas normas —cifrado, aislamiento por clínica, trazabilidad, respaldo—,
 * porque esas medidas están activas y son verificables.
 *
 * Lo que NO se afirma, y no debe aparecer nunca: que Clinera esté certificado,
 * acreditado, registrado o conectado al RENHICE. En México, Perú y Colombia el
 * cumplimiento formal ES el registro estatal (DGIS, MINSA/OGTI, MinSalud) y
 * esos trámites están en curso, no resueltos. Afirmarlos sería falso y además
 * es lo único de esta página que expone legalmente a la empresa.
 *
 * En resumen: "cumple con los requisitos técnicos que exige la norma" sí;
 * "cumple con la norma" / "certificado" / "acreditado" no.
 *
 * Fuentes verificadas (agosto 2026):
 * - CL  Ley 20.584; Decreto 41/2012 MINSAL; Ley 21.668 (28-05-2024,
 *       interoperabilidad de fichas clínicas); Ley 21.719 (vigencia dic. 2026).
 * - MX  NOM-004-SSA3-2012; NOM-024-SSA3-2012 (SIRES, certificación DGIS);
 *       decreto DOF 15-01-2026, arts. 71 Bis y 71 Ter de la Ley General de Salud.
 * - PE  Ley 30024 (RENHICE); RM 164-2025/MINSA, Directiva Administrativa
 *       373-MINSA/OGTI-2025 (acreditación de SIHCE, seis atributos).
 * - CO  Ley 2015 de 2020; Resolución 866 de 2021; Resolución 1888 de 2025
 *       (Resumen Digital de Atención sobre HL7 FHIR R4).
 */

export const LAST_UPDATED = "12 de agosto de 2026";
export const PUBLISHED_ISO = "2026-08-12";
export const MODIFIED_ISO = "2026-08-12";

export type TocEntry = { id: string; label: string };

export const TOC: TocEntry[] = [
  { id: "estado", label: "Clinera y la norma" },
  { id: "equivalencias", label: "Equivalencias entre países" },
  { id: "chile", label: "Chile" },
  { id: "mexico", label: "México" },
  { id: "peru", label: "Perú" },
  { id: "colombia", label: "Colombia" },
  { id: "glosario", label: "Glosario" },
  { id: "aviso", label: "Aviso legal" },
];

/* -------------------------------------------------------------------------- */
/* Sección 1 — tabla de equivalencias                                          */
/* -------------------------------------------------------------------------- */

export const TABLE_COLUMNS = ["Chile", "México", "Perú", "Colombia"] as const;

export const TABLE_ROWS: Array<{ label: string; cells: [string, string, string, string] }> = [
  {
    label: "Ministerio",
    cells: [
      "Ministerio de Salud (MINSAL)",
      "Secretaría de Salud",
      "Ministerio de Salud (MINSA)",
      "Ministerio de Salud y Protección Social",
    ],
  },
  {
    label: "Regulador sanitario",
    cells: [
      "Superintendencia de Salud",
      "COFEPRIS",
      "SUSALUD",
      "Supersalud",
    ],
  },
  {
    label: "Cómo se llama la clínica",
    cells: [
      "Prestador institucional de salud",
      "Establecimiento para la atención médica",
      "IPRESS",
      "IPS",
    ],
  },
  {
    label: "Registro de prestadores",
    cells: [
      "Registro Nacional de Prestadores, Superintendencia de Salud",
      "CLUES",
      "RENIPRESS",
      "REPS",
    ],
  },
  {
    label: "Nombre de la ficha electrónica",
    cells: [
      "Ficha clínica electrónica (FCE)",
      "Expediente clínico electrónico, operado por un SIRES",
      "Historia clínica electrónica (HCE), operada por un SIHCE",
      "Historia clínica electrónica interoperable",
    ],
  },
  {
    label: "Norma que regula el software",
    cells: [
      "Sin norma específica de software: Ley 20.584, Decreto 41/2012 y Ley 21.668",
      "NOM-024-SSA3-2012, con NOM-004-SSA3-2012 sobre el expediente",
      "Ley 30024 y RM 164-2025/MINSA",
      "Ley 2015 de 2020, Resolución 866 de 2021 y Resolución 1888 de 2025",
    ],
  },
  {
    label: "Quién valida el software",
    cells: [
      "Nadie: no existe certificación estatal de software clínico",
      "DGIS, Secretaría de Salud",
      "MINSA, a través de la OGTI",
      "Ministerio de Salud y Protección Social",
    ],
  },
  {
    label: "Red nacional de intercambio",
    cells: [
      "En construcción bajo la Ley 21.668",
      "Intercambio de información en salud definido por la NOM-024",
      "RENHICE",
      "IHCE",
    ],
  },
  {
    label: "Asegurador público",
    cells: [
      "FONASA",
      "IMSS, ISSSTE e IMSS-Bienestar",
      "SIS y EsSalud",
      "EPS, con recursos administrados por la ADRES",
    ],
  },
  {
    label: "Ley de datos personales",
    cells: [
      "Ley 19.628, sustituida por la Ley 21.719 en diciembre de 2026",
      "LFPDPPP",
      "Ley 29733",
      "Ley 1581 de 2012",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Secciones 2–5 — un bloque por país                                          */
/* -------------------------------------------------------------------------- */

export type Country = {
  id: string;
  code: string;
  name: string;
  exige: string;
  valida: string;
  arquitectura: string[];
  vocabulario: string[];
  /** Guía interna que profundiza en el marco legal del país, si existe. */
  guia?: { href: string; label: string };
};

export const COUNTRIES: Country[] = [
  {
    id: "chile",
    code: "CL",
    name: "Chile",
    exige:
      "La Ley 20.584 trata la ficha clínica como dato sensible: acceso reservado al personal autorizado, registro de quién la consulta y entrega de copia al paciente que la pide, y el Decreto 41/2012 del MINSAL permite llevarla en formato electrónico. La Ley 21.668, de mayo de 2024, sumó el deber de interoperar las fichas entre prestadores y conservarlas quince años, con el reglamento técnico del MINSAL todavía pendiente. Desde diciembre de 2026, la Ley 21.719 eleva el estándar de seguridad exigible sobre los datos de salud.",
    valida:
      "Ningún organismo certifica software clínico en Chile: la Superintendencia de Salud fiscaliza al prestador, no a su proveedor de software.",
    arquitectura: [
      "Cifrado en reposo AES-256-GCM sobre todo el contenido clínico, con una llave por clínica bajo envelope encryption y llave maestra en bóveda gestionada.",
      "Registro de acceso a la ficha: queda trazado qué usuario abrió qué ficha y cuándo, que es la medida que la Ley 20.584 obliga a poder acreditar.",
      "Respaldo continuo con restauración punto en el tiempo, sobre el horizonte de conservación que fija la Ley 21.668.",
      "Exportación de la ficha en formato estructurado, para responder la solicitud de copia del paciente y para el intercambio que exigirá el reglamento del MINSAL.",
    ],
    vocabulario: ["MINSAL", "Superintendencia de Salud", "FONASA", "ISAPRE", "FCE"],
    guia: {
      href: "/blog/normativa-ficha-clinica-chile-ley-20584",
      label: "Guía completa de la Ley 20.584 y la ficha clínica",
    },
  },
  {
    id: "mexico",
    code: "MX",
    name: "México",
    exige:
      "La NOM-004-SSA3-2012 fija qué debe contener el expediente clínico, y la NOM-024-SSA3-2012 regula el software que lo opera —el SIRES— con reglas de estructura, seguridad e intercambio de información. El decreto publicado en el DOF el 15 de enero de 2026 incorporó los artículos 71 Bis y 71 Ter a la Ley General de Salud: definen la salud digital y ordenan digitalizar la información médica del Sistema Nacional de Salud garantizando interoperabilidad.",
    valida:
      "La DGIS (Dirección General de Información en Salud), de la Secretaría de Salud, es el organismo que audita los SIRES bajo la NOM-024-SSA3-2012.",
    arquitectura: [
      "La ficha cubre los apartados que la NOM-004 exige del expediente —identificación, historia clínica, notas de evolución, consentimientos informados— con el profesional que registra identificado en cada anotación.",
      "Las anotaciones son inmutables y versionadas: una corrección se agrega, nunca sobrescribe, que es el criterio de integridad del expediente.",
      "Control de acceso por rol y aislamiento por llave de cifrado por clínica, sin llaves compartidas entre establecimientos.",
      "Salida de datos en formatos estructurados, que es la base técnica sobre la que se construye un intercambio conforme a la NOM-024.",
    ],
    vocabulario: ["Secretaría de Salud", "COFEPRIS", "DGIS", "SIRES", "CLUES", "IMSS"],
  },
  {
    id: "peru",
    code: "PE",
    name: "Perú",
    exige:
      "La Ley 30024 creó el RENHICE, el registro nacional que permite a una IPRESS consultar la historia clínica electrónica de un paciente atendido en otro establecimiento. Para conectarse, el software de historia clínica —el SIHCE— debe estar acreditado, y la RM 164-2025/MINSA fijó ese procedimiento mediante la Directiva Administrativa 373-MINSA/OGTI-2025. La acreditación se evalúa sobre seis atributos: confidencialidad, integridad, disponibilidad, confiabilidad, trazabilidad y no repudio.",
    valida:
      "El MINSA es el organismo que evalúa los SIHCE, a través de su Oficina General de Tecnologías de la Información (OGTI).",
    arquitectura: [
      "Confidencialidad e integridad: AES-256-GCM en reposo, TLS en tránsito y una llave de cifrado por clínica, con llave maestra en bóveda gestionada.",
      "Trazabilidad y no repudio: cada lectura y cada escritura sobre la ficha queda registrada con usuario, acción y marca de tiempo, en un log que el operador de la clínica no puede editar.",
      "Disponibilidad y confiabilidad: respaldo continuo con restauración a un instante exacto, sobre infraestructura gestionada.",
      "Exportación de la historia en formato estructurado, condición previa de cualquier integración futura con el RENHICE.",
    ],
    vocabulario: ["MINSA", "SUSALUD", "IPRESS", "RENIPRESS", "RENHICE", "SIHCE", "EsSalud", "SIS"],
  },
  {
    id: "colombia",
    code: "CO",
    name: "Colombia",
    exige:
      "La Ley 2015 de 2020 creó la historia clínica electrónica interoperable y la Resolución 866 de 2021 definió el conjunto de datos clínicos relevantes que deben poder intercambiarse. La Resolución 1888 de 2025 adoptó el Resumen Digital de Atención (RDA) como mecanismo obligatorio de ese intercambio, sobre HL7 FHIR R4 y con transporte cifrado. Alcanza a todo prestador inscrito en el REPS, con plazo de adecuación de seis meses contados desde el 15 de octubre de 2025.",
    valida:
      "El Ministerio de Salud y Protección Social es el organismo que valida técnicamente al prestador y a su software antes de habilitarlo contra la plataforma IHCE.",
    arquitectura: [
      "El modelo de datos de la ficha cubre los elementos del conjunto mínimo de la Resolución 866, de modo que armar un RDA es una transformación de salida y no un rediseño del núcleo clínico.",
      "Cifrado del contenido clínico en reposo y transporte cifrado extremo a extremo, con una llave por clínica.",
      "Trazabilidad de acceso y versionado de cada anotación, que es la evidencia que pide una auditoría de la Supersalud.",
      "Webhooks y API pública para conectar un middleware de interoperabilidad sin tocar el núcleo clínico.",
    ],
    vocabulario: ["MinSalud", "Supersalud", "IPS", "EPS", "REPS", "IHCE", "RIPS", "ADRES", "MIPRES"],
  },
];

/* -------------------------------------------------------------------------- */
/* Sección 6 — glosario (orden alfabético estricto)                            */
/* -------------------------------------------------------------------------- */

export const GLOSSARY: Array<{ term: string; def: string }> = [
  {
    term: "ADRES",
    def: "Administradora de los Recursos del Sistema General de Seguridad Social en Salud: gira el dinero del sistema colombiano a EPS e IPS.",
  },
  {
    term: "COFEPRIS",
    def: "Comisión Federal para la Protección contra Riesgos Sanitarios: el regulador sanitario de México.",
  },
  {
    term: "DGIS",
    def: "Dirección General de Información en Salud: el área de la Secretaría de Salud mexicana que certifica los SIRES bajo la NOM-024.",
  },
  {
    term: "EPS",
    def: "Entidad Promotora de Salud: el asegurador que afilia al paciente y contrata la red de atención en Colombia.",
  },
  {
    term: "EsSalud",
    def: "Seguro Social de Salud del Perú: asegura a los trabajadores dependientes y opera su propia red de establecimientos.",
  },
  {
    term: "FONASA",
    def: "Fondo Nacional de Salud: el asegurador público de Chile, alternativa a las ISAPRE privadas.",
  },
  {
    term: "IHCE",
    def: "Interoperabilidad de la Historia Clínica Electrónica: la plataforma nacional colombiana por donde circula el Resumen Digital de Atención.",
  },
  {
    term: "IPRESS",
    def: "Institución Prestadora de Servicios de Salud: el nombre legal de una clínica en Perú.",
  },
  {
    term: "IPS",
    def: "Institución Prestadora de Servicios de Salud: el nombre legal de una clínica en Colombia.",
  },
  {
    term: "MIPRES",
    def: "Mi Prescripción: la plataforma colombiana para prescribir tecnologías que no financia la UPC.",
  },
  {
    term: "RENHICE",
    def: "Registro Nacional de Historias Clínicas Electrónicas: la red peruana que permite consultar la historia de un paciente atendido en otra IPRESS.",
  },
  {
    term: "REPS",
    def: "Registro Especial de Prestadores de Servicios de Salud: el registro que habilita a toda IPS colombiana.",
  },
  {
    term: "RIPS",
    def: "Registro Individual de Prestación de Servicios de Salud: el reporte de atenciones que sustenta la facturación en Colombia.",
  },
  {
    term: "SIHCE",
    def: "Sistema de Información de Historias Clínicas Electrónicas: el software de historia clínica en Perú, sujeto a acreditación del MINSA.",
  },
  {
    term: "SIRES",
    def: "Sistema de Información de Registro Electrónico para la Salud: el software de expediente clínico en México, sujeto a la NOM-024.",
  },
  {
    term: "SIS",
    def: "Seguro Integral de Salud: el asegurador público subsidiado del Perú.",
  },
  {
    term: "UPC",
    def: "Unidad de Pago por Capitación: el monto anual que la ADRES reconoce a una EPS por cada afiliado.",
  },
];
