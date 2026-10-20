import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import FuncionesV3 from "@/components/interior-v3/FuncionesV3";

export const metadata: Metadata = {
  title: "Vortex — el software con IA para clínicas",
  description:
    "Vortex, el software de Clinera: agenda, ficha clínica, bandeja de WhatsApp, Instagram y Facebook, AURA que responde y agenda, y Clinera Intelligence, el agente interno de tus números. US$ 279/mes.",
  alternates: { canonical: "https://www.clinera.io/funciones" },
  openGraph: { url: "https://www.clinera.io/funciones" },
};

export default function FuncionesPage() {
  return (
    <>
      <NavV3 />
      <main>
        <FuncionesV3 />
      </main>
      <FooterV3 />
    </>
  );
}
