import type { Metadata } from "next";
import { WHATSAPP_IA } from "@/components/software-vertical/content";
import SoftwareVerticalPage from "@/components/software-vertical/SoftwareVerticalPage";

const URL = "https://www.clinera.io/agendamiento-whatsapp-ia";

export const metadata: Metadata = {
  title: WHATSAPP_IA.meta.title,
  description: WHATSAPP_IA.meta.description,
  keywords: [...WHATSAPP_IA.meta.keywords],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: WHATSAPP_IA.meta.title,
    description: WHATSAPP_IA.meta.description,
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: WHATSAPP_IA.meta.title,
    description: WHATSAPP_IA.meta.description,
    images: ["/images/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return <SoftwareVerticalPage content={WHATSAPP_IA} />;
}
