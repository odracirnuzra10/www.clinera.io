import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import HomeV3 from "@/components/home-v3/HomeV3";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  definedTermSetSchema,
  faqSchema,
  orgSchema,
  softwareSchema,
  videoObjectSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import { DEMO_VIDEO } from "@/content/demo-video";
import { PageUpdated } from "@/components/seo/PageUpdated";
import { HOME_FAQ } from "@/content/home-faq";
import {
  ENTITY_PHRASE,
  HOME_META_DESCRIPTION,
  PRODUCT_NAME,
} from "@/content/entidad";

export const metadata: Metadata = {
  title: { absolute: `${PRODUCT_NAME} | Software de IA para tu clínica` },
  description: HOME_META_DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/" },
  openGraph: {
    url: "https://www.clinera.io/",
    title: `${PRODUCT_NAME} — el sistema operativo de tu clínica`,
    description: HOME_META_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          softwareSchema,
          webPageSchema({
            path: "/",
            name: `${PRODUCT_NAME} | Software de IA para tu clínica`,
            description: HOME_META_DESCRIPTION,
          }),
          definedTermSetSchema,
          faqSchema(HOME_FAQ),
          videoObjectSchema({
            name: DEMO_VIDEO.title,
            description: HOME_META_DESCRIPTION,
            thumbnailUrl: "https://www.clinera.io/og-demo.png",
            uploadDate: "2026-05-01",
            embedUrl: DEMO_VIDEO.embedUrl,
          }),
        ]}
      />
      <p data-entity-phrase className="sr-only">
        {ENTITY_PHRASE}
      </p>
      <NavV3 />
      <main>
        <HomeV3 />
        <PageUpdated path="/" />
      </main>
      <FooterV3 />
    </>
  );
}
