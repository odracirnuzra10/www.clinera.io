import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EmpleadoDigitalLanding from "@/components/empleado-digital/EmpleadoDigitalLanding";
import styles from "./empleado-digital.module.css";

export const metadata: Metadata = {
  title: "Empleado Digital IA para Clínicas — AURA y LIA | Clinera.io",
  description:
    "No es un chatbot. Es un empleado digital que ejecuta funciones: crea citas, re-agenda, consulta pagos, revisa sesiones. 24/7 por WhatsApp. Desde USD 279/mes. Plan Corporativo personalizado desde USD 1.900/mes.",
  alternates: { canonical: "https://www.clinera.io/empleado-digital" },
  openGraph: {
    url: "https://www.clinera.io/empleado-digital",
    title: "Empleado Digital IA para Clínicas — AURA y LIA | Clinera.io",
    description:
      "AURA ejecuta el 100% del trabajo de tu recepcionista por WhatsApp. LIA mantiene tu vacancia en 0%. Desde USD 279/mes.",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io — Empleado digital IA para clínicas",
      },
    ],
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io — Empleado digital IA para clínicas",
  description:
    "Empleado digital con IA para clínicas. Ejecuta funciones (agenda, re-agenda, consulta pagos, revisa sesiones) por WhatsApp 24/7. Planes desde USD 279/mes, Corporativo personalizado desde USD 1.900/mes.",
  brand: { "@type": "Brand", name: "Clinera.io" },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "279",
    highPrice: "1900",
    priceCurrency: "USD",
    offerCount: 4,
    availability: "https://schema.org/InStock",
    url: "https://www.clinera.io/empleado-digital",
    seller: { "@type": "Organization", name: "Clinera.io" },
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://www.clinera.io/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Empleado digital",
      item: "https://www.clinera.io/empleado-digital",
    },
  ],
};

export default function EmpleadoDigitalPage() {
  return (
    <>
      <NavV3 />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className={styles.page}>
        <EmpleadoDigitalLanding />
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
