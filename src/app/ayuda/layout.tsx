import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda — Clinera.io",
  description:
    "¿Necesitas ayuda con Clinera? Explora nuestra base de conocimiento, tutoriales en video y FAQ para dominar la IA de agendamiento en WhatsApp.",
  alternates: { canonical: "https://www.clinera.io/ayuda" },
  openGraph: {
    url: "https://www.clinera.io/ayuda",
    title: "Centro de Ayuda — Clinera.io",
    description: "Tutoriales, FAQ y soporte para Clinera.",
    type: "website",
  },
};

export default function AyudaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
