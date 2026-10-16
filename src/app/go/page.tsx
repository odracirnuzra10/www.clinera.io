import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import GoLanding from "@/components/go/GoLanding";

const TITLE = "Inicia con Clinera por solo 17 dólares al mes";

// Landing de Go! en revisión interna: noindex, Disallow en robots-txt.ts y
// fuera del sitemap. La ruta /go es sugerida y está pendiente de confirmar.
export const metadata: Metadata = {
  title: TITLE,
  description: "Tu agenda, tus fichas y tus mensajes de WhatsApp, Facebook e Instagram en un solo lugar.",
  alternates: { canonical: "https://www.clinera.io/go" },
  robots: { index: false, follow: false },
};

export default function GoPage() {
  return (
    <>
      <NavV3 />
      <main>
        <GoLanding />
      </main>
      <FooterV3 />
    </>
  );
}
