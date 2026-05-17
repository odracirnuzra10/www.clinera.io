import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import EmpleadoDigitalLanding from "@/components/empleado-digital/EmpleadoDigitalLanding";
import styles from "./empleado-digital.module.css";

export const metadata: Metadata = {
  title: "Empleado Digital IA para Clínicas — AURA y LIA",
  description:
    "Tu equipo de empleados digitales 24/7. AURA contesta WhatsApp, LIA decide a quién contactar. Plan Advanced desde USD 179/mes. Cancela cuando quieras.",
  alternates: { canonical: "https://clinera.io/empleado-digital" },
  openGraph: {
    url: "https://clinera.io/empleado-digital",
    title: "Empleado Digital IA para Clínicas — AURA y LIA | Clinera.io",
    description:
      "AURA contesta WhatsApp, LIA decide a quién contactar. Plan Advanced desde USD 179/mes.",
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
  name: "Clinera.io — Plan Advanced",
  description:
    "Plan Advanced de Clinera.io. 2000 conversaciones IA/mes, 15 usuarios, multi-sede, webhooks avanzados, soporte prioritario, acceso anticipado a LIA.",
  brand: { "@type": "Brand", name: "Clinera.io" },
  offers: {
    "@type": "Offer",
    price: "179",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://clinera.io/empleado-digital",
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
      item: "https://clinera.io/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Empleado digital",
      item: "https://clinera.io/empleado-digital",
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
