import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Analytics from "@/components/Analytics";
import StickyMobileCTA from "@/components/cro/StickyMobileCTA";
import GclidCapture from "@/components/GclidCapture";
import { PriceModalityProvider } from "@/components/pricing/PriceModalityProvider";
import SkipLink from "@/components/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { entityGraph } from "@/components/seo/schemas";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clinera.io"),
  title: {
    default: "Clinera | Software de IA para clínicas",
    template: "%s | Clinera",
  },
  description:
    "Clinera es software de IA para clínicas médicas y estéticas en LATAM: AURA, CAMILA y LIA agendan, confirman, cobran y recuperan pacientes.",
  keywords: [
    "agendamiento con IA",
    "WhatsApp clinica",
    "gestion clinica",
    "inteligencia artificial clinica",
    "agenda medica",
    "ficha clinica digital",
    "software estetica",
    "clinera",
  ],
  authors: [{ name: "Clinera" }],
  creator: "Clinera",
  publisher: "Clinera",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.clinera.io",
    siteName: "Clinera",
    title: "Clinera | Software de IA para clínicas",
    description:
      "AURA agenda, re-agenda y atiende pacientes por WhatsApp 24/7. +52 clínicas en LATAM. Desde USD 279/mes.",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera — software de IA para clínicas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clinera | Software de IA para clínicas",
    description:
      "AURA agenda, re-agenda y atiende pacientes por WhatsApp 24/7. +52 clínicas en LATAM. Desde USD 279/mes.",
    images: ["/images/og-banner.png"],
  },
  // icons handled automatically by Next.js (src/app/icon.png + apple-icon.png)
  alternates: {
    canonical: "https://www.clinera.io",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="llms-txt" href="https://www.clinera.io/llms.txt" />
        <JsonLd data={entityGraph} />
      </head>
      <body>
        <SkipLink />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NXT8BGS9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <GclidCapture />

        <PriceModalityProvider>{children}</PriceModalityProvider>

        <StickyMobileCTA />

        <Analytics />
      </body>
    </html>
  );
}
