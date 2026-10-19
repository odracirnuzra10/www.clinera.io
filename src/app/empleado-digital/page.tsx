import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EmpleadoDigitalLanding from "@/components/empleado-digital/EmpleadoDigitalLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  definedTermSetSchema,
  faqSchema,
  orgSchema,
  softwareSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { EMPLEADO_DIGITAL_FAQ } from "@/content/empleado-digital-faq";
import { EMPLEADO_DIGITAL_DEFINICION } from "@/content/empleado-digital-definicion";
import { ENTITY_PHRASE } from "@/content/entidad";
import styles from "./empleado-digital.module.css";

const TITLE = "Empleado digital para clínicas";
const DESCRIPTION =
  "Empleados digitales CAMILA (voz), AURA (WhatsApp) y LIA (orquestación) que ejecutan sobre la agenda de tu clínica 24/7: agendan, confirman, cobran y recuperan pacientes. Vortex USD 279/mes o Ecosistema USD 529/mes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/empleado-digital" },
  openGraph: {
    url: "https://www.clinera.io/empleado-digital",
    title: TITLE,
    description:
      "CAMILA llama, AURA atiende WhatsApp y LIA orquesta la operación. Tres empleados digitales con una sola memoria del paciente. Desde USD 279/mes.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera — empleado digital de IA para clínicas",
      },
    ],
  },
};

const definedTermJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "@id": "https://www.clinera.io/empleado-digital#term",
  name: "Empleado digital",
  description: EMPLEADO_DIGITAL_DEFINICION,
  url: "https://www.clinera.io/empleado-digital",
};

export default function EmpleadoDigitalPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          softwareSchema,
          webPageSchema({
            path: "/empleado-digital",
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io/" },
            {
              name: "Empleado digital",
              url: "https://www.clinera.io/empleado-digital",
            },
          ]),
          faqSchema(EMPLEADO_DIGITAL_FAQ),
          definedTermJsonLd,
          definedTermSetSchema,
        ]}
      />
      <p data-entity-phrase className="sr-only">
        {ENTITY_PHRASE}
      </p>
      <main className={styles.page}>
        <EmpleadoDigitalLanding />
        <PageUpdated path="/empleado-digital" />
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
                  lead_source: 'empleado_digital_landing',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/empleado-digital'
                });
                if (typeof fbq === 'function') {
                  fbq('track', 'InitiateCheckout', {
                    content_name: name,
                    content_category: 'landing_empleado_digital',
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
