import { CLINERA_PLANS } from "@/content/pricing";
import { pageDate } from "@/content/page-dates";
import {
  ADDRESS_COUNTRY,
  ADDRESS_LOCALITY,
  AREA_SERVED,
  CLINERA_ORG_ID,
  CLINERA_ORG_URL,
  DISAMBIGUATING_DESCRIPTION,
  ENTITY_NAME,
  FOUNDER,
  FOUNDING_DATE,
  HEBE_ORG_ID,
  HOME_META_DESCRIPTION,
  LEGAL_NAME,
  LOGO_URL,
  LUMINA_ORG_ID,
  OACG_ORG_ID,
  ORG_SCHEMA_DESCRIPTION,
  PARENT_ORG_NAME,
  PARENT_ORG_URL,
  PRODUCT_NAME,
  RICARDO_PERSON_ID,
  SAME_AS,
  SITE_URL,
} from "@/content/entidad";

export {
  CLINERA_ORG_ID,
  HEBE_ORG_ID,
  LUMINA_ORG_ID,
  OACG_ORG_ID,
  RICARDO_PERSON_ID,
  SITE_URL,
};

export const oacgOrgNode = {
  "@type": "Organization" as const,
  "@id": OACG_ORG_ID,
  name: "OACG",
  legalName: LEGAL_NAME,
  alternateName: PARENT_ORG_NAME,
  url: PARENT_ORG_URL,
};

export const ricardoPersonNode = {
  "@type": "Person" as const,
  "@id": RICARDO_PERSON_ID,
  name: "Ricardo Oyarzún",
  jobTitle: "Creador de Clinera, fundador de Método Hebe y Protocolo Lumina",
  alumniOf: {
    "@type": "CollegeOrUniversity" as const,
    name: "Universidad de Concepción",
  },
  url: "https://www.metodohebe.cl/fundador/",
  sameAs: [FOUNDER.sameAs, `${SITE_URL}/equipo#${FOUNDER.slug}`],
  worksFor: { "@id": CLINERA_ORG_ID },
};

export const clineraOrgNode = {
  "@type": "Organization" as const,
  "@id": CLINERA_ORG_ID,
  name: ENTITY_NAME,
  alternateName: ["Clinera.io", PRODUCT_NAME],
  legalName: LEGAL_NAME,
  url: CLINERA_ORG_URL,
  logo: LOGO_URL,
  description: ORG_SCHEMA_DESCRIPTION,
  disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
  foundingDate: FOUNDING_DATE,
  founder: { "@id": RICARDO_PERSON_ID },
  parentOrganization: { "@id": OACG_ORG_ID },
  address: {
    "@type": "PostalAddress" as const,
    addressCountry: ADDRESS_COUNTRY,
    addressLocality: ADDRESS_LOCALITY,
  },
  areaServed: [...AREA_SERVED],
  sameAs: [...SAME_AS],
  knowsAbout: [
    "empleado digital",
    "agendamiento con IA",
    "ficha clínica electrónica",
    "WhatsApp Business API",
  ],
};

export const orgSchema = {
  "@context": "https://schema.org",
  ...clineraOrgNode,
};

/** Grafo AEO en layout: OACG + Clinera + Ricardo (un solo Person, @id de Hebe). */
export const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [oacgOrgNode, clineraOrgNode, ricardoPersonNode],
};

/** Un Offer por plan (mensual), misma fuente que `/planes`. */
export const softwareOffers = CLINERA_PLANS.map((plan) => ({
  "@type": "Offer" as const,
  name: plan.name,
  price: String(plan.monthlyPrice),
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  url: `${SITE_URL}/planes`,
  description: `${plan.name}: USD ${plan.monthlyPrice}/mes; implementación USD 450 con el primer cobro. No incluye IVA.`,
}));

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: PRODUCT_NAME,
  alternateName: ENTITY_NAME,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Medical Practice Management",
  operatingSystem: "Web, iOS, Android",
  description: HOME_META_DESCRIPTION,
  url: SITE_URL,
  offers: softwareOffers,
  publisher: { "@id": CLINERA_ORG_ID },
  brand: { "@type": "Brand", name: ENTITY_NAME },
};

export const productPlansSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: PRODUCT_NAME,
  description: HOME_META_DESCRIPTION,
  brand: { "@type": "Brand", name: ENTITY_NAME },
  offers: softwareOffers,
};

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const videoObjectSchema = (v: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl: string;
  contentUrl?: string;
  transcript?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.name,
  description: v.description,
  thumbnailUrl: v.thumbnailUrl,
  uploadDate: v.uploadDate,
  embedUrl: v.embedUrl,
  ...(v.contentUrl && { contentUrl: v.contentUrl }),
  ...(v.transcript && { transcript: v.transcript }),
  publisher: { "@id": CLINERA_ORG_ID },
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

export const webPageSchema = (opts: {
  path: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) => {
  const dates = pageDate(opts.path);
  const url = `${SITE_URL}${opts.path === "/" ? "/" : opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    datePublished: opts.datePublished ?? dates.published,
    dateModified: opts.dateModified ?? dates.modified,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": CLINERA_ORG_ID },
    publisher: { "@id": CLINERA_ORG_ID },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-entity-phrase]"],
    },
  };
};

export const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/#definiciones`,
  name: "Glosario Clinera",
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/empleado-digital#term`,
      name: "empleado digital",
      url: `${SITE_URL}/empleado-digital`,
    },
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/blog/modo-agentic-agendamiento-ia-clinicas#term`,
      name: "modo Agentic",
      url: `${SITE_URL}/blog/modo-agentic-agendamiento-ia-clinicas`,
    },
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/blog/creditos-clinera-como-funcionan-costos-planes#term`,
      name: "crédito Clinera",
      url: `${SITE_URL}/blog/creditos-clinera-como-funcionan-costos-planes`,
    },
  ],
};

export const KNOWN_AUTHORS: Record<
  string,
  {
    name: string;
    jobTitle: string;
    sameAs: string[];
    description?: string;
    slug: string;
  }
> = {
  "Ricardo Oyarzún": {
    name: "Ricardo Oyarzún",
    jobTitle: "Co-fundador y Head of Growth, Clinera",
    slug: "ricardo-oyarzun",
    sameAs: ["https://www.linkedin.com/in/ricardooyarzunmarketingdigital/"],
    description:
      "Marketing digital para clínicas en LATAM. Co-fundador de Clinera, Método Hebe y Protocolo Lumina.",
  },
  "Mauricio López": {
    name: "Mauricio López",
    jobTitle: "Operaciones y producto, Clinera",
    slug: "mauricio-lopez",
    sameAs: ["https://www.linkedin.com/in/mauro-l%C3%B3pez-5b5642179/"],
    description:
      "Operaciones y producto en Clinera, con foco en agenda inteligente, ficha clínica electrónica e implementación en clínicas LATAM.",
  },
};

export const personSchema = (key: string) => {
  const known =
    KNOWN_AUTHORS[key] ??
    Object.values(KNOWN_AUTHORS).find((a) => a.slug === key);
  if (!known) return null;
  if (known.slug === FOUNDER.slug) {
    return {
      "@context": "https://schema.org",
      ...ricardoPersonNode,
      description: known.description,
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/equipo#${known.slug}`,
    name: known.name,
    jobTitle: known.jobTitle,
    sameAs: known.sameAs,
    description: known.description,
    worksFor: { "@id": CLINERA_ORG_ID },
    url: `${SITE_URL}/equipo#${known.slug}`,
  };
};

export const blogPostingSchema = (post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) => {
  const known = post.authorName ? KNOWN_AUTHORS[post.authorName] : undefined;
  const author = known
    ? known.slug === FOUNDER.slug
      ? { "@id": RICARDO_PERSON_ID }
      : {
          "@type": "Person",
          "@id": `${SITE_URL}/equipo#${known.slug}`,
          name: known.name,
          jobTitle: known.jobTitle,
          sameAs: known.sameAs,
          ...(known.description && { description: known.description }),
          worksFor: { "@id": CLINERA_ORG_ID },
        }
    : {
        "@type": post.authorName ? "Person" : "Organization",
        name: post.authorName || ENTITY_NAME,
      };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#post`,
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author,
    publisher: { "@id": CLINERA_ORG_ID },
    ...(post.image && {
      image: post.image.startsWith("http")
        ? post.image
        : `${SITE_URL}${post.image}`,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
};

export const medicalBusinessSchema = (clinic: {
  slug: string;
  name: string;
  city: string;
  region: string;
  countryCode: "CL" | "PE" | "CO" | "MX" | "AR" | "EC" | "PA";
  address?: string;
  phone?: string;
  whatsapp?: string;
  specialties: string[];
  hours?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/clinicas/${clinic.slug}#business`,
  name: clinic.name,
  url: `${SITE_URL}/clinicas/${clinic.slug}`,
  ...(clinic.phone && { telephone: clinic.phone }),
  ...(clinic.address && {
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressLocality: clinic.city,
      addressRegion: clinic.region,
      addressCountry: clinic.countryCode,
    },
  }),
  medicalSpecialty: clinic.specialties,
  ...(clinic.hours && { openingHours: clinic.hours }),
});

export const reviewSchema = (r: {
  author: string;
  clinic: string;
  quote: string;
  rating?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  reviewRating: {
    "@type": "Rating",
    ratingValue: r.rating || 5,
    bestRating: 5,
  },
  author: { "@type": "Person", name: r.author, affiliation: r.clinic },
  reviewBody: r.quote,
  itemReviewed: { "@id": `${SITE_URL}/#software` },
});

export const caseStudySchema = (opts: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  mentions: { "@id": string }[];
  image?: {
    url: string;
    width: number;
    height: number;
    caption: string;
  };
}) => {
  const url = `${SITE_URL}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#casestudy`,
    headline: opts.headline,
    description: opts.description,
    url,
    inLanguage: "es-CL",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@id": CLINERA_ORG_ID },
    publisher: { "@id": CLINERA_ORG_ID },
    about: { "@id": CLINERA_ORG_ID },
    mentions: opts.mentions,
    ...(opts.image
      ? {
          image: {
            "@type": "ImageObject" as const,
            url: opts.image.url,
            width: opts.image.width,
            height: opts.image.height,
            caption: opts.image.caption,
          },
        }
      : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
};
