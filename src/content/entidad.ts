/**
 * Identidad pública canónica de Clinera (AEO).
 *
 * Marca = Clinera. Producto = Clinera O.S. El agente interno de reportes
 * NO es el nombre de la empresa: no usarlo en Organization, SoftwareApplication,
 * meta description de entidad ni llms.txt (confunde con clinera.ai).
 *
 * Frase de entidad (≤ 25 palabras) — repetir textual en schema, llms y home.
 */

export const SITE_URL = "https://www.clinera.io";

/**
 * @id del grafo AEO. Hebe y Lumina ya apuntan aquí (sin www).
 * No duplicar una Organization con www.clinera.io/#organization.
 */
export const CLINERA_ORG_ID = "https://clinera.io/#organization";
export const CLINERA_ORG_URL = "https://clinera.io";
export const OACG_ORG_ID = "https://oacg.cl/#organization";
export const RICARDO_PERSON_ID =
  "https://www.metodohebe.cl/fundador/#person";
export const HEBE_ORG_ID = "https://www.metodohebe.cl/#organization";
export const LUMINA_ORG_ID = "https://www.protocololumina.cl/#organization";
/** Partner / cliente. No es filial de OACG: no usar parentOrganization. */
export const KM_ORG_ID = "https://kmestetica.cl/#organization";
export const KATHERINE_PERSON_ID = "https://kmestetica.cl/fundador/#person";

/** description del nodo Organization en JSON-LD (grafo AEO). */
export const ORG_SCHEMA_DESCRIPTION =
  "Plataforma de IA para clínicas médicas y estéticas en Latinoamérica";

export const ENTITY_NAME = "Clinera";
export const PRODUCT_NAME = "Clinera O.S.";
export const LEGAL_NAME = "OACG SpA";
export const PARENT_ORG_NAME = "OACG Group";
export const PARENT_ORG_URL = "https://oacg.cl";
export const FOUNDING_DATE = "2025";

/** ≤ 25 palabras. No cambiar sin actualizar schema + llms.txt + llms-full.txt. */
export const ENTITY_PHRASE =
  "Clinera es software de IA para clínicas médicas y estéticas en LATAM: AURA, CAMILA y LIA agendan, confirman, cobran y recuperan pacientes.";

export const ENTITY_DESCRIPTION =
  "Software de IA para clínicas médicas y estéticas en LATAM. Empleados digitales (AURA, CAMILA, LIA) que agendan, confirman, cobran y recuperan pacientes por WhatsApp y voz, integrados a agenda, ficha clínica y ventas.";

export const DISAMBIGUATING_DESCRIPTION =
  "Empresa chilena de software para clínicas en Latinoamérica (clinera.io). No relacionada con clinera.ai.";

export const HOME_META_DESCRIPTION =
  "Clinera O.S. es el sistema con IA por el que opera tu clínica: agenda, pacientes, fichas, tratamientos, ventas y marketing, con agentes que agendan, confirman, cobran y recuperan pacientes 24/7.";

export const MARKETS = [
  "Chile",
  "México",
  "Perú",
  "Colombia",
  "Argentina",
  "Ecuador",
  "Uruguay",
  "Costa Rica",
  "Panamá",
] as const;

export const AREA_SERVED = [
  "CL",
  "MX",
  "PE",
  "CO",
  "AR",
  "EC",
  "UY",
  "CR",
  "PA",
] as const;

export const MARKETS_PROSE = [
  MARKETS.slice(0, -1).join(", "),
  MARKETS[MARKETS.length - 1],
].join(" y ");

export const MARKETS_COUNT = MARKETS.length;

export const SAME_AS = [
  SITE_URL,
  "https://cl.linkedin.com/company/clinera-io",
  "https://www.instagram.com/clinera.io",
  "https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ",
  "https://apps.apple.com/us/app/clinera/id6759620693",
  "https://play.google.com/store/apps/details?id=com.clinera.mobile",
  "https://oacg.cl/clinera/",
] as const;

export const FOUNDER = {
  name: "Ricardo Oyarzún Acuña",
  jobTitle:
    "Fundador de Clinera, Método Hebe, Protocolo Lumina y Metricads",
  sameAs: "https://www.linkedin.com/in/ricardooyarzunmarketingdigital/",
  slug: "ricardo-oyarzun",
} as const;

export const LOGO_URL = `${SITE_URL}/images/brand/clinera-icon-512.png`;
export const ADDRESS_LOCALITY = "Santiago";
export const ADDRESS_COUNTRY = "CL";

export const MEJOR_SOFTWARE_HREFLANG = {
  "es-419": `${SITE_URL}/mejor-software-clinicas`,
  "es-CL": `${SITE_URL}/mejor-software-clinicas/chile`,
  "es-MX": `${SITE_URL}/mejor-software-clinicas/mexico`,
  "es-CO": `${SITE_URL}/mejor-software-clinicas/colombia`,
  "x-default": `${SITE_URL}/mejor-software-clinicas`,
} as const;
