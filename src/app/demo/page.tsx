import type { Metadata } from "next";
import Script from "next/script";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import DemoV3 from "@/components/interior-v3/DemoV3";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  orgSchema,
  softwareSchema,
  videoObjectSchema,
  webPageSchema,
} from "@/components/seo/schemas";

const TITLE = "Demo en vivo: agente IA para clínicas";
const DESCRIPTION =
  "Ve en acción el agente de IA para clínicas de Clinera. Software médico con IA para agendamiento, WhatsApp y gestión clínica. Alternativa a AgendaPro, Dentalink, Medilink y DentalSoft.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "agente IA para WhatsApp",
    "software médico con IA",
    "software de agendamiento con IA",
    "Clinera",
    "alternativa AgendaPro",
    "alternativa Dentalink",
    "alternativa DentalSoft",
    "alternativa Medilink",
    "IA para clínicas",
    "sistema de agendamiento inteligente",
    "CRM médico LATAM",
  ],
  alternates: { canonical: "https://www.clinera.io/demo" },
  openGraph: {
    title: TITLE,
    description:
      "Software médico con IA para agendamiento automático y atención por WhatsApp. Demo interactiva.",
    url: "https://www.clinera.io/demo",
    siteName: "Clinera",
    type: "website",
    images: [{ url: "https://www.clinera.io/og-demo.png", width: 1200, height: 630, alt: "Demo de Clinera O.S." }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Agente IA para clínicas: WhatsApp, agendamiento y gestión con IA. Ve la demo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DemoPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          softwareSchema,
          webPageSchema({
            path: "/demo",
            name: TITLE,
            description: DESCRIPTION,
          }),
          videoObjectSchema({
            name: "Demo | Clinera.io",
            description:
              "Demostración en vivo del agente IA de Clinera para clínicas: agendamiento automático por WhatsApp, gestión de pacientes y automatización clínica.",
            thumbnailUrl: "https://www.clinera.io/og-demo.png",
            uploadDate: "2026-05-01",
            embedUrl: "https://player.vimeo.com/video/1229275734?h=6bb3791685",
          }),
        ]}
      />
      <main>
        <DemoV3 />
      </main>
      <FooterV3 />
      <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" />
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
