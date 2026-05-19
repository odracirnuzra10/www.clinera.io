import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import TrialBanner from "@/components/cro/TrialBanner";

export const metadata: Metadata = {
  title: "Planes y Precios — Clinera.io (desde USD 129/mes)",
  description:
    "Core USD 129/mes (~200 conv.), Conect USD 179/mes (~400 conv. + modo automático), Advanced USD 358/mes (~1.200 conv. + modo automático). AURA agenda por WhatsApp 24/7. Sin permanencia.",
  alternates: { canonical: "https://clinera.io/planes" },
  openGraph: {
    url: "https://clinera.io/planes",
    title: "Planes y Precios — Clinera.io",
    description:
      "3 planes para clínicas en LATAM. Desde USD 129/mes, sin permanencia.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io",
  description: "Software de IA para clínicas",
  offers: [
    { "@type": "Offer", name: "Core",     price: "129", priceCurrency: "USD", url: "https://clinera.io/planes" },
    { "@type": "Offer", name: "Conect",   price: "179", priceCurrency: "USD", url: "https://clinera.io/planes" },
    { "@type": "Offer", name: "Advanced", price: "358", priceCurrency: "USD", url: "https://clinera.io/planes" },
  ],
};

export default function PlanesPage() {
  return (
    <>
      <NavV3 />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <TrialBanner />
        <PlanesV3 />
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
                  lead_source: 'planes_landing',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/planes'
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
