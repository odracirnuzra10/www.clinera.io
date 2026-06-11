import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import DemoV3 from "@/components/interior-v3/DemoV3";

export const metadata: Metadata = {
  title: {
    absolute: "Demo en vivo — Clinera.io | Agente IA para clínicas con WhatsApp",
  },
  description:
    "Ve en acción el agente de IA para clínicas de Clinera.io. Software médico con IA para agendamiento, WhatsApp y gestión clínica. Alternativa a AgendaPro, Dentalink, Medilink y DentalSoft.",
  keywords: [
    "agente IA para WhatsApp",
    "software médico con IA",
    "software de agendamiento con IA",
    "Clinera.io",
    "alternativa AgendaPro",
    "alternativa Dentalink",
    "alternativa DentalSoft",
    "alternativa Medilink",
    "chatbot para clínicas",
    "IA para clínicas",
    "sistema de agendamiento inteligente",
    "CRM médico LATAM",
  ],
  alternates: { canonical: "https://clinera.io/demo" },
  openGraph: {
    title: "Demo en vivo — Clinera.io | Agente IA para clínicas",
    description:
      "Software médico con IA para agendamiento automático y atención por WhatsApp. Demo interactiva.",
    url: "https://clinera.io/demo",
    siteName: "Clinera.io",
    type: "website",
    images: [{ url: "https://clinera.io/og-demo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Demo en vivo — Clinera.io",
    description: "Agente IA para clínicas: WhatsApp, agendamiento y gestión con IA. Ve la demo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clinera.io",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clinera.io",
  description:
    "Agente de IA para clínicas médicas y estéticas en LATAM. Automatiza agendamiento, WhatsApp y gestión clínica. Alternativa a AgendaPro, Dentalink, Medilink y DentalSoft.",
  offers: {
    "@type": "Offer",
    price: "129",
    priceCurrency: "USD",
    priceValidUntil: "2026-12-31",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "326",
  },
  provider: {
    "@type": "Organization",
    name: "OACG Group",
    url: "https://clinera.io",
  },
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Presentación + Demo | Clinera.io",
  description:
    "Demostración en vivo del agente IA de Clinera.io para clínicas: agendamiento automático por WhatsApp, gestión de pacientes y automatización clínica.",
  embedUrl: "https://player.vimeo.com/video/1199567468",
  uploadDate: "2026-05-01",
  thumbnailUrl: "https://clinera.io/og-demo.png",
};

export default function DemoPage() {
  return (
    <>
      <NavV3 />
      <main>
        <DemoV3 />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      </main>
      <FooterV3 />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              window.dataLayer = window.dataLayer || [];
              document.addEventListener('click', function(ev){
                var a = ev.target.closest('a[data-plan]');
                if (!a) return;
                var plan = a.getAttribute('data-plan');
                var name = a.getAttribute('data-plan-name') || (plan + ' signup');
                var value = parseFloat(a.getAttribute('data-plan-value') || '0');
                window.dataLayer.push({
                  event: 'initiate_checkout',
                  lead_source: 'demo_landing',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/demo'
                });
                if (typeof fbq === 'function') {
                  fbq('track', 'InitiateCheckout', {
                    content_name: name,
                    content_category: 'landing_register',
                    content_type: 'product',
                    currency: 'USD',
                    value: value
                  });
                }
              }, { capture: true });
            })();
          `,
        }}
      />
    </>
  );
}
