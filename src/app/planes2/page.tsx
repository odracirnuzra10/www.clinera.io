import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import Planes2Body from "@/components/planes2/Planes2Body";

const TITLE = "Planes Go!, Flux y Ultra";

// Vista previa interna del modelo nuevo (17-oct-2026). No reemplaza a /planes
// hasta que Ricardo apruebe: noindex en metadata, Disallow en robots-txt.ts y
// fuera del sitemap. Sin JSON-LD de precios a propósito: los de /planes son los
// vigentes y los de acá todavía no son públicos.
export const metadata: Metadata = {
  title: TITLE,
  description: "Empieza con Clinera desde USD 17 al mes y sube de plan cuando tu clínica crezca.",
  alternates: { canonical: "https://www.clinera.io/planes2" },
  robots: { index: false, follow: false },
};

export default function Planes2Page() {
  return (
    <>
      <NavV3 />
      <main>
        <Planes2Body />
      </main>
      <FooterV3 />
    </>
  );
}
