import type { Metadata } from "next";
import DemoWizard from "@/components/DemoWizard";

export const metadata: Metadata = {
  title: "Agenda tu demostración — Clinera.io",
  description:
    "Elige tu plan, agenda tu hora y un especialista te guía paso a paso. Demostración personalizada de 30 minutos.",
  alternates: { canonical: "https://www.clinera.io/contacto" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Agenda tu demostración — Clinera.io",
    description:
      "30 min con un especialista. Elige tu plan y horario.",
    url: "https://www.clinera.io/contacto",
    type: "website",
  },
};

export default function ContactoPage() {
  return (
    <main>
      <DemoWizard />
    </main>
  );
}
