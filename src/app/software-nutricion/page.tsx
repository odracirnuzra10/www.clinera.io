import type { Metadata } from "next";
import { NUTRICION } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-nutricion";

export const metadata: Metadata = {
  title: NUTRICION.meta.title,
  description: NUTRICION.meta.description,
  keywords: [...NUTRICION.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: NUTRICION.meta.title,
    description: NUTRICION.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: NUTRICION.meta.title,
    description: NUTRICION.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={NUTRICION} />;
}
