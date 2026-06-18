import type { Metadata } from "next";
import BloqueosDeck from "./BloqueosDeck";

export const metadata: Metadata = {
  title: { absolute: "Cuida tu WhatsApp — Clinera.io" },
  description:
    "Por qué un número de WhatsApp se puede bloquear y cómo Clinera protege el de tu clínica. Presentación en 5 pasos para clínicas.",
  alternates: { canonical: "https://www.clinera.io/bloqueos" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.clinera.io/bloqueos",
    siteName: "Clinera.io",
    title: "Cuida tu WhatsApp — Clinera.io",
    description:
      "Por qué un número de WhatsApp se bloquea y cómo Clinera protege el de tu clínica.",
  },
};

export default function BloqueosPage() {
  return <BloqueosDeck />;
}
