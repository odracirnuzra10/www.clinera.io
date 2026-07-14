const SITE_URL = "https://www.clinera.io";

export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Clinera",
  legalName: "OACG SpA",
  url: SITE_URL,
  logo: `${SITE_URL}/clinera-logo2.png`,
  description:
    "AURA, la IA que agenda pacientes por WhatsApp 24/7 para clínicas médicas y estéticas en LATAM.",
  foundingDate: "2025",
  founders: [{ "@type": "Person", name: "Ricardo Oyarzún Acuña" }],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: ["Spanish"],
    areaServed: ["CL", "PE", "CO", "MX", "AR", "EC", "UY", "CR", "PA"],
  },
  sameAs: [
    "https://www.linkedin.com/company/clinera-io",
    "https://www.instagram.com/clinera.io",
  ],
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "Clinera AURA",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Medical Practice Management",
  operatingSystem: "Web, iOS, Android",
  offers: [
    {
      "@type": "Offer",
      name: "Vortex",
      price: "279",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/planes`,
    },
    {
      "@type": "Offer",
      name: "Atlas",
      price: "379",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/planes`,
    },
    {
      "@type": "Offer",
      name: "Summit",
      price: "479",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/planes`,
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "52",
    bestRating: "5",
  },
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const productPlansSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera AURA",
  description:
    "Software de IA para clínicas médicas y estéticas: agenda por WhatsApp, fichas clínicas, consentimientos, recordatorios.",
  brand: { "@type": "Brand", name: "Clinera" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "279",
    highPrice: "479",
    offerCount: "3",
    offers: [
      {
        "@type": "Offer",
        name: "Vortex",
        price: "279",
        priceCurrency: "USD",
        url: `${SITE_URL}/planes`,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Atlas",
        price: "379",
        priceCurrency: "USD",
        url: `${SITE_URL}/planes`,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Summit",
        price: "479",
        priceCurrency: "USD",
        url: `${SITE_URL}/planes`,
        availability: "https://schema.org/InStock",
      },
    ],
  },
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
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.name,
  description: v.description,
  thumbnailUrl: v.thumbnailUrl,
  uploadDate: v.uploadDate,
  embedUrl: v.embedUrl,
  ...(v.contentUrl && { contentUrl: v.contentUrl }),
  publisher: { "@id": `${SITE_URL}/#organization` },
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

// Catalogo de autores reales con credenciales + sameAs (LinkedIn). E-E-A-T.
// Cuando se firma un post con uno de estos nombres, el Schema BlogPosting
// emite Person enriquecido en lugar de un string plano.
export const KNOWN_AUTHORS: Record<
  string,
  {
    name: string;
    jobTitle: string;
    sameAs: string[];
    description?: string;
  }
> = {
  "Ricardo Oyarzún": {
    name: "Ricardo Oyarzún",
    jobTitle: "Co-fundador y Head of Growth, Clinera",
    sameAs: [
      "https://www.linkedin.com/in/ricardooyarzunmarketingdigital/",
    ],
    description:
      "Marketing digital para clínicas en LATAM. Co-fundador de Clinera, Método Hebe y Protocolo Lumina.",
  },
  "Mauricio López": {
    name: "Mauricio López",
    jobTitle: "Operaciones y producto, Clinera",
    sameAs: [
      "https://www.linkedin.com/in/mauro-l%C3%B3pez-5b5642179/",
    ],
    description:
      "Operaciones y producto en Clinera, con foco en agenda inteligente, ficha clínica electrónica e implementación en clínicas LATAM.",
  },
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
    ? {
        "@type": "Person",
        name: known.name,
        jobTitle: known.jobTitle,
        sameAs: known.sameAs,
        ...(known.description && { description: known.description }),
        worksFor: { "@id": `${SITE_URL}/#organization` },
      }
    : {
        "@type": post.authorName ? "Person" : "Organization",
        name: post.authorName || "Clinera",
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
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(post.image && {
      image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
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
