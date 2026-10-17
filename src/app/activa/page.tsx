import type { Metadata } from "next";
import ActivaLanding from "@/components/activa/ActivaLanding";

const TITLE = "Activa tu cuenta de Clinera";

// Landing informativa de los 3 planes (17-oct-2026) para anuncios y envíos. Todos los CTA van a /go.
// Interna hasta que Ricardo la apruebe: noindex, Disallow en robots-txt.ts y fuera del sitemap.
export const metadata: Metadata = {
  title: TITLE,
  description: "Agenda, fichas y tus mensajes de WhatsApp, Facebook e Instagram en un solo lugar. Desde USD 17 al mes.",
  alternates: { canonical: "https://www.clinera.io/activa" },
  robots: { index: false, follow: false },
};

export default function ActivaPage() {
  return <ActivaLanding />;
}
