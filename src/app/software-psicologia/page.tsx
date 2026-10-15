import type { Metadata } from "next";
import { PSICOLOGIA } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-psicologia";

export const metadata: Metadata = {
  title: PSICOLOGIA.meta.title,
  description: PSICOLOGIA.meta.description,
  keywords: [...PSICOLOGIA.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: PSICOLOGIA.meta.title,
    description: PSICOLOGIA.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: PSICOLOGIA.meta.title,
    description: PSICOLOGIA.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={PSICOLOGIA} />;
}
