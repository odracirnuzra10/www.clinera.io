import type { Metadata } from "next";
import { KINESIOLOGIA } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/software-kinesiologia";

export const metadata: Metadata = {
  title: KINESIOLOGIA.meta.title,
  description: KINESIOLOGIA.meta.description,
  keywords: [...KINESIOLOGIA.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: KINESIOLOGIA.meta.title,
    description: KINESIOLOGIA.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: KINESIOLOGIA.meta.title,
    description: KINESIOLOGIA.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={KINESIOLOGIA} />;
}
