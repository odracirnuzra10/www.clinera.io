import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import WebinarsLanding from "@/components/webinars/WebinarsLanding";

export const metadata: Metadata = {
  title: "Webinar semanal — Empleados digitales para clínicas | Clinera.io",
  description:
    "Cada semana mostramos en vivo cómo AURA atiende, agenda y cobra por WhatsApp 24/7. Sin costo, sin compromiso. Únete al grupo y participa del próximo webinar.",
  alternates: { canonical: "https://www.clinera.io/webinars" },
  openGraph: {
    url: "https://www.clinera.io/webinars",
    title: "Webinar semanal — Empleados digitales para clínicas",
    description:
      "AURA atiende, agenda y cobra por WhatsApp 24/7. Únete al grupo y participa del próximo webinar gratis.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Webinar semanal",
      },
    ],
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Webinar semanal — Empleados digitales con IA para clínicas",
  description:
    "Webinar semanal en vivo donde mostramos cómo Clinera y AURA hacen que una clínica opere 24/7 con IA. Sin costo. Cada jueves 16:00 hora Chile.",
  startDate: "2026-05-28T16:00:00-04:00",
  endDate: "2026-05-28T17:00:00-04:00",
  eventSchedule: {
    "@type": "Schedule",
    repeatFrequency: "P1W",
    byDay: "https://schema.org/Thursday",
    startTime: "16:00:00",
    endTime: "17:00:00",
    scheduleTimezone: "America/Santiago",
  },
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "VirtualLocation",
    url: "https://meet.google.com/kye-abrq-qwj",
  },
  organizer: {
    "@type": "Organization",
    name: "Clinera.io",
    url: "https://www.clinera.io",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.clinera.io/webinars",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Webinars", item: "https://www.clinera.io/webinars" },
  ],
};

export default function WebinarsPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <WebinarsLanding />
      </main>
      <FooterV3 />
    </>
  );
}
