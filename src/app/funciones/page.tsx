import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import FuncionesV3 from "@/components/interior-v3/FuncionesV3";

export const metadata: Metadata = {
  title: "Funciones — Software clínico con IA",
  description:
    "Agenda inteligente, AURA (IA conversacional 24/7), ficha clínica digital, mensajería omnicanal, ventas trazables y marketing con atribución. Todas las funciones de Clinera.",
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
