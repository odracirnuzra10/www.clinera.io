import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import ReservaLanding from "@/components/reserva/ReservaLanding";

export const metadata: Metadata = {
  title: "Reserva tu cupo — Webinar Clinera",
  description:
    "Reserva tu cupo del próximo webinar semanal de Clinera. Cada jueves 16:00 hora Chile. Agrega el evento a tu calendario en un click y únete al grupo de WhatsApp para recibir el link cada semana.",
  alternates: { canonical: "https://www.clinera.io/reserva" },
  openGraph: {
    url: "https://www.clinera.io/reserva",
    title: "Reserva tu cupo — Webinar Clinera",
    description:
      "Cada jueves 16:00 hora Chile. Agrega el evento a tu calendario y únete al grupo.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Reserva tu cupo al webinar",
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
    url: "https://clinera.io",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.clinera.io/reserva",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://clinera.io/" },
    { "@type": "ListItem", position: 2, name: "Reserva tu cupo", item: "https://clinera.io/reserva" },
  ],
};

export default function ReservaPage() {
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
        <ReservaLanding />
      </main>
      <FooterV3 />
    </>
  );
}
