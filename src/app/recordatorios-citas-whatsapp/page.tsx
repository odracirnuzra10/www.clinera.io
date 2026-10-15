import type { Metadata } from "next";
import { RECORDATORIOS } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/recordatorios-citas-whatsapp";

export const metadata: Metadata = {
  title: RECORDATORIOS.meta.title,
  description: RECORDATORIOS.meta.description,
  keywords: [...RECORDATORIOS.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: RECORDATORIOS.meta.title,
    description: RECORDATORIOS.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: RECORDATORIOS.meta.title,
    description: RECORDATORIOS.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={RECORDATORIOS} />;
}
