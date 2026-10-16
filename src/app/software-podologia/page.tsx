import type { Metadata } from "next";
import { PODOLOGIA } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-podologia";

export const metadata: Metadata = {
  title: PODOLOGIA.meta.title,
  description: PODOLOGIA.meta.description,
  keywords: [...PODOLOGIA.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: PODOLOGIA.meta.title,
    description: PODOLOGIA.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: PODOLOGIA.meta.title,
    description: PODOLOGIA.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={PODOLOGIA} />;
}
