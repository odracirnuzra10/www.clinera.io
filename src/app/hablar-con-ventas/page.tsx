import type { Metadata } from "next";
import type { CSSProperties } from "react";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import VentasLanding from "@/components/ventas/VentasLanding";

export const metadata: Metadata = {
  title: "Hablar con ventas — Clinera.io",
  description:
    "30 min con el equipo comercial de Clinera. IA que opera la agenda de todo tu equipo y todas tus sedes por WhatsApp 24/7.",
  alternates: { canonical: "https://www.clinera.io/hablar-con-ventas" },
  openGraph: { url: "https://www.clinera.io/hablar-con-ventas" },
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

export default function HablarConVentasPage() {
  return (
    <>
      <NavV3 />
      <main>
        <h1 style={srOnly}>Hablemos: ¿cómo te puede ayudar Clinera?</h1>
        <VentasLanding enableMigrationQualification />
      </main>
      <FooterV3 />
    </>
  );
}
