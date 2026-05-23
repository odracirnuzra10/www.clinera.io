import type { Metadata } from "next";
import type { CSSProperties } from "react";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import ReunionLanding from "@/components/reunion/ReunionLanding";

export const metadata: Metadata = {
  title: "Agenda tu reunión — Clinera.io",
  description:
    "30 minutos con el equipo de Clinera. Califica tu situación y elige horario en pocos pasos. Te confirmamos por email.",
  alternates: { canonical: "https://www.clinera.io/reunion" },
  openGraph: {
    title: "Agenda tu reunión — Clinera.io",
    description:
      "30 minutos con el equipo de Clinera. Te confirmamos por email.",
    url: "https://www.clinera.io/reunion",
    type: "website",
  },
};

const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export default function ReunionPage() {
  return (
    <>
      <NavV3 />
      <main>
        <h1 style={srOnly}>Agenda tu reunión con Clinera</h1>
        <ReunionLanding enableMigrationQualification />
      </main>
      <FooterV3 />
    </>
  );
}
