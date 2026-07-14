import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Analytics from "@/components/Analytics";
import StickyMobileCTA from "@/components/cro/StickyMobileCTA";
import GclidCapture from "@/components/GclidCapture";
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clinera.io"),
  title: {
    default: "Clinera.io | Software de IA para Clínicas",
    template: "%s | Clinera.io",
  },
  description:
    "Agenda pacientes con IA las 24 horas. Clinera responde, agenda y confirma citas por ti 24/7 con inteligencia artificial.",
  keywords: [
    "software medico",
    "software para clinicas",
    "agendamiento con IA",
    "WhatsApp clinica",
    "gestion clinica",
    "inteligencia artificial clinica",
    "agenda medica",
    "ficha clinica digital",
    "software dental",
    "software estetica",
    "clinera",
  ],
  authors: [{ name: "Clinera.io" }],
  creator: "Clinera.io",
  publisher: "Clinera.io",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.clinera.io",
    siteName: "Clinera.io",
    title: "Clinera.io | Software de IA para Clínicas",
    description:
      "AURA agenda, re-agenda y atiende pacientes por WhatsApp 24/7. +52 clínicas en LATAM. Desde USD 279/mes, sin permanencia.",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera.io - Software de IA para Clínicas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clinera.io | Software de IA para Clínicas",
    description:
      "AURA agenda, re-agenda y atiende pacientes por WhatsApp 24/7. +52 clínicas en LATAM. Desde USD 279/mes, sin permanencia.",
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

        {children}

        <StickyMobileCTA />

        <Analytics />
      </body>
    </html>
  );
}
