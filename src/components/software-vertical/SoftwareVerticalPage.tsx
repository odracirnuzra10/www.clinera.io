import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, orgSchema } from "@/components/seo/schemas";
import { PLANES } from "@/content/planes";
import type { SoftwareVerticalContent } from "./content";
import SoftwareVerticalLanding from "./SoftwareVerticalLanding";

const SITE = "https://www.clinera.io";

function softwareAppSchema(content: SoftwareVerticalContent) {
  const url = `${SITE}/${content.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: content.applicationName,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: content.applicationSubCategory,
    operatingSystem: "Web, iOS, Android",
    url,
    offers: PLANES.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: String(plan.monthlyUsd),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
    })),
    publisher: { "@id": `${SITE}/#organization` },
  };
}

export default function SoftwareVerticalPage({
  content,
}: {
  content: SoftwareVerticalContent;
}) {
  const url = `${SITE}/${content.slug}`;
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          softwareAppSchema(content),
          faqSchema(content.faqs),
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE}/` },
            { name: content.breadcrumbName, url },
          ]),
        ]}
      />
      <SoftwareVerticalLanding content={content} />
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
                  lead_source: '${content.leadSource}',
                  plan: plan,
                  content_name: name,
                  value: value,
                  currency: 'USD',
                  page_path: '/${content.slug}'
                });
                if (typeof fbq === 'function') {
                  fbq('track', 'InitiateCheckout', {
                    content_name: name,
                    content_category: '${content.contentCategory}',
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
