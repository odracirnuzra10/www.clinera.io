import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesV3 from "@/components/interior-v3/PlanesV3";
import TrialBanner from "@/components/cro/TrialBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  faqSchema,
  orgSchema,
  productPlansSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { PLANES_FAQ } from "@/content/planes-faq";

const TITLE = "Planes: anual con 20% OFF, desde USD 223/mes";
const DESCRIPTION =
  "Vortex, Atlas y Summit. El plan anual va primero a valor mensual (20% OFF: Vortex USD 223/mes). El mensual queda después, desde USD 279/mes. El primer cobro suma implementación USD 450.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/planes" },
  openGraph: {
    url: "https://www.clinera.io/planes",
    title: TITLE,
    description:
      "3 planes. El anual va primero, a valor mensual con 20% OFF. El mensual queda después. Implementación USD 450 en el primer cobro.",
    type: "website",
  },
};

export default function PlanesPage() {
  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          productPlansSchema,
          webPageSchema({
            path: "/planes",
            name: TITLE,
            description: DESCRIPTION,
          }),
          faqSchema(PLANES_FAQ),
        ]}
      />
      <main>
        <TrialBanner />
        <PlanesV3 />
        <PageUpdated path="/planes" />
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
