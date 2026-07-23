import type { Metadata } from "next";
import type { CSSProperties } from "react";
import VentasLanding from "@/components/ventas/VentasLanding";

export const metadata: Metadata = {
  title: "Agenda una reunión comercial — Clinera.io",
  description:
    "30 min con el equipo comercial de Clinera. IA que opera la agenda de todo tu equipo y todas tus sedes por WhatsApp 24/7.",
  alternates: { canonical: "https://www.clinera.io/ventas" },
  openGraph: { url: "https://www.clinera.io/ventas" },
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

export default function VentasPage() {
  return (
    <>
      <h1 style={srOnly}>Agenda una reunión con el equipo de Clinera</h1>
      <VentasLanding enableMigrationQualification />
    </>
  );
}
