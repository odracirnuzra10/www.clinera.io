import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import AppLandingV3 from "@/components/interior-v3/AppLandingV3";

export const metadata: Metadata = {
  title: "App móvil de Clinera 2.0 — iOS y Android | Clinera.io",
  description:
    "La nueva app de Clinera: rediseñada por completo, más rápida y sin errores. Agenda por sucursal, mensajería con plantillas de WhatsApp y chatbot, y toda tu clínica en el celular. Descárgala para iPhone y Android.",
  alternates: { canonical: "https://www.clinera.io/app" },
  openGraph: {
    url: "https://www.clinera.io/app",
    title: "App móvil de Clinera 2.0 — iOS y Android",
    description:
      "Rediseñada por completo, más rápida y sin errores. Agenda por sucursal, mensajería con plantillas de WhatsApp y chatbot. Descárgala para iPhone y Android.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "App móvil de Clinera 2.0",
      },
    ],
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Clinera",
  operatingSystem: "iOS, Android",
  applicationCategory: "BusinessApplication",
  description:
    "App de gestión clínica: agenda por sucursal, fichas de pacientes y mensajería con IA por WhatsApp para clínicas médicas y estéticas.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: "Clinera.io", url: "https://www.clinera.io" },
  downloadUrl: [
    "https://apps.apple.com/cl/app/clinera/id6759620693",
    "https://play.google.com/store/apps/details?id=com.clinera.mobile",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
    { "@type": "ListItem", position: 2, name: "App móvil", item: "https://www.clinera.io/app" },
  ],
};

export default function AppPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <AppLandingV3 />
      </main>
      <FooterV3 />
    </>
  );
}
