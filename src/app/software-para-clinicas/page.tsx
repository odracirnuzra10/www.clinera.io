import type { Metadata } from "next";
import { CLINICAS } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-para-clinicas";

export const metadata: Metadata = {
  title: CLINICAS.meta.title,
  description: CLINICAS.meta.description,
  keywords: [...CLINICAS.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: CLINICAS.meta.title,
    description: CLINICAS.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: CLINICAS.meta.title,
    description: CLINICAS.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={CLINICAS} />;
}
