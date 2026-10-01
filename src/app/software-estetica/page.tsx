import type { Metadata } from "next";
import { ESTETICA } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-estetica";

export const metadata: Metadata = {
  title: ESTETICA.meta.title,
  description: ESTETICA.meta.description,
  keywords: [...ESTETICA.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: ESTETICA.meta.title,
    description: ESTETICA.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: ESTETICA.meta.title,
    description: ESTETICA.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={ESTETICA} />;
}
