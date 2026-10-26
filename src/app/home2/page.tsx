import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import Home2 from "@/components/home2/Home2";

// /home2 (Ricardo, 26-oct-2026): borrador del home con la historia de Clinera y
// los casos. No se indexa: compite con el home real (va en robots-txt.ts y fuera
// del sitemap) hasta que Ricardo decida si reemplaza a /.
export const metadata: Metadata = {
  title: "Cómo nace Clinera y casos de clínicas médicas y estéticas",
  description:
    "Clinera nace de la experiencia de una red de clínicas. Software con IA, marketing y método comercial, con los números reales de sus campañas.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/" },
};

export default function Home2Page() {
  return (
    <>
      <NavV3 />
      <main>
        <Home2 />
      </main>
      <FooterV3 />
    </>
  );
}
