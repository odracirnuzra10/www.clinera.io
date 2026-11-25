import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesUsuario from "@/components/planes-usuario/PlanesUsuario";

// /planes-usuario (Ricardo, 25-nov-2026): propuesta de precios por profesional, al estilo Notion.
// Vista previa: no reemplaza /planes, no se indexa ni va al sitemap. Fuente: src/content/planes-usuario.ts.
export const metadata: Metadata = {
  title: "Planes por profesional",
  description: "Paga por cada profesional que atiende. La recepción no paga. Gratis para 1 profesional.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/planes" },
};

export default function PlanesUsuarioPage() {
  return (
    <>
      <NavV3 />
      <main style={{ paddingTop: 72, background: "#fff" }}>
        <PlanesUsuario />
      </main>
      <FooterV3 />
    </>
  );
}
