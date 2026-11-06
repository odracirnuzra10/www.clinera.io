import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesTrial from "@/components/planes-trial/PlanesTrial";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import { faqSchema, orgSchema, webPageSchema } from "@/components/seo/schemas";
import { SITE_URL } from "@/content/entidad";
import { PLANES_TRIAL, PLANES_TRIAL_DESDE, PLANES_TRIAL_FAQ } from "@/content/planes-trial";

// /planes (Ricardo, 7-nov-2026): prueba gratis de 7 días y después Flux · Hex · Xcale. La fuente
// es `planes-trial.ts`, la misma del home. /planes2 conserva el catálogo anterior (planes-nuevos.ts).
const TITLE = `Planes: prueba gratis y Flux, Hex y Xcale, desde US$ ${PLANES_TRIAL_DESDE}/mes`;
const DESCRIPTION = "Regístrate gratis y usa Clinera 7 días. Después eliges: Flux US$ 49/mes · Hex US$ 129/mes · Xcale US$ 149/mes. Sin costo de implementación.";

const planesSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  offers: PLANES_TRIAL.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: String(p.monthlyUsd),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/planes`,
    description: `${p.name}: US$ ${p.monthlyUsd}/mes. ${p.incluye.join(", ")}.`,
  })),
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/planes" },
  openGraph: {
    url: "https://www.clinera.io/planes",
    title: TITLE,
    description: DESCRIPTION,
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
          planesSchema,
          webPageSchema({ path: "/planes", name: TITLE, description: DESCRIPTION }),
          faqSchema([...PLANES_TRIAL_FAQ]),
        ]}
      />
      <main style={{ paddingTop: 72 }}>
        <PlanesTrial h1 />
        <section style={{ padding: "8px 16px 88px", background: "#fff" }} data-planes-faq>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>Preguntas frecuentes</h2>
            {PLANES_TRIAL_FAQ.map((f) => (
              <details key={f.q} style={{ borderTop: "1px solid #E5E7EB", padding: "16px 0" }}>
                <summary style={{ fontWeight: 700, fontSize: 17, cursor: "pointer" }}>{f.q}</summary>
                <p style={{ margin: "10px 0 0", color: "#4B5563", fontSize: 16, lineHeight: 1.6 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <PageUpdated path="/planes" />
      </main>
      <FooterV3 />
    </>
  );
}
